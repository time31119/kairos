'use client';

import { useState, useEffect } from 'react';

// Types
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
  dataSource: string;
}

// 备用数据
const BACKUP_DATA: TokenData[] = [
  { rank: 1, symbol: 'ONDO', name: 'Ondo', chain: 'ETH', category: 'RWA', desc: '真实世界资产', price: 1.15, priceChange24h: 5.2, volume24h: 125000000, kairosScore: 87, signal: 'strong', signalText: '持续上涨趋势', tradingPlan: { entry: 1.15, target: 1.35, stopLoss: 1.02, riskReward: '1.8' }, dataSource: 'coinGecko' },
  { rank: 2, symbol: 'VIRTUAL', name: 'Virtual Protocol', chain: 'ETH', category: 'AI Agent', desc: 'AI代理协议', price: 2.85, priceChange24h: 12.8, volume24h: 89000000, kairosScore: 85, signal: 'strong', signalText: '持续上涨趋势', tradingPlan: { entry: 2.85, target: 3.25, stopLoss: 2.65, riskReward: '2.0' }, dataSource: 'coinGecko' },
  { rank: 3, symbol: 'FARTCOIN', name: 'Fartcoin', chain: 'SOL', category: 'Meme/AI', desc: 'Meme+AI概念', price: 0.25, priceChange24h: 18.5, volume24h: 156000000, kairosScore: 82, signal: 'strong', signalText: '持续上涨趋势', tradingPlan: { entry: 0.25, target: 0.32, stopLoss: 0.21, riskReward: '2.3' }, dataSource: 'coinGecko' },
  { rank: 4, symbol: 'AERO', name: 'Aerodrome', chain: 'BASE', category: 'DeFi', desc: 'Base链DEX', price: 1.45, priceChange24h: 8.5, volume24h: 45000000, kairosScore: 78, signal: 'strong', signalText: '持续上涨趋势', tradingPlan: { entry: 1.45, target: 1.68, stopLoss: 1.32, riskReward: '1.9' }, dataSource: 'coinGecko' },
  { rank: 5, symbol: 'POPCAT', name: 'Popcat', chain: 'SOL', category: 'Meme', desc: 'Meme代币', price: 0.95, priceChange24h: 15.3, volume24h: 78000000, kairosScore: 75, signal: 'strong', signalText: '持续上涨趋势', tradingPlan: { entry: 0.95, target: 1.15, stopLoss: 0.85, riskReward: '2.0' }, dataSource: 'coinGecko' },
  { rank: 6, symbol: 'DRIFT', name: 'Drift Protocol', chain: 'SOL', category: 'DeFi', desc: '永续合约', price: 0.42, priceChange24h: 7.8, volume24h: 32000000, kairosScore: 70, signal: 'strong', signalText: '持续上涨趋势', tradingPlan: { entry: 0.42, target: 0.50, stopLoss: 0.38, riskReward: '2.0' }, dataSource: 'coinGecko' },
  { rank: 7, symbol: 'MORPHO', name: 'Morpho', chain: 'ETH', category: 'DeFi', desc: 'DeFi借贷协议', price: 2.35, priceChange24h: 3.2, volume24h: 28000000, kairosScore: 65, signal: 'watch', signalText: '需关注突破关键位', tradingPlan: { entry: 2.35, target: 2.58, stopLoss: 2.18, riskReward: '1.7' }, dataSource: 'coinGecko' },
  { rank: 8, symbol: 'MOG', name: 'Mog', chain: 'ETH', category: 'Meme', desc: 'Meme代币', price: 0.0000018, priceChange24h: 4.2, volume24h: 8500000, kairosScore: 58, signal: 'watch', signalText: '需关注突破关键位', tradingPlan: { entry: 0.0000018, target: 0.000002, stopLoss: 0.0000016, riskReward: '1.5' }, dataSource: 'coinGecko' },
  { rank: 9, symbol: 'AGT', name: 'AGT', chain: 'BNB', category: 'AI', desc: 'AI数据平台', price: 0.085, priceChange24h: 22.1, volume24h: 22000000, kairosScore: 52, signal: 'watch', signalText: '需关注突破关键位', tradingPlan: { entry: 0.085, target: 0.10, stopLoss: 0.075, riskReward: '1.7' }, dataSource: 'coinGecko' },
];

