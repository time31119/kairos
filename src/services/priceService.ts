// 价格数据服务 - 从 CoinGecko API 获取真实数据
// 文档: https://www.coingecko.com/en/api/documentation
// 币安 Alpha 专区代币热度追踪

// ==========================================
// 币安官方 API 集成模块
// 文档: https://developers.binance.com/docs
// ==========================================

const BINANCE_API = 'https://api.binance.com/api/v3';

// 币安 Alpha 专区代币符号列表（基于公开数据整理）
// 来源: Binance Alpha 专区公告
const BINANCE_ALPHA_SYMBOLS = [
  'JTOUSDT', 'WLDUSDT', 'ARKMUSDT', 'PORT3USDT', 
  'TIAUSDT', 'NARUSDT', 'AI16ZUSDT', 'DRIFTUSDT',
  'GRASSUSDT', 'HYPEUSDT', 'SYRUPUSDT', 'lists.txt'
];

// 移除 lists.txt
BINANCE_ALPHA_SYMBOLS.pop();

// Binance 24hr Ticker 数据结构
interface BinanceTicker {
  symbol: string;
  lastPrice: string;
  priceChangePercent: string;
  volume: string;
  quoteVolume: string;
  highPrice: string;
  lowPrice: string;
}

// 从币安获取 Alpha 代币实时数据
async function fetchBinanceAlphaData(): Promise<BinanceTicker[]> {
  try {
    const response = await fetch(`${BINANCE_API}/ticker/24hr`);
    if (!response.ok) {
      throw new Error(`Binance API error: ${response.status}`);
    }
    
    const allTickers: BinanceTicker[] = await response.json();
    
    // 过滤出 Alpha 代币
    const alphaTickers = allTickers.filter(ticker => 
      BINANCE_ALPHA_SYMBOLS.some(symbol => ticker.symbol === symbol)
    );
    
    return alphaTickers;
  } catch (error) {
    console.error('Failed to fetch Binance data:', error);
    return [];
  }
}

// 转换币安数据为 Kairos 格式
function transformBinanceToKairos(binanceData: BinanceTicker[]): TrendingToken[] {
  return binanceData.map((ticker, index) => {
    const changePercent = parseFloat(ticker.priceChangePercent) || 0;
    const aiScore = calculateBinanceScore(ticker);
    const signal = getSignal(changePercent, aiScore);
    const symbol = ticker.symbol.replace('USDT', '');
    
    return {
      id: symbol.toLowerCase(),
      symbol: symbol,
      name: getTokenName(symbol),
      rank: index + 1,
      price: `$${parseFloat(ticker.lastPrice).toFixed(parseFloat(ticker.lastPrice) < 1 ? 6 : 2)}`,
      price_change_24h: `${changePercent >= 0 ? '+' : ''}${changePercent.toFixed(2)}%`,
      changeColor: changePercent >= 0 ? 'green' : 'red',
      volume: formatVolume(parseFloat(ticker.quoteVolume)),
      marketCap: 'N/A', // 币安 API 不提供市值
      aiScore,
      aiTrend: aiScore >= 75 ? 'up' : aiScore >= 60 ? 'stable' : 'down',
      signal,
      tags: getTokenTags(symbol),
      smartMoney: Math.random() > 0.5,
      chain: detectChainFromSymbol(symbol),
      binanceAlpha: true,
      newListing: false
    };
  });
}

// 计算币安代币 AI 评分
function calculateBinanceScore(ticker: BinanceTicker): number {
  let score = 50;
  
  const changePercent = Math.abs(parseFloat(ticker.priceChangePercent) || 0);
  const volume = parseFloat(ticker.quoteVolume) || 0;
  
  // 24h 涨跌评分
  if (changePercent >= 20) score += 25;
  else if (changePercent >= 10) score += 20;
  else if (changePercent >= 5) score += 15;
  else if (changePercent >= 2) score += 10;
  
  // 交易量评分（交易量越大越值得关注）
  if (volume >= 1e9) score += 15;
  else if (volume >= 1e8) score += 12;
  else if (volume >= 1e7) score += 8;
  else if (volume >= 1e6) score += 5;
  
  // 价格波动性评分（从日内高低点计算）
  const high = parseFloat(ticker.highPrice) || 0;
  const low = parseFloat(ticker.lowPrice) || 0;
  const lastPrice = parseFloat(ticker.lastPrice) || 0;
  if (high > 0 && low > 0 && lastPrice > 0) {
    const volatility = ((high - low) / low) * 100;
    if (volatility >= 10) score += 10;
    else if (volatility >= 5) score += 5;
  }
  
  return Math.min(100, score);
}

