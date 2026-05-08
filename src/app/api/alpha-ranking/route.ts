import { NextResponse } from 'next/server';

// 币安Alpha专区代币配置（Symbol -> 代币ID映射）
const ALPHA_SYMBOLS: Record<string, { coingecko: string; name: string; chain: string }> = {
  'GOAT': { coingecko: 'goatseusd', name: 'Goatseus Maximus', chain: 'SOL' },
  'NEIRO': { coingecko: 'neiro-inu', name: 'Neiro Inu', chain: 'ETH' },
  'FWOG': { coingecko: 'fwog', name: 'FWOG', chain: 'SOL' },
  'PNUT': { coingecko: 'peanut-the-squirrel', name: 'Peanut the Squirrel', chain: 'ETH' },
  'POPCAT': { coingecko: 'popcat', name: 'Popcat', chain: 'SOL' },
  'MOODENG': { coingecko: 'moodeng', name: 'Moo Deng', chain: 'ETH' },
  'WIF': { coingecko: 'dogwifcoin', name: 'dogwifhat', chain: 'SOL' },
  'BRETT': { coingecko: 'brett', name: 'Brett', chain: 'BASE' },
  'PONKE': { coingecko: 'ponke', name: 'Ponke', chain: 'SOL' },
  'SLERF': { coingecko: 'slerf', name: 'Slerf', chain: 'SOL' },
};

interface CoinData {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  price_change_percentage_24h: number;
  price_change_percentage_1h_in_currency?: number;
  total_volume: number;
  market_cap: number;
}

export async function GET() {
  try {
    // 1. 尝试 Bybit API（通常更稳定）
    let priceData: Record<string, number> = {};
    let changeData: Record<string, number> = {};
    let volumeData: Record<string, number> = {};
    let source = 'bybit';

    const symbols = Object.keys(ALPHA_SYMBOLS).map(s => `${s}USDT`);
    
    try {
      const bybitResponse = await fetch(
        `https://api.bybit.com/v5/market/tickers?category=spot&symbol=${symbols.join(',')}`,
        { signal: AbortSignal.timeout(5000) }
      );
      
      if (bybitResponse.ok) {
        const bybitData = await bybitResponse.json();
        if (bybitData.retCode === 0 && bybitData.result?.list) {
          bybitData.result.list.forEach((item: any) => {
            const baseSymbol = item.symbol.replace('USDT', '');
            if (ALPHA_SYMBOLS[baseSymbol]) {
              priceData[baseSymbol] = parseFloat(item.lastPrice || '0');
              changeData[baseSymbol] = parseFloat(item.price24hPcnt || '0') * 100;
              volumeData[baseSymbol] = parseFloat(item.volume24h || '0') * parseFloat(item.lastPrice || '1');
            }
          });
        }
      }
    } catch (e) {
      console.log('Bybit failed, trying alternative...');
    }

    // 2. 如果Bybit失败，使用备用静态数据
    if (Object.keys(priceData).length === 0) {
      source = 'fallback';
      const fallbackPrices: Record<string, number> = {
        'WIF': 3.25, 'GOAT': 1.15, 'NEIRO': 0.0028, 'FWOG': 0.042, 'PNUT': 0.58,
        'POPCAT': 1.05, 'MOODENG': 0.0022, 'BRETT': 0.098, 'PONKE': 0.055, 'SLERF': 0.42
      };
      const fallbackChanges: Record<string, number> = {
        'WIF': 12.5, 'GOAT': 8.3, 'NEIRO': 15.7, 'FWOG': -3.2, 'PNUT': 22.1,
        'POPCAT': 6.8, 'MOODENG': 18.5, 'BRETT': -1.5, 'PONKE': 9.6, 'SLERF': -5.8
      };
      const fallbackVolumes: Record<string, number> = {
        'WIF': 280000000, 'GOAT': 185000000, 'NEIRO': 95000000, 'FWOG': 42000000, 'PNUT': 156000000,
        'POPCAT': 89000000, 'MOODENG': 128000000, 'BRETT': 67000000, 'PONKE': 95000000, 'SLERF': 38000000
      };
      priceData = fallbackPrices;
      changeData = fallbackChanges;
      volumeData = fallbackVolumes;
    }

    // 3. 构建返回数据
    const result = Object.entries(ALPHA_SYMBOLS).map(([symbol, config], index) => {
      const price = priceData[symbol] || 0;
      const change24h = changeData[symbol] || 0;
      const volume = volumeData[symbol] || 0;
      
      // Kairos评分计算
      const momentum = Math.min(Math.max(change24h * 2, -20), 40);
      const volumeScore = Math.min((volume / 2e8) * 60, 60);
      const alphaScore = Math.round(momentum + volumeScore);
      
      // 信号判断
      let signal = 'watch';
      let signals: string[] = ['正常'];
      if (alphaScore >= 70) {
        signal = 'strong';
        signals = ['强势信号', '高动量', '交易活跃'];
      } else if (alphaScore >= 50) {
        signal = 'moderate';
        signals = ['温和上涨', '值得关注'];
      } else if (change24h < 0) {
        signal = 'watch';
        signals = ['回调中', '观望'];
      }

      // 交易计划
      const entry = price * 1.0;
      const target = price * (1 + Math.abs(change24h) / 100 + 0.15);
      const stopLoss = price * (1 - 0.08);

      return {
        rank: index + 1,
        symbol,
        name: config.name,
        chain: config.chain,
        price: `$${price.toFixed(price < 0.01 ? 6 : price < 1 ? 4 : 2)}`,
        priceValue: price,
        priceChange24h: change24h,
        priceChange1h: change24h / 4,
        volume24h: volume,
        alphaScore,
        signal,
        signals,
        smartMoneyScore: Math.round(alphaScore * 0.9),
        tradingPlan: {
          entry: entry.toFixed(entry < 0.01 ? 6 : entry < 1 ? 4 : 2),
          target: target.toFixed(target < 0.01 ? 6 : target < 1 ? 4 : 2),
          stopLoss: stopLoss.toFixed(stopLoss < 0.01 ? 6 : stopLoss < 1 ? 4 : 2),
          riskReward: `${((target - entry) / (entry - stopLoss)).toFixed(1)}:1`,
        },
        source,
      };
    });

    // 按Alpha评分排序
    result.sort((a, b) => b.alphaScore - a.alphaScore);
    result.forEach((item, index) => item.rank = index + 1);

    return NextResponse.json({
      success: true,
      source,
      data: result,
      updated: new Date().toISOString(),
    });

  } catch (error) {
    console.error('Alpha Ranking API Error:', error);
    
    // 返回错误信息
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch data',
      data: [],
    }, { status: 500 });
  }
}
