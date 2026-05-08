'use client';

import { useState, useEffect } from 'react';

interface TokenData {
  rank: number;
  symbol: string;
  name: string;
  chain: string;
  category: string;
  desc: string;
  price: number;
  priceChange24h: number;
  volume24h: number;
  kairosScore: number;
  signal: 'strong' | 'watch' | 'wait';
  signalText: string;
  tradingPlan: {
    entry: number;
    target: number;
    stopLoss: number;
    riskReward: string;
  };
}

const BACKUP_DATA: TokenData[] = [
  { rank: 1, symbol: 'ONDO', name: 'Ondo', chain: 'ETH', category: 'RWA', desc: '真实世界资产', price: 0.45, priceChange24h: 26.31, volume24h: 465612282, kairosScore: 87, signal: 'strong', signalText: '持续上涨趋势', tradingPlan: { entry: 0.45, target: 0.59, stopLoss: 0.37, riskReward: '1.94' } },
  { rank: 2, symbol: 'AGT', name: 'AGT', chain: 'BNB', category: 'AI', desc: 'AI数据平台', price: 0.085, priceChange24h: 22.10, volume24h: 35750543, kairosScore: 85, signal: 'strong', signalText: '持续上涨趋势', tradingPlan: { entry: 0.085, target: 0.108, stopLoss: 0.073, riskReward: '1.93' } },
  { rank: 3, symbol: 'VIRTUAL', name: 'Virtual Protocol', chain: 'ETH', category: 'AI Agent', desc: 'AI代理协议', price: 0.93, priceChange24h: 4.84, volume24h: 128559759, kairosScore: 70, signal: 'strong', signalText: '持续上涨趋势', tradingPlan: { entry: 0.93, target: 1.03, stopLoss: 0.88, riskReward: '1.82' } },
  { rank: 4, symbol: 'MOG', name: 'Mog', chain: 'ETH', category: 'Meme', desc: 'Meme代币', price: 0.000002, priceChange24h: 4.27, volume24h: 9877624, kairosScore: 65, signal: 'watch', signalText: '需关注突破关键位', tradingPlan: { entry: 0.000002, target: 0.000002, stopLoss: 0.000002, riskReward: '1.81' } },
  { rank: 5, symbol: 'MORPHO', name: 'Morpho', chain: 'ETH', category: 'DeFi', desc: 'DeFi借贷协议', price: 2.35, priceChange24h: 3.20, volume24h: 31630819, kairosScore: 61, signal: 'watch', signalText: '需关注突破关键位', tradingPlan: { entry: 2.35, target: 2.54, stopLoss: 2.24, riskReward: '1.78' } },
  { rank: 6, symbol: 'POPCAT', name: 'Popcat', chain: 'SOL', category: 'Meme', desc: 'Meme代币', price: 0.069, priceChange24h: 2.45, volume24h: 14238153, kairosScore: 57, signal: 'watch', signalText: '需关注突破关键位', tradingPlan: { entry: 0.069, target: 0.074, stopLoss: 0.066, riskReward: '1.76' } },
  { rank: 7, symbol: 'AERO', name: 'Aerodrome', chain: 'BASE', category: 'DeFi', desc: 'Base链DEX', price: 0.45, priceChange24h: 1.40, volume24h: 15246405, kairosScore: 51, signal: 'watch', signalText: '需关注突破关键位', tradingPlan: { entry: 0.45, target: 0.48, stopLoss: 0.43, riskReward: '1.73' } },
  { rank: 8, symbol: 'DRIFT', name: 'Drift Protocol', chain: 'SOL', category: 'DeFi', desc: '永续合约', price: 0.037, priceChange24h: 1.58, volume24h: 4381074, kairosScore: 51, signal: 'watch', signalText: '需关注突破关键位', tradingPlan: { entry: 0.037, target: 0.039, stopLoss: 0.035, riskReward: '1.74' } },
  { rank: 9, symbol: 'FARTCOIN', name: 'Fartcoin', chain: 'SOL', category: 'Meme/AI', desc: 'Meme+AI概念', price: 0.25, priceChange24h: 0.70, volume24h: 25940274, kairosScore: 48, signal: 'watch', signalText: '需关注突破关键位', tradingPlan: { entry: 0.25, target: 0.26, stopLoss: 0.24, riskReward: '1.70' } },
];

const BINANCE_LISTED = ['ONDO', 'VIRTUAL', 'POPCAT'];

function formatPrice(price: number): string {
  if (price < 0.0001) return '$' + price.toFixed(8);
  if (price < 0.01) return '$' + price.toFixed(6);
  if (price < 1) return '$' + price.toFixed(4);
  return '$' + price.toFixed(2);
}

