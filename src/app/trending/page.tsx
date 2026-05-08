'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  TrendingUp,
  TrendingDown,
  ChevronLeft,
  ChevronRight,
  Zap,
  RefreshCw,
  Check,
  Home,
  ArrowLeft
} from 'lucide-react';

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
  volumeChange?: number;
  marketCap: string;
  holders: string;
  aiScore: number;
  aiTrend: 'up' | 'down' | 'stable';
  tags: string[];
  signal: 'rising' | 'hot' | 'stable' | 'cooling';
  smartMoney: boolean;
  lastActive?: string;
  binanceAlpha?: boolean;  // 是否为币安 Alpha 代币
  newListing?: boolean;    // 是否新上线
}

const CHAIN_FILTERS = [
  { id: 'all', label: '全部' },
  { id: 'BSC', label: 'BNB Chain', icon: '◈' },
  { id: 'Solana', label: 'Solana', icon: '◎' },
  { id: 'Ethereum', label: 'ETH', icon: '⟠' },
  { id: 'Arbitrum', label: 'ARB', icon: '◆' },
  { id: 'Base', label: 'BASE', icon: '○' },
];

const SORT_OPTIONS = [
  { id: 'rank', label: '热度排名' },
  { id: 'aiScore', label: 'AI评分' },
  { id: 'volumeChange', label: '交易量变化' },
  { id: 'change24h', label: '24h涨跌' },
];

const SIGNAL_FILTERS = [
  { id: 'all', label: '全部' },
  { id: 'hot', label: 'Alpha热门' },
  { id: 'rising', label: '即将爆发' },
  { id: 'stable', label: '稳定持有' },
  { id: 'cooling', label: '关注中' },
];

const ITEMS_PER_PAGE = 10;

