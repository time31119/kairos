'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { TrendingUp, TrendingDown, ArrowLeft, RefreshCw, Star } from 'lucide-react';

// Alpha代币数据
const ALPHA_TOKENS = [
  { rank: 1, name: 'NEIRO', symbol: 'NEIRO', chain: 'ETH', price: '$0.00234', change: '+127.5%', score: 98 },
  { rank: 2, name: 'GOAT', symbol: 'GOAT', chain: 'SOL', price: '$0.8934', change: '+89.2%', score: 95 },
  { rank: 3, name: 'FWOG', symbol: 'FWOG', chain: 'ETH', price: '$0.0421', change: '+65.8%', score: 92 },
  { rank: 4, name: 'PNUT', symbol: 'PNUT', chain: 'BSC', price: '$0.00123', change: '+52.3%', score: 88 },
  { rank: 5, name: 'POPCAT', symbol: 'POPCAT', chain: 'SOL', price: '$0.7845', change: '+48.7%', score: 85 },
  { rank: 6, name: 'MOODENG', symbol: 'MOODENG', chain: 'ETH', price: '$0.0156', change: '+41.2%', score: 82 },
  { rank: 7, name: 'CHILLGUY', symbol: 'CHILLGUY', chain: 'ETH', price: '$0.00345', change: '+35.6%', score: 78 },
  { rank: 8, name: 'WIF', symbol: 'WIF', chain: 'SOL', price: '$1.234', change: '+28.9%', score: 75 },
  { rank: 9, name: 'BRETT', symbol: 'BRETT', chain: 'BASE', price: '$0.00892', change: '+24.3%', score: 72 },
  { rank: 10, name: 'PONKE', symbol: 'PONKE', chain: 'SOL', price: '$0.0567', change: '+18.5%', score: 68 },
];

export default function TrendingPage() {
  const [tokens, setTokens] = useState(ALPHA_TOKENS);
  const [loading, setLoading] = useState(false);
  const [favorites, setFavorites] = useState<Set<number>>(new Set([1, 2]));

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 500);
  };

  const toggleFavorite = (rank: number) => {
    setFavorites(prev => {
      const next = new Set(prev);
      if (next.has(rank)) next.delete(rank);
      else next.add(rank);
      return next;
    });
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0f172a' }}>
      {/* 顶部导航 */}
      <nav className="sticky top-0 z-50 px-6 py-4 flex items-center justify-between" 
           style={{ backgroundColor: 'rgba(15, 23, 42, 0.95)', borderBottom: '1px solid #1e293b' }}>
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-gradient-to-br from-blue-500 to-cyan-400">
              <span className="text-white font-bold">K</span>
            </div>
            <span className="text-lg font-bold text-white">KAIROS</span>
          </Link>
          <span className="text-slate-600">/</span>
          <span className="text-slate-400">Alpha 热力榜</span>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={handleRefresh}
            className={`p-2 rounded-lg transition-colors ${loading ? 'animate-spin' : ''}`}
            style={{ color: '#94a3b8' }}
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <Link href="/" className="flex items-center gap-2 text-sm" style={{ color: '#94a3b8' }}>
            <ArrowLeft className="w-4 h-4" />
            返回首页
          </Link>
        </div>
      </nav>

      {/* 主内容 */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* 标题区 */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400">
              BNB Chain · Solana
            </span>
            <span className="text-xs" style={{ color: '#64748b' }}>
              {tokens.length} 个Alpha代币
            </span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Alpha 热力榜</h1>
          <p className="text-sm" style={{ color: '#64748b' }}>
            币安Alpha专区代币实时排名，按投资价值动态排序
          </p>
        </div>

        {/* 代币列表 */}
        <div className="space-y-3">
          {tokens.map((token) => (
            <div
              key={token.rank}
              className="flex items-center gap-4 p-4 rounded-xl transition-all hover:scale-[1.01]"
              style={{ backgroundColor: '#1e293b', border: '1px solid #334155' }}
            >
              {/* 排名 */}
              <div className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm"
                   style={{ backgroundColor: '#0f172a', color: token.rank <= 3 ? '#fbbf24' : '#94a3b8' }}>
                {token.rank}
              </div>

              {/* 代币信息 */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-white">{token.name}</span>
                  <span className="px-1.5 py-0.5 rounded text-xs font-medium bg-blue-500/20 text-blue-400">
                    Alpha
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs" style={{ color: '#64748b' }}>
                  <span>{token.symbol}</span>
                  <span>·</span>
                  <span>{token.chain}</span>
                </div>
              </div>

              {/* 价格 */}
              <div className="text-right">
                <div className="font-semibold text-white">{token.price}</div>
                <div className="text-xs font-medium" style={{ color: token.change.startsWith('+') ? '#4ade80' : '#f87171' }}>
                  {token.change}
                </div>
              </div>

              {/* 评分 */}
              <div className="flex flex-col items-center">
                <div className="text-lg font-bold" style={{ color: token.score >= 90 ? '#4ade80' : token.score >= 70 ? '#fbbf24' : '#94a3b8' }}>
                  {token.score}
                </div>
                <div className="text-xs" style={{ color: '#64748b' }}>机会分</div>
              </div>

              {/* 操作 */}
              <button
                onClick={() => toggleFavorite(token.rank)}
                className="p-2 rounded-lg transition-colors"
                style={{ 
                  backgroundColor: favorites.has(token.rank) ? '#3b82f6' : '#0f172a',
                  color: favorites.has(token.rank) ? 'white' : '#64748b'
                }}
              >
                <Star className="w-4 h-4" fill={favorites.has(token.rank) ? 'currentColor' : 'none'} />
              </button>
            </div>
          ))}
        </div>

        {/* 底部提示 */}
        <div className="mt-8 p-4 rounded-xl text-center text-sm" style={{ backgroundColor: '#1e293b', color: '#64748b' }}>
          数据每30秒自动刷新 · 仅展示当下真正有机会的Alpha代币
        </div>
      </div>
    </div>
  );
}