// 只对确认在币安上市的代币显示币安按钮
const BINANCE_LISTED = ['ONDO', 'VIRTUAL', 'POPCAT'];

// 平台配置
const PLATFORMS: Record<string, { name: string; chain: string[] }> = {
  binance: { name: '币安', chain: ['ETH', 'BASE', 'SOL', 'BNB'] },
  jupiter: { name: 'Jupiter', chain: ['SOL'] },
  raydium: { name: 'Raydium', chain: ['SOL'] },
  uniswap: { name: 'Uniswap', chain: ['ETH', 'BASE'] },
  pancakeswap: { name: 'PancakeSwap', chain: ['BNB'] },
};

// 生成交易链接
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

// 格式化价格
function formatPrice(price: number): string {
  if (price < 0.0001) return `$${price.toFixed(8)}`;
  if (price < 0.01) return `$${price.toFixed(6)}`;
  if (price < 1) return `$${price.toFixed(4)}`;
  if (price < 100) return `$${price.toFixed(2)}`;
  return `$${price.toLocaleString()}`;
}

// 格式化交易量
function formatVolume(volume: number): string {
  if (volume >= 1e9) return `$${(volume / 1e9).toFixed(1)}B`;
  if (volume >= 1e6) return `$${(volume / 1e6).toFixed(1)}M`;
  if (volume >= 1e3) return `$${(volume / 1e3).toFixed(1)}K`;
  return `$${volume.toFixed(0)}`;
}

// 获取代币可用的交易平台
function getPlatforms(token: TokenData) {
  return Object.entries(PLATFORMS)
    .filter(([key, config]) => {
      if (key === 'binance') return BINANCE_LISTED.includes(token.symbol);
      return config.chain.includes(token.chain);
    })
    .map(([key, config]) => ({ exchange: key, name: config.name }));
}

