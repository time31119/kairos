'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { TrendingUp, TrendingDown, ArrowLeft, RefreshCw, Zap, Shield, Clock, DollarSign, Users, Activity } from 'lucide-react';

// ============== 数据类型 ==============
interface TokenSignal {
  symbol: string;
  name: string;
  chain: string;
  smartMoneyScore: number;
  smartMoneyWallets: number;
  lastSmartMoneyBuy: string;
  chainActivityScore: number;
  volume24h: number;
  volumeChange1h: number;
  buyPressure: number;
  socialScore: number;
  momentumScore: number;
  priceChange1h: number;
  priceChange24h: number;
  alphaScore: number;
  signals: string[];
  investmentAdvice: string;
  riskLevel: string;
  entryPrice: number;
  targetPrice: number;
}

// ============== 工具函数 ==============
function formatVolume(v: number): string {
  if (v >= 1e7) return `$${(v / 1e7).toFixed(1)}M`;
  if (v >= 1e4) return `$${(v / 1e4).toFixed(0)}K`;
  return `$${v}`;
}

function getScoreColor(score: number): string {
  if (score >= 70) return 'text-emerald-400';
  if (score >= 50) return 'text-amber-400';
  return 'text-slate-400';
}

function getAdviceBadge(advice: string) {
  switch (advice) {
    case '强烈推荐':
      return { bg: 'bg-emerald-500/20', text: 'text-emerald-400', label: '强烈推荐' };
    case '关注':
      return { bg: 'bg-amber-500/20', text: 'text-amber-400', label: '关注' };
    default:
      return { bg: 'bg-slate-500/20', text: 'text-slate-400', label: '观望' };
  }
}

