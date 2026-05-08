'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { AuthButton } from '@/components/AuthButton';

// ============================================
// 币安Alpha专区代币数据库（系统化管理）
// ============================================

// 币安Alpha专区代币（确认在Alpha专区的代币 - 2025年）
const BINANCE_ALPHA_TOKENS = [
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

// 链ID映射
const CHAIN_ICONS: Record<string, string> = {
  ETH: '🔷',
  SOL: '🌟',
  BASE: '🔵',
};

// CoinGecko代币市场数据接口
interface CoinMarketData {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  price_change_percentage_24h: number;
  price_change_percentage_1h_in_currency?: number;
  total_volume: number;
  market_cap: number;
  high_24h: number;
  low_24h: number;
}

// 接口定义
interface AlphaOpportunity {
  rank: number;
  id: string;
  name: string;
  symbol: string;
  chain: string;
  chainIcon: string;
  price: string;
  change24h: number;
  change1h: number;
  volume: string;
  marketCap: string;
  // 投资价值评分
  opportunityScore: number;
  // 投资信号
  signal: 'hot' | 'rising' | 'watch' | 'cooling';
  // 信号说明
  signalReason: string;
  // 性价比指标 (涨幅/市值)
  valueRatio: number;
  tags: string[];
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
  const [opportunities, setOpportunities] = useState<AlphaOpportunity[]>([]);
  const [todayPicks, setTodayPicks] = useState<TodayPick[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [email, setEmail] = useState('');
  const [waitlistMsg, setWaitlistMsg] = useState('');
  const [scanResult, setScanResult] = useState('');
  const [scanning, setScanning] = useState(false);
  const [contractInput, setContractInput] = useState('');

  // 计算投资价值评分 - 只关注有意义的指标
  const calculateOpportunityScore = (
    change24h: number,
    change1h: number,
    volume: number,
    marketCap: number
  ): { score: number; signal: 'hot' | 'rising' | 'watch' | 'cooling'; reason: string; valueRatio: number } => {
    // 性价比指标：涨幅/市值对数 (小市值+高涨幅 = 机会)
    const valueRatio = marketCap > 0 ? (change24h / Math.log10(marketCap + 1)) * 10 : 0;
    
    // 1. 动量评分 (40分) - 1h变化更重要
    let momentumScore = 0;
    let signalReason = '';
    
    if (change1h >= 5) {
      momentumScore = 40;
      signalReason = '1小时强势拉升';
    } else if (change1h >= 2) {
      momentumScore = 30;
      signalReason = '短期动量强劲';
    } else if (change1h >= 0) {
      momentumScore = 20;
      signalReason = '保持上升势头';
    } else if (change24h >= 20) {
      momentumScore = 25;
      signalReason = '24h持续上涨';
    } else if (change24h >= 10) {
      momentumScore = 15;
      signalReason = '今日表现稳健';
    } else if (change24h >= 0) {
      momentumScore = 10;
      signalReason = '横盘整理';
    } else {
      momentumScore = 0;
      signalReason = '今日回调';
    }

    // 2. 交易活跃度 (30分)
    const volumeScore = Math.min(30, Math.log10(volume + 1) * 3.5);

    // 3. 市值评估 (30分) - 小市值更容易爆发
    let capScore = 0;
    if (marketCap < 1e6) {
      capScore = 30; // 微市值 = 高爆发潜力
    } else if (marketCap < 1e7) {
      capScore = 25;
    } else if (marketCap < 1e8) {
      capScore = 20;
    } else if (marketCap < 5e8) {
      capScore = 15;
    } else {
      capScore = 10;
    }

    const totalScore = Math.round(momentumScore + volumeScore + capScore);

    // 信号判定
    let signal: 'hot' | 'rising' | 'watch' | 'cooling';
    if (totalScore >= 70 && change24h > 10) {
      signal = 'hot';
    } else if (totalScore >= 55 && change24h > 5) {
      signal = 'rising';
    } else if (totalScore >= 40 && change24h > 0) {
      signal = 'watch';
    } else {
      signal = 'cooling';
    }

    return { score: totalScore, signal, reason: signalReason, valueRatio };
  };

  // 获取Alpha专区代币真实数据
  const fetchAlphaTokens = async () => {
    try {
      const idsParam = BINANCE_ALPHA_IDS.join(',');
      const response = await fetch(
        `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${idsParam}&order=volume_desc&sparkline=false&price_change_percentage=24h,1h`
      );
      
      if (!response.ok) throw new Error('API request failed');
      
      const data: CoinMarketData[] = await response.json();
      const tokenMap = new Map(BINANCE_ALPHA_TOKENS.map(t => [t.id, t]));
      
      // 计算每个代币的投资价值
      const opportunitiesList: AlphaOpportunity[] = data
        .map((coin) => {
          const alphaToken = tokenMap.get(coin.id);
          if (!alphaToken) return null;
          
          const price = Number(coin.current_price) || 0;
          const change24h = Number(coin.price_change_percentage_24h) || 0;
          const change1h = Number(coin.price_change_percentage_1h_in_currency) || 0;
          const volume = Number(coin.total_volume) || 0;
          const marketCap = Number(coin.market_cap) || 0;
          
          const { score, signal, reason, valueRatio } = calculateOpportunityScore(
            change24h, change1h, volume, marketCap
          );
          
          return {
            rank: 0, // 稍后按评分排序
            id: alphaToken.id,
            name: alphaToken.name,
            symbol: alphaToken.symbol,
            chain: alphaToken.chain,
            chainIcon: CHAIN_ICONS[alphaToken.chain] || '🔷',
            price: formatPrice(price),
            change24h,
            change1h,
            volume: formatLargeNumber(volume),
            marketCap: formatLargeNumber(marketCap),
            opportunityScore: score,
            signal,
            signalReason: reason,
            valueRatio,
            tags: [alphaToken.category, alphaToken.chain],
          };
        })
        .filter((t): t is AlphaOpportunity => t !== null);

      // 按投资价值评分降序排列
      opportunitiesList.sort((a, b) => b.opportunityScore - a.opportunityScore);
      
      // 分配排名
      opportunitiesList.forEach((item, index) => {
        item.rank = index + 1;
      });

      setOpportunities(opportunitiesList);
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
      
      // 只推荐有上涨动力的候选币
      const picks: TodayPick[] = data
        .filter((coin) => {
          const change = Number(coin.price_change_percentage_24h) || 0;
          return change > 0; // 只推荐今日上涨的
        })
        .map((coin) => {
          const candidate = candidateMap.get(coin.id);
          if (!candidate) return null;
          
          const price = Number(coin.current_price) || 0;
          const change24h = Number(coin.price_change_percentage_24h) || 0;
          const volume = Number(coin.total_volume) || 0;
          
          const kairosScore = Math.round(Math.min(100, 
            Math.log10(volume + 1) * 4 + 
            (change24h > 20 ? 35 : change24h > 0 ? 25 : 15)
          ));
          
          return {
            id: candidate.id,
            symbol: candidate.symbol,
            name: candidate.name,
            price,
            priceChangePercent: change24h,
            kairosScore,
            socialSentiment: Math.min(100, Math.max(0, 50 + change24h * 2)),
            socialBuzz: volume > 50000000 ? '热门' : volume > 10000000 ? '活跃' : '一般',
            chain: candidate.chain,
            chainIcon: CHAIN_ICONS[candidate.chain] || '🔷',
            reason: change24h > 20 ? '24h强势上涨' : 
                    change24h > 10 ? '今日涨幅可观' : 
                    change24h > 0 ? '今日温和上涨' : '保持关注',
          };
        })
        .filter((p): p is TodayPick => p !== null)
        .sort((a, b) => b.kairosScore - a.kairosScore)
        .slice(0, 3);

      setTodayPicks(picks);
    } catch (error) {
      console.error('获取今日推荐失败:', error);
    }
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

  // 获取信号样式
  const getSignalStyle = (signal: string) => {
    switch (signal) {
      case 'hot': return { bg: 'bg-red-500/20', text: 'text-red-400', label: '🔥 热门机会' };
      case 'rising': return { bg: 'bg-orange-500/20', text: 'text-orange-400', label: '📈 上升中' };
      case 'watch': return { bg: 'bg-blue-500/20', text: 'text-blue-400', label: '👀 值得关注' };
      case 'cooling': return { bg: 'bg-slate-500/20', text: 'text-slate-400', label: '💤 冷却中' };
      default: return { bg: 'bg-slate-500/20', text: 'text-slate-400', label: '未知' };
    }
  };

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
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            AI驱动的 <span className="text-blue-400">Alpha</span> 发现平台
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            只展示今天真正有机会的Alpha代币，冷却的、错过的机会我们不推荐
          </p>
          {lastUpdated && (
            <p className="text-sm text-slate-500 mt-2">
              数据更新时间: {lastUpdated.toLocaleTimeString()} (每30秒自动刷新)
            </p>
          )}
        </div>

        {/* Alpha投资机会榜 - 核心功能 */}
        <section className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <span className="text-2xl">🎯</span>
                今日Alpha投资机会
              </h2>
              <p className="text-slate-400 text-sm mt-1">
                按投资价值实时排序，只推荐当下真正有机会的标的
              </p>
            </div>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="bg-slate-800/50 rounded-xl p-4 animate-pulse">
                  <div className="h-6 bg-slate-700 rounded w-1/4 mb-2"></div>
                  <div className="h-4 bg-slate-700 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {opportunities
                .filter(t => t.signal !== 'cooling') // 过滤掉冷却的
                .slice(0, 8) // 只展示前8个有机会的
                .map((token) => {
                  const signalStyle = getSignalStyle(token.signal);
                  return (
                    <div 
                      key={token.id}
                      className="bg-slate-800/50 border border-blue-900/30 rounded-xl p-4 hover:border-blue-500/50 transition"
                    >
                      <div className="flex items-center justify-between">
                        {/* 左侧：排名和代币信息 */}
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${
                            token.rank === 1 ? 'bg-yellow-500/20 text-yellow-400' :
                            token.rank === 2 ? 'bg-slate-400/20 text-slate-300' :
                            token.rank === 3 ? 'bg-orange-600/20 text-orange-400' :
                            'bg-slate-700/50 text-slate-400'
                          }`}>
                            {token.rank}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-white font-semibold">{token.symbol}</span>
                              <span className="text-sm text-slate-500">{token.chainIcon}</span>
                              <span className={`px-2 py-0.5 rounded text-xs ${signalStyle.bg} ${signalStyle.text}`}>
                                {signalStyle.label}
                              </span>
                            </div>
                            <div className="text-xs text-slate-500 mt-0.5">
                              {token.signalReason} · {token.tags.join(' · ')}
                            </div>
                          </div>
                        </div>

                        {/* 中间：价格信息 */}
                        <div className="hidden md:flex items-center gap-8">
                          <div className="text-right">
                            <div className="text-white font-medium">{token.price}</div>
                            <div className="text-xs text-slate-500">当前价格</div>
                          </div>
                          <div className="text-right">
                            <div className={`font-semibold ${
                              token.change24h >= 0 ? 'text-green-400' : 'text-red-400'
                            }`}>
                              {token.change24h >= 0 ? '+' : ''}{token.change24h.toFixed(2)}%
                            </div>
                            <div className="text-xs text-slate-500">24h</div>
                          </div>
                          <div className="text-right">
                            <div className={`font-semibold ${
                              token.change1h >= 0 ? 'text-green-400' : 'text-red-400'
                            }`}>
                              {token.change1h >= 0 ? '+' : ''}{token.change1h.toFixed(2)}%
                            </div>
                            <div className="text-xs text-slate-500">1h</div>
                          </div>
                        </div>

                        {/* 右侧：评分 */}
                        <div className="text-right">
                          <div className={`text-2xl font-bold ${
                            token.opportunityScore >= 70 ? 'text-green-400' :
                            token.opportunityScore >= 55 ? 'text-blue-400' :
                            'text-slate-400'
                          }`}>
                            {token.opportunityScore}
                          </div>
                          <div className="text-xs text-slate-500">机会评分</div>
                        </div>
                      </div>

                      {/* 移动端价格 */}
                      <div className="flex md:hidden items-center gap-4 mt-3 pt-3 border-t border-slate-700/50">
                        <div className="text-white">{token.price}</div>
                        <div className={`px-2 py-0.5 rounded text-sm ${
                          token.change24h >= 0 ? 'text-green-400 bg-green-400/10' : 'text-red-400 bg-red-400/10'
                        }`}>
                          {token.change24h >= 0 ? '+' : ''}{token.change24h.toFixed(2)}%
                        </div>
                        <div className={`px-2 py-0.5 rounded text-sm ${
                          token.change1h >= 0 ? 'text-green-400 bg-green-400/10' : 'text-red-400 bg-red-400/10'
                        }`}>
                          1h: {token.change1h >= 0 ? '+' : ''}{token.change1h.toFixed(2)}%
                        </div>
                      </div>
                    </div>
                  );
                })}

              {/* 冷却中的代币提示 */}
              {opportunities.filter(t => t.signal === 'cooling').length > 0 && (
                <div className="text-center py-4 text-slate-500 text-sm">
                  还有 {opportunities.filter(t => t.signal === 'cooling').length} 个代币处于冷却状态，已隐藏
                </div>
              )}
            </div>
          )}
        </section>

        {/* 今日Alpha推荐 */}
        <section className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <span className="text-2xl">⭐</span>
                潜力候选池
              </h2>
              <p className="text-slate-400 text-sm mt-1">
                尚未入选Alpha但今日表现活跃，可能进入下轮Alpha
              </p>
            </div>
          </div>

          <div className="bg-slate-800/30 rounded-xl border border-blue-900/30 overflow-hidden">
            {todayPicks.length === 0 ? (
              <div className="p-8 text-center text-slate-500">
                暂无符合条件的候选币
              </div>
            ) : (
              todayPicks.map((pick, index) => (
                <div 
                  key={pick.id}
                  className="grid grid-cols-4 gap-4 p-4 hover:bg-slate-800/50 transition border-b border-blue-900/20 last:border-0"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 bg-cyan-500/20 rounded-full flex items-center justify-center text-cyan-400 text-xs">
                      {index + 1}
                    </span>
                    <div>
                      <div className="text-white font-medium">{pick.symbol}</div>
                      <div className="text-slate-500 text-xs">{pick.chainIcon}</div>
                    </div>
                  </div>
                  <div className="text-right text-white">
                    ${pick.price.toFixed(pick.price < 1 ? 6 : 4)}
                  </div>
                  <div className={`text-right font-medium ${
                    pick.priceChangePercent >= 0 ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {pick.priceChangePercent >= 0 ? '+' : ''}{pick.priceChangePercent.toFixed(2)}%
                  </div>
                  <div className="text-right">
                    <span className={`text-lg font-bold ${
                      pick.kairosScore >= 70 ? 'text-green-400' :
                      pick.kairosScore >= 50 ? 'text-blue-400' : 'text-slate-400'
                    }`}>
                      {pick.kairosScore}
                    </span>
                    <span className="text-slate-500 text-xs ml-1">/100</span>
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
          <p>© 2025 Kairos. 数据来源: CoinGecko API | Binance Alpha | 不构成投资建议</p>
        </div>
      </footer>
    </div>
  );
}
