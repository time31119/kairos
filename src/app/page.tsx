'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { AuthButton } from '@/components/AuthButton';

// ============================================
// 币安Alpha专区代币数据库（系统化管理）
// ============================================

// 币安Alpha专区代币（确认在Alpha专区的代币 - 2025年）
const BINANCE_ALPHA_TOKENS = [
  // === Meme 代币（Alpha专区主力）===
  { id: 'neiro-eu', symbol: 'NEIRO', name: 'Neiro', category: 'Meme', chain: 'ETH' },
  { id: 'goat', symbol: 'GOAT', name: 'Goatseus Maximus', category: 'Meme', chain: 'ETH' },
  { id: 'fwog-2', symbol: 'FWOG', name: 'FWOG', category: 'Meme', chain: 'ETH' },
  { id: 'pnut', symbol: 'PNUT', name: 'Peanut', category: 'Meme', chain: 'ETH' },
  { id: 'popcat-2', symbol: 'POPCAT', name: 'Popcat', category: 'Meme', chain: 'SOL' },
  { id: 'moodeng', symbol: 'MOODENG', name: 'Moodeng', category: 'Meme', chain: 'ETH' },
  { id: 'chill-guy', symbol: 'CHILLGUY', name: 'Chill Guy', category: 'Meme', chain: 'ETH' },
  { id: 'dog-wif-nft', symbol: 'WIF', name: 'DogWifHat', category: 'Meme', chain: 'SOL' },
  { id: 'brett', symbol: 'BRETT', name: 'Brett', category: 'Meme', chain: 'BASE' },
  { id: 'ponke', symbol: 'PONKE', name: 'Ponke', category: 'Meme', chain: 'SOL' },
  { id: 'pingu-the-penguin', symbol: 'PINGU', name: 'Pingu', category: 'Meme', chain: 'SOL' },
  { id: 'act', symbol: 'ACT', name: 'Act I: The AI Prophecy', category: 'Meme', chain: 'ETH' },
  { id: 'retardio', symbol: 'RETRY', name: 'Retardio', category: 'Meme', chain: 'ETH' },
  { id: 'slerf', symbol: 'SLERF', name: 'Slerf', category: 'Meme', chain: 'SOL' },
  { id: 'michi', symbol: 'MICHI', name: 'Michi', category: 'Meme', chain: 'SOL' },
  { id: 'degen', symbol: 'DEGEN', name: 'Degen', category: 'Meme', chain: 'SOL' },
  // === DeFi / 基础设施 ===
  { id: 'jito-2', symbol: 'JTO', name: 'Jito', category: 'DeFi', chain: 'SOL' },
  { id: 'drift-protocol', symbol: 'DRIFT', name: 'Drift Protocol', category: 'DeFi', chain: 'SOL' },
  { id: 'kamino', symbol: 'KMNO', name: 'Kamino', category: 'DeFi', chain: 'SOL' },
  { id: 'margin', symbol: 'MARGIN', name: 'Margin', category: 'DeFi', chain: 'ETH' },
  { id: 'eliza', symbol: 'ELIZA', name: 'Eliza', category: 'AI', chain: 'SOL' },
];

// 提取Alpha专区代币的CoinGecko ID
const BINANCE_ALPHA_IDS = BINANCE_ALPHA_TOKENS.map(t => t.id);

// Alpha候选池 - 可能进入Alpha的潜力代币
const ALPHA_CANDIDATES = [
  { id: 'zerebro', symbol: 'ZEREBRO', name: 'Zerebro', category: 'AI/Meme', chain: 'ETH' },
  { id: 'foxy', symbol: 'FOXY', name: 'Foxy', category: 'Meme', chain: 'ETH' },
  { id: 'fartcoin', symbol: 'FARTCOIN', name: 'Fartcoin', category: 'Meme', chain: 'SOL' },
  { id: 'bill', symbol: 'BILL', name: 'Bill', category: 'Meme', chain: 'SOL' },
  { id: 'aios', symbol: 'AIOS', name: 'AIOS', category: 'AI', chain: 'SOL' },
];

