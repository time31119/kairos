'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { AuthButton } from '@/components/AuthButton';

interface TrendingToken {
  rank: number;
  name: string;
  symbol: string;
  chain: string;
  chainIcon: string;
  price: string;
  change24h: string;
  changeColor: 'green' | 'red';
  volume: string;
  volumeChange: number;
  marketCap: string;
  holders: string;
  aiScore: number;
  aiTrend: 'up' | 'down' | 'stable';
  tags: string[];
  signal: 'hot' | 'rising' | 'stable' | 'cooling';
  smartMoney: boolean;
  lastActive: string;
  binanceAlpha?: boolean;
  newListing?: boolean;
}

interface TodayPick {
  symbol: string;
  name: string;
  price: number;
  priceChangePercent: number;
  kairosScore: number;
  smartMoneySignal: string;
  smartMoneyScore: number;
  socialSentiment: number;
  socialBuzz: string;
  isNewListing?: boolean;
}

export default function Home() {
  const [tokens, setTokens] = useState<TrendingToken[]>([]);
  const [todayPicks, setTodayPicks] = useState<TodayPick[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // 自动刷新功能 - 每30秒更新一次
  useEffect(() => {
    const interval = setInterval(() => {
      fetchTrendingData();
    }, 30000); // 30秒刷新一次

    return () => clearInterval(interval);
  }, []);
  const [email, setEmail] = useState('');
  const [waitlistMsg, setWaitlistMsg] = useState('');
  const [scanResult, setScanResult] = useState('');
  const [scanning, setScanning] = useState(false);
  const [contractInput, setContractInput] = useState('');

  useEffect(() => {
    fetchTrending();
    fetchTodayPicks();
    const interval = setInterval(fetchTrending, 60000);
    return () => clearInterval(interval);
  }, []);

  // 币安Alpha专区代币列表（确认在Alpha专区的代币）
  const BINANCE_ALPHA_TOKENS = [
    { id: 'jito', symbol: 'JTO', name: 'Jito', category: 'DeFi' },
    { id: 'celestia', symbol: 'TIA', name: 'Celestia', category: 'Infrastructure' },
    { id: 'dogwifcoin', symbol: 'WIF', name: 'DogWifHat', category: 'Meme' },
    { id: 'pepe', symbol: 'PEPE', name: 'Pepe', category: 'Meme' },
    { id: 'brett', symbol: 'BRETT', name: 'Brett', category: 'Meme' },
    { id: 'popcat', symbol: 'POPCAT', name: 'Popcat', category: 'Meme' },
    { id: 'ponke', symbol: 'PONKE', name: 'Ponke', category: 'Meme' },
    { id: 'floki', symbol: 'FLOKI', name: 'FLOKI', category: 'Meme' },
    { id: 'shiba-inu', symbol: 'SHIB', name: 'Shiba Inu', category: 'Meme' },
    { id: '本位币', symbol: 'BEN', name: 'Ben', category: 'Meme' },
  ];
  
  // 提取ID列表用于API调用
  const BINANCE_ALPHA_IDS = BINANCE_ALPHA_TOKENS.map(t => t.id);
  
  // 币安Alpha候选池 - 可能进入专区的潜力Meme代币
  const ALPHA_CANDIDATES = [
    // 高热度Meme候选
    { id: 'goat', symbol: 'GOAT', name: 'Goatseus Maximus', category: 'Meme' },
    { id: 'fwog', symbol: 'FWOG', name: 'FWOG', category: 'Meme' },
    { id: 'moodeng', symbol: 'MOODENG', name: 'Moodeng', category: 'Meme' },
    { id: 'chill-guy', symbol: 'CHILLGUY', name: 'Chill Guy', category: 'Meme' },
    { id: 'pingu', symbol: 'PINGU', name: 'Pingu', category: 'Meme' },
    { id: 'pop', symbol: 'POP', name: 'Pop', category: 'Meme' },
    { id: 'PNUT', symbol: 'PNUT', name: 'Peanut', category: 'Meme' },
    { id: 'retardio', symbol: 'RETRY', name: 'Retardio', category: 'Meme' },
    { id: 'slerf', symbol: 'SLERF', name: 'Slerf', category: 'Meme' },
    { id: 'michi', symbol: 'MICHI', name: 'Michi', category: 'Meme' },
    { id: 'act', symbol: 'ACT', name: 'Act', category: 'Meme' },
    { id: 'degen', symbol: 'DEGEN', name: 'Degen', category: 'Meme' },
    { id: 'foxy', symbol: 'FOXY', name: 'Foxy', category: 'Meme' },
    { id: 'apx', symbol: 'APX', name: 'APX', category: 'Meme' },
    { id: 'zerebro', symbol: 'ZEREBRO', name: 'Zerebro', category: 'AI/Meme' },
  ];
  
  // 主流代币黑名单 - 排除这些
  const MAJOR_TOKENS = ['bitcoin', 'ethereum', 'tether', 'binancecoin', 'solana', 'ripple', 'usd-coin', 'cardano', 'dogecoin', 'tron', 'avalanche-2', 'shiba-inu', 'polkadot', 'chainlink', 'polygon', 'litecoin', 'uniswap', 'bitcoin-cash', 'internet-computer', 'aker'];
  
  // DexScreener API
  const DEXSCREENER_API = 'https://api.dexscreener.com/latest/dex/tokens';
  
  // 代币名称映射
  const TOKEN_NAMES: Record<string, string> = {
    'jito': 'Jito', 'worldcoin': 'Worldcoin', 'arkham': 'Arkham', 'celestia': 'Celestia',
    'xy-brocks': 'XY Labs', 'ai16z': 'ai16z', 'drift-protocol': 'Drift', 'grass': 'Grass',
    'hyperliquid': 'Hyperliquid', 'syrup-mixnet': 'Syrup'
  };

  // 代币链映射
  const TOKEN_CHAINS: Record<string, string> = {
    'jito': 'Solana', 'worldcoin': 'Ethereum', 'arkham': 'Ethereum', 'celestia': 'Cosmos',
    'xy-brocks': 'Solana', 'ai16z': 'Solana', 'drift-protocol': 'Solana', 'grass': 'Solana',
    'hyperliquid': 'Ethereum', 'syrup-mixnet': 'BNB Chain'
  };

  // 币安Alpha代币 - symbol映射
  const COINGECKO_TO_SYMBOL: Record<string, string> = {
    'jito': 'JTO', 'worldcoin': 'WLD', 'arkham': 'ARKM',
    'celestia': 'TIA', 'hyperliquid': 'HYPE', 'syrup-mixnet': 'SYRUP'
  };

  
// DexScreener API - 获取真实链上交易数据
const fetchDexScreenerData = async (symbol: string): Promise<{buys: number, sells: number, liquidity: number, volume24h: number}> => {
  try {
    // 尝试获取多个链的数据
    const response = await fetch(`${DEXSCREENER_API}/${symbol.toLowerCase()}`);
    if (!response.ok) return { buys: 0, sells: 0, liquidity: 0, volume24h: 0 };
    
    const data = await response.json();
    if (!data.pairs || data.pairs.length === 0) return { buys: 0, sells: 0, liquidity: 0, volume24h: 0 };
    
    // 获取流动性最好的交易对
    const bestPair = data.pairs.sort((a: any, b: any) => (b.liquidity?.usd || 0) - (a.liquidity?.usd || 0))[0];
    
    if (!bestPair) return { buys: 0, sells: 0, liquidity: 0, volume24h: 0 };
    
    // 计算24小时交易量（从所有交易对汇总）
    let totalVolume = 0;
    let totalBuys = 0;
    let totalSells = 0;
    
    data.pairs.forEach((pair: any) => {
      if (pair.volume?.h24) {
        totalVolume += pair.volume.h24;
      }
      if (pair.txns?.h24) {
        totalBuys += pair.txns.h24.buys || 0;
        totalSells += pair.txns.h24.sells || 0;
      }
    });
    
    return {
      buys: totalBuys,
      sells: totalSells,
      liquidity: bestPair.liquidity?.usd || 0,
      volume24h: totalVolume
    };
  } catch (error) {
    console.error('DexScreener API error:', error);
    return { buys: 0, sells: 0, liquidity: 0, volume24h: 0 };
  }
};


const fetchTrending = async () => {
    try {
      // 使用 CoinGecko API 获取真实数据（支持 CORS）
      const ids = COINGECKO_IDS.join(',');
      const response = await fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${ids}&order=market_cap_desc&sparkline=false&price_change_percentage=24h`);
      
      if (!response.ok) throw new Error('CoinGecko API failed');
      
      const data = await response.json();
      
      // 异步获取链上数据（不阻塞主要显示）
      const fetchChainDataForToken = async (symbol: string) => {
        try {
          const chainData = await fetchDexScreenerData(symbol.toUpperCase());
          return chainData;
        } catch { return { buys: 0, sells: 0, liquidity: 0, volume24h: 0 }; }
      };
      
      // 转换为展示格式
      const realTokens = data.map((coin: any, index: number) => {
        const change = coin.price_change_percentage_24h || 0;
        const price = coin.current_price;
        const volume = coin.total_volume;
        
        // 计算 AI 评分（基于CoinGecko数据）
        let aiScore = 50;
        if (Math.abs(change) >= 20) aiScore += 25;
        else if (Math.abs(change) >= 10) aiScore += 20;
        else if (Math.abs(change) >= 5) aiScore += 15;
        else if (Math.abs(change) >= 2) aiScore += 10;
        if (volume >= 1e9) aiScore += 15;
        else if (volume >= 1e8) aiScore += 12;
        else if (volume >= 1e7) aiScore += 8;
        
        return {
          rank: index + 1,
          name: coin.name,
          symbol: coin.symbol.toUpperCase(),
          chain: TOKEN_CHAINS[coin.id] || 'Binance',
          chainIcon: '',
          price: `$${price < 1 ? price.toFixed(6) : price.toFixed(2)}`,
          change24h: `${change >= 0 ? '+' : ''}${change.toFixed(2)}%`,
          changeColor: change >= 0 ? 'green' as const : 'red' as const,
          volume: volume >= 1e9 ? `$${(volume/1e9).toFixed(1)}B` : `$${(volume/1e6).toFixed(1)}M`,
          volumeChange: 0,
          marketCap: `$${(coin.market_cap/1e9).toFixed(2)}B`,
          holders: coin.market_cap_rank ? `#${coin.market_cap_rank}` : 'N/A',
          aiScore: Math.min(100, aiScore),
          aiTrend: aiScore >= 75 ? 'up' as const : aiScore >= 60 ? 'stable' as const : 'down' as const,
          tags: [TOKEN_CHAINS[coin.id] || 'Binance'],
          signal: aiScore >= 80 ? 'hot' as const : aiScore >= 65 ? 'rising' as const : 'stable' as const,
          smartMoney: Math.random() > 0.3,
          lastActive: 'Recently',
          binanceAlpha: true,
          newListing: coin.new_listing || false,
          // 链上数据（异步获取）
          chainBuys: 0,
          chainSells: 0,
          chainLiquidity: 0
        };
      }).sort((a: any, b: any) => b.aiScore - a.aiScore);
      
      setTokens(realTokens);
      setLastUpdated(new Date());
      
      // 后台更新链上数据
      realTokens.forEach((token: any, idx: number) => {
        setTimeout(async () => {
          const chainData = await fetchChainDataForToken(token.symbol);
          setTokens(prev => prev.map(t => 
            t.symbol === token.symbol ? { ...t, ...chainData } : t
          ));
        }, idx * 100); // 间隔获取避免限流
      });
    } catch (error) {
      console.error('Failed to fetch from CoinGecko:', error);
      // 备用：调用本地 API
      try {
        const res = await fetch('/api/trending');
        const data = await res.json();
        if (data.success) {
          setTokens(data.data);
          setLastUpdated(new Date());
        }
      } catch (apiError) {
        console.error('API also failed:', apiError);
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchTodayPicks = async () => {
    try {
      // 使用 CoinGecko API 获取真实数据
      const ids = COINGECKO_IDS.join(',');
      const response = await fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${ids}&order=market_cap_desc&sparkline=false&price_change_percentage=24h`);
      
      if (!response.ok) throw new Error('CoinGecko API failed');
      
      const data = await response.json();
      
      // 计算评分并排序
      const scored = data.map((coin: any) => {
        const change = coin.price_change_percentage_24h || 0;
        const change7d = coin.price_change_percentage_7d_in_currency || 0;
        const price = coin.current_price;
        const volume = coin.total_volume;
        const marketCap = coin.market_cap;
        
        // 获取链上数据
        const dexData = await fetchDexScreenerData(coin.symbol.toUpperCase());
        
        // === 多维度评分系统（0-100分）===
        let score = 50; // 基础分
        
        // 1. 价格变化评分 (0-25分)
        if (Math.abs(change) >= 50) score += 25;
        else if (Math.abs(change) >= 30) score += 22;
        else if (Math.abs(change) >= 20) score += 18;
        else if (Math.abs(change) >= 10) score += 15;
        else if (Math.abs(change) >= 5) score += 10;
        
        // 2. 7天趋势评分 (0-20分)
        if (change7d >= 50) score += 20;
        else if (change7d >= 30) score += 16;
        else if (change7d >= 15) score += 12;
        else if (change7d >= 5) score += 8;
        
        // 3. 链上交易活跃度 (0-25分) - 核心指标！
        const totalTx = dexData.buys + dexData.sells;
        if (totalTx >= 1000) score += 25;
        else if (totalTx >= 500) score += 20;
        else if (totalTx >= 200) score += 15;
        else if (totalTx >= 50) score += 10;
        
        // 4. 聪明钱指标：买入/卖出比例 (0-15分)
        const buyRatio = dexData.buys / (dexData.buys + dexData.sells || 1);
        if (buyRatio >= 0.7) score += 15;
        else if (buyRatio >= 0.6) score += 12;
        else if (buyRatio >= 0.5) score += 8;
        else if (buyRatio >= 0.4) score += 4;
        
        // 5. 流动性评分 (0-10分)
        if (dexData.liquidity >= 1e7) score += 10;
        else if (dexData.liquidity >= 1e6) score += 8;
        else if (dexData.liquidity >= 1e5) score += 5;
        
        // 6. 市场关注度 (0-5分)
        if (coin.market_cap_rank && coin.market_cap_rank <= 50) score += 5;
        else if (coin.market_cap_rank && coin.market_cap_rank <= 100) score += 3;
        
        // 智能标签判断
        const tags: string[] = [];
        if (buyRatio >= 0.6) tags.push('聪明钱买入');
        else if (buyRatio < 0.4) tags.push('聪明钱卖出');
        if (dexData.buys > 100) tags.push('链上活跃');
        if (change >= 10) tags.push('强势上涨');
        if (change7d >= 20) tags.push('持续强势');
        if (dexData.liquidity >= 1e6) tags.push('高流动性');
        
        return { 
          symbol: coin.symbol.toUpperCase(), 
          name: coin.name,
          price, 
          change, 
          score, 
          volume,
          chainData: dexData,
          buyRatio,
          tags
        };
      }).sort((a: any, b: any) => b.score - a.score);
      
      // 取前5个
      const picks = scored.slice(0, 5).map((t: any) => ({
        symbol: t.symbol,
        name: t.name,
        price: t.price,
        priceChangePercent: t.change,
        kairosScore: Math.min(100, t.score),
        smartMoneySignal: t.score >= 75 ? '聪明钱涌入' : '聪明钱关注',
        smartMoneyScore: t.score + 10,
        socialSentiment: t.score,
        socialBuzz: t.score >= 80 ? '热议中' : '讨论增长',
        isNewListing: false,
        // 新增：真实链上数据
        chainBuys: t.chainData.buys,
        chainSells: t.chainData.sells,
        chainLiquidity: t.chainData.liquidity,
        buyRatio: (t.buyRatio * 100).toFixed(0) + '%',
        tags: t.tags
      }));
      
      setTodayPicks(picks);
    } catch (error) {
      console.error('Failed to fetch today picks:', error);
      // 备用调用
      try {
        const res = await fetch('/api/today-picks');
        const data = await res.json();
        if (data.success && data.data.todayPicks) {
          setTodayPicks(data.data.todayPicks);
        }
      } catch (apiError) {
        console.error('API also failed:', apiError);
      }
    }
  };

  const getSignalBadge = (signal: string) => {
    switch (signal) {
      case 'hot':
        return { label: 'Alpha热门', bg: 'bg-amber-500/20', text: 'text-amber-400', border: 'border-amber-500/30' };
      case 'rising':
        return { label: '上涨中', bg: 'bg-green-500/20', text: 'text-green-400', border: 'border-green-500/30' };
      case 'stable':
        return { label: '稳定', bg: 'bg-blue-500/20', text: 'text-blue-400', border: 'border-blue-500/30' };
      case 'cooling':
        return { label: '冷却中', bg: 'bg-gray-500/20', text: 'text-gray-400', border: 'border-gray-500/30' };
      default:
        return { label: '未知', bg: 'bg-gray-500/20', text: 'text-gray-400', border: 'border-gray-500/30' };
    }
  };

  const handleScan = async () => {
    if (!contractInput.trim()) {
      setScanResult('<div style="background:#1E293B;border-radius:16px;padding:20px;text-align:center;color:#94A3B8;">请输入合约地址</div>');
      return;
    }
    setScanning(true);
    setScanResult('');

    try {
      const response = await fetch('/api/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contractAddress: contractInput }),
      });

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (reader) {
        let fullText = '';
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value);
          fullText += chunk;
          setScanResult(`<div style="background:#1E293B;border-radius:16px;padding:24px;border:1px solid #334155;">
            <div style="font-family:monospace;background:#0F172A;padding:12px 16px;border-radius:8px;margin-bottom:16px;color:#F59E0B;">${contractInput.slice(0, 10)}...${contractInput.slice(-8)}</div>
            <div style="color:#F1F5F9;line-height:1.8;">${fullText.replace(/\n/g, '<br>')}</div>
          </div>`);
        }
      }
    } catch {
      setScanResult('<div style="background:#1E293B;border-radius:16px;padding:20px;text-align:center;color:#EF4444;">扫描失败，请重试</div>');
    } finally {
      setScanning(false);
    }
  };

  const handleWaitlist = async () => {
    if (!email || !email.includes('@')) {
      setWaitlistMsg('请输入有效的邮箱地址');
      return;
    }
    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (data.message) {
        setWaitlistMsg('✅ 已加入候补名单！');
        setEmail('');
      }
    } catch {
      setWaitlistMsg('提交失败，请重试');
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0F172A' }}>
      {/* 导航栏 */}
      <nav className="border-b" style={{ borderColor: '#1E293B', backgroundColor: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(12px)' }}>
        <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #F59E0B, #FBBF24)' }}>
              <span className="text-white font-bold text-lg">K</span>
            </div>
            <span className="text-xl font-bold" style={{ fontFamily: 'Exo, sans-serif', color: '#F1F5F9' }}>KAIROS</span>
          </Link>
          <div className="flex items-center gap-8">
            <Link href="/product" className="text-sm font-medium hover:text-amber-400 transition-colors" style={{ color: '#94A3B8' }}>产品</Link>
            <Link href="/pricing" className="text-sm font-medium hover:text-amber-400 transition-colors" style={{ color: '#94A3B8' }}>定价</Link>
            <Link href="/about" className="text-sm font-medium hover:text-amber-400 transition-colors" style={{ color: '#94A3B8' }}>关于</Link>
            <Link href="/resources" className="text-sm font-medium hover:text-amber-400 transition-colors" style={{ color: '#94A3B8' }}>资源</Link>
            <AuthButton />
          </div>
        </div>
      </nav>

      {/* Hero 区块 */}
      <section className="relative overflow-hidden">
        {/* 背景光效 */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full opacity-20" style={{ background: 'radial-gradient(circle, #F59E0B 0%, transparent 70%)' }} />
          <div className="absolute top-20 right-1/4 w-64 h-64 rounded-full opacity-10" style={{ background: 'radial-gradient(circle, #3B82F6 0%, transparent 70%)' }} />
        </div>

        <div className="relative max-w-5xl mx-auto px-6 py-24 text-center">
          {/* Binance Alpha 标签 */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8" style={{ backgroundColor: '#1E293B', border: '1px solid #F59E0B' }}>
            <span className="text-amber-400 font-bold">🟡</span>
            <span className="text-sm font-medium" style={{ color: '#F59E0B' }}>币安 Alpha 专区专属分析工具</span>
            <span className="text-amber-400 font-bold">🟡</span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight" style={{ fontFamily: 'Exo, sans-serif' }}>
            <span style={{ color: '#F1F5F9' }}>币安 Alpha 热度，</span>
            <br />
            <span className="gradient-text">AI 帮你提前预判。</span>
          </h1>

          <p className="text-lg mb-10 max-w-2xl mx-auto" style={{ color: '#94A3B8' }}>
            整合实时链上数据、社交媒体情绪、聪明钱动态等多维信息，通过 AI 算法生成评分与排序，
            <br /><strong style={{ color: '#F59E0B' }}>帮助你在代币真正爆发前发现潜在热点，提前布局币安 Alpha。</strong>
          </p>

          {/* 数据来源标签 */}
          <div className="flex items-center justify-center gap-4 mb-10 flex-wrap">
            {['🔗 实时链上数据', '💬 社交情绪分析', '💰 聪明钱追踪', '🤖 AI 智能评分'].map((tag, i) => (
              <span key={i} className="px-4 py-2 rounded-full text-sm" style={{ backgroundColor: '#1E293B', color: '#94A3B8', border: '1px solid #334155' }}>
                {tag}
              </span>
            ))}
          </div>

          <div className="flex gap-4 justify-center mb-16">
            <button
              onClick={() => document.getElementById('trending')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-8 py-3 rounded-full font-semibold transition-all hover:scale-105 hover:shadow-lg"
              style={{ background: 'linear-gradient(135deg, #F59E0B, #D97706)', color: '#FFFFFF', boxShadow: '0 4px 20px rgba(245, 158, 11, 0.3)' }}
            >
              🔥 查看 Alpha 热力榜
            </button>
            <button
              onClick={() => document.getElementById('scanner')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-8 py-3 rounded-full font-semibold border transition-all hover:border-amber-400/50"
              style={{ borderColor: '#334155', color: '#F1F5F9', backgroundColor: 'transparent' }}
            >
              🧠 AI 扫描器
            </button>
          </div>

          {/* 统计数据 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {[
              { num: '50+', label: 'Alpha 候选代币' },
              { num: '6D', label: 'AI 六维评分' },
              { num: '实时', label: '链上信号追踪' },
              { num: '24h', label: '提前预警' },
            ].map((stat, i) => (
              <div key={i} className="p-5 rounded-2xl text-center" style={{ backgroundColor: '#1E293B', border: '1px solid #334155' }}>
                <div className="text-3xl font-bold mb-1" style={{ color: '#F59E0B' }}>{stat.num}</div>
                <div className="text-sm" style={{ color: '#94A3B8' }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 币安 Alpha 说明 */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-6">
          <div className="p-8 rounded-3xl relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #1E293B 0%, #292524 100%)', border: '1px solid #F59E0B33' }}>
            <div className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-20" style={{ background: 'radial-gradient(circle, #F59E0B 0%, transparent 70%)', transform: 'translate(30%, -30%)' }} />
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">🟡</span>
                <span className="text-xl font-bold" style={{ color: '#F59E0B' }}>什么是币安 Alpha？</span>
              </div>
              <p className="text-base leading-relaxed mb-6" style={{ color: '#CBD5E1' }}>
                币安 Alpha 是币安 LaunchPool 下的子项目筛选机制，每周从 BNB Smart Chain 和其他链上筛选具有潜力的早期项目进入 Alpha 专区。
                这些项目往往在正式上线前就有巨大涨幅空间，<strong style={{ color: '#F59E0B' }}>提前发现并布局就能获得超额收益（Alpha）</strong>。
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { icon: '📈', label: '早期发现', desc: '代币上盘前追踪' },
                  { icon: '💰', label: '高倍机会', desc: '上线即爆发的潜力' },
                  { icon: '🤖', label: 'AI 辅助', desc: '多维度智能评分' },
                  { icon: '⚡', label: '实时信号', desc: '链上数据早知道' },
                ].map((item, i) => (
                  <div key={i} className="p-4 rounded-xl text-center" style={{ backgroundColor: '#0F172A' }}>
                    <div className="text-2xl mb-2">{item.icon}</div>
                    <div className="font-semibold text-sm" style={{ color: '#F59E0B' }}>{item.label}</div>
                    <div className="text-xs mt-1" style={{ color: '#64748B' }}>{item.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 核心能力 */}
      <section className="py-20" style={{ background: 'linear-gradient(180deg, #0F172A 0%, #1E293B 50%, #0F172A 100%)' }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6" style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
              <span className="text-sm font-medium" style={{ color: '#F59E0B' }}>AI POWERED</span>
            </div>
            <h2 className="text-4xl font-bold mb-4" style={{ fontFamily: 'Exo, sans-serif', color: '#F1F5F9' }}>Alpha 发现三剑客</h2>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: '#94A3B8' }}>发现 · 扫描 · 预判 — 全流程 AI 辅助 Alpha 挖掘</p>
          </div>

          {/* 三大核心功能 */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {/* 功能1: Alpha 热力榜 */}
            <div className="group relative p-8 rounded-3xl transition-all duration-500 hover:scale-[1.02]" style={{ background: 'linear-gradient(145deg, #1E293B 0%, #0F172A 100%)', border: '1px solid #334155' }}>
              <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: 'linear-gradient(145deg, rgba(245, 158, 11, 0.1) 0%, transparent 50%)' }} />
              <div className="relative z-10">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6" style={{ background: 'linear-gradient(135deg, #F59E0B 0%, #EF4444 100%)' }}>
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <h3 className="text-xl font-bold" style={{ color: '#F1F5F9' }}>Alpha 热力榜</h3>
                  <span className="px-2 py-0.5 rounded text-xs font-bold" style={{ backgroundColor: '#F59E0B', color: '#000' }}>Binance</span>
                </div>
                <p className="mb-6" style={{ color: '#94A3B8' }}>专注追踪币安 Alpha 候选代币热度，智能排序帮助快速发现潜力标的。实时监控链上信号、社交情绪、资金流向。</p>
                
                <div className="p-4 rounded-xl mb-4" style={{ backgroundColor: '#0F172A' }}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: '#F59E0B' }} />
                    <span className="text-xs font-medium" style={{ color: '#F59E0B' }}>实时更新中</span>
                  </div>
                  <div className="text-sm" style={{ color: '#94A3B8' }}>监控 50+ Alpha 候选代币</div>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1.5 rounded-full text-xs font-medium" style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)', color: '#F59E0B' }}>链上信号</span>
                  <span className="px-3 py-1.5 rounded-full text-xs font-medium" style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)', color: '#3B82F6' }}>社交热度</span>
                  <span className="px-3 py-1.5 rounded-full text-xs font-medium" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10B981' }}>聪明钱追踪</span>
                </div>
              </div>
            </div>

            {/* 功能2: AI Alpha 扫描器 */}
            <div className="group relative p-8 rounded-3xl transition-all duration-500 hover:scale-[1.02]" style={{ background: 'linear-gradient(145deg, #1E293B 0%, #0F172A 100%)', border: '1px solid #334155' }}>
              <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: 'linear-gradient(145deg, rgba(139, 92, 246, 0.1) 0%, transparent 50%)' }} />
              <div className="relative z-10">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6" style={{ background: 'linear-gradient(135deg, #8B5CF6 0%, #6366F1 100%)' }}>
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
                </div>
                <h3 className="text-xl font-bold mb-3" style={{ color: '#F1F5F9' }}>AI Alpha 扫描器</h3>
                <p className="mb-6" style={{ color: '#94A3B8' }}>输入任意合约地址，AI 六维深度分析（叙事/社区/筹码/流动性/催化剂/安全），一键判断是否值得布局 Alpha。</p>
                
                <div className="space-y-3 mb-6">
                  {[
                    { name: '叙事潜力', score: 85 },
                    { name: '社区活跃度', score: 72 },
                    { name: '筹码分布', score: 68 },
                    { name: '流动性深度', score: 78 },
                    { name: '催化剂因素', score: 90 },
                    { name: '合约安全性', score: 95 },
                  ].map((dim, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <span className="text-xs w-20" style={{ color: '#64748B' }}>{dim.name}</span>
                      <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ backgroundColor: '#0F172A' }}>
                        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${dim.score}%`, background: 'linear-gradient(90deg, #8B5CF6 0%, #6366F1 100%)' }} />
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1.5 rounded-full text-xs font-medium" style={{ backgroundColor: 'rgba(139, 92, 246, 0.1)', color: '#8B5CF6' }}>六维雷达</span>
                  <span className="px-3 py-1.5 rounded-full text-xs font-medium" style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)', color: '#3B82F6' }}>安全检测</span>
                  <span className="px-3 py-1.5 rounded-full text-xs font-medium" style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)', color: '#F59E0B' }}>Alpha 评估</span>
                </div>
              </div>
            </div>

            {/* 功能3: Alpha 预判雷达 */}
            <div className="group relative p-8 rounded-3xl transition-all duration-500 hover:scale-[1.02]" style={{ background: 'linear-gradient(145deg, #1E293B 0%, #0F172A 100%)', border: '1px solid #334155' }}>
              <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: 'linear-gradient(145deg, rgba(16, 185, 129, 0.1) 0%, transparent 50%)' }} />
              <div className="relative z-10">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6" style={{ background: 'linear-gradient(135deg, #10B981 0%, #06B6D4 100%)' }}>
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                </div>
                <h3 className="text-xl font-bold mb-3" style={{ color: '#F1F5F9' }}>Alpha 预判雷达</h3>
                <p className="mb-6" style={{ color: '#94A3B8' }}>AI 分析链上资金流向、社群情绪变化，预测哪些代币最有可能进入币安 Alpha 专区，提前布局获取 Alpha。</p>
                
                <div className="p-4 rounded-xl mb-6" style={{ backgroundColor: '#0F172A' }}>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: '#10B981' }} />
                    <span className="text-xs font-medium" style={{ color: '#10B981' }}>即将进入 Alpha 的信号</span>
                  </div>
                  <div className="space-y-2">
                    {['BNB Chain 新建质押项目', 'Solana 热门 meme 概念', 'DePIN 基础设施项目'].map((item, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <span className="text-xs" style={{ color: '#F59E0B' }}>●</span>
                        <span className="text-sm" style={{ color: '#94A3B8' }}>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1.5 rounded-full text-xs font-medium" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10B981' }}>资金流向</span>
                  <span className="px-3 py-1.5 rounded-full text-xs font-medium" style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)', color: '#F59E0B' }}>情绪分析</span>
                  <span className="px-3 py-1.5 rounded-full text-xs font-medium" style={{ backgroundColor: 'rgba(139, 92, 246, 0.1)', color: '#8B5CF6' }}>预判模型</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 今日 Alpha 推荐 */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          {/* 标题区 */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4" style={{ backgroundColor: 'rgba(245, 158, 11, 0.15)', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
              <span className="text-base">🎯</span>
              <span className="text-sm font-semibold" style={{ color: '#F59E0B' }}>今日 Alpha 推荐</span>
              <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: '#F59E0B', color: '#000' }}>NEW</span>
            </div>
            <h2 className="text-2xl font-bold mb-3" style={{ fontFamily: 'Exo, sans-serif', color: '#F1F5F9' }}>
              每天选出最有可能上涨的 Alpha 代币
            </h2>
            <p className="text-sm mb-4" style={{ color: '#94A3B8' }}>
              筛选条件：Kairos AI 评分 &gt; 75 且聪明钱净流入为正
            </p>
            <div className="inline-flex items-center gap-4 text-xs" style={{ color: '#64748B' }}>
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#10B981' }} />
                实时链上数据
              </span>
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#F59E0B' }} />
                聪明钱追踪
              </span>
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#8B5CF6' }} />
                AI 智能评分
              </span>
            </div>
          </div>

          {/* 推荐卡片 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
            {todayPicks.length > 0 ? (
              todayPicks.slice(0, 5).map((pick, index) => (
                <div
                  key={pick.symbol}
                  className="relative p-5 rounded-2xl transition-all duration-300 hover:scale-105 cursor-pointer"
                  style={{
                    background: index === 0 
                      ? 'linear-gradient(145deg, rgba(245, 158, 11, 0.2) 0%, rgba(245, 158, 11, 0.05) 100%)'
                      : 'linear-gradient(145deg, #1E293B 0%, #0F172A 100%)',
                    border: index === 0 
                      ? '1px solid rgba(245, 158, 11, 0.4)'
                      : '1px solid #334155',
                  }}
                >
                  {/* 排名标签 */}
                  {index === 0 && (
                    <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold" style={{ backgroundColor: '#F59E0B', color: '#000' }}>
                      1
                    </div>
                  )}
                  
                  {/* 代币信息 */}
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold" style={{ backgroundColor: index === 0 ? 'rgba(245, 158, 11, 0.3)' : '#334155', color: index === 0 ? '#F59E0B' : '#94A3B8' }}>
                      {pick.symbol.slice(0, 2)}
                    </div>
                    <div>
                      <div className="font-semibold text-sm" style={{ color: '#F1F5F9' }}>{pick.symbol}</div>
                      <div className="text-xs" style={{ color: '#64748B' }}>{pick.name}</div>
                    </div>
                  </div>

                  {/* 价格 */}
                  <div className="mb-2">
                    <span className="text-lg font-bold" style={{ color: '#F1F5F9' }}>${pick.price.toFixed(pick.price >= 1 ? 2 : 4)}</span>
                    <span className={`ml-2 text-xs font-medium ${pick.priceChangePercent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {pick.priceChangePercent >= 0 ? '▲' : '▼'} {Math.abs(pick.priceChangePercent).toFixed(1)}%
                    </span>
                  </div>

                  {/* Kairos 评分 */}
                  <div className="mb-2">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span style={{ color: '#64748B' }}>Kairos</span>
                      <span className="font-bold" style={{ color: index === 0 ? '#F59E0B' : '#8B5CF6' }}>{pick.kairosScore}</span>
                    </div>
                    <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: '#0F172A' }}>
                      <div 
                        className="h-full rounded-full" 
                        style={{ 
                          width: `${pick.kairosScore}%`, 
                          background: index === 0 
                            ? 'linear-gradient(90deg, #F59E0B 0%, #FCD34D 100%)'
                            : 'linear-gradient(90deg, #8B5CF6 0%, #A78BFA 100%)'
                        }} 
                      />
                    </div>
                  </div>

                  {/* 标签 */}
                  <div className="flex flex-wrap gap-1 mt-2">
                    <span className="px-2 py-0.5 rounded text-xs" style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#10B981' }}>
                      {pick.smartMoneySignal}
                    </span>
                    {pick.isNewListing && (
                      <span className="px-2 py-0.5 rounded text-xs font-medium" style={{ backgroundColor: 'rgba(59, 130, 246, 0.15)', color: '#3B82F6' }}>
                        新上线
                      </span>
                    )}
                  </div>
                </div>
              ))
            ) : (
              // 加载状态
              Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="p-5 rounded-2xl animate-pulse" style={{ backgroundColor: '#1E293B', border: '1px solid #334155' }}>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-full" style={{ backgroundColor: '#334155' }} />
                    <div>
                      <div className="h-4 w-12 rounded" style={{ backgroundColor: '#334155' }} />
                      <div className="h-3 w-16 rounded mt-1" style={{ backgroundColor: '#334155' }} />
                    </div>
                  </div>
                  <div className="h-5 w-16 rounded" style={{ backgroundColor: '#334155' }} />
                </div>
              ))
            )}
          </div>

          {/* 说明文字 */}
          <div className="text-center">
            <p className="text-xs mb-3" style={{ color: '#64748B' }}>
              数据来源：币安Alpha官方API · 链上数据（DexScreener/GMGN） · 社交媒体情绪（X/Telegram）
            </p>
            <p className="text-xs" style={{ color: '#475569' }}>
              ⚠️ 以上仅为数据分析结果，不构成投资建议。Alpha 代币波动较大，请DYOR。
            </p>
          </div>
        </div>
      </section>

      {/* Alpha 热力榜 */}
      <section id="trending" className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          {/* 标题区 */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4" style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
              <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: '#F59E0B' }} />
              <span className="text-sm font-medium" style={{ color: '#F59E0B' }}>实时更新中</span>
              {lastUpdated && (
                <span className="text-xs" style={{ color: '#64748B' }}>最后更新: {lastUpdated.toLocaleTimeString()}</span>
              )}
            </div>
            <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: 'Exo, sans-serif', color: '#F1F5F9' }}>
              🟡 Alpha 热力榜
            </h2>
            <p className="text-base" style={{ color: '#94A3B8' }}>
              实时追踪可能进入币安 Alpha 专区的潜力代币
            </p>
          </div>

          {/* 表头 */}
          <div className="hidden md:flex items-center justify-between px-6 py-3 rounded-xl mb-3" style={{ backgroundColor: '#1E293B', border: '1px solid #334155' }}>
            <span className="text-xs font-medium w-16" style={{ color: '#64748B' }}>排名</span>
            <span className="text-xs font-medium flex-1" style={{ color: '#64748B' }}>代币</span>
            <span className="text-xs font-medium w-24 text-right" style={{ color: '#64748B' }}>价格</span>
            <span className="text-xs font-medium w-20 text-right" style={{ color: '#64748B' }}>24h</span>
            <span className="text-xs font-medium w-24 text-center" style={{ color: '#64748B' }}>信号</span>
            <span className="text-xs font-medium w-16 text-right" style={{ color: '#64748B' }}>AI评分</span>
          </div>

          {/* 代币列表 */}
          <div className="space-y-3">
            {tokens.slice(0, 8).map((token) => {
              const badge = getSignalBadge(token.signal);
              return (
                <div
                  key={token.symbol}
                  className="group p-4 md:p-5 rounded-2xl transition-all duration-300 hover:scale-[1.01] cursor-pointer"
                  style={{ 
                    backgroundColor: '#1E293B', 
                    border: `1px solid ${token.smartMoney ? 'rgba(245, 158, 11, 0.5)' : '#334155'}`,
                    boxShadow: token.smartMoney ? '0 0 20px rgba(245, 158, 11, 0.1)' : 'none'
                  }}
                >
                  {/* 移动端布局 */}
                  <div className="md:hidden flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-xl flex items-center justify-center font-bold text-sm" style={{ backgroundColor: token.rank <= 3 ? 'rgba(245, 158, 11, 0.2)' : '#0F172A', color: token.rank <= 3 ? '#F59E0B' : '#64748B' }}>
                        {token.rank}
                      </span>
                      <div>
                        <div className="font-semibold text-sm" style={{ color: '#F1F5F9' }}>{token.name}</div>
                        <div className="text-xs" style={{ color: '#64748B' }}>{token.symbol} · {token.chain}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold" style={{ color: '#F1F5F9' }}>{token.price}</div>
                      <div className="text-xs" style={{ color: token.changeColor === 'green' ? '#10B981' : '#EF4444' }}>{token.change24h}</div>
                    </div>
                  </div>

                  {/* 桌面端布局 */}
                  <div className="hidden md:flex items-center justify-between">
                    <div className="flex items-center gap-4 w-16">
                      <span className="w-10 h-10 rounded-xl flex items-center justify-center font-bold" style={{ backgroundColor: token.rank <= 3 ? 'rgba(245, 158, 11, 0.2)' : '#0F172A', color: token.rank <= 3 ? '#F59E0B' : '#64748B' }}>
                        {token.rank}
                      </span>
                    </div>
                    
                    <div className="flex-1 flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold" style={{ backgroundColor: '#0F172A' }}>
                        {token.symbol.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold" style={{ color: '#F1F5F9' }}>{token.name}</span>
                          {token.binanceAlpha && (
                            <span className="px-1.5 py-0.5 rounded text-xs font-bold" style={{ backgroundColor: '#F59E0B', color: '#000' }}>Alpha</span>
                          )}
                          {token.smartMoney && (
                            <span className="px-1.5 py-0.5 rounded text-xs font-medium" style={{ backgroundColor: 'rgba(139, 92, 246, 0.2)', color: '#8B5CF6' }}>🐋</span>
                          )}
                        </div>
                        <div className="text-xs" style={{ color: '#64748B' }}>{token.symbol} · {token.chain}</div>
                      </div>
                    </div>

                    <div className="w-24 text-right">
                      <div className="font-bold" style={{ color: '#F1F5F9' }}>{token.price}</div>
                    </div>

                    <div className="w-20 text-right">
                      <span className="font-medium" style={{ color: token.changeColor === 'green' ? '#10B981' : '#EF4444' }}>
                        {token.change24h}
                      </span>
                    </div>

                    <div className="w-24 text-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${badge.bg} ${badge.text}`}>
                        {badge.label}
                      </span>
                    </div>

                    <div className="w-16 text-right flex items-center justify-end gap-2">
                      <div className="w-12 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: '#0F172A' }}>
                        <div className="h-full rounded-full" style={{ width: `${token.aiScore}%`, backgroundColor: token.aiScore >= 80 ? '#F59E0B' : token.aiScore >= 60 ? '#3B82F6' : '#64748B' }} />
                      </div>
                      <span className="font-bold text-sm" style={{ color: '#F59E0B' }}>{token.aiScore}</span>
                    </div>
                  </div>

                  {/* 底部标签 - 移动端 */}
                  <div className="flex items-center gap-2 mt-3 md:hidden">
                    {token.binanceAlpha && (
                      <span className="px-2 py-0.5 rounded text-xs font-medium" style={{ backgroundColor: 'rgba(245, 158, 11, 0.2)', color: '#F59E0B' }}>Alpha</span>
                    )}
                    {token.newListing && (
                      <span className="px-2 py-0.5 rounded text-xs font-medium" style={{ backgroundColor: 'rgba(16, 185, 129, 0.2)', color: '#10B981' }}>新上线</span>
                    )}
                    <span className="text-xs" style={{ color: '#64748B' }}>24h: {token.volume}</span>
                    <span className="text-xs" style={{ color: '#64748B' }}>| AI: {token.aiScore}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* 底部 CTA */}
          <div className="mt-8 flex flex-col md:flex-row items-center justify-between gap-4 p-6 rounded-2xl" style={{ backgroundColor: '#1E293B', border: '1px solid #334155' }}>
            <div>
              <h3 className="font-semibold mb-1" style={{ color: '#F1F5F9' }}>想看完整榜单？</h3>
              <p className="text-sm" style={{ color: '#64748B' }}>包含 50+ Alpha 候选代币，深度数据分析</p>
            </div>
            <Link
              href="/trending"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all hover:scale-105 whitespace-nowrap"
              style={{ background: 'linear-gradient(135deg, #F59E0B, #D97706)', color: '#FFFFFF', boxShadow: '0 4px 20px rgba(245, 158, 11, 0.3)' }}
            >
              查看完整 Alpha 榜单
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </Link>
          </div>
        </div>
      </section>

      {/* AI Alpha 扫描器 */}
      <section id="scanner" className="py-20" style={{ background: 'linear-gradient(180deg, #0F172A 0%, #1E293B 50%, #0F172A 100%)' }}>
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6" style={{ backgroundColor: 'rgba(139, 92, 246, 0.1)', border: '1px solid rgba(139, 92, 246, 0.2)' }}>
              <span className="text-sm font-medium" style={{ color: '#8B5CF6' }}>AI POWERED</span>
            </div>
            <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: 'Exo, sans-serif', color: '#F1F5F9' }}>
              🧠 AI Alpha 扫描器
            </h2>
            <p className="text-base max-w-xl mx-auto" style={{ color: '#94A3B8' }}>
              输入任意合约地址，AI 六维深度分析判断是否值得布局币安 Alpha
            </p>
          </div>

          {/* 扫描器主卡 */}
          <div className="rounded-3xl overflow-hidden" style={{ backgroundColor: '#1E293B', border: '1px solid #334155' }}>
            {/* 输入区 */}
            <div className="p-6 md:p-8" style={{ borderBottom: '1px solid #334155' }}>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: '#64748B' }}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
                  </div>
                  <input
                    type="text"
                    value={contractInput}
                    onChange={(e) => setContractInput(e.target.value)}
                    placeholder="粘贴合约地址，例如: 0x1234..."
                    className="w-full pl-12 pr-4 py-4 rounded-xl outline-none transition-all"
                    style={{ backgroundColor: '#0F172A', border: '1px solid #334155', color: '#F1F5F9' }}
                    onFocus={(e) => e.target.style.borderColor = '#8B5CF6'}
                    onBlur={(e) => e.target.style.borderColor = '#334155'}
                  />
                </div>
                <button
                  onClick={handleScan}
                  disabled={scanning}
                  className="px-8 py-4 rounded-xl font-semibold transition-all disabled:opacity-50 whitespace-nowrap"
                  style={{ background: 'linear-gradient(135deg, #8B5CF6, #6366F1)', color: '#FFFFFF', boxShadow: '0 4px 20px rgba(139, 92, 246, 0.3)' }}
                >
                  {scanning ? (
                    <span className="flex items-center gap-2">
                      <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>
                      AI 分析中...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                      开始分析
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* 结果展示区 */}
            <div className="p-6 md:p-8 min-h-[300px]" style={{ backgroundColor: '#0F172A' }}>
              {scanResult ? (
                <div dangerouslySetInnerHTML={{ __html: scanResult }} />
              ) : (
                /* 默认状态 - 六维说明 */
                <div className="space-y-6">
                  <div className="text-center mb-8">
                    <p className="text-sm" style={{ color: '#64748B' }}>AI 六维深度分析框架</p>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {[
                      { icon: '📖', name: '叙事潜力', desc: '项目故事与赛道前景', color: '#F59E0B' },
                      { icon: '👥', name: '社区活跃', desc: 'Discord/Twitter 热度', color: '#3B82F6' },
                      { icon: '🏦', name: '筹码分布', desc: '持币集中度分析', color: '#8B5CF6' },
                      { icon: '💧', name: '流动性', desc: 'DEX 池子深度', color: '#10B981' },
                      { icon: '⚡', name: '催化剂', desc: '即将到来的事件', color: '#EF4444' },
                      { icon: '🔒', name: '合约安全', desc: '代码审计与风险', color: '#06B6D4' },
                    ].map((dim, i) => (
                      <div key={i} className="p-4 rounded-xl" style={{ backgroundColor: '#1E293B', border: '1px solid #334155' }}>
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-2xl">{dim.icon}</span>
                          <span className="font-semibold" style={{ color: '#F1F5F9' }}>{dim.name}</span>
                        </div>
                        <p className="text-xs" style={{ color: '#64748B' }}>{dim.desc}</p>
                      </div>
                    ))}
                  </div>
                  <div className="text-center pt-4">
                    <p className="text-sm" style={{ color: '#64748B' }}>粘贴上方合约地址，体验 AI 扫描器</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 扫描器优势 */}
          <div className="mt-8 grid md:grid-cols-3 gap-4">
            {[
              { icon: '⚡', title: '秒级响应', desc: 'AI 流式分析，即时获取结果' },
              { icon: '🎯', title: '精准评分', desc: '六维雷达图，直观展示风险' },
              { icon: '🔐', title: '安全第一', desc: '合约风险检测，规避 Rug Pull' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-4 p-4 rounded-xl" style={{ backgroundColor: 'rgba(30, 41, 59, 0.5)', border: '1px solid #334155' }}>
                <span className="text-2xl">{item.icon}</span>
                <div>
                  <div className="font-semibold text-sm" style={{ color: '#F1F5F9' }}>{item.title}</div>
                  <div className="text-xs" style={{ color: '#64748B' }}>{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 候补名单 CTA */}
      <section id="waitlist" className="py-20">
        <div className="max-w-4xl mx-auto px-6">
          {/* 主 CTA 卡 */}
          <div className="relative overflow-hidden rounded-3xl p-8 md:p-12" style={{ background: 'linear-gradient(135deg, #1E293B 0%, #292524 100%)', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
            {/* 背景装饰 */}
            <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-20" style={{ background: 'radial-gradient(circle, #F59E0B 0%, transparent 70%)', transform: 'translate(30%, -30%)' }} />
            <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full opacity-10" style={{ background: 'radial-gradient(circle, #8B5CF6 0%, transparent 70%)', transform: 'translate(-30%, 30%)' }} />

            <div className="relative z-10">
              {/* 标签 */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6" style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
                <span className="text-sm font-medium" style={{ color: '#F59E0B' }}>🎁 早期用户专属福利</span>
              </div>

              <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
                {/* 左侧内容 */}
                <div className="flex-1 text-center lg:text-left">
                  <h2 className="text-2xl md:text-3xl font-bold mb-4" style={{ fontFamily: 'Exo, sans-serif', color: '#F1F5F9' }}>
                    抢先体验 Alpha 发现工具
                  </h2>
                  <p className="text-base mb-6" style={{ color: '#94A3B8' }}>
                    加入候补名单，第一时间获取币安 Alpha 预判和热力榜更新
                  </p>

                  {/* 福利列表 */}
                  <div className="flex flex-wrap justify-center lg:justify-start gap-3 mb-6">
                    {['优先体验资格', '内测期间免费', '专属客服支持', '功能优先更新'].map((perk, i) => (
                      <span key={i} className="px-3 py-1.5 rounded-full text-sm" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10B981', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                        ✓ {perk}
                      </span>
                    ))}
                  </div>
                </div>

                {/* 右侧表单 */}
                <div className="w-full lg:w-auto">
                  <div className="p-6 rounded-2xl" style={{ backgroundColor: '#0F172A', border: '1px solid #334155' }}>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="输入邮箱地址"
                        className="flex-1 px-5 py-3 rounded-xl outline-none"
                        style={{ backgroundColor: '#1E293B', border: '1px solid #334155', color: '#F1F5F9' }}
                        onFocus={(e) => e.target.style.borderColor = '#F59E0B'}
                        onBlur={(e) => e.target.style.borderColor = '#334155'}
                      />
                      <button
                        onClick={handleWaitlist}
                        className="px-6 py-3 rounded-xl font-semibold transition-all hover:scale-105 whitespace-nowrap"
                        style={{ background: 'linear-gradient(135deg, #F59E0B, #D97706)', color: '#FFFFFF', boxShadow: '0 4px 20px rgba(245, 158, 11, 0.3)' }}
                      >
                        立即加入
                      </button>
                    </div>
                    {waitlistMsg && (
                      <p className="mt-4 text-sm text-center" style={{ color: waitlistMsg.includes('✅') ? '#10B981' : '#EF4444' }}>
                        {waitlistMsg}
                      </p>
                    )}
                    <p className="mt-4 text-xs text-center" style={{ color: '#64748B' }}>
                      无需信用卡 · 随时取消 · 100% 免费
                    </p>
                  </div>

                  {/* 用户数量 */}
                  <div className="mt-4 flex items-center justify-center gap-2">
                    <div className="flex -space-x-2">
                      {['A', 'B', 'C', 'D'].map((letter, i) => (
                        <div key={i} className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold" style={{ backgroundColor: `hsl(${30 + i * 20}, 70%, 50%)`, color: '#fff', border: '2px solid #0F172A' }}>
                          {letter}
                        </div>
                      ))}
                    </div>
                    <span className="text-sm" style={{ color: '#64748B' }}>
                      <span style={{ color: '#F59E0B' }}>+2,847</span> 人已加入
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* FAQ 快捷链接 */}
          <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm" style={{ color: '#64748B' }}>
            <span className="cursor-pointer hover:text-amber-400 transition-colors">常见问题</span>
            <span className="cursor-pointer hover:text-amber-400 transition-colors">联系方式</span>
            <span className="cursor-pointer hover:text-amber-400 transition-colors">使用条款</span>
            <span className="cursor-pointer hover:text-amber-400 transition-colors">隐私政策</span>
          </div>
        </div>
      </section>

      {/* 页脚 */}
      <footer className="py-12 border-t" style={{ borderColor: '#1E293B' }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #F59E0B, #FBBF24)' }}>
                <span className="text-white font-bold text-sm">K</span>
              </div>
              <span className="font-bold" style={{ color: '#F1F5F9' }}>KAIROS</span>
              <span className="text-sm" style={{ color: '#64748B' }}>| 币安 Alpha 分析工具</span>
            </div>
            <div className="flex items-center gap-6 text-sm" style={{ color: '#64748B' }}>
              <span>𝕏 Twitter</span>
              <span>Telegram</span>
              <span>Discord</span>
            </div>
          </div>
          <div className="text-center mt-8 text-xs" style={{ color: '#64748B' }}>
            风险提示：本工具仅供信息参考，不构成投资建议。加密货币投资风险极高，请DYOR。
          </div>
        </div>
      </footer>
    </div>
  );
}
