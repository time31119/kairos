'use client';

import { useState, useEffect } from 'react';

interface TokenAnalysis {
  symbol: string;
  name: string;
  price: string;
  priceChange24h: number;
  volume: string;
  advice: string;
  reason: string;
  entryPrice: string;
  targetPrice: string;
  stopLoss: string;
  riskLevel: string;
  timeHorizon?: string;
  signals: string[];
}

interface AnalysisResult {
  success: boolean;
  timestamp: string;
  dataSource: string;
  tokenCount: number;
  prices: Array<{
    symbol: string;
    name: string;
    price: number;
    priceChange24h: number;
    volume24h: number;
  }>;
  analysis: {
    summary: string;
    recommendations: TokenAnalysis[];
    marketSentiment: string;
    topPick: string;
  };
}

export default function TrendingPage() {
  const [data, setData] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<string>('');

  const fetchAnalysis = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/analyze');
      const result = await response.json();
      setData(result);
      setLastUpdate(new Date().toLocaleTimeString('zh-CN'));
      setError(null);
    } catch (err) {
      setError('获取数据失败');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalysis();
    const interval = setInterval(fetchAnalysis, 60000); // 每分钟刷新
    return () => clearInterval(interval);
  }, []);

  const getAdviceColor = (advice: string) => {
    switch (advice) {
      case '强烈推荐': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case '关注': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case '低': return 'text-green-400';
      case '中': return 'text-yellow-400';
      case '高': return 'text-red-400';
      default: return 'text-slate-400';
    }
  };

  const getChangeColor = (change: number) => {
    if (change > 0) return 'text-green-400';
    if (change < 0) return 'text-red-400';
    return 'text-slate-400';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950">
      {/* Header */}
      <header className="border-b border-blue-500/20 bg-slate-950/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">
                Alpha <span className="text-blue-400">热力榜</span>
              </h1>
              <p className="text-sm text-slate-400 mt-1">
                币安Alpha专区 · Kairos AI实时分析
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-xs text-slate-500">数据来源</div>
                <div className="text-sm text-blue-400">CoinGecko</div>
              </div>
              <button
                onClick={fetchAnalysis}
                disabled={loading}
                className="px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 rounded-lg text-blue-400 text-sm transition-colors disabled:opacity-50"
              >
                {loading ? '刷新中...' : '刷新数据'}
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Market Summary */}
        {data?.analysis && (
          <div className="mb-8 bg-blue-500/5 border border-blue-500/20 rounded-xl p-6">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-lg font-semibold text-white mb-2">市场总览</h2>
                <p className="text-slate-300">{data.analysis.summary}</p>
                <div className="mt-4 flex items-center gap-4">
                  <span className="text-sm text-slate-500">
                    市场情绪：<span className="text-cyan-400">{data.analysis.marketSentiment}</span>
                  </span>
                  <span className="text-sm text-slate-500">
                    更新时间：<span className="text-slate-300">{lastUpdate}</span>
                  </span>
                </div>
              </div>
              {data.analysis.topPick && (
                <div className="bg-green-500/10 border border-green-500/20 rounded-lg px-4 py-2">
                  <div className="text-xs text-slate-500">今日首选</div>
                  <div className="text-xl font-bold text-green-400">{data.analysis.topPick}</div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && !data && (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-slate-400">Kairos AI 正在分析中...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-8 text-center">
            <p className="text-red-400">{error}</p>
            <button
              onClick={fetchAnalysis}
              className="mt-4 px-6 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-lg text-red-400"
            >
              重试
            </button>
          </div>
        )}

        {/* AI Recommendations */}
        {data?.analysis?.recommendations && data.analysis.recommendations.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></span>
              AI 投资建议
            </h2>
            
            {data.analysis.recommendations.map((rec, index) => (
              <div
                key={rec.symbol}
                className="bg-slate-900/50 border border-blue-500/20 rounded-xl overflow-hidden hover:border-blue-500/40 transition-colors"
              >
                {/* Token Header */}
                <div className="p-6 border-b border-blue-500/10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold text-lg">
                        {rec.symbol.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-3">
                          <h3 className="text-xl font-bold text-white">{rec.symbol}</h3>
                          <span className={`px-2 py-0.5 rounded text-xs border ${getAdviceColor(rec.advice)}`}>
                            {rec.advice}
                          </span>
                          <span className="text-xs text-slate-500 bg-slate-800 px-2 py-0.5 rounded">
                            Alpha专区
                          </span>
                        </div>
                        <p className="text-sm text-slate-400 mt-1">{rec.name}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-white">{rec.price}</div>
                      <div className={`text-sm ${getChangeColor(data.prices[index]?.priceChange24h || 0)}`}>
                        {data.prices[index]?.priceChange24h > 0 ? '+' : ''}
                        {data.prices[index]?.priceChange24h?.toFixed(2)}%
                      </div>
                    </div>
                  </div>
                </div>

                {/* Analysis Content */}
                <div className="p-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Left: Analysis */}
                    <div>
                      <h4 className="text-sm font-medium text-slate-400 mb-2">AI 分析理由</h4>
                      <p className="text-slate-300 mb-4">{rec.reason}</p>
                      
                      <h4 className="text-sm font-medium text-slate-400 mb-2">关键信号</h4>
                      <div className="flex flex-wrap gap-2">
                        {rec.signals.map((signal, i) => (
                          <span key={i} className="px-2 py-1 bg-blue-500/10 border border-blue-500/20 rounded text-xs text-blue-300">
                            {signal}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Right: Trading Plan */}
                    <div className="bg-slate-800/50 rounded-lg p-4">
                      <h4 className="text-sm font-medium text-slate-400 mb-3">交易计划</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-slate-500">建议入场价</span>
                          <span className="text-green-400 font-mono">{rec.entryPrice}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-slate-500">目标价格</span>
                          <span className="text-cyan-400 font-mono">{rec.targetPrice}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-slate-500">止损价格</span>
                          <span className="text-red-400 font-mono">{rec.stopLoss}</span>
                        </div>
                        <div className="border-t border-slate-700 pt-3 mt-3 flex justify-between items-center">
                          <span className="text-sm text-slate-500">风险等级</span>
                          <span className={`font-medium ${getRiskColor(rec.riskLevel)}`}>
                            {rec.riskLevel}风险
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-slate-500">投资周期</span>
                          <span className="text-slate-300">{rec.timeHorizon || '短期'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* All Tokens */}
        {data?.prices && data.prices.length > 0 && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-white mb-4">全部代币实时价格</h2>
            <div className="bg-slate-900/50 border border-blue-500/20 rounded-xl overflow-hidden">
              <table className="w-full">
                <thead className="bg-slate-800/50">
                  <tr>
                    <th className="text-left p-4 text-sm font-medium text-slate-400">代币</th>
                    <th className="text-right p-4 text-sm font-medium text-slate-400">价格</th>
                    <th className="text-right p-4 text-sm font-medium text-slate-400">24h涨跌</th>
                    <th className="text-right p-4 text-sm font-medium text-slate-400">24h交易量</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-blue-500/10">
                  {data.prices.map((token) => (
                    <tr key={token.symbol} className="hover:bg-blue-500/5 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white text-sm font-bold">
                            {token.symbol.charAt(0)}
                          </div>
                          <div>
                            <div className="text-white font-medium">{token.symbol}</div>
                            <div className="text-xs text-slate-500">{token.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-right text-white font-mono">
                        {token.price >= 1 ? `$${token.price.toFixed(2)}` : token.price >= 0.01 ? `$${token.price.toFixed(4)}` : `$${token.price.toFixed(6)}`}
                      </td>
                      <td className={`p-4 text-right font-mono ${getChangeColor(token.priceChange24h)}`}>
                        {token.priceChange24h > 0 ? '+' : ''}{token.priceChange24h.toFixed(2)}%
                      </td>
                      <td className="p-4 text-right text-slate-400">
                        {token.volume24h >= 1e9 ? `$${(token.volume24h / 1e9).toFixed(1)}B` : 
                         token.volume24h >= 1e6 ? `$${(token.volume24h / 1e6).toFixed(1)}M` :
                         `$${(token.volume24h / 1e3).toFixed(1)}K`}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Disclaimer */}
        <div className="mt-12 p-4 bg-slate-800/30 border border-slate-700 rounded-lg">
          <p className="text-xs text-slate-500 text-center">
            免责声明：以上内容仅为Kairos AI基于市场数据的分析参考，不构成投资建议。
            加密货币投资存在风险，请谨慎决策，盈亏自负。
          </p>
        </div>
      </main>
    </div>
  );
}