function formatVolume(vol: number): string {
  if (vol >= 1e9) return '$' + (vol / 1e9).toFixed(1) + 'B';
  if (vol >= 1e6) return '$' + (vol / 1e6).toFixed(1) + 'M';
  if (vol >= 1e3) return '$' + (vol / 1e3).toFixed(1) + 'K';
  return '$' + vol.toFixed(0);
}

function getTradeUrl(symbol: string, exchange: string): string {
  if (exchange === 'binance') {
    return `https://www.binance.com/en/trade/${symbol}_USDT`;
  }
  const dexUrls: Record<string, string> = {
    jupiter: `https://jup.ag/swap/SOL-${symbol}`,
    raydium: `https://raydium.io/swap/?inputCurrency=sol&outputCurrency=${symbol}`,
    uniswap: `https://app.uniswap.org/#/swap?outputCurrency=${symbol}`,
    pancakeswap: `https://pancakeswap.finance/swap?outputCurrency=${symbol}`,
  };
  return dexUrls[exchange] || 'https://www.binance.com';
}

function getPlatforms(symbol: string, chain: string) {
  const platforms = [];
  if (BINANCE_LISTED.includes(symbol)) {
    platforms.push({ exchange: 'binance', name: '币安交易' });
  }
  if (chain === 'SOL') {
    platforms.push({ exchange: 'jupiter', name: 'Jupiter' });
    platforms.push({ exchange: 'raydium', name: 'Raydium' });
  } else if (chain === 'ETH') {
    platforms.push({ exchange: 'uniswap', name: 'Uniswap' });
  } else if (chain === 'BASE') {
    platforms.push({ exchange: 'uniswap', name: 'Uniswap' });
  } else if (chain === 'BNB') {
    platforms.push({ exchange: 'pancakeswap', name: 'PancakeSwap' });
  }
  return platforms;
}