// 主流代币黑名单（排除这些，不显示也不推荐）
const MAJOR_TOKENS_BLACKLIST = [
  'bitcoin', 'ethereum', 'tether', 'binancecoin', 'solana',
  'ripple', 'usd-coin', 'cardano', 'dogecoin', 'tron',
  'avalanche-2', 'shiba-inu', 'polkadot', 'chainlink', 'polygon',
  'litecoin', 'uniswap', 'bitcoin-cash', 'internet-computer',
  'worldcoin-wld', 'arkham', 'celestia', 'floki', 'binance-usd',
];

// 链ID映射
const CHAIN_ICONS: Record<string, string> = {
  ETH: '🔷',
  SOL: '🌟',
  BASE: '🔵',
  BSC: '🔴',
  ARB: '🔶',
  OP: '🔵',
};

// CoinGecko代币市场数据接口
interface CoinMarketData {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  price_change_percentage_24h: number;
  total_volume: number;
  market_cap: number;
}

// 接口定义
interface TrendingToken {
  rank: number;
  id: string;
  name: string;
  symbol: string;
  chain: string;
  chainIcon: string;
  price: string;
  change24h: string;
  changeColor: 'green' | 'red';
  volume: string;
  marketCap: string;
  aiScore: number;
  tags: string[];
  signal: 'hot' | 'rising' | 'stable' | 'cooling';
  binanceAlpha: boolean;
}

interface TodayPick {
  id: string;
  symbol: string;
  name: string;
  price: number;
  priceChangePercent: number;
  kairosScore: number;
  socialSentiment: number;
  socialBuzz: string;
  chain: string;
  chainIcon: string;
  reason: string;
}