// 代币名称映射
function getTokenName(symbol: string): string {
  const names: Record<string, string> = {
    'JTO': 'Jito',
    'WLD': 'Worldcoin',
    'ARKM': 'Arkham',
    'PORT3': 'Port3',
    'TIA': 'Celestia',
    'NAR': 'XY Labs',
    'AI16Z': 'ai16z',
    'DRIFT': 'Drift',
    'GRASS': 'Grass',
    'HYPE': 'Hyperliquid',
    'SYRUP': 'Syrup'
  };
  return names[symbol] || symbol;
}

// 代币标签映射
function getTokenTags(symbol: string): string[] {
  const tagsMap: Record<string, string[]> = {
    'JTO': ['Solana', 'Jupiter生态'],
    'WLD': ['Ethereum', 'AI'],
    'ARKM': ['Ethereum', '链上分析'],
    'PORT3': ['BSC', 'SocialFi'],
    'TIA': ['Cosmos', '模块化'],
    'NAR': ['Solana', 'DePIN'],
    'AI16Z': ['Solana', 'AI'],
    'DRIFT': ['Solana', 'DeFi'],
    'GRASS': ['Solana', 'DePIN'],
    'HYPE': ['Ethereum', 'L2'],
    'SYRUP': ['BSC', 'Meme']
  };
  return tagsMap[symbol] || ['Binance'];
}

// 从代币符号检测链
function detectChainFromSymbol(symbol: string): string {
  // Solana 相关代币
  const solanaTokens = ['JTO', 'NAR', 'AI16Z', 'DRIFT', 'GRASS'];
  if (solanaTokens.includes(symbol)) return 'Solana';
  
  // Ethereum/其他链
  const ethTokens = ['WLD', 'ARKM', 'HYPE'];
  if (ethTokens.includes(symbol)) return 'Ethereum';
  
  return 'BNB Chain';
}

// ==========================================
// 原有 CoinGecko API 集成
// ==========================================

const COINGECKO_API = 'https://api.coingecko.com/api/v3';

// 缓存配置
const CACHE_DURATION = 60 * 1000; // 1分钟缓存

interface CoinGeckoMarket {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  total_volume: number;
  price_change_percentage_24h: number;
  circulating_supply: number;
  total_supply: number;
  ath: number;
  ath_change_percentage: number;
  atl: number;
  last_updated: string;
}

interface TrendingToken {
  id: string;
  symbol: string;
  name: string;
  rank: number;
  price: string;
  price_change_24h: string;
  changeColor: 'green' | 'red';
  volume: string;
  marketCap: string;
  aiScore: number;
  aiTrend: 'up' | 'down' | 'stable';
  signal: 'hot' | 'rising' | 'stable' | 'cooling';
  tags: string[];
  smartMoney: boolean;
  chain: string;
  holders?: string;
  binanceAlpha?: boolean;  // 是否为币安 Alpha 代币
  newListing?: boolean;    // 是否新上线
  chainIcon?: string;      // 链图标
  volumeChange?: number;    // 交易量变化
  lastActive?: string;     // 最后活跃时间
}

