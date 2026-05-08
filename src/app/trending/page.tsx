'use client';

import { useState, useEffect } from 'react';

interface TokenData {
  rank: number;
  symbol: string;
  name: string;
  category: string;
  chain: string;
  price: number;
  priceChange24h: number;
  volume24h: number;
  high24h: number;
  low24h: number;
  kairosScore: number;
  signal: 'strong' | 'watch' | 'wait';
  riskLevel: 'low' | 'medium' | 'high';
  signalText: string;
  tradingPlan: {
    entry: number;
    target: number;
    stopLoss: number;
    riskReward: string;
  } | null;
}

interface ApiResponse {
  success: boolean;
  data: {
    tokens: TokenData[];
    lastUpdate: string;
    dataSource: string;
  };
}

export default function TrendingPage() {
  const [tokens, setTokens] = useState<TokenData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<string>('');
  const [dataSource, setDataSource] = useState<string>('');
  const [selectedToken, setSelectedToken] = useState<TokenData | null>(null);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000); // 每30秒刷新
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch('/api/alpha-ranking');
      const result: ApiResponse = await response.json();
      
      if (result.success && result.data) {
        setTokens(result.data.tokens);
        setLastUpdate(result.data.lastUpdate);
        setDataSource(result.data.dataSource);
        setError(null);
      }
    } catch (err) {
      setError('数据加载失败');
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    if (price === 0) return '--';
    if (price >= 1) return `$${price.toFixed(2)}`;
    if (price >= 0.0001) return `$${price.toFixed(4)}`;
    return `$${price.toFixed(8)}`;
  };

  const formatVolume = (volume: number) => {
    if (volume >= 1e9) return `$${(volume / 1e9).toFixed(2)}B`;
    if (volume >= 1e6) return `$${(volume / 1e6).toFixed(2)}M`;
    if (volume >= 1e3) return `$${(volume / 1e3).toFixed(2)}K`;
    return `$${volume.toFixed(2)}`;
  };

  const getSignalBadge = (signal: string) => {
    switch (signal) {
      case 'strong':
        return <span className="px-2 py-0.5 rounded text-xs font-medium bg-green-500/20 text-green-400">强烈推荐</span>;
      case 'watch':
        return <span className="px-2 py-0.5 rounded text-xs font-medium bg-yellow-500/20 text-yellow-400">关注</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-xs font-medium bg-slate-500/20 text-slate-400">观望</span>;
    }
  };

  const getRiskBadge = (risk: string) => {
    switch (risk) {
      case 'low':
        return <span className="text-xs text-green-400">低风险</span>;
      case 'medium':
        return <span className="text-xs text-yellow-400">中风险</span>;
      default:
        return <span className="text-xs text-red-400">高风险</span>;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 70) return 'text-green-400';
    if (score >= 40) return 'text-yellow-400';
    return 'text-slate-400';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-slate-400">正在加载币安Alpha数据...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <header className="bg-slate-900/80 backdrop-blur-sm border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-white">Alpha热力榜</h1>
              <p className="text-sm text-slate-400">币安Alpha专区代币实时排名</p>
            </div>
            <div className="text-right text-sm text-slate-400">
              <p>数据来源: {dataSource}</p>
              <p>更新: {lastUpdate ? new Date(lastUpdate).toLocaleTimeString('zh-CN') : '--'}</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {error ? (
          <div className="text-center py-12">
            <p className="text-red-400 mb-4">{error}</p>
            <button onClick={fetchData} className="px-4 py-2 bg-cyan-500 rounded-lg text-white">
              重试
            </button>
          </div>
        ) : tokens.length === 0 ? (
          <div className="text-center py-12 text-slate-400">
            <p>暂无数据</p>
          </div>
        ) : (
          <>
            {/* 简化的表格展示 */}
            <div className="bg-slate-900/50 rounded-xl border border-slate-800 overflow-hidden">
              <table className="w-full">
                <thead className="bg-slate-800/50">
                  <tr className="text-left text-sm text-slate-400">
                    <th className="px-4 py-3 w-12">排名</th>
                    <th className="px-4 py-3">代币</th>
                    <th className="px-4 py-3 text-right">价格</th>
                    <th className="px-4 py-3 text-right">24h涨跌</th>
                    <th className="px-4 py-3 text-right">24h交易量</th>
                    <th className="px-4 py-3 text-center">信号</th>
                    <th className="px-4 py-3 text-center">Kairos评分</th>
                    <th className="px-4 py-3 text-center">详情</th>
                  </tr>
                </thead>
                <tbody>
                  {tokens.map((token) => (
                    <tr 
                      key={token.symbol} 
                      className="border-t border-slate-800/50 hover:bg-slate-800/30 transition-colors cursor-pointer"
                      onClick={() => setSelectedToken(token)}
                    >
                      <td className="px-4 py-4">
                        <span className={`font-bold ${token.rank <= 3 ? 'text-yellow-400' : 'text-slate-400'}`}>
                          #{token.rank}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-white">{token.symbol}</span>
                          <span className="text-xs px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-400">{token.category}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-right font-mono">
                        {formatPrice(token.price)}
                      </td>
                      <td className={`px-4 py-4 text-right font-mono ${
                        token.priceChange24h >= 0 ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {token.priceChange24h >= 0 ? '+' : ''}{token.priceChange24h.toFixed(2)}%
                      </td>
                      <td className="px-4 py-4 text-right text-slate-400">
                        {formatVolume(token.volume24h)}
                      </td>
                      <td className="px-4 py-4 text-center">
                        <div className="flex flex-col items-center gap-1">
                          {getSignalBadge(token.signal)}
                          {getRiskBadge(token.riskLevel)}
                        </div>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <span className={`font-bold text-lg ${getScoreColor(token.kairosScore)}`}>
                          {token.kairosScore}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <button className="px-3 py-1 text-sm bg-slate-700 hover:bg-slate-600 rounded transition-colors">
                          查看
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* 说明 */}
            <div className="mt-6 text-center text-sm text-slate-500">
              <p>Kairos评分基于：涨跌动量(40%) + 交易活跃度(30%) + 市值潜力(30%)</p>
              <p className="mt-1">数据每30秒自动刷新 | 数据来源：Binance Official API</p>
            </div>
          </>
        )}
      </main>

      {/* 详情弹窗 */}
      {selectedToken && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50" onClick={() => setSelectedToken(null)}>
          <div className="bg-slate-900 rounded-xl border border-slate-700 max-w-md w-full p-6" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold text-white">{selectedToken.symbol}</h2>
                <p className="text-slate-400">{selectedToken.name} · {selectedToken.category}</p>
              </div>
              <button onClick={() => setSelectedToken(null)} className="text-slate-400 hover:text-white">
                ✕
              </button>
            </div>

            {/* 价格信息 */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-slate-800/50 rounded-lg p-3">
                <p className="text-slate-400 text-xs mb-1">当前价格</p>
                <p className="text-xl font-mono font-bold text-white">{formatPrice(selectedToken.price)}</p>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-3">
                <p className="text-slate-400 text-xs mb-1">24h涨跌</p>
                <p className={`text-xl font-mono font-bold ${selectedToken.priceChange24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {selectedToken.priceChange24h >= 0 ? '+' : ''}{selectedToken.priceChange24h.toFixed(2)}%
                </p>
              </div>
            </div>

            {/* 交易计划 */}
            {selectedToken.tradingPlan && (
              <div className="bg-slate-800/50 rounded-lg p-4 mb-6">
                <h3 className="text-sm font-medium text-slate-400 mb-3">交易计划</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-400">建议入场</span>
                    <span className="font-mono text-green-400">{formatPrice(selectedToken.tradingPlan.entry)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">目标价格</span>
                    <span className="font-mono text-cyan-400">{formatPrice(selectedToken.tradingPlan.target)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">止损价格</span>
                    <span className="font-mono text-red-400">{formatPrice(selectedToken.tradingPlan.stopLoss)}</span>
                  </div>
                  <div className="flex justify-between border-t border-slate-700 pt-2 mt-2">
                    <span className="text-slate-400">盈亏比</span>
                    <span className="font-mono text-yellow-400">{selectedToken.tradingPlan.riskReward}</span>
                  </div>
                </div>
              </div>
            )}

            {/* 信号 */}
            <div className="flex items-center justify-between">
              {getSignalBadge(selectedToken.signal)}
              <span className="text-sm text-slate-400">{selectedToken.signalText}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