export default function TrendingPage() {
  const [tokens, setTokens] = useState<TokenData[]>(BACKUP_DATA);
  const [filter, setFilter] = useState<'all' | 'strong' | 'watch'>('all');
  const [lastUpdate, setLastUpdate] = useState('--:--:--');

  useEffect(() => {
    const updateTime = () => {
      setLastUpdate(new Date().toLocaleTimeString());
    };
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  const filteredTokens = tokens.filter(t => {
    if (filter === 'strong') return t.signal === 'strong';
    if (filter === 'watch') return t.signal === 'watch';
    return true;
  });

  const strongCount = tokens.filter(t => t.signal === 'strong').length;
  const watchCount = tokens.filter(t => t.signal === 'watch').length;

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-cyan-600 to-blue-600 py-6 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Alpha热力榜</h1>
              <p className="text-cyan-100 text-sm mt-1">币安Alpha专区代币 · 实时数据</p>
            </div>
            <div className="text-right">
              <p className="text-cyan-100 text-xs">更新时间</p>
              <p className="text-white font-medium">{lastUpdate}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-4">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-slate-900 rounded-xl p-4 text-center">
            <p className="text-3xl font-bold text-white">{tokens.length}</p>
            <p className="text-slate-400 text-sm">Alpha代币</p>
          </div>
          <div className="bg-slate-900 rounded-xl p-4 text-center">
            <p className="text-3xl font-bold text-green-400">{strongCount}</p>
            <p className="text-slate-400 text-sm">强烈推荐</p>
          </div>
          <div className="bg-slate-900 rounded-xl p-4 text-center">
            <p className="text-3xl font-bold text-yellow-400">{watchCount}</p>
            <p className="text-slate-400 text-sm">关注</p>
          </div>
          <div className="bg-slate-900 rounded-xl p-4 text-center">
            <p className="text-green-400 text-lg font-bold">LIVE</p>
            <p className="text-slate-400 text-sm">数据来源: CoinGecko</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              filter === 'all' ? 'bg-cyan-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
            }`}
          >
            全部 ({tokens.length})
          </button>
          <button
            onClick={() => setFilter('strong')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              filter === 'strong' ? 'bg-green-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
            }`}
          >
            强烈推荐 ({strongCount})
          </button>
          <button
            onClick={() => setFilter('watch')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              filter === 'watch' ? 'bg-yellow-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
            }`}
          >
            关注 ({watchCount})
          </button>
        </div>

        {/* Token Cards */}
        <div className="space-y-4">
          {filteredTokens.map((token) => {
            const platforms = getPlatforms(token.symbol, token.chain);
            return (
              <div key={token.symbol} className="bg-slate-900 rounded-xl overflow-hidden border border-slate-800">
                {/* Main Info */}
                <div className="p-5">
                  <div className="flex flex-wrap items-center gap-6">
                    {/* Rank */}
                    <div className="flex items-center gap-3 min-w-[120px]">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                        token.rank === 1 ? 'bg-yellow-500 text-black' :
                        token.rank === 2 ? 'bg-slate-400 text-black' :
                        token.rank === 3 ? 'bg-amber-600 text-white' :
                        'bg-slate-700 text-white'
                      }`}>
                        {token.rank}
                      </div>
                      <div>
                        <p className="font-bold text-white">{token.symbol}</p>
                        <p className="text-slate-400 text-xs">{token.chain}</p>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="min-w-[100px]">
                      <p className="text-slate-400 text-xs">价格</p>
                      <p className="text-white font-semibold text-lg">{formatPrice(token.price)}</p>
                    </div>

                    {/* 24h Change */}
                    <div className="min-w-[80px]">
                      <p className="text-slate-400 text-xs">24h涨跌</p>
                      <p className={`font-semibold ${token.priceChange24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {token.priceChange24h >= 0 ? '+' : ''}{token.priceChange24h.toFixed(2)}%
                      </p>
                    </div>

                    {/* Volume */}
                    <div className="min-w-[80px]">
                      <p className="text-slate-400 text-xs">交易量</p>
                      <p className="text-white font-medium">{formatVolume(token.volume24h)}</p>
                    </div>

                    {/* Kairos Score */}
                    <div className="min-w-[140px]">
                      <p className="text-slate-400 text-xs">Kairos评分</p>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden max-w-[80px]">
                          <div
                            className={`h-full rounded-full ${token.kairosScore >= 70 ? 'bg-green-500' : token.kairosScore >= 40 ? 'bg-yellow-500' : 'bg-slate-500'}`}
                            style={{ width: `${token.kairosScore}%` }}
                          />
                        </div>
                        <span className="text-white font-bold">{token.kairosScore}</span>
                      </div>
                    </div>

                    {/* Signal */}
                    <div className="min-w-[100px]">
                      <p className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
                        token.signal === 'strong' ? 'bg-green-500/20 text-green-400' :
                        token.signal === 'watch' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-slate-500/20 text-slate-400'
                      }`}>
                        {token.signal === 'strong' ? '🟢' : token.signal === 'watch' ? '🟡' : '⚪'}
                        {token.signal === 'strong' ? '强烈推荐' : token.signal === 'watch' ? '关注' : '观望'}
                      </p>
                    </div>

                    {/* Trade Buttons */}
                    <div className="flex flex-wrap gap-2">
                      {platforms.map((p) => (
                        <a
                          key={p.exchange}
                          href={getTradeUrl(token.symbol, p.exchange)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`px-4 py-2 rounded-lg text-sm font-bold transition-all hover:scale-105 ${
                            p.exchange === 'binance' 
                              ? 'bg-gradient-to-r from-yellow-400 to-amber-500 text-black' 
                              : p.exchange === 'jupiter'
                              ? 'bg-purple-600 hover:bg-purple-500 text-white'
                              : p.exchange === 'uniswap'
                              ? 'bg-pink-600 hover:bg-pink-500 text-white'
                              : p.exchange === 'raydium'
                              ? 'bg-blue-600 hover:bg-blue-500 text-white'
                              : 'bg-cyan-600 hover:bg-cyan-500 text-white'
                          }`}
                        >
                          {p.name}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Trading Plan */}
                <div className="px-5 py-4 bg-slate-800/50 border-t border-slate-800">
                  <div className="flex flex-wrap items-center gap-8 text-sm">
                    <div>
                      <span className="text-slate-500">建议入场 </span>
                      <span className="text-cyan-400 font-medium">{formatPrice(token.tradingPlan.entry)}</span>
                    </div>
                    <div>
                      <span className="text-slate-500">目标价格 </span>
                      <span className="text-green-400 font-medium">{formatPrice(token.tradingPlan.target)}</span>
                    </div>
                    <div>
                      <span className="text-slate-500">止损价格 </span>
                      <span className="text-red-400 font-medium">{formatPrice(token.tradingPlan.stopLoss)}</span>
                    </div>
                    <div>
                      <span className="text-slate-500">盈亏比 </span>
                      <span className="text-yellow-400 font-medium">1:{token.tradingPlan.riskReward}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Source */}
        <div className="mt-8 text-center text-slate-500 text-sm">
          <p>数据来源：binance.com/en/alphaevents · CoinGecko</p>
          <p className="mt-1 text-xs">名单动态变化，投资有风险，入市需谨慎</p>
        </div>
      </div>
    </div>
  );
}