export default function TrendingPage() {
  const [tokens, setTokens] = useState<TrendingToken[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [selectedChain, setSelectedChain] = useState('all');
  const [selectedSignal, setSelectedSignal] = useState('all');
  const [sortBy, setSortBy] = useState('rank');
  const [currentPage, setCurrentPage] = useState(1);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchTrending();
    const interval = setInterval(fetchTrending, 60000);
    return () => clearInterval(interval);
  }, []);

  const fetchTrending = async () => {
    try {
      const res = await fetch('/api/trending');
      const data = await res.json();
      if (data.success) {
        setTokens(data.data);
        setLastUpdated(new Date());
      }
    } catch (error) {
      console.error('Failed to fetch trending:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTokens = tokens
    .filter(token => selectedChain === 'all' || token.chain === selectedChain)
    .filter(token => selectedSignal === 'all' || token.signal === selectedSignal)
    .sort((a, b) => {
      if (sortBy === 'rank') return a.rank - b.rank;
      if (sortBy === 'aiScore') return b.aiScore - a.aiScore;
      if (sortBy === 'volumeChange') return (b.volumeChange || 0) - (a.volumeChange || 0);
      if (sortBy === 'change24h') {
        const aVal = parseFloat(a.change24h.replace(/[^0-9.-]/g, ''));
        const bVal = parseFloat(b.change24h.replace(/[^0-9.-]/g, ''));
        return bVal - aVal;
      }
      return 0;
    });

  const totalPages = Math.ceil(filteredTokens.length / ITEMS_PER_PAGE);
  const paginatedTokens = filteredTokens.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const getSignalBadge = (signal: string) => {
    switch (signal) {
      case 'hot': return { label: 'Alpha热门', bg: 'bg-amber-500/20', text: 'text-amber-400' };
      case 'rising': return { label: '即将爆发', bg: 'bg-emerald-500/20', text: 'text-emerald-400' };
      case 'stable': return { label: '稳定持有', bg: 'bg-blue-500/20', text: 'text-blue-400' };
      case 'cooling': return { label: '关注中', bg: 'bg-slate-500/20', text: 'text-slate-400' };
      default: return { label: '未知', bg: 'bg-slate-500/20', text: 'text-slate-400' };
    }
  };

  const toggleFavorite = (symbol: string) => {
    setFavorites(prev => {
      const next = new Set(prev);
      if (next.has(symbol)) {
        next.delete(symbol);
      } else {
        next.add(symbol);
      }
      return next;
    });
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'slate-950' }}>
      {/* 导航栏 */}
      <nav className="sticky top-0 z-50 border-b" style={{ borderColor: 'slate-800', backgroundColor: 'rgba(15, 23, 42, 0.95)', backdropFilter: 'blur(12px)' }}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, blue-500, cyan-400)' }}>
                <span className="text-white font-bold">K</span>
              </div>
              <span className="text-lg font-bold" style={{ fontFamily: 'Exo, sans-serif', color: 'white' }}>KAIROS</span>
            </Link>
            <span className="text-slate-600">/</span>
            <span style={{ color: 'slate-400' }}>Alpha 热力榜</span>
          </div>
          <Link href="/" className="flex items-center gap-2 text-sm transition-colors hover:text-amber-400" style={{ color: 'slate-500' }}>
            <ArrowLeft className="w-4 h-4" />
            返回首页
          </Link>
        </div>
      </nav>

      {/* 页面标题 */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-1/4 w-96 h-96 rounded-full opacity-10" style={{ background: 'radial-gradient(circle, blue-500 0%, transparent 70%)' }} />
        </div>
        <div className="relative max-w-7xl mx-auto px-6 py-12">
          {/* Binance Alpha 徽章 */}
          <div className="flex items-center gap-2 mb-6">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full" style={{ backgroundColor: 'rgba(245, 158, 11, 0.15)', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
              <span className="text-lg">🟡</span>
              <span className="text-sm font-semibold" style={{ color: 'blue-500' }}>Binance Alpha</span>
            </div>
            <span className="text-xs" style={{ color: 'slate-500' }}>币安 Alpha 专区专属追踪</span>
          </div>

          <div className="flex items-center gap-3 mb-4">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, blue-500, cyan-600)' }}>
              <TrendingUp className="w-7 h-7 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold" style={{ fontFamily: 'Exo, sans-serif', color: 'white' }}>Alpha 热力榜</h1>
                <span className="px-3 py-1.5 rounded-full text-xs font-bold" style={{ backgroundColor: 'blue-500', color: '#000' }}>
                  BNB Chain + Solana
                </span>
              </div>
              <div className="flex items-center gap-4 mt-1">
                <p className="text-sm" style={{ color: 'slate-500' }}>
                  追踪币安 Alpha 候选代币热度，发现下一个潜力标的
                </p>
                {lastUpdated && (
                  <span className="flex items-center gap-1.5 text-xs" style={{ color: 'slate-500' }}>
                    <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: 'green-500' }} />
                    {lastUpdated.toLocaleTimeString()} 更新
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* 统计卡片 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            {[
              { label: 'Alpha 候选', value: '50+', color: 'blue-500' },
              { label: '今日热门', value: '12', color: 'red-500' },
              { label: '新晋标的', value: '8', color: 'green-500' },
              { label: '聪明钱关注', value: '23', color: 'cyan-500' },
            ].map((stat, i) => (
              <div key={i} className="p-4 rounded-xl text-center" style={{ backgroundColor: 'slate-800', border: '1px solid blue-900/30' }}>
                <div className="text-2xl font-bold mb-1" style={{ color: stat.color }}>{stat.value}</div>
                <div className="text-xs" style={{ color: 'slate-500' }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 筛选栏 */}
      <div className="sticky top-[65px] z-40 border-b" style={{ borderColor: 'slate-800', backgroundColor: 'rgba(15, 23, 42, 0.95)', backdropFilter: 'blur(12px)' }}>
        <div className="max-w-7xl mx-auto px-6 py-4">
          {/* 链路筛选 */}
          <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-2">
            <span className="text-xs whitespace-nowrap mr-2" style={{ color: 'slate-500' }}>链:</span>
            {CHAIN_FILTERS.map(chain => (
              <button
                key={chain.id}
                onClick={() => { setSelectedChain(chain.id); setCurrentPage(1); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                  selectedChain === chain.id
                    ? 'text-white'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                style={{
                  backgroundColor: selectedChain === chain.id ? 'blue-900/30' : 'transparent',
                }}
              >
                {chain.icon && <span className="mr-1">{chain.icon}</span>}
                {chain.label}
              </button>
            ))}
          </div>

          {/* 信号和排序筛选 */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 overflow-x-auto">
              <span className="text-xs whitespace-nowrap mr-2" style={{ color: 'slate-500' }}>信号:</span>
              {SIGNAL_FILTERS.map(signal => (
                <button
                  key={signal.id}
                  onClick={() => { setSelectedSignal(signal.id); setCurrentPage(1); }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                    selectedSignal === signal.id
                      ? 'text-white'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                  style={{
                    backgroundColor: selectedSignal === signal.id ? 'blue-900/30' : 'transparent',
                  }}
                >
                  {signal.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-1.5 rounded-lg text-xs outline-none"
                style={{ backgroundColor: 'slate-800', border: '1px solid blue-900/30', color: 'white' }}
              >
                {SORT_OPTIONS.map(opt => (
                  <option key={opt.id} value={opt.id}>{opt.label}</option>
                ))}
              </select>
              <button
                onClick={fetchTrending}
                className="p-2 rounded-lg transition-colors hover:bg-slate-800"
                style={{ color: 'slate-400' }}
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 代币列表 */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="p-5 rounded-xl animate-pulse" style={{ backgroundColor: 'slate-800' }}>
                <div className="h-20 bg-slate-700 rounded" />
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {paginatedTokens.map((token, i) => {
                const signalBadge = getSignalBadge(token.signal);
                return (
                  <div
                    key={token.symbol}
                    className="p-5 rounded-xl transition-all duration-200 hover:scale-[1.01] hover:border-amber-400/20"
                    style={{
                      backgroundColor: 'slate-800',
                      border: `1px solid ${token.binanceAlpha ? 'rgba(245, 158, 11, 0.4)' : 'blue-900/30'}`,
                      animationDelay: `${i * 30}ms`,
                    }}
                  >
                    {/* 头部 */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-xl flex items-center justify-center font-bold text-sm"
                          style={{ backgroundColor: token.binanceAlpha ? 'rgba(245, 158, 11, 0.15)' : 'slate-950', color: 'blue-500' }}>
                          {token.rank}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold" style={{ color: 'white' }}>{token.name}</span>
                            {token.binanceAlpha && (
                              <span className="px-1.5 py-0.5 rounded text-xs font-bold" style={{ backgroundColor: 'blue-500', color: '#000' }}>
                                Alpha
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-xs" style={{ color: 'slate-500' }}>
                            <span>{token.chainIcon}</span>
                            <span>{token.symbol}</span>
                            {token.newListing && (
                              <span className="px-1.5 py-0.5 rounded text-xs font-medium" style={{ backgroundColor: 'rgba(16, 185, 129, 0.2)', color: 'green-500' }}>
                                新上线
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {token.smartMoney && (
                          <span className="px-2 py-1 rounded text-xs font-medium" style={{ backgroundColor: 'rgba(139, 92, 246, 0.2)', color: 'cyan-500' }}>
                            聪明钱
                          </span>
                        )}
                        <span className={`px-2.5 py-1 rounded-lg text-xs font-medium ${signalBadge.bg} ${signalBadge.text}`}>
                          {signalBadge.label}
                        </span>
                        <button
                          onClick={() => toggleFavorite(token.symbol)}
                          className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                            favorites.has(token.symbol)
                              ? 'text-amber-400'
                              : 'text-slate-500 hover:text-slate-300'
                          }`}
                          style={{ backgroundColor: favorites.has(token.symbol) ? 'blue-50020' : 'slate-950' }}
                        >
                          {favorites.has(token.symbol) ? <Check className="w-4 h-4" /> : <Zap className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    {/* 价格和变化 */}
                    <div className="grid grid-cols-3 gap-3 mb-3">
                      <div>
                        <div className="text-xs mb-1" style={{ color: 'slate-500' }}>价格</div>
                        <div className="font-semibold" style={{ color: 'white' }}>{token.price}</div>
                      </div>
                      <div>
                        <div className="text-xs mb-1" style={{ color: 'slate-500' }}>24h</div>
                        <div className={`font-semibold flex items-center gap-1 ${token.changeColor === 'green' ? 'text-emerald-400' : 'text-red-400'}`}>
                          {token.changeColor === 'green' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                          {token.change24h}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs mb-1" style={{ color: 'slate-500' }}>市值</div>
                        <div className="font-semibold text-sm" style={{ color: 'white' }}>{token.marketCap}</div>
                      </div>
                    </div>

                    {/* 标签 */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {token.tags.map((tag, j) => (
                        <span key={j} className="px-2 py-0.5 rounded text-xs" style={{ backgroundColor: 'slate-950', color: 'slate-400' }}>
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* 底部 */}
                    <div className="flex items-center justify-between pt-3 border-t" style={{ borderColor: 'blue-900/30' }}>
                      <div className="flex items-center gap-3">
                        <div>
                          <div className="text-xs" style={{ color: 'slate-500' }}>交易量变化</div>
                          <div className="text-sm font-medium text-emerald-400">+{token.volumeChange}%</div>
                        </div>
                        <div>
                          <div className="text-xs" style={{ color: 'slate-500' }}>持有者</div>
                          <div className="text-sm font-medium" style={{ color: 'white' }}>{token.holders}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs" style={{ color: 'slate-500' }}>AI</span>
                        <div className="w-20 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: 'slate-950' }}>
                          <div
                            className="h-full rounded-full"
                            style={{ width: `${token.aiScore}%`, backgroundColor: token.aiScore >= 75 ? 'green-500' : token.aiScore >= 60 ? 'blue-500' : 'slate-500' }}
                          />
                        </div>
                        <span className="text-sm font-bold" style={{ color: token.aiScore >= 75 ? 'green-500' : 'blue-500' }}>{token.aiScore}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* 分页 */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg transition-colors disabled:opacity-30"
                  style={{ backgroundColor: 'slate-800', color: 'white' }}
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                {[...Array(Math.min(5, totalPages))].map((_, i) => {
                  const page = i + 1;
                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className="w-10 h-10 rounded-lg text-sm font-medium transition-colors"
                      style={{
                        backgroundColor: currentPage === page ? 'blue-500' : 'slate-800',
                        color: currentPage === page ? '#FFFFFF' : 'slate-400',
                      }}
                    >
                      {page}
                    </button>
                  );
                })}
                {totalPages > 5 && <span style={{ color: 'slate-500' }}>...</span>}
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg transition-colors disabled:opacity-30"
                  style={{ backgroundColor: 'slate-800', color: 'white' }}
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </>
        )}

        {/* 统计信息 */}
        <div className="mt-8 p-4 rounded-xl text-center" style={{ backgroundColor: 'slate-800', border: '1px solid blue-900/30' }}>
          <p className="text-sm" style={{ color: 'slate-500' }}>
            共 <span style={{ color: 'blue-500' }}>{filteredTokens.length}</span> 个代币 | 
            显示第 <span style={{ color: 'blue-500' }}>{(currentPage - 1) * ITEMS_PER_PAGE + 1}</span> - <span style={{ color: 'blue-500' }}>{Math.min(currentPage * ITEMS_PER_PAGE, filteredTokens.length)}</span> 个
          </p>
        </div>
      </div>

      {/* 页脚 */}
      <footer className="py-8 mt-12 border-t" style={{ borderColor: 'slate-800' }}>
        <div className="max-w-7xl mx-auto px-6 text-center text-sm" style={{ color: 'slate-500' }}>
          <Link href="/" className="hover:text-amber-400 transition-colors">← 返回首页</Link>
          <span className="mx-4">|</span>
          <span>数据每 60 秒自动刷新</span>
          <span className="mx-4">|</span>
          <span>所有AI分析均基于公开数据，不构成投资建议</span>
        </div>
      </footer>
    </div>
  );
}
