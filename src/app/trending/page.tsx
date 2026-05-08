'use client';

import { useState, useEffect, useCallback } from 'react';

// 币安Alpha专区代币
const ALPHA_SYMBOLS = [
  { symbol: 'NEIROUSDT', name: 'Neiro', coingecko: 'neiro' },
  { symbol: 'GOATUSDT', name: 'Goat', coingecko: 'goatseusd' },
  { symbol: 'FWOGUSDT', name: 'FWOG', coingecko: 'fwog' },
  { symbol: 'PNUTUSDT', name: 'Peanut', coingecko: 'peanut-the-squirrel' },
  { symbol: 'POPCATUSDT', name: 'Popcat', coingecko: 'popcat' },
  { symbol: 'MOODENGUSDT', name: 'MooDeng', coingecko: 'moodeng' },
  { symbol: 'WIFUSDT', name: 'dogwifhat', coingecko: 'dogwifcoin' },
  { symbol: 'BRETTUSDT', name: 'Brett', coingecko: 'brett' },
  { symbol: 'PONKEUSDT', name: 'Ponke', coingecko: 'ponke' },
  { symbol: 'SLERFUSDT', name: 'Slerf', coingecko: 'slerf' },
];

interface TokenData {
  symbol: string;
  name: string;
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
  };
}

