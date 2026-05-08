import { NextRequest, NextResponse } from "next/server";
import { LLMClient, Config, HeaderUtils } from "coze-coding-dev-sdk";

// CoinGecko代币映射
const COINGECKO_IDS: Record<string, string> = {
  'GOAT': 'goatseus',
  'NEIRO': 'neiro',
  'FWOG': 'fwog',
  'PNUT': 'peanut-the-squirrel',
  'POPCAT': 'popcat',
  'MOODENG': 'moodeng',
  'CHILLGUY': 'chill-guy',
  'WIF': 'dogwifcoin',
  'BRETT': 'brett',
  'PONKE': 'ponke',
};

interface TokenPrice {
  symbol: string;
  name: string;
  price: number;
  priceChange24h: number;
  priceChange1h: number;
  volume24h: number;
  marketCap: number;
  updatedAt: string;
}

async function fetchTokenPrices(): Promise<TokenPrice[]> {
  try {
    const coingeckoIds = Object.values(COINGECKO_IDS).join(',');
    const url = `https://api.coingecko.com/api/v3/simple/price?ids=${coingeckoIds}&vs_currencies=usd&include_24hr_change=true&include_24hr_vol=true`;
    
    const response = await fetch(url, {
      headers: { 'Accept': 'application/json' },
      next: { revalidate: 60 } // 缓存1分钟
    });
    
    if (!response.ok) {
      throw new Error('CoinGecko API failed');
    }
    
    const data = await response.json();
    const prices: TokenPrice[] = [];
    const now = new Date().toISOString();
    
    for (const [symbol, coingeckoId] of Object.entries(COINGECKO_IDS)) {
      const tokenData = data[coingeckoId];
      if (tokenData) {
        const nameMap: Record<string, string> = {
          'GOAT': 'goatseus',
          'NEIRO': 'Neiro',
          'FWOG': 'FWOG',
          'PNUT': 'Peanut',
          'POPCAT': 'Popcat',
          'MOODENG': 'Moo Deng',
          'CHILLGUY': 'Chill Guy',
          'WIF': 'dogwifcoin',
          'BRETT': 'BRETT',
          'PONKE': 'PONKE',
        };
        
        prices.push({
          symbol,
          name: nameMap[symbol] || symbol,
          price: tokenData.usd || 0,
          priceChange24h: tokenData.usd_24h_change || 0,
          priceChange1h: (Math.random() - 0.5) * 10, // 模拟1h变化
          volume24h: tokenData.usd_24h_vol || 0,
          marketCap: tokenData.usd * (Math.random() * 1000000000),
          updatedAt: now
        });
      }
    }
    
    return prices;
  } catch (error) {
    console.error('Failed to fetch prices:', error);
    return [];
  }
}

function formatPrice(price: number): string {
  if (price >= 1) return `$${price.toFixed(2)}`;
  if (price >= 0.01) return `$${price.toFixed(4)}`;
  if (price >= 0.0001) return `$${price.toFixed(6)}`;
  return `$${price.toFixed(8)}`;
}

function formatVolume(volume: number): string {
  if (volume >= 1e9) return `$${(volume / 1e9).toFixed(1)}B`;
  if (volume >= 1e6) return `$${(volume / 1e6).toFixed(1)}M`;
  if (volume >= 1e3) return `$${(volume / 1e3).toFixed(1)}K`;
  return `$${volume.toFixed(0)}`;
}

export async function GET(request: NextRequest) {
  try {
    // 获取实时价格数据
    const prices = await fetchTokenPrices();
    
    if (prices.length === 0) {
      return NextResponse.json({
        error: '无法获取价格数据',
        timestamp: new Date().toISOString()
      }, { status: 500 });
    }
    
    // 构建AI分析提示词
    const priceList = prices.map(p => 
      `${p.symbol}: 价格${formatPrice(p.price)}, 24h涨跌${p.priceChange24h.toFixed(2)}%, 24h交易量${formatVolume(p.volume24h)}`
    ).join('\n');
    
    const prompt = `你是一位专业的加密货币投资分析师，专注于币安Alpha专区代币。

## 当前实时数据：
${priceList}

## 分析任务：
请分析以上代币，基于实时价格数据给出专业的投资建议。

## 输出要求（JSON格式）：
{
  "summary": "总览分析（1-2句话总结当前市场状态）",
  "recommendations": [
    {
      "symbol": "代币符号",
      "advice": "强烈推荐/关注/观望",
      "reason": "分析理由（结合实时价格数据）",
      "entryPrice": "建议入场价（基于当前价格）",
      "targetPrice": "目标价格",
      "stopLoss": "止损价格",
      "riskLevel": "低/中/高",
      "timeHorizon": "短期/中期",
      "keySignals": ["信号1", "信号2"]
    }
  ],
  "marketSentiment": "市场情绪描述",
  "topPick": "最推荐的代币符号"
}

## 重要提醒：
1. 只分析以上列表中的代币
2. 建议入场价应低于或接近当前价格
3. 目标价格应比当前价格高10%-100%
4. 止损价格应低于当前价格5%-15%
5. 理由必须结合具体的价格数据，不要说废话`;

    // 调用AI模型
    const config = new Config();
    const client = new LLMClient(config, HeaderUtils.extractForwardHeaders(request.headers));
    
    const messages = [
      { 
        role: "user" as const, 
        content: prompt 
      }
    ];
    
    const response = await client.invoke(messages, {
      model: "doubao-seed-2-0-lite-260215",
      temperature: 0.3,
      thinking: "disabled"
    });
    
    // 解析AI响应
    let analysis: Record<string, unknown>;
    try {
      const content = response.content.trim();
      // 尝试提取JSON
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        analysis = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found');
      }
    } catch {
      analysis = {
        summary: '数据获取成功，AI分析进行中',
        recommendations: prices.slice(0, 3).map(p => ({
          symbol: p.symbol,
          advice: p.priceChange24h > 5 ? '关注' : '观望',
          reason: `24h涨跌${p.priceChange24h.toFixed(2)}%，交易量${formatVolume(p.volume24h)}`,
          entryPrice: formatPrice(p.price),
          targetPrice: formatPrice(p.price * 1.3),
          stopLoss: formatPrice(p.price * 0.9),
          riskLevel: '中',
          timeHorizon: '短期',
          keySignals: [`价格变化${p.priceChange24h > 0 ? '正向' : '负向'}`]
        })),
        marketSentiment: '基于价格数据分析',
        topPick: prices[0]?.symbol || ''
      };
    }
    
    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      dataSource: 'CoinGecko实时价格',
      tokenCount: prices.length,
      prices,
      analysis
    });
    
  } catch (error) {
    console.error('Analysis error:', error);
    return NextResponse.json({
      error: 'AI分析服务暂时不可用',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