// ============== 组件 ==============
export default function TrendingPage() {
  const [tokens, setTokens] = useState<TokenSignal[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [selectedToken, setSelectedToken] = useState<TokenSignal | null>(null);

  // 获取数据
  const fetchAlphaRanking = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/alpha-ranking');
      const json = await res.json();
      if (json.success) {
        setTokens(json.data);
        setLastUpdated(new Date(json.timestamp));
      }
    } catch (error) {
      console.error('Failed to fetch alpha ranking:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAlphaRanking();
    // 每30秒自动刷新
    const interval = setInterval(fetchAlphaRanking, 30000);
    return () => clearInterval(interval);
  }, []);

  // 选中的代币详情
  const showTokenDetail = (token: TokenSignal) => {
    setSelectedToken(token);
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
          {lastUpdated && (
            <span className="text-xs" style={{ color: '#64748b' }}>
              {lastUpdated.toLocaleTimeString()} 更新
            </span>
          )}
          <button 
            onClick={fetchAlphaRanking}
            className={`p-2 rounded-lg transition-colors hover:bg-slate-800 ${loading ? 'animate-spin' : ''}`}
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
      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* 标题区 */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400">
              BNB Chain · Solana · Ethereum
            </span>
            <span className="px-2 py-1 rounded text-xs" style={{ backgroundColor: '#1e293b', color: '#64748b' }}>
              {tokens.length} 个Alpha机会
            </span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Alpha 热力榜</h1>
          <p className="text-sm" style={{ color: '#64748b' }}>
            按真实投资价值排序 · 聪明钱追踪 + 链上数据 + 社区热度
          </p>
        </div>

        {/* 评分说明 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {[
            { icon: <Zap className="w-4 h-4" />, label: '聪明钱信号', weight: '40%', color: '#f59e0b' },
            { icon: <Activity className="w-4 h-4" />, label: '链上活跃度', weight: '30%', color: '#3b82f6' },
            { icon: <Users className="w-4 h-4" />, label: '社区热度', weight: '15%', color: '#8b5cf6' },
            { icon: <TrendingUp className="w-4 h-4" />, label: '价格动量', weight: '15%', color: '#10b981' },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-xl" style={{ backgroundColor: '#1e293b' }}>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${item.color}20`, color: item.color }}>
                {item.icon}
              </div>
              <div>
                <div className="text-xs" style={{ color: '#64748b' }}>{item.label}</div>
                <div className="text-sm font-semibold" style={{ color: item.color }}>{item.weight}</div>
              </div>
            </div>
          ))}
        </div>

        {/* 代币列表 */}
        {loading && tokens.length === 0 ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-24 rounded-xl animate-pulse" style={{ backgroundColor: '#1e293b' }} />
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {tokens.map((token) => {
              const badge = getAdviceBadge(token.investmentAdvice);
              return (
                <div
                  key={token.symbol}
                  onClick={() => showTokenDetail(token)}
                  className="p-5 rounded-xl cursor-pointer transition-all hover:scale-[1.01]"
                  style={{ backgroundColor: '#1e293b', border: '1px solid #334155' }}
                >
                  {/* 第一行：排名 + 代币 + 链 */}
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold"
                         style={{ backgroundColor: '#0f172a', color: token.alphaScore >= 70 ? '#fbbf24' : '#94a3b8' }}>
                      #{tokens.indexOf(token) + 1}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-lg text-white">{token.name}</span>
                        <span className="px-2 py-0.5 rounded text-xs font-medium bg-blue-500/20 text-blue-400">
                          {token.chain}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${badge.bg} ${badge.text}`}>
                          {badge.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-xs" style={{ color: '#64748b' }}>
                        <span>{token.symbol}</span>
                        {token.smartMoneyWallets > 0 && (
                          <span className="flex items-center gap-1">
                            <Zap className="w-3 h-3" style={{ color: '#f59e0b' }} />
                            {token.smartMoneyWallets} 个聪明钱
                          </span>
                        )}
                      </div>
                    </div>
                    {/* Alpha评分 */}
                    <div className="text-center">
                      <div className={`text-2xl font-bold ${getScoreColor(token.alphaScore)}`}>
                        {token.alphaScore}
                      </div>
                      <div className="text-xs" style={{ color: '#64748b' }}>Alpha评分</div>
                    </div>
                  </div>

                  {/* 第二行：关键指标 */}
                  <div className="grid grid-cols-4 gap-4 mb-4">
                    <div>
                      <div className="text-xs mb-1" style={{ color: '#64748b' }}>聪明钱信号</div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 rounded-full" style={{ backgroundColor: '#0f172a' }}>
                          <div 
                            className="h-full rounded-full" 
                            style={{ width: `${token.smartMoneyScore}%`, backgroundColor: '#f59e0b' }}
                          />
                        </div>
                        <span className="text-xs font-medium" style={{ color: '#f59e0b' }}>{token.smartMoneyScore}</span>
                      </div>
                    </div>
                    <div>
                      <div className="text-xs mb-1" style={{ color: '#64748b' }}>链上活跃度</div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 rounded-full" style={{ backgroundColor: '#0f172a' }}>
                          <div 
                            className="h-full rounded-full" 
                            style={{ width: `${token.chainActivityScore}%`, backgroundColor: '#3b82f6' }}
                          />
                        </div>
                        <span className="text-xs font-medium" style={{ color: '#3b82f6' }}>{token.chainActivityScore}</span>
                      </div>
                    </div>
                    <div>
                      <div className="text-xs mb-1" style={{ color: '#64748b' }}>价格动量</div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 rounded-full" style={{ backgroundColor: '#0f172a' }}>
                          <div 
                            className="h-full rounded-full" 
                            style={{ width: `${token.momentumScore}%`, backgroundColor: '#10b981' }}
                          />
                        </div>
                        <span className="text-xs font-medium" style={{ color: '#10b981' }}>{token.momentumScore}</span>
                      </div>
                    </div>
                    <div>
                      <div className="text-xs mb-1" style={{ color: '#64748b' }}>风险等级</div>
                      <span className={`text-sm font-medium ${
                        token.riskLevel === '低' ? 'text-emerald-400' : 
                        token.riskLevel === '中' ? 'text-amber-400' : 'text-red-400'
                      }`}>
                        {token.riskLevel === '低' ? '● 低' : token.riskLevel === '中' ? '● 中' : '● 高'}
                      </span>
                    </div>
                  </div>

                  {/* 第三行：信号标签 + 数据 */}
                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-2">
                      {token.signals.slice(0, 3).map((signal, i) => (
                        <span key={i} className="px-2 py-1 rounded text-xs" style={{ backgroundColor: '#0f172a', color: '#94a3b8' }}>
                          {signal}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center gap-6 text-sm">
                      <div>
                        <span style={{ color: '#64748b' }}>1h: </span>
                        <span className={token.priceChange1h >= 0 ? 'text-emerald-400' : 'text-red-400'}>
                          {token.priceChange1h >= 0 ? '+' : ''}{token.priceChange1h.toFixed(1)}%
                        </span>
                      </div>
                      <div>
                        <span style={{ color: '#64748b' }}>24h: </span>
                        <span className={token.priceChange24h >= 0 ? 'text-emerald-400' : 'text-red-400'}>
                          {token.priceChange24h >= 0 ? '+' : ''}{token.priceChange24h.toFixed(1)}%
                        </span>
                      </div>
                      <div>
                        <span style={{ color: '#64748b' }}>24h量: </span>
                        <span className="text-white">{formatVolume(token.volume24h)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* 代币详情弹窗 */}
        {selectedToken && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ backgroundColor: 'rgba(0,0,0,0.8)' }}
            onClick={() => setSelectedToken(null)}
          >
            <div 
              className="w-full max-w-lg rounded-2xl p-6"
              style={{ backgroundColor: '#1e293b' }}
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg"
                       style={{ backgroundColor: '#0f172a', color: '#fbbf24' }}>
                    {selectedToken.symbol}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">{selectedToken.name}</h3>
                    <span className="text-sm" style={{ color: '#64748b' }}>{selectedToken.chain}</span>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedToken(null)}
                  className="p-2 rounded-lg hover:bg-slate-700"
                  style={{ color: '#94a3b8' }}
                >
                  ✕
                </button>
              </div>

              {/* Alpha评分 */}
              <div className="text-center mb-6 p-4 rounded-xl" style={{ backgroundColor: '#0f172a' }}>
                <div className="text-5xl font-bold mb-2" style={{ color: selectedToken.alphaScore >= 70 ? '#10b981' : '#f59e0b' }}>
                  {selectedToken.alphaScore}
                </div>
                <div className="text-sm" style={{ color: '#64748b' }}>Alpha投资评分</div>
              </div>

              {/* 投资建议 */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-4 rounded-xl" style={{ backgroundColor: '#0f172a' }}>
                  <div className="text-xs mb-1" style={{ color: '#64748b' }}>建议入场价</div>
                  <div className="text-lg font-bold text-emerald-400">${selectedToken.entryPrice.toFixed(4)}</div>
                </div>
                <div className="p-4 rounded-xl" style={{ backgroundColor: '#0f172a' }}>
                  <div className="text-xs mb-1" style={{ color: '#64748b' }}>目标价格</div>
                  <div className="text-lg font-bold text-blue-400">${selectedToken.targetPrice.toFixed(4)}</div>
                </div>
              </div>

              {/* 信号详情 */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2" style={{ color: '#94a3b8' }}>
                    <Zap className="w-4 h-4" style={{ color: '#f59e0b' }} />
                    聪明钱信号
                  </span>
                  <span className="font-medium" style={{ color: '#f59e0b' }}>{selectedToken.smartMoneyScore}分</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2" style={{ color: '#94a3b8' }}>
                    <Activity className="w-4 h-4" style={{ color: '#3b82f6' }} />
                    链上活跃度
                  </span>
                  <span className="font-medium" style={{ color: '#3b82f6' }}>{selectedToken.chainActivityScore}分</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2" style={{ color: '#94a3b8' }}>
                    <TrendingUp className="w-4 h-4" style={{ color: '#10b981' }} />
                    价格动量
                  </span>
                  <span className="font-medium" style={{ color: '#10b981' }}>{selectedToken.momentumScore}分</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2" style={{ color: '#94a3b8' }}>
                    <DollarSign className="w-4 h-4" style={{ color: '#64748b' }} />
                    买入压力
                  </span>
                  <span className="font-medium">{selectedToken.buyPressure}%</span>
                </div>
              </div>

              {/* 投资信号 */}
              <div className="mt-6 pt-4 border-t" style={{ borderColor: '#334155' }}>
                <div className="text-xs mb-2" style={{ color: '#64748b' }}>投资信号</div>
                <div className="flex flex-wrap gap-2">
                  {selectedToken.signals.map((signal, i) => (
                    <span key={i} className="px-3 py-1.5 rounded-lg text-sm" style={{ backgroundColor: '#0f172a', color: '#94a3b8' }}>
                      {signal}
                    </span>
                  ))}
                </div>
              </div>

              {/* 提示 */}
              <div className="mt-6 p-3 rounded-lg text-xs" style={{ backgroundColor: '#0f172a', color: '#64748b' }}>
                ⚠️ 以上仅为信号展示，不构成投资建议。请DYOR。
              </div>
            </div>
          </div>
        )}

        {/* 底部提示 */}
        <div className="mt-8 p-4 rounded-xl text-center text-sm" style={{ backgroundColor: '#1e293b', color: '#64748b' }}>
          数据每30秒自动刷新 · Alpha评分基于真实链上数据计算
        </div>
      </div>
    </div>
  );
}
