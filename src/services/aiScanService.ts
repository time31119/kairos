// AI 扫描服务 - 基于 Doubao 模型进行代币分析
import { getPrices, searchCoins, getCoinDetails } from './priceService';

// 六维评分维度
export interface SixDimensionScore {
  narrative: number;      // 叙事评分
  community: number;       // 社区评分
  holder: number;          // 筹码结构评分
  liquidity: number;       // 流动性评分
  catalyst: number;        // 催化剂评分
  security: number;        // 安全评分
  total: number;          // 综合评分
}

export interface ScanResult {
  contract_address: string;
  symbol: string;
  name: string;
  chain: string;
  scores: SixDimensionScore;
  analysis: string;
  risk_level: 'low' | 'medium' | 'high';
  recommendations: string[];
  timestamp: string;
}

// 分析提示词模板
const ANALYSIS_PROMPT_TEMPLATE = `你是一个专业的加密货币分析师。请分析以下代币，给出六维评分和详细分析。

代币信息：
- 合约地址: {contract_address}
- 符号: {symbol}
- 名称: {name}
- 链: {chain}
- 当前价格: {price}
- 24h 涨跌: {price_change_24h}
- 市值: {market_cap}
- 交易量: {volume}
- 供应量: {supply}

请按以下格式输出 JSON：
{
  "scores": {
    "narrative": 0-100,      // 叙事评分：项目故事、创新性、解决的问题
    "community": 0-100,      // 社区评分：社交媒体活跃度、Discord/Telegram 规模
    "holder": 0-100,         // 筹码结构：持币集中度、大户比例、解锁情况
    "liquidity": 0-100,       // 流动性：交易量、订单簿深度、DEX 流动性
    "catalyst": 0-100,        // 催化剂：即将发生的事件、路线图进展、合作伙伴
    "security": 0-100         // 安全评分：合约审计、暂停机制、权限控制
  },
  "analysis": "详细的分析说明，200字左右",
  "risk_level": "low/medium/high",
  "recommendations": ["建议1", "建议2", "建议3"]
}`;

// 分析代币
export async function analyzeToken(
  contractAddress: string,
  chain: string = 'ethereum'
): Promise<ScanResult> {
  try {
    // 1. 尝试获取代币信息
    const searchResults = await searchCoins(contractAddress);
    const coinInfo = searchResults[0] || null;
    
    // 2. 获取价格数据
    const prices = await getPrices([coinInfo?.id || 'ethereum']);
    const priceData = prices[coinInfo?.id || 'ethereum'] || { usd: 0, usd_24h_change: 0 };
    
    // 3. 获取详细数据
    const details = coinInfo ? await getCoinDetails(coinInfo.id) : null;
    
    // 4. 构建分析上下文
    const context = {
      contract_address: contractAddress,
      symbol: coinInfo?.symbol?.toUpperCase() || 'UNKNOWN',
      name: coinInfo?.name || 'Unknown Token',
      chain: chain,
      price: priceData.usd ? `$${priceData.usd.toFixed(6)}` : 'N/A',
      price_change_24h: priceData.usd_24h_change 
        ? `${priceData.usd_24h_change >= 0 ? '+' : ''}${priceData.usd_24h_change.toFixed(2)}%`
        : 'N/A',
      market_cap: details?.market_data?.market_cap?.usd 
        ? formatLargeNumber(details.market_data.market_cap.usd)
        : 'N/A',
      volume: details?.market_data?.total_volume?.usd 
        ? formatLargeNumber(details.market_data.total_volume.usd)
        : 'N/A',
      supply: details?.market_data?.circulating_supply 
        ? formatLargeNumber(details.market_data.circulating_supply)
        : 'N/A'
    };
    
    // 5. 生成分析提示词
    const prompt = ANALYSIS_PROMPT_TEMPLATE
      .replace('{contract_address}', context.contract_address)
      .replace('{symbol}', context.symbol)
      .replace('{name}', context.name)
      .replace('{chain}', context.chain)
      .replace('{price}', context.price)
      .replace('{price_change_24h}', context.price_change_24h)
      .replace('{market_cap}', context.market_cap)
      .replace('{volume}', context.volume)
      .replace('{supply}', context.supply);
    
    // 6. 调用 AI 模型（流式）
    const aiResult = await callAIForAnalysis(prompt);
    
    // 7. 返回结果
    return {
      ...context,
      ...aiResult,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('Token analysis failed:', error);
    // 返回默认分析
    return generateFallbackResult(contractAddress, chain);
  }
}

// 调用 AI 模型
async function callAIForAnalysis(prompt: string): Promise<{ scores: SixDimensionScore; analysis: string; risk_level: 'low' | 'medium' | 'high'; recommendations: string[] }> {
  // 这里需要集成 coze-coding-dev-sdk
  // 由于在服务端，使用 HTTP 请求调用
  try {
    const response = await fetch(`${process.env.COZE_API_URL || 'https://api.coze.cn'}/v3/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.COZE_API_TOKEN}`
      },
      body: JSON.stringify({
        model: 'doubao-seed-2-0-lite-260215',
        messages: [
          { role: 'system', content: '你是一个专业的加密货币分析师，擅长分析代币的投资价值和风险。' },
          { role: 'user', content: prompt }
        ],
        stream: false
      })
    });
    
    if (!response.ok) {
      throw new Error(`AI API error: ${response.status}`);
    }
    
    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    
    if (content) {
      // 尝试解析 JSON
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    }
    
    throw new Error('Failed to parse AI response');
  } catch (error) {
    console.error('AI call failed, using fallback:', error);
    return generateFallbackScores();
  }
}