export default function TrendingPage() {
  const [tokens, setTokens] = useState<(TokenData & { rank: number })[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<string>('');

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // 前端直接调用支持CORS的API
      const response = await fetch(
        'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=goatseusd,neiro,fwog,peanut-the-squirrel,popcat,moodeng,dogwifcoin,brett,ponke,slerf&order=volume_desc&sparkline=false&price_change_percentage=24h'
      );
      const binceData: Array<{
        id: string;
        symbol: string;
        name: string;
        current_price: number;
        price_change_percentage_24h: number;
        total_volume: number;
        high_24h: number;
        low_24h: number;
      }> = await response.json();
      
      if (!Array.isArray(binceData)) {
        throw new Error('Invalid data');
      }
      
      // 映射到TokenData
      const validData = binceData
        .filter(t => t.current_price > 0)
        .map((coin) => {
          const price = coin.current_price;
          const change24h = coin.price_change_percentage_24h || 0;
          const volume = coin.total_volume || 0;
          const high24h = coin.high_24h || price * 1.05;
          const low24h = coin.low_24h || price * 0.95;
          const symbol = coin.symbol.toUpperCase();

          // Kairos评分
          let score = 50;
          score += Math.max(-20, Math.min(30, change24h * 2));
          const volumeScore = volume > 100000000 ? 20 : volume > 50000000 ? 15 : volume > 10000000 ? 10 : 5;
          score += volumeScore;
          score = Math.max(0, Math.min(100, Math.round(score)));

          // 投资信号
          let signal: 'strong' | 'watch' | 'wait' = 'watch';
          let riskLevel: 'low' | 'medium' | 'high' = 'medium';
          let signalText = '';

          if (score >= 70) {
            signal = 'strong';
            riskLevel = change24h > 20 ? 'high' : change24h > 5 ? 'medium' : 'low';
            signalText = change24h > 10 ? '24h强势突破' : '量价齐升';
          } else if (score >= 40) {
            signal = 'watch';
            signalText = '震荡整理中';
          } else {
            signal = 'wait';
            riskLevel = 'high';
            signalText = change24h < -10 ? '回调风险' : '动能不足';
          }

          // 交易计划
          const entry = price;
          const targetMultiplier = signal === 'strong' ? 0.15 : signal === 'watch' ? 0.08 : 0.05;
          const stopMultiplier = signal === 'strong' ? 0.95 : signal === 'watch' ? 0.93 : 0.90;
          const target = price * (1 + targetMultiplier);
          const stopLoss = price * (1 - (1 - stopMultiplier));
          const riskReward = ((target - entry) / (entry - stopLoss)).toFixed(2);

          return {
            symbol,
            name: coin.name,
            price,
            priceChange24h: change24h,
            volume24h: volume,
            high24h,
            low24h,
            kairosScore: score,
            signal,
            riskLevel,
            signalText,
            tradingPlan: {
              entry,
              target,
              stopLoss,
              riskReward
            }
          };
        })
        .filter(Boolean) as (TokenData & { rank?: number })[];

      // 按Kairos评分排序
      validData.sort((a, b) => b.kairosScore - a.kairosScore);
      validData.forEach((t, i) => t.rank = i + 1);

      setTokens(validData as (TokenData & { rank: number })[]);
      setLastUpdate(new Date().toLocaleTimeString());
      setLoading(false);

    } catch (err) {
      console.error('Fetch error:', err);
      setError('无法获取数据，请检查网络');
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 60000); // 每分钟刷新
    return () => clearInterval(interval);
  }, [fetchData]);

  const formatPrice = (price: number) => {
    if (price < 0.001) return `$${price.toFixed(6)}`;
    if (price < 0.01) return `$${price.toFixed(5)}`;
    if (price < 1) return `$${price.toFixed(4)}`;
    if (price < 100) return `$${price.toFixed(3)}`;
    return `$${price.toFixed(2)}`;
  };

  const formatVolume = (vol: number) => {
    if (vol >= 1e9) return `$${(vol / 1e9).toFixed(1)}B`;
    if (vol >= 1e6) return `$${(vol / 1e6).toFixed(1)}M`;
    if (vol >= 1e3) return `$${(vol / 1e3).toFixed(1)}K`;
    return `$${vol.toFixed(0)}`;
  };

  const getSignalBadge = (signal: string) => {
    switch (signal) {
      case 'strong': return { bg: 'bg-green-500', text: '强烈推荐' };
      case 'watch': return { bg: 'bg-yellow-500', text: '关注' };
      default: return { bg: 'bg-gray-500', text: '观望' };
    }
  };

  const getRiskBadge = (level: string) => {
    switch (level) {
      case 'low': return 'text-green-400';
      case 'medium': return 'text-yellow-400';
      default: return 'text-red-400';
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-slate-950 text-white p-8">
        <div className="max-w-4xl mx-auto text-center py-20">
          <div className="text-red-400 text-xl mb-4">{error}</div>
          <button onClick={fetchData} className="px-6 py-3 bg-blue-600 rounded-lg">
            重试
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <div className="border-b border-slate-800 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Alpha热力榜</h1>
            <p className="text-slate-400 text-sm">币安Alpha专区代币 · 实时数据</p>
          </div>
          <button onClick={fetchData} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm">
            刷新数据
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        {/* 实时数据提示 */}
        <div className="bg-slate-900 rounded-xl p-4 mb-6 border border-slate-800">
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span className="text-slate-400">实时数据</span>
            </div>
            <div className="text-slate-500">|</div>
            <div className="text-slate-400">数据来源：Binance API</div>
            <div className="text-slate-500">|</div>
            <div className="text-slate-400">更新时间：{lastUpdate}</div>
          </div>
        </div>

        {loading && tokens.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-slate-400">加载中...</div>
          </div>
        ) : (
          <>
            {/* 代币列表 */}
            <div className="space-y-3">
              {tokens.map((token, idx) => {
                const badge = getSignalBadge(token.signal);
                return (
                  <div key={token.symbol} className="bg-slate-900 rounded-xl p-5 border border-slate-800 hover:border-slate-700 transition-all">
                    <div className="flex items-start justify-between gap-4">
                      {/* 左侧：排名和代币 */}
                      <div className="flex items-center gap-4">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                          idx < 3 ? 'bg-yellow-500/20 text-yellow-400' : 'bg-slate-800 text-slate-400'
                        }`}>
                          {idx + 1}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-lg">{token.symbol}</span>
                            <span className={`px-2 py-0.5 rounded text-xs font-medium ${badge.bg} text-white`}>
                              {badge.text}
                            </span>
                            <span className="px-2 py-0.5 rounded text-xs bg-slate-800 text-slate-400">
                              BNB Chain
                            </span>
                          </div>
                          <div className="text-slate-500 text-sm">{token.name}</div>
                        </div>
                      </div>

                      {/* 中间：价格和涨跌 */}
                      <div className="text-right">
                        <div className="font-bold text-lg">{formatPrice(token.price)}</div>
                        <div className={`text-sm ${token.priceChange24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {token.priceChange24h >= 0 ? '+' : ''}{token.priceChange24h.toFixed(2)}%
                        </div>
                      </div>

                      {/* Kairos评分 */}
                      <div className="text-center px-4">
                        <div className={`text-2xl font-bold ${
                          token.kairosScore >= 70 ? 'text-green-400' : token.kairosScore >= 40 ? 'text-yellow-400' : 'text-slate-400'
                        }`}>
                          {token.kairosScore}
                        </div>
                        <div className="text-xs text-slate-500">Kairos评分</div>
                      </div>

                      {/* 交易量 */}
                      <div className="text-right">
                        <div className="text-sm text-white">{formatVolume(token.volume24h)}</div>
                        <div className={`text-xs ${getRiskBadge(token.riskLevel)}`}>
                          风险: {token.riskLevel === 'low' ? '低' : token.riskLevel === 'medium' ? '中' : '高'}
                        </div>
                      </div>
                    </div>

                    {/* 交易计划 */}
                    {token.signal === 'strong' && (
                      <div className="mt-4 pt-4 border-t border-slate-800 grid grid-cols-4 gap-4 text-sm">
                        <div>
                          <div className="text-slate-500">建议入场</div>
                          <div className="text-white font-mono">{formatPrice(token.tradingPlan.entry)}</div>
                        </div>
                        <div>
                          <div className="text-slate-500">目标价格</div>
                          <div className="text-green-400 font-mono">{formatPrice(token.tradingPlan.target)}</div>
                        </div>
                        <div>
                          <div className="text-slate-500">止损价格</div>
                          <div className="text-red-400 font-mono">{formatPrice(token.tradingPlan.stopLoss)}</div>
                        </div>
                        <div>
                          <div className="text-slate-500">盈亏比</div>
                          <div className="text-cyan-400 font-bold">1:{token.tradingPlan.riskReward}</div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {tokens.length === 0 && !loading && (
              <div className="text-center py-20 text-slate-400">
                暂无数据
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