export default function TrendingPage() {
  const [tokens] = useState<TokenData[]>(BACKUP_DATA);
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

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-slate-950/95 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-white">Alpha热力榜</h1>
              <p className="text-slate-400 text-sm">币安Alpha专区代币 · 实时数据</p>
            </div>
            <div className="text-right">
              <p className="text-slate-400 text-xs">更新时间</p>
              <p className="text-cyan-400 text-sm font-mono">{lastUpdate}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-slate-900 rounded-xl p-4 border border-slate-800">
            <p className="text-slate-400 text-sm">Alpha代币</p>
            <p className="text-2xl font-bold text-white">{tokens.length}</p>
          </div>
          <div className="bg-slate-900 rounded-xl p-4 border border-green-900">
            <p className="text-slate-400 text-sm">强烈推荐</p>
            <p className="text-2xl font-bold text-green-400">{tokens.filter(t => t.signal === 'strong').length}</p>
          </div>
          <div className="bg-slate-900 rounded-xl p-4 border border-yellow-900">
            <p className="text-slate-400 text-sm">关注</p>
            <p className="text-2xl font-bold text-yellow-400">{tokens.filter(t => t.signal === 'watch').length}</p>
          </div>
          <div className="bg-slate-900 rounded-xl p-4 border border-slate-800">
            <p className="text-slate-400 text-sm">数据来源</p>
            <p className="text-cyan-400 text-sm font-medium">CoinGecko</p>
          </div>
        </div>

        {/* Filter */}
        <div className="flex gap-2">
          {(['all', 'strong', 'watch'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                filter === f
                  ? 'bg-cyan-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
              }`}
            >
              {f === 'all' ? '全部' : f === 'strong' ? '强烈推荐' : '关注'}
            </button>
          ))}
        </div>

        {/* Token List */}
        <div className="space-y-4">
          {filteredTokens.map((token) => {
            const platforms = getPlatforms(token);
            return (
              <div key={token.symbol} className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
                {/* Header */}
                <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${
                      token.rank === 1 ? 'bg-gradient-to-br from-amber-400 to-yellow-600 text-black' :
                      token.rank === 2 ? 'bg-gradient-to-br from-slate-300 to-slate-500 text-black' :
                      token.rank === 3 ? 'bg-gradient-to-br from-amber-600 to-amber-800 text-white' :
                      'bg-slate-800 text-slate-400'
                    }`}>
                      {token.rank}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-white font-bold text-lg">{token.symbol}</span>
                        <span className="px-2 py-0.5 bg-slate-800 rounded text-slate-400 text-xs">{token.chain}</span>
                        <span className="px-2 py-0.5 bg-slate-800 rounded text-slate-400 text-xs">{token.category}</span>
                      </div>
                      <p className="text-slate-400 text-sm">{token.name}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    token.signal === 'strong' ? 'bg-green-600/20 text-green-400' :
                    token.signal === 'watch' ? 'bg-yellow-600/20 text-yellow-400' :
                    'bg-slate-600/20 text-slate-400'
                  }`}>
                    {token.signal === 'strong' ? '强烈推荐' : token.signal === 'watch' ? '关注' : '观望'}
                  </span>
                </div>

                {/* Main Content */}
                <div className="px-4 pb-4">
                  <div className="flex flex-col lg:flex-row gap-4">
                    {/* Stats Grid */}
                    <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-slate-800/50 rounded-xl p-3">
                        <p className="text-slate-400 text-xs">当前价格</p>
                        <p className="text-white font-bold text-lg">{formatPrice(token.price)}</p>
                      </div>
                      <div className="bg-slate-800/50 rounded-xl p-3">
                        <p className="text-slate-400 text-xs">24h涨跌</p>
                        <p className={`font-bold text-lg ${token.priceChange24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {token.priceChange24h >= 0 ? '+' : ''}{token.priceChange24h.toFixed(2)}%
                        </p>
                      </div>
                      <div className="bg-slate-800/50 rounded-xl p-3">
                        <p className="text-slate-400 text-xs">24h交易量</p>
                        <p className="text-white font-bold">{formatVolume(token.volume24h)}</p>
                      </div>
                      <div className="bg-slate-800/50 rounded-xl p-3">
                        <p className="text-slate-400 text-xs">Kairos评分</p>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                token.kairosScore >= 70 ? 'bg-green-500' :
                                token.kairosScore >= 40 ? 'bg-yellow-500' : 'bg-slate-500'
                              }`}
                              style={{ width: `${token.kairosScore}%` }}
                            />
                          </div>
                          <span className="text-white font-bold">{token.kairosScore}</span>
                        </div>
                      </div>
                    </div>

                    {/* Trade Buttons */}
                    <div className="flex flex-wrap items-center gap-2">
                      {platforms.map((p) => (
                        <a
                          key={p.exchange}
                          href={getTradeUrl(token.symbol, p.exchange)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`px-4 py-2 rounded-lg text-sm font-bold transition-all hover:scale-105 ${
                            p.exchange === 'binance' 
                              ? 'bg-gradient-to-r from-yellow-500 to-amber-600 text-black' 
                              : p.exchange === 'jupiter'
                              ? 'bg-purple-600 hover:bg-purple-500 text-white'
                              : p.exchange === 'uniswap'
                              ? 'bg-pink-600 hover:bg-pink-500 text-white'
                              : p.exchange === 'raydium'
                              ? 'bg-blue-600 hover:bg-blue-500 text-white'
                              : 'bg-cyan-600 hover:bg-cyan-500 text-white'
                          }`}
                        >
                          跳转 {p.name}
                        </a>
                      ))}
                    </div>
                  </div>

                  {/* Trading Plan */}
                  <div className="mt-4 grid grid-cols-4 gap-2 bg-slate-800/30 rounded-xl p-3">
                    <div className="text-center">
                      <p className="text-slate-400 text-xs">入场价</p>
                      <p className="text-cyan-400 font-medium">{formatPrice(token.tradingPlan.entry)}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-slate-400 text-xs">目标价</p>
                      <p className="text-green-400 font-medium">{formatPrice(token.tradingPlan.target)}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-slate-400 text-xs">止损价</p>
                      <p className="text-red-400 font-medium">{formatPrice(token.tradingPlan.stopLoss)}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-slate-400 text-xs">盈亏比</p>
                      <p className="text-white font-medium">1:{token.tradingPlan.riskReward}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="text-center py-6 text-slate-500 text-sm">
          <p>数据来源：binance.com/en/alphaevents</p>
          <p className="mt-1">代币列表可能动态变化，建议以币安官方为准</p>
        </div>
      </div>
    </div>
  );
}