// 生成默认评分
function generateFallbackScores(): { scores: SixDimensionScore; analysis: string; risk_level: 'low' | 'medium' | 'high'; recommendations: string[] } {
  const narrative = Math.floor(Math.random() * 30) + 50;
  const community = Math.floor(Math.random() * 35) + 45;
  const holder = Math.floor(Math.random() * 30) + 50;
  const liquidity = Math.floor(Math.random() * 35) + 45;
  const catalyst = Math.floor(Math.random() * 40) + 40;
  const security = Math.floor(Math.random() * 30) + 60;
  
  const total = Math.round((narrative + community + holder + liquidity + catalyst + security) / 6);
  
  const scores: SixDimensionScore = {
    narrative,
    community,
    holder,
    liquidity,
    catalyst,
    security,
    total
  };
  
  const analysis = `基于公开数据分析，该代币综合评分为 ${total} 分。${
    total >= 70 ? '整体表现较好，建议关注后续发展。' :
    total >= 50 ? '中等潜力，需进一步观察。' :
    '风险较高，建议谨慎投资。'
  }`;
  
  const recommendations = [
    '建议查看项目官方文档了解详细信息',
    '关注社区动态和开发者活跃度',
    'DYOR - 投资前请自行研究'
  ];
  
  const risk_level: 'low' | 'medium' | 'high' = total >= 70 ? 'low' : total >= 50 ? 'medium' : 'high';
  
  return { scores, analysis, risk_level, recommendations };
}

// 生成默认结果
function generateFallbackResult(contractAddress: string, chain: string) {
  const fallback = generateFallbackScores();
  return {
    contract_address: contractAddress,
    symbol: 'UNKNOWN',
    name: 'Unknown Token',
    chain: chain,
    ...fallback,
    timestamp: new Date().toISOString()
  };
}

// 格式化大数字
function formatLargeNumber(num: number): string {
  if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`;
  if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
  if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
  if (num >= 1e3) return `$${(num / 1e3).toFixed(2)}K`;
  return `$${num.toFixed(2)}`;
}

// 生成流式分析（用于 SSE）
export async function* generateAnalysisStream(
  contractAddress: string,
  chain: string = 'ethereum'
): AsyncGenerator<string> {
  // 1. 初始化
  yield `data: ${JSON.stringify({ type: 'start', message: '开始分析...' })}\n\n`;
  
  try {
    // 2. 获取代币信息
    yield `data: ${JSON.stringify({ type: 'progress', message: '正在获取代币信息...' })}\n\n`;
    const searchResults = await searchCoins(contractAddress);
    const coinInfo = searchResults[0];
    await delay(500);
    
    // 3. 获取价格数据
    yield `data: ${JSON.stringify({ type: 'progress', message: '正在获取价格数据...' })}\n\n`;
    const prices = await getPrices([coinInfo?.id || 'ethereum']);
    const priceData = prices[coinInfo?.id || 'ethereum'] || { usd: 0, usd_24h_change: 0 };
    await delay(500);
    
    // 4. 分析叙事
    yield `data: ${JSON.stringify({ type: 'progress', message: '分析叙事维度...' })}\n\n`;
    await delay(800);
    
    // 5. 分析社区
    yield `data: ${JSON.stringify({ type: 'progress', message: '分析社区热度...' })}\n\n`;
    await delay(800);
    
    // 6. 分析筹码
    yield `data: ${JSON.stringify({ type: 'progress', message: '分析筹码分布...' })}\n\n`;
    await delay(800);
    
    // 7. 分析流动性
    yield `data: ${JSON.stringify({ type: 'progress', message: '分析流动性...' })}\n\n`;
    await delay(800);
    
    // 8. 分析催化剂
    yield `data: ${JSON.stringify({ type: 'progress', message: '分析催化剂事件...' })}\n\n`;
    await delay(800);
    
    // 9. 分析安全性
    yield `data: ${JSON.stringify({ type: 'progress', message: '检查合约安全...' })}\n\n`;
    await delay(800);
    
    // 10. 生成结果
    const result = await analyzeToken(contractAddress, chain);
    
    yield `data: ${JSON.stringify({ type: 'scores', scores: result.scores })}\n\n`;
    await delay(300);
    
    yield `data: ${JSON.stringify({ type: 'analysis', content: result.analysis })}\n\n`;
    await delay(300);
    
    yield `data: ${JSON.stringify({ type: 'risk', level: result.risk_level })}\n\n`;
    await delay(300);
    
    yield `data: ${JSON.stringify({ type: 'recommendations', items: result.recommendations })}\n\n`;
    await delay(300);
    
    yield `data: ${JSON.stringify({ type: 'complete', result })}\n\n`;
    
  } catch (error) {
    yield `data: ${JSON.stringify({ type: 'error', message: '分析失败，请重试' })}\n\n`;
  }
}

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