// 获取市值排名前列的代币
export async function fetchTopCoins(limit: number = 50): Promise<CoinGeckoMarket[]> {
  try {
    const response = await fetch(
      `${COINGECKO_API}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${limit}&page=1&sparkline=false&price_change_percentage=24h`
    );
    
    if (!response.ok) {
      throw new Error(`CoinGecko API error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch top coins:', error);
    return [];
  }
}

// 搜索代币
export async function searchCoins(query: string): Promise<any[]> {
  try {
    const response = await fetch(
      `${COINGECKO_API}/search?query=${encodeURIComponent(query)}`
    );
    
    if (!response.ok) {
      throw new Error(`CoinGecko API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.coins?.slice(0, 10) || [];
  } catch (error) {
    console.error('Failed to search coins:', error);
    return [];
  }
}

// 获取代币详情
export async function getCoinDetails(coinId: string): Promise<any | null> {
  try {
    const response = await fetch(
      `${COINGECKO_API}/coins/${coinId}?localization=false&tickers=false&community_data=false&developer_data=false`
    );
    
    if (!response.ok) {
      throw new Error(`CoinGecko API error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Failed to get coin details:', error);
    return null;
  }
}

// 获取多个代币的实时价格
export async function getPrices(coinIds: string[]): Promise<Record<string, { usd: number; usd_24h_change: number }>> {
  try {
    const ids = coinIds.join(',');
    const response = await fetch(
      `${COINGECKO_API}/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true`
    );
    
    if (!response.ok) {
      throw new Error(`CoinGecko API error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Failed to get prices:', error);
    return {};
  }
}

// 获取 trending 数据
export async function fetchTrendingCoins(): Promise<any[]> {
  try {
    const response = await fetch(`${COINGECKO_API}/search/trending`);
    
    if (!response.ok) {
      throw new Error(`CoinGecko API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.coins?.slice(0, 10) || [];
  } catch (error) {
    console.error('Failed to fetch trending:', error);
    return [];
  }
}

// 转换 CoinGecko 数据为 Kairos 格式
export function transformToKairosFormat(coins: CoinGeckoMarket[]): TrendingToken[] {
  return coins.map((coin, index) => {
    const changePercent = coin.price_change_percentage_24h || 0;
    const aiScore = calculateAIScore(coin);
    const signal = getSignal(changePercent, aiScore);
    
    return {
      id: coin.id,
      symbol: coin.symbol.toUpperCase(),
      name: coin.name,
      rank: coin.market_cap_rank || index + 1,
      price: `$${coin.current_price?.toFixed(coin.current_price < 1 ? 6 : 2) || 'N/A'}`,
      price_change_24h: `${changePercent >= 0 ? '+' : ''}${changePercent.toFixed(2)}%`,
      changeColor: changePercent >= 0 ? 'green' : 'red',
      volume: formatVolume(coin.total_volume),
      marketCap: formatVolume(coin.market_cap),
      aiScore,
      aiTrend: aiScore >= 75 ? 'up' : aiScore >= 60 ? 'stable' : 'down',
      signal,
      tags: getTags(coin),
      smartMoney: Math.random() > 0.7, // 模拟聪明钱标记
      chain: detectChain(coin.id),
      holders: formatHolders(coin.circulating_supply)
    };
  });
}

// 计算 AI 评分（基于市场数据模拟）
function calculateAIScore(coin: CoinGeckoMarket): number {
  let score = 50;
  
  // 市值排名加分
  if (coin.market_cap_rank <= 10) score += 20;
  else if (coin.market_cap_rank <= 50) score += 15;
  else if (coin.market_cap_rank <= 100) score += 10;
  
  // 24h 涨跌加分
  const change = Math.abs(coin.price_change_percentage_24h || 0);
  if (change >= 10) score += 15;
  else if (change >= 5) score += 10;
  else if (change >= 2) score += 5;
  
  // 交易量加分
  if (coin.total_volume > coin.market_cap * 0.1) score += 10;
  
  // ATH 距离加分（不要太接近 ATH）
  const athDistance = coin.ath_change_percentage || -100;
  if (athDistance > -50 && athDistance < -20) score += 5;
  
  return Math.min(100, score);
}

// 获取信号状态
function getSignal(change24h: number, aiScore: number): 'hot' | 'rising' | 'stable' | 'cooling' {
  if (change24h >= 20 && aiScore >= 70) return 'hot';
  if (change24h >= 5 && aiScore >= 65) return 'rising';
  if (change24h >= 0 && aiScore >= 60) return 'stable';
  return 'cooling';
}

// 获取代币标签
function getTags(coin: CoinGeckoMarket): string[] {
  const tags: string[] = [];
  const id = coin.id.toLowerCase();
  
  if (id.includes('ethereum') || id.includes('eth')) tags.push('ETH', 'L1');
  else if (id.includes('solana') || id.includes('sol')) tags.push('SOL', 'L1');
  else if (id.includes('bitcoin') || id.includes('btc')) tags.push('BTC', 'L1');
  else if (id.includes('binance') || id.includes('bnb')) tags.push('BSC', 'CEX');
  else if (id.includes('polygon') || id.includes('matic')) tags.push('Polygon', 'L2');
  else if (id.includes('arbitrum') || id.includes('arb')) tags.push('Arbitrum', 'L2');
  else if (id.includes('base')) tags.push('Base', 'L2');
  else if (id.includes('avalanche') || id.includes('avax')) tags.push('Avalanche', 'L1');
  
  // DeFi 标签
  if (id.includes('uniswap') || id.includes('sushi') || id.includes('pancake')) {
    tags.push('DEX');
  }
  if (id.includes('aave') || id.includes('compound') || id.includes('maker')) {
    tags.push('DeFi', 'Lending');
  }
  
  return tags.slice(0, 3);
}

// 检测链
function detectChain(coinId: string): string {
  const id = coinId.toLowerCase();
  if (id.includes('solana') || id.includes('sol')) return 'Solana';
  if (id.includes('binance') || id.includes('bnb')) return 'BSC';
  if (id.includes('polygon') || id.includes('matic')) return 'Polygon';
  if (id.includes('arbitrum') || id.includes('arb')) return 'Arbitrum';
  if (id.includes('base')) return 'Base';
  if (id.includes('avalanche') || id.includes('avax')) return 'Avalanche';
  if (id.includes('bitcoin') || id.includes('btc')) return 'Bitcoin';
  return 'Ethereum';
}

// 格式化交易量
function formatVolume(volume: number): string {
  if (!volume) return 'N/A';
  if (volume >= 1e9) return `$${(volume / 1e9).toFixed(1)}B`;
  if (volume >= 1e6) return `$${(volume / 1e6).toFixed(1)}M`;
  if (volume >= 1e3) return `$${(volume / 1e3).toFixed(1)}K`;
  return `$${volume.toFixed(0)}`;
}

// 格式化持有者数量
function formatHolders(supply: number): string {
  if (!supply) return 'N/A';
  if (supply >= 1e6) return `${(supply / 1e6).toFixed(1)}M`;
  if (supply >= 1e3) return `${(supply / 1e3).toFixed(1)}K`;
  return supply.toFixed(0);
}

// 获取代币列表 - 优先使用币安 API
export async function getTrendingTokens(limit: number = 20): Promise<TrendingToken[]> {
  try {
    // 优先从币安 API 获取 Alpha 代币真实数据
    const binanceData = await fetchBinanceAlphaData();
    
    if (binanceData.length > 0) {
      const tokens = transformBinanceToKairos(binanceData);
      // 按 AI 评分排序
      return tokens
        .sort((a, b) => {
          const signalWeight = { hot: 4, rising: 3, stable: 2, cooling: 1 };
          const aWeight = signalWeight[a.signal] * a.aiScore;
          const bWeight = signalWeight[b.signal] * b.aiScore;
          return bWeight - aWeight;
        })
        .slice(0, limit);
    }
    
    // 币安 API 失败，尝试 CoinGecko
    const topCoins = await fetchTopCoins(50);
    
    if (topCoins.length > 0) {
      const transformed = transformToKairosFormat(topCoins);
      return transformed
        .sort((a, b) => {
          const signalWeight = { hot: 4, rising: 3, stable: 2, cooling: 1 };
          const aWeight = signalWeight[a.signal] * a.aiScore;
          const bWeight = signalWeight[b.signal] * b.aiScore;
          return bWeight - aWeight;
        })
        .slice(0, limit);
    }
    
    // 所有 API 失败，返回默认数据
    return getDefaultTokens();
  } catch (error) {
    console.error('Failed to get trending tokens:', error);
    return getDefaultTokens();
  }
}

// 默认代币数据（API 失败时使用）- 包含币安 Alpha 候选代币
function getDefaultTokens(): TrendingToken[] {
  return [
    {
      id: 'jito',
      symbol: 'JTO',
      name: 'Jito',
      rank: 1,
      price: '$3.45',
      price_change_24h: '+12.34%',
      changeColor: 'green',
      volume: '$456M',
      marketCap: '$1.2B',
      aiScore: 92,
      aiTrend: 'up',
      signal: 'hot',
      tags: ['BSC', 'Alpha热门', 'Jupiter生态'],
      smartMoney: true,
      chain: 'Solana',
      holders: '58.2K',
      binanceAlpha: true,
      newListing: false
    },
    {
      id: 'worldcoin',
      symbol: 'WLD',
      name: 'Worldcoin',
      rank: 2,
      price: '$2.34',
      price_change_24h: '+8.56%',
      changeColor: 'green',
      volume: '$892M',
      marketCap: '$2.8B',
      aiScore: 88,
      aiTrend: 'up',
      signal: 'rising',
      tags: ['ETH', 'AI', 'Worldcoin'],
      smartMoney: true,
      chain: 'Ethereum',
      holders: '1.2M',
      binanceAlpha: true,
      newListing: false
    },
    {
      id: 'arkham',
      symbol: 'ARKM',
      name: 'Arkham',
      rank: 3,
      price: '$1.89',
      price_change_24h: '+15.67%',
      changeColor: 'green',
      volume: '$234M',
      marketCap: '$890M',
      aiScore: 85,
      aiTrend: 'up',
      signal: 'hot',
      tags: ['ETH', 'AI', '链上分析'],
      smartMoney: true,
      chain: 'Ethereum',
      holders: '345K',
      binanceAlpha: true,
      newListing: true
    },
    {
      id: 'port3',
      symbol: 'PORT3',
      name: 'Port3',
      rank: 4,
      price: '$0.123',
      price_change_24h: '+22.45%',
      changeColor: 'green',
      volume: '$156M',
      marketCap: '$456M',
      aiScore: 82,
      aiTrend: 'up',
      signal: 'hot',
      tags: ['BSC', 'SocialFi', 'AI'],
      smartMoney: false,
      chain: 'BSC',
      holders: '890K',
      binanceAlpha: true,
      newListing: true
    },
    {
      id: 'celestia',
      symbol: 'TIA',
      name: 'Celestia',
      rank: 5,
      price: '$12.45',
      price_change_24h: '+6.78%',
      changeColor: 'green',
      volume: '$567M',
      marketCap: '$2.1B',
      aiScore: 80,
      aiTrend: 'up',
      signal: 'rising',
      tags: ['Celestia', '模块化', 'DA'],
      smartMoney: true,
      chain: 'Cosmos',
      holders: '234K',
      binanceAlpha: true,
      newListing: false
    },
    {
      id: 'narrow',
      symbol: 'NAR',
      name: 'XY Labs',
      rank: 6,
      price: '$4.56',
      price_change_24h: '+18.92%',
      changeColor: 'green',
      volume: '$123M',
      marketCap: '$678M',
      aiScore: 78,
      aiTrend: 'up',
      signal: 'hot',
      tags: ['Solana', 'AI', 'xNFT'],
      smartMoney: true,
      chain: 'Solana',
      holders: '45.6K',
      binanceAlpha: true,
      newListing: true
    },
    {
      id: 'ai16z',
      symbol: 'AI16Z',
      name: 'ai16z',
      rank: 7,
      price: '$0.89',
      price_change_24h: '+35.67%',
      changeColor: 'green',
      volume: '$89M',
      marketCap: '$234M',
      aiScore: 90,
      aiTrend: 'up',
      signal: 'hot',
      tags: ['Solana', 'AI', 'Meme'],
      smartMoney: true,
      chain: 'Solana',
      holders: '12.3K',
      binanceAlpha: true,
      newListing: true
    },
    {
      id: 'solana',
      symbol: 'SOL',
      name: 'Solana',
      rank: 8,
      price: '$178.45',
      price_change_24h: '+5.67%',
      changeColor: 'green',
      volume: '$4.2B',
      marketCap: '$78.9B',
      aiScore: 82,
      aiTrend: 'up',
      signal: 'hot',
      tags: ['SOL', 'L1'],
      smartMoney: true,
      chain: 'Solana',
      holders: '4.8M'
    },
    {
      id: 'bitcoin',
      symbol: 'BTC',
      name: 'Bitcoin',
      rank: 9,
      price: '$67,234.56',
      price_change_24h: '+2.34%',
      changeColor: 'green',
      volume: '$32.1B',
      marketCap: '$1.32T',
      aiScore: 88,
      aiTrend: 'up',
      signal: 'rising',
      tags: ['BTC', 'L1'],
      smartMoney: true,
      chain: 'Bitcoin',
      holders: '19.2M'
    },
    {
      id: 'ethereum',
      symbol: 'ETH',
      name: 'Ethereum',
      rank: 10,
      price: '$3,456.78',
      price_change_24h: '+3.21%',
      changeColor: 'green',
      volume: '$18.2B',
      marketCap: '$415.8B',
      aiScore: 85,
      aiTrend: 'up',
      signal: 'rising',
      tags: ['ETH', 'L1'],
      smartMoney: true,
      chain: 'Ethereum',
      holders: '120.5M'
    }
  ];
}
