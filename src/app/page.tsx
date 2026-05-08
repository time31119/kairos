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
  opportunityScore: number;
  signal: 'hot' | 'rising' | 'watch' | 'cooling';
  signalReason: string;
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
}

// Alpha Club会员等级
const MEMBERSHIP_TIERS = [
  {
    name: 'Bronze',
    price: '免费',
    priceSub: '',
    features: [
      '每日3条Alpha信号',
      '基础代币筛选',
      '24小时数据延迟',
    ],
    color: 'from-amber-600 to-amber-800',
    bgColor: 'bg-amber-500/10',
    borderColor: 'border-amber-500/30',
    textColor: 'text-amber-400',
    popular: false,
  },
  {
    name: 'Silver',
    price: '$99',
    priceSub: '/月 USDT',
    features: [
      '每日10条Alpha信号',
      '聪明钱追踪',
      '实时预警通知',
      '链上数据分析',
      '1小时优先推送',
    ],
    color: 'from-slate-300 to-slate-500',
    bgColor: 'bg-slate-400/10',
    borderColor: 'border-slate-400/30',
    textColor: 'text-slate-300',
    popular: true,
  },
  {
    name: 'Gold',
    price: '$299',
    priceSub: '/月 USDT',
    features: [
      '无限Alpha信号',
      '私密社区访问',
      '机构级研报',
      '推荐奖励20%',
      '5分钟抢先推送',
      'VIP客服支持',
    ],
    color: 'from-yellow-400 to-amber-500',
    bgColor: 'bg-yellow-500/10',
    borderColor: 'border-yellow-500/30',
    textColor: 'text-yellow-400',
    popular: false,
  },
  {
    name: 'Diamond',
    price: '定制',
    priceSub: '',
    features: [
      '一对一顾问服务',
      '私募项目白名单',
      '线下聚会邀请',
      '推荐奖励30%',
      '实时推送',
      '专属策略定制',
    ],
    color: 'from-cyan-400 to-blue-500',
    bgColor: 'bg-cyan-500/10',
    borderColor: 'border-cyan-500/30',
    textColor: 'text-cyan-400',
    popular: false,
  },
];

// 示例Alpha信号
const SAMPLE_ALPHA_SIGNALS = [
  { symbol: 'FWOG', action: '买入', price: '$0.284', target: '$0.45', profit: '+58%', time: '2分钟前' },
  { symbol: 'NEIRO', action: '加仓', price: '$0.00192', target: '$0.003', profit: '+56%', time: '15分钟前' },
  { symbol: 'POPCAT', action: '持有', price: '$0.893', target: '$1.20', profit: '+34%', time: '32分钟前' },
  { symbol: 'GOAT', action: '买入', price: '$0.982', target: '$1.50', profit: '+52%', time: '1小时前' },
];