export default function Home() {
  const [tokens, setTokens] = useState<TrendingToken[]>([]);
  const [todayPicks, setTodayPicks] = useState<TodayPick[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [email, setEmail] = useState('');
  const [waitlistMsg, setWaitlistMsg] = useState('');
  const [scanResult, setScanResult] = useState('');
  const [scanning, setScanning] = useState(false);
  const [contractInput, setContractInput] = useState('');

  // AI热度评分
  const calculateAiScore = (volume: number, change24h: number, marketCap: number): number => {
    const volumeScore = Math.min(30, Math.log10(volume + 1) * 3);
    const changeScore = Math.abs(change24h) > 50 ? 25 : Math.abs(change24h) * 0.5;
    const momentumScore = change24h > 0 ? 25 : Math.max(0, 15 - Math.abs(change24h));
    const capScore = Math.min(20, Math.log10(marketCap + 1) * 2);
    return Math.round(Math.min(100, volumeScore + changeScore + momentumScore + capScore));
  };

  // Kairos潜力评分
  const calculateKairosScore = (volume: number, change24h: number): number => {
    const volumeScore = Math.min(35, Math.log10(volume + 1) * 4);
    const momentumScore = change24h > 20 ? 35 : change24h > 0 ? 25 : 15;
    const trendScore = change24h > 0 ? 30 : Math.max(10, 20 - Math.abs(change24h));
    return Math.round(Math.min(100, volumeScore + momentumScore + trendScore));
  };

  // 获取信号
  const getSignal = (change24h: number, volume: number): 'hot' | 'rising' | 'stable' | 'cooling' => {
    if (change24h > 30 && volume > 50000000) return 'hot';
    if (change24h > 10) return 'rising';
    if (change24h > -10) return 'stable';
    return 'cooling';
  };

  // 获取社交热度
  const getSocialBuzz = (volume: number): string => {
    if (volume > 100000000) return '爆火';
    if (volume > 50000000) return '热门';
    if (volume > 10000000) return '活跃';
    return '一般';
  };

  // 生成推荐理由
  const generateReason = (category: string, change24h: number, volume: number): string => {
    const reasons: string[] = [];
    
    if (change24h > 20) reasons.push('24小时涨幅强劲');
    if (volume > 50000000) reasons.push('链上交易活跃');
    if (category.includes('AI')) reasons.push('AI叙事加持');
    if (category.includes('Meme')) reasons.push('Meme热潮');
    
    if (reasons.length === 0) reasons.push('市场关注度提升');
    return reasons.join('，');
  };

  // 格式化价格
  const formatPrice = (price: number): string => {
    if (price >= 1) return `$${price.toFixed(2)}`;
    if (price >= 0.01) return `$${price.toFixed(4)}`;
    return `$${price.toFixed(6)}`;
  };

  // 格式化大数字
  const formatLargeNumber = (num: number): string => {
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
    if (num >= 1e3) return `$${(num / 1e3).toFixed(2)}K`;
    return `$${num.toFixed(2)}`;
  };

  // 获取Alpha专区代币真实数据
  const fetchAlphaTokens = async () => {
    try {
      const idsParam = BINANCE_ALPHA_IDS.join(',');
      const response = await fetch(
        `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${idsParam}&order=volume_desc&sparkline=false&price_change_percentage=24h`
      );
      
      if (!response.ok) throw new Error('API request failed');
      
      const data: CoinMarketData[] = await response.json();
      
      // 按Alpha专区代币顺序保持排名
      const tokenMap = new Map<string, CoinMarketData>(data.map((coin) => [coin.id, coin]));
      
      const alphaTokens: TrendingToken[] = BINANCE_ALPHA_TOKENS
        .map((alphaToken, index) => {
          const coin = tokenMap.get(alphaToken.id);
          if (!coin) return null;
          
          const price = Number(coin.current_price) || 0;
          const change24h = Number(coin.price_change_percentage_24h) || 0;
          const volume = Number(coin.total_volume) || 0;
          const marketCap = Number(coin.market_cap) || 0;
          
          // 计算AI热度分数（基于多个维度）
          const aiScore = calculateAiScore(volume, change24h, marketCap);
          
          return {
            rank: index + 1,
            id: alphaToken.id,
            name: alphaToken.name,
            symbol: alphaToken.symbol,
            chain: alphaToken.chain,
            chainIcon: CHAIN_ICONS[alphaToken.chain] || '🔷',
            price: formatPrice(price),
            change24h: `${change24h >= 0 ? '+' : ''}${change24h.toFixed(2)}%`,
            changeColor: change24h >= 0 ? 'green' : 'red' as const,
            volume: formatLargeNumber(volume),
            marketCap: formatLargeNumber(marketCap),
            aiScore,
            tags: [alphaToken.category, alphaToken.chain],
            signal: getSignal(change24h, volume),
            binanceAlpha: true,
          };
        })
        .filter((t): t is TrendingToken => t !== null);

      setTokens(alphaTokens);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('获取Alpha代币数据失败:', error);
    }
  };

  // 获取今日推荐
  const fetchTodayPicks = async () => {
    try {
      const candidateIds = ALPHA_CANDIDATES.map(c => c.id);
      const response = await fetch(
        `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${candidateIds.join(',')}&order=volume_desc&sparkline=false&price_change_percentage=24h`
      );
      
      if (!response.ok) throw new Error('API request failed');
      
      const data: CoinMarketData[] = await response.json();
      const candidateMap = new Map(ALPHA_CANDIDATES.map(c => [c.id, c]));
      
      const picks: TodayPick[] = data
        .map((coin: CoinMarketData) => {
          const candidate = candidateMap.get(coin.id);
          if (!candidate) return null;
          
          const price = Number(coin.current_price) || 0;
          const change24h = Number(coin.price_change_percentage_24h) || 0;
          const volume = Number(coin.total_volume) || 0;
          
          // 计算Kairos评分
          const kairosScore = calculateKairosScore(volume, change24h);
          
          return {
            id: candidate.id,
            symbol: candidate.symbol,
            name: candidate.name,
            price,
            priceChangePercent: change24h,
            kairosScore,
            socialSentiment: Math.min(100, Math.max(0, 50 + change24h * 2)),
            socialBuzz: getSocialBuzz(volume),
            chain: candidate.chain,
            chainIcon: CHAIN_ICONS[candidate.chain] || '🔷',
            reason: generateReason(candidate.category, change24h, volume),
          };
        })
        .filter((p): p is TodayPick => p !== null)
        .sort((a, b) => b.kairosScore - a.kairosScore)
        .slice(0, 5);

      setTodayPicks(picks);
    } catch (error) {
      console.error('获取今日推荐失败:', error);
    }
  };

  // 提交候补名单
  const handleWaitlist = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      
      if (res.ok) {
        setWaitlistMsg('✓ 已加入候补名单！');
        setEmail('');
      } else {
        setWaitlistMsg('加入失败，请重试');
      }
    } catch {
      setWaitlistMsg('网络错误，请重试');
    }
  };

  // AI扫描功能
  const handleScan = async (contract: string) => {
    if (!contract || scanning) return;
    
    setScanning(true);
    setScanResult('');
    
    try {
      const response = await fetch('/api/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contract }),
      });
      
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      
      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value);
          setScanResult((prev: string) => prev + chunk);
        }
      }
    } catch {
      setScanResult('扫描失败，请检查合约地址');
    } finally {
      setScanning(false);
    }
  };

  // 初始化加载
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchAlphaTokens(), fetchTodayPicks()]);
      setLoading(false);
    };
    loadData();
  }, []);

  // 30秒自动刷新
  useEffect(() => {
    const interval = setInterval(fetchAlphaTokens, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900">
      {/* 导航栏 */}
      <nav className="border-b border-blue-900/30 bg-slate-950/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-2xl font-bold text-white">
                <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  Kairos
                </span>
              </Link>
              <span className="text-xs text-blue-400/60 bg-blue-500/10 px-2 py-1 rounded">
                Alpha Discovery
              </span>
            </div>
            <div className="hidden md:flex items-center space-x-6">
              <Link href="/trending" className="text-blue-300 hover:text-white transition">
                Alpha热力榜
              </Link>
              <Link href="/product" className="text-slate-400 hover:text-white transition">
                产品
              </Link>
              <Link href="/pricing" className="text-slate-400 hover:text-white transition">
                定价
              </Link>
              <Link href="/resources" className="text-slate-400 hover:text-white transition">
                资源
              </Link>
            </div>
            <AuthButton />
          </div>
        </div>
      </nav>

      {/* 主内容 */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero区域 */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            AI驱动的 <span className="text-blue-400">Alpha</span> 发现平台
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            实时监控币安Alpha专区代币，AI智能分析六维评分，发现下一个爆发机会
          </p>
          {lastUpdated && (
            <p className="text-sm text-slate-500 mt-2">
              数据更新时间: {lastUpdated.toLocaleTimeString()}
            </p>
          )}
        </div>

        {/* Alpha热力榜 */}
        <section className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <span className="text-2xl">🔥</span>
                Alpha热力榜
              </h2>
              <p className="text-slate-400 text-sm mt-1">
                币安Alpha专区代币实时排名（仅展示确认入选代币）
              </p>
            </div>
            <Link 
              href="/trending"
              className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-1"
            >
              查看完整榜单 →
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-slate-800/50 rounded-xl p-4 animate-pulse">
                  <div className="h-4 bg-slate-700 rounded w-1/2 mb-2"></div>
                  <div className="h-3 bg-slate-700 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {tokens.slice(0, 6).map((token) => (
                <div 
                  key={token.id}
                  className="bg-slate-800/50 border border-blue-900/30 rounded-xl p-4 hover:border-blue-500/50 transition"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-slate-400 text-sm">#{token.rank}</span>
                        <span className="text-white font-semibold">{token.symbol}</span>
                        <span className="text-sm">{token.chainIcon}</span>
                      </div>
                      <span className="text-slate-500 text-xs">{token.name}</span>
                    </div>
                    <div className={`px-2 py-1 rounded text-xs font-medium ${
                      token.signal === 'hot' ? 'bg-red-500/20 text-red-400' :
                      token.signal === 'rising' ? 'bg-orange-500/20 text-orange-400' :
                      token.signal === 'stable' ? 'bg-blue-500/20 text-blue-400' :
                      'bg-slate-500/20 text-slate-400'
                    }`}>
                      {token.signal === 'hot' ? '🔥火热' :
                       token.signal === 'rising' ? '📈上升' :
                       token.signal === 'stable' ? '➡️平稳' : '📉冷却'}
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-end">
                    <div>
                      <div className="text-white text-lg font-bold">{token.price}</div>
                      <div className={`text-sm ${token.changeColor === 'green' ? 'text-green-400' : 'text-red-400'}`}>
                        {token.change24h}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-blue-400">{token.aiScore}</div>
                      <div className="text-xs text-slate-500">AI热度</div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 mt-3">
                    {token.tags.map(tag => (
                      <span key={tag} className="text-xs bg-blue-500/10 text-blue-400 px-2 py-1 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* 今日Alpha推荐 */}
        <section className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <span className="text-2xl">🎯</span>
                今日Alpha推荐
              </h2>
              <p className="text-slate-400 text-sm mt-1">
                AI预测可能进入Alpha专区的潜力代币（来自候选池）
              </p>
            </div>
          </div>

          <div className="bg-slate-800/30 rounded-xl border border-blue-900/30 overflow-hidden">
            <div className="grid grid-cols-5 gap-4 p-4 bg-slate-900/50 text-sm text-slate-400 border-b border-blue-900/30">
              <div>代币</div>
              <div className="text-right">价格</div>
              <div className="text-right">24h涨跌</div>
              <div className="text-right">Kairos评分</div>
              <div className="text-right">推荐理由</div>
            </div>
            {todayPicks.length === 0 ? (
              <div className="p-8 text-center text-slate-500">
                加载中...
              </div>
            ) : (
              todayPicks.map((pick, index) => (
                <div 
                  key={pick.id}
                  className="grid grid-cols-5 gap-4 p-4 hover:bg-slate-800/50 transition border-b border-blue-900/20 last:border-0"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 bg-blue-500/20 rounded-full flex items-center justify-center text-blue-400 text-xs">
                      {index + 1}
                    </span>
                    <div>
                      <div className="text-white font-medium">{pick.symbol}</div>
                      <div className="text-slate-500 text-xs">{pick.chainIcon} {pick.chain}</div>
                    </div>
                  </div>
                  <div className="text-right text-white">
                    ${pick.price.toFixed(pick.price < 1 ? 6 : 2)}
                  </div>
                  <div className={`text-right font-medium ${
                    pick.priceChangePercent >= 0 ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {pick.priceChangePercent >= 0 ? '+' : ''}{pick.priceChangePercent.toFixed(2)}%
                  </div>
                  <div className="text-right">
                    <span className={`text-lg font-bold ${
                      pick.kairosScore >= 70 ? 'text-green-400' :
                      pick.kairosScore >= 50 ? 'text-yellow-400' : 'text-slate-400'
                    }`}>
                      {pick.kairosScore}
                    </span>
                    <span className="text-slate-500 text-xs ml-1">/100</span>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-400 text-sm">{pick.reason}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* AI扫描器 */}
        <section className="mb-12 bg-slate-800/30 rounded-xl border border-blue-900/30 p-6">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <span className="text-2xl">🤖</span>
            AI代币扫描器
          </h2>
          <p className="text-slate-400 mb-4">
            输入合约地址，AI将分析代币的六大维度并给出投资建议
          </p>
          
          <div className="flex gap-4 mb-4">
            <input
              type="text"
              value={contractInput}
              onChange={(e) => setContractInput(e.target.value)}
              placeholder="输入代币合约地址..."
              className="flex-1 bg-slate-900 border border-blue-900/50 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
            <button
              onClick={() => handleScan(contractInput)}
              disabled={scanning || !contractInput}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 disabled:text-slate-500 text-white rounded-lg font-medium transition"
            >
              {scanning ? '扫描中...' : '开始扫描'}
            </button>
          </div>
          
          {scanResult && (
            <div className="bg-slate-900 rounded-lg p-4 border border-blue-900/30">
              <pre className="text-slate-300 text-sm whitespace-pre-wrap font-mono">
                {scanResult}
              </pre>
            </div>
          )}
        </section>

        {/* 候补名单 */}
        <section className="bg-gradient-to-r from-blue-900/30 to-cyan-900/30 rounded-xl border border-blue-700/30 p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-2">
            加入 Kairos Alpha Club
          </h2>
          <p className="text-slate-400 mb-6">
            抢先体验高级功能，获得专属Alpha信号推送
          </p>
          
          <form onSubmit={handleWaitlist} className="flex max-w-md mx-auto gap-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="输入邮箱地址"
              className="flex-1 bg-slate-900/50 border border-blue-700/50 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              required
            />
            <button
              type="submit"
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white rounded-lg font-medium transition"
            >
              加入
            </button>
          </form>
          
          {waitlistMsg && (
            <p className="mt-4 text-blue-400">{waitlistMsg}</p>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-blue-900/30 mt-12 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-500 text-sm">
          <p>© 2025 Kairos. 数据来源: CoinGecko API | Binance Alpha</p>
        </div>
      </footer>
    </div>
  );
}