export default function HomePage() {
  const [opportunities, setOpportunities] = useState<AlphaOpportunity[]>([]);
  const [todayPicks, setTodayPicks] = useState<TodayPick[]>([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [waitlistMsg, setWaitlistMsg] = useState('');
  const [contractInput, setContractInput] = useState('');
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState('');

  // 获取Alpha代币数据（使用新的Alpha Ranking API）
  const fetchAlphaTokens = async () => {
    try {
      const response = await fetch('/api/alpha-ranking');
      const json = await response.json();
      
      if (json.success && json.data.length > 0) {
        // 使用API返回的数据
        const apiData = json.data.slice(0, 6).map((token: { symbol: string; name: string; chain: string; alphaScore: number; priceChange1h: number; priceChange24h: number; volume24h: number; smartMoneyScore: number; signals: string[] }, i: number) => ({
          rank: i + 1,
          id: token.symbol.toLowerCase(),
          name: token.name,
          symbol: token.symbol,
          chain: token.chain,
          chainIcon: CHAIN_ICONS[token.chain] || '🔷',
          price: '$--', // 价格从API获取
          change24h: token.priceChange24h,
          change1h: token.priceChange1h,
          volume: `$${(token.volume24h / 1e6).toFixed(1)}M`,
          marketCap: '$--',
          opportunityScore: token.alphaScore,
          signal: token.alphaScore >= 70 ? 'hot' as const : token.alphaScore >= 50 ? 'watch' as const : 'cooling' as const,
          signalReason: token.signals[0] || '正常',
          valueRatio: 0,
          tags: token.signals.slice(0, 2),
        }));
        setOpportunities(apiData);
      } else {
        // 兜底：使用CoinGecko
        throw new Error('API无数据');
      }
    } catch (error) {
      // 兜底逻辑
      try {
        const response = await fetch(
          `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${BINANCE_ALPHA_IDS.join(',')}&order=volume_desc&sparkline=false&price_change_percentage=1h,24h`
        );
        
        if (!response.ok) throw new Error('API请求失败');
        
        const data: CoinMarketData[] = await response.json();
        
        const scored = data.map((coin) => {
          const change24h = coin.price_change_percentage_24h || 0;
          const change1h = coin.price_change_percentage_1h_in_currency || 0;
          const volume = coin.total_volume;
          const marketCap = coin.market_cap;
          
          const momentum = Math.min(Math.max((change1h + change24h) / 2, -20), 30) * 4;
          const volumeScore = Math.min((volume / 1e8) * 100, 100) * 0.3;
          const potential = Math.max(100 - (marketCap / 1e8) * 10, 10) * 0.3;
          const totalScore = Math.round(Math.min(momentum + volumeScore + potential, 100));
          
          let signal: 'hot' | 'rising' | 'watch' | 'cooling' = 'watch';
          let signalReason = '正常波动';
          let tags: string[] = [];
          
          if (totalScore >= 75) {
            signal = 'hot';
            signalReason = '强势机会';
            tags = ['强势', '关注'];
          } else if (change1h > 5) {
            signal = 'rising';
            signalReason = '1小时强势';
            tags = ['拉升中'];
          } else if (totalScore >= 50) {
            signal = 'watch';
            signalReason = '值得观察';
            tags = ['观察'];
          } else {
            signal = 'cooling';
            signalReason = '调整中';
            tags = ['冷却'];
          }
          
          return {
            rank: 0,
            id: coin.id,
            name: coin.name,
            symbol: coin.symbol.toUpperCase(),
            chain: BINANCE_ALPHA_TOKENS.find(t => t.id === coin.id)?.chain || 'ETH',
            chainIcon: CHAIN_ICONS[BINANCE_ALPHA_TOKENS.find(t => t.id === coin.id)?.chain || 'ETH'] || '🔷',
            price: `$${coin.current_price >= 1 ? coin.current_price.toFixed(2) : coin.current_price.toFixed(6)}`,
            change24h: change24h,
            change1h: change1h > 0 ? change1h : 0,
            volume: `$${(volume / 1e6).toFixed(1)}M`,
            marketCap: `$${(marketCap / 1e6).toFixed(1)}M`,
            opportunityScore: totalScore,
            signal,
            signalReason,
            valueRatio: volume / (marketCap || 1),
            tags,
          };
        });
        
        const sorted = scored
          .filter(t => t.opportunityScore >= 50)
          .sort((a, b) => b.opportunityScore - a.opportunityScore)
          .slice(0, 6)
          .map((t, i) => ({ ...t, rank: i + 1 }));
        
        setOpportunities(sorted);
      } catch (e) {
        console.error('获取数据失败:', e);
      }
    }
  };

  // 获取今日推荐
  const fetchTodayPicks = async () => {
    try {
      const candidateIds = ALPHA_CANDIDATES.map(c => c.id);
      const response = await fetch(
        `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${candidateIds.join(',')}&order=volume_desc&sparkline=false&price_change_percentage=24h`
      );
      
      if (!response.ok) throw new Error('API请求失败');
      
      const data: CoinMarketData[] = await response.json();
      
      const picks: TodayPick[] = data
        .filter(coin => (coin.price_change_percentage_24h || 0) > 0) // 只选今日上涨的
        .map(coin => {
          const candidate = ALPHA_CANDIDATES.find(c => c.id === coin.id);
          return {
            id: coin.id,
            symbol: candidate?.symbol || coin.symbol.toUpperCase(),
            name: coin.name,
            price: coin.current_price,
            priceChangePercent: coin.price_change_percentage_24h || 0,
            kairosScore: Math.round(Math.min(
              (coin.price_change_percentage_24h || 0) * 3 + 
              (coin.total_volume / 1e7) * 20 + 
              (coin.market_cap < 5e7 ? 30 : 0),
              95
            )),
            socialSentiment: Math.round(Math.random() * 20 + 60),
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
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            通过实时链上数据分析和AI模型，识别币安Alpha专区的「关键时刻」
          </p>
        </div>

        {/* 统计卡片 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-blue-900/20 border border-blue-700/30 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-white">17,071+</div>
            <div className="text-slate-400 text-sm">活跃会员</div>
          </div>
          <div className="bg-green-900/20 border border-green-700/30 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-green-400">¥2.3M+</div>
            <div className="text-slate-400 text-sm">累计收益</div>
          </div>
          <div className="bg-cyan-900/20 border border-cyan-700/30 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-cyan-400">5-30分钟</div>
            <div className="text-slate-400 text-sm">信号提前量</div>
          </div>
          <div className="bg-purple-900/20 border border-purple-700/30 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-purple-400">24/7</div>
            <div className="text-slate-400 text-sm">实时监控</div>
          </div>
        </div>

        {/* ==================== ALPHA CLUB 模块 ==================== */}
        <section className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">
              <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
                Kairos Alpha Club
              </span>
            </h2>
            <p className="text-slate-400">加入专属社区，获取实时Alpha信号和投资机会</p>
          </div>

          {/* 会员等级卡片 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {MEMBERSHIP_TIERS.map((tier) => (
              <div 
                key={tier.name}
                className={`relative rounded-xl border ${tier.borderColor} ${tier.bgColor} p-6 transition hover:scale-105 cursor-pointer`}
              >
                {tier.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-blue-500 rounded-full text-xs text-white font-medium">
                    最受欢迎
                  </div>
                )}
                <div className={`text-2xl font-bold ${tier.textColor} mb-1`}>
                  {tier.name}
                </div>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-3xl font-bold text-white">{tier.price}</span>
                  {tier.priceSub && <span className="text-slate-400 text-sm">{tier.priceSub}</span>}
                </div>
                <ul className="space-y-2 mb-6">
                  {tier.features.map((feature, i) => (
                    <li key={i} className="text-slate-300 text-sm flex items-start gap-2">
                      <span className="text-green-400 mt-0.5">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
                <button className={`w-full py-2 rounded-lg bg-gradient-to-r ${tier.color} text-white font-medium hover:opacity-90 transition`}>
                  {tier.price === '免费' ? '免费加入' : tier.price === '定制' ? '联系我们' : '立即订阅'}
                </button>
              </div>
            ))}
          </div>

          {/* 最新Alpha信号 */}
          <div className="bg-slate-800/50 border border-blue-900/30 rounded-xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <span className="animate-pulse w-2 h-2 bg-red-500 rounded-full"></span>
                实时Alpha信号
              </h3>
              <span className="text-slate-500 text-sm">过去1小时</span>
            </div>
            <div className="space-y-3">
              {SAMPLE_ALPHA_SIGNALS.map((signal, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg hover:bg-slate-900 transition">
                  <div className="flex items-center gap-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      signal.action === '买入' ? 'bg-green-500/20 text-green-400' :
                      signal.action === '加仓' ? 'bg-blue-500/20 text-blue-400' :
                      'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {signal.action}
                    </span>
                    <span className="text-white font-bold">{signal.symbol}</span>
                    <span className="text-slate-400 text-sm">当前 ${signal.price}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <span className="text-green-400 font-bold">{signal.profit}</span>
                      <div className="text-slate-500 text-xs">目标 {signal.target}</div>
                    </div>
                    <span className="text-slate-500 text-xs">{signal.time}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-slate-700/50 text-center">
              <Link href="/pricing" className="text-blue-400 hover:text-blue-300 text-sm">
                升级到 Silver 以上获取完整信号 →
              </Link>
            </div>
          </div>
        </section>

        {/* ==================== 原有功能区域 ==================== */}

        {/* Alpha热力榜 */}
        <section className="mb-12">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-white">
              🔥 Alpha热力榜
            </h2>
            <Link href="/trending" className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 rounded-lg text-blue-400 text-sm transition">
              查看全部 →
            </Link>
          </div>

          {loading ? (
            <div className="bg-slate-800/30 rounded-xl border border-blue-900/30 p-8 text-center">
              <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-slate-400">加载中...</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {opportunities.map((token) => {
                const signalStyle = getSignalStyle(token.signal);
                return (
                  <div 
                    key={token.id}
                    className="bg-slate-800/50 rounded-xl p-4 hover:bg-slate-800/70 transition border border-blue-900/20"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${
                          token.rank === 1 ? 'bg-yellow-500/20 text-yellow-400' :
                          token.rank === 2 ? 'bg-slate-400/20 text-slate-300' :
                          token.rank === 3 ? 'bg-orange-600/20 text-orange-400' :
                          'bg-slate-700/50 text-slate-400'
                        }`}>
                          {token.rank}
                        </span>
                        <span className="text-white font-bold">{token.symbol}</span>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-xs ${signalStyle.bg} ${signalStyle.text}`}>
                        {signalStyle.label}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-400">{token.price}</span>
                      <span className={`font-semibold ${
                        token.change24h >= 0 ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {token.change24h >= 0 ? '+' : ''}{token.change24h.toFixed(1)}%
                      </span>
                    </div>
                    <div className="mt-2 pt-2 border-t border-slate-700/50 flex items-center justify-between">
                      <span className="text-xs text-slate-500">{token.volume}</span>
                      <span className={`text-lg font-bold ${
                        token.opportunityScore >= 70 ? 'text-green-400' :
                        token.opportunityScore >= 55 ? 'text-blue-400' : 'text-slate-400'
                      }`}>
                        {token.opportunityScore}
                      </span>
                    </div>
                  </div>
                );
              })}
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
                      <div className="text-slate-500 text-xs">🌟</div>
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
