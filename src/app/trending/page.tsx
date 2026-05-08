'use client';

import { useState, useEffect } from 'react';

// Token data interface
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

// Backup data
const BACKUP_DATA: TokenData[] = [
  { rank: 1, symbol: 'ONDO', name: 'Ondo', chain: 'ETH', category: 'RWA', desc: '真实世界资产', price: 0.45, priceChange24h: 26.31, volume24h: 465612282, kairosScore: 87, signal: 'strong', signalText: '持续上涨趋势', tradingPlan: { entry: 0.45, target: 0.59, stopLoss: 0.37, riskReward: '1.94' }, dataSource: 'coinGecko' },
  { rank: 2, symbol: 'AGT', name: 'AGT', chain: 'BNB', category: 'AI', desc: 'AI数据平台', price: 0.085, priceChange24h: 22.10, volume24h: 35750543, kairosScore: 85, signal: 'strong', signalText: '持续上涨趋势', tradingPlan: { entry: 0.085, target: 0.108, stopLoss: 0.073, riskReward: '1.93' }, dataSource: 'coinGecko' },
  { rank: 3, symbol: 'VIRTUAL', name: 'Virtual Protocol', chain: 'ETH', category: 'AI Agent', desc: 'AI代理协议', price: 0.93, priceChange24h: 4.84, volume24h: 128559759, kairosScore: 70, signal: 'strong', signalText: '持续上涨趋势', tradingPlan: { entry: 0.93, target: 1.03, stopLoss: 0.88, riskReward: '1.82' }, dataSource: 'coinGecko' },
  { rank: 4, symbol: 'MOG', name: 'Mog', chain: 'ETH', category: 'Meme', desc: 'Meme代币', price: 0.000002, priceChange24h: 4.27, volume24h: 9877624, kairosScore: 65, signal: 'watch', signalText: '需关注突破关键位', tradingPlan: { entry: 0.000002, target: 0.000002, stopLoss: 0.000002, riskReward: '1.81' }, dataSource: 'coinGecko' },
  { rank: 5, symbol: 'MORPHO', name: 'Morpho', chain: 'ETH', category: 'DeFi', desc: 'DeFi借贷协议', price: 2.35, priceChange24h: 3.20, volume24h: 31630819, kairosScore: 61, signal: 'watch', signalText: '需关注突破关键位', tradingPlan: { entry: 2.35, target: 2.54, stopLoss: 2.24, riskReward: '1.78' }, dataSource: 'coinGecko' },
  { rank: 6, symbol: 'POPCAT', name: 'Popcat', chain: 'SOL', category: 'Meme', desc: 'Meme代币', price: 0.069, priceChange24h: 2.45, volume24h: 14238153, kairosScore: 57, signal: 'watch', signalText: '需关注突破关键位', tradingPlan: { entry: 0.069, target: 0.074, stopLoss: 0.066, riskReward: '1.76' }, dataSource: 'coinGecko' },
  { rank: 7, symbol: 'AERO', name: 'Aerodrome', chain: 'BASE', category: 'DeFi', desc: 'Base链DEX', price: 0.45, priceChange24h: 1.40, volume24h: 15246405, kairosScore: 51, signal: 'watch', signalText: '需关注突破关键位', tradingPlan: { entry: 0.45, target: 0.48, stopLoss: 0.43, riskReward: '1.73' }, dataSource: 'coinGecko' },
  { rank: 8, symbol: 'DRIFT', name: 'Drift Protocol', chain: 'SOL', category: 'DeFi', desc: '永续合约', price: 0.037, priceChange24h: 1.58, volume24h: 4381074, kairosScore: 51, signal: 'watch', signalText: '需关注突破关键位', tradingPlan: { entry: 0.037, target: 0.039, stopLoss: 0.035, riskReward: '1.74' }, dataSource: 'coinGecko' },
  { rank: 9, symbol: 'FARTCOIN', name: 'Fartcoin', chain: 'SOL', category: 'Meme/AI', desc: 'Meme+AI概念', price: 0.25, priceChange24h: 0.70, volume24h: 25940274, kairosScore: 48, signal: 'watch', signalText: '需关注突破关键位', tradingPlan: { entry: 0.25, target: 0.26, stopLoss: 0.24, riskReward: '1.70' }, dataSource: 'coinGecko' },
];

// Only show Binance button for confirmed listed tokens
const BINANCE_LISTED = ['ONDO', 'VIRTUAL', 'POPCAT'];

// Get trade URL
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

// Get platforms for token
function getPlatforms(symbol: string, chain: string) {
  const platforms = [];
  if (BINANCE_LISTED.includes(symbol)) {
    platforms.push({ exchange: 'binance', name: '币安交易' });
  }
  if (chain === 'SOL') {
    platforms.push({ exchange: 'jupiter', name: 'Jupiter' });
    platforms.push({ exchange: 'raydium', name: 'Raydium' });
  }
  if (chain === 'ETH') {
    platforms.push({ exchange: 'uniswap', name: 'Uniswap' });
  }
  if (chain === 'BASE') {
    platforms.push({ exchange: 'uniswap', name: 'Uniswap' });
  }
  if (chain === 'BNB') {
    platforms.push({ exchange: 'pancakeswap', name: 'PancakeSwap' });
  }
  return platforms;
}

// Format price
function formatPrice(price: number): string {
  if (price >= 1) return `$${price.toFixed(2)}`;
  if (price >= 0.01) return `$${price.toFixed(4)}`;
  return `$${price.toFixed(6)}`;
}

// Format volume
function formatVolume(vol: number): string {
  if (vol >= 1e9) return `$${(vol / 1e9).toFixed(1)}B`;
  if (vol >= 1e6) return `$${(vol / 1e6).toFixed(1)}M`;
  if (vol >= 1e3) return `$${(vol / 1e3).toFixed(1)}K`;
  return `$${vol.toFixed(0)}`;
}

// Chain icons
const chainIcons: Record<string, string> = {
  ETH: '🔷',
  SOL: '🟣',
  BASE: '🔵',
  BNB: '🟡',
};

export default function TrendingPage() {
  const [tokens] = useState<TokenData[]>(BACKUP_DATA);
  const [filter, setFilter] = useState<'all' | 'strong' | 'watch'>('all');
  const [lastUpdate] = useState(new Date().toLocaleTimeString());

  // Filter tokens
  const filteredTokens = tokens.filter(t => {
    if (filter === 'strong') return t.signal === 'strong';
    if (filter === 'watch') return t.signal === 'watch';
    return true;
  });

  // Stats
  const strongCount = tokens.filter(t => t.signal === 'strong').length;
  const watchCount = tokens.filter(t => t.signal === 'watch').length;

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-cyan-600 to-blue-600 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Alpha热力榜</h1>
          <p className="text-cyan-100">币安Alpha专区代币 · 实时数据</p>
          <p className="text-cyan-200 text-sm mt-2">更新时间: {lastUpdate}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-slate-900 rounded-xl p-4 border border-slate-800 text-center">
            <p className="text-3xl font-bold text-white">{tokens.length}</p>
            <p className="text-slate-400 text-sm">Alpha代币</p>
          </div>
          <div className="bg-slate-900 rounded-xl p-4 border border-green-800 text-center">
            <p className="text-3xl font-bold text-green-400">{strongCount}</p>
            <p className="text-slate-400 text-sm">强烈推荐</p>
          </div>
          <div className="bg-slate-900 rounded-xl p-4 border border-yellow-800 text-center">
            <p className="text-3xl font-bold text-yellow-400">{watchCount}</p>
            <p className="text-slate-400 text-sm">关注</p>
          </div>
          <div className="bg-slate-900 rounded-xl p-4 border border-slate-800 text-center">
            <p className="text-lg font-bold text-cyan-400">CoinGecko</p>
            <p className="text-slate-400 text-sm">数据来源</p>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              filter === 'all' ? 'bg-cyan-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
            }`}
          >
            全部
          </button>
          <button
            onClick={() => setFilter('strong')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              filter === 'strong' ? 'bg-green-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
            }`}
          >
            强烈推荐
          </button>
          <button
            onClick={() => setFilter('watch')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              filter === 'watch' ? 'bg-yellow-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
            }`}
          >
            关注
          </button>
        </div>

        {/* Token Table */}
        <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-12 gap-2 px-4 py-3 bg-slate-800 text-xs text-slate-400 font-medium">
            <div className="col-span-1">排名</div>
            <div className="col-span-2">代币</div>
            <div className="col-span-1">价格</div>
            <div className="col-span-1">24h涨跌</div>
            <div className="col-span-1">交易量</div>
            <div className="col-span-1">评分</div>
            <div className="col-span-2">信号</div>
            <div className="col-span-3">交易</div>
          </div>

          {/* Token Rows */}
          {filteredTokens.map((token) => {
            const platforms = getPlatforms(token.symbol, token.chain);
            return (
              <div key={token.symbol} className="border-t border-slate-800">
                {/* Main Row */}
                <div className="grid grid-cols-12 gap-2 px-4 py-3 items-center">
                  {/* Rank */}
                  <div className="col-span-1">
                    <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm ${
                      token.rank === 1 ? 'bg-yellow-500 text-black' :
                      token.rank === 2 ? 'bg-slate-400 text-black' :
                      token.rank === 3 ? 'bg-amber-700 text-white' :
                      'bg-slate-700 text-slate-300'
                    }`}>
                      {token.rank}
                    </span>
                  </div>

                  {/* Token Info */}
                  <div className="col-span-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white">{token.symbol}</span>
                      <span className="text-slate-400 text-xs">{chainIcons[token.chain]}</span>
                    </div>
                    <p className="text-slate-500 text-xs">{token.desc}</p>
                  </div>

                  {/* Price */}
                  <div className="col-span-1 font-semibold text-white">
                    {formatPrice(token.price)}
                  </div>

                  {/* 24h Change */}
                  <div className={`col-span-1 font-semibold ${token.priceChange24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {token.priceChange24h >= 0 ? '+' : ''}{token.priceChange24h.toFixed(2)}%
                  </div>

                  {/* Volume */}
                  <div className="col-span-1 text-slate-400 text-sm">
                    {formatVolume(token.volume24h)}
                  </div>

                  {/* Kairos Score */}
                  <div className="col-span-1">
                    <div className="flex items-center gap-1">
                      <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            token.kairosScore >= 70 ? 'bg-green-500' :
                            token.kairosScore >= 40 ? 'bg-yellow-500' : 'bg-slate-500'
                          }`}
                          style={{ width: `${token.kairosScore}%` }}
                        />
                      </div>
                      <span className="text-xs font-semibold text-white ml-1">{token.kairosScore}</span>
                    </div>
                  </div>

                  {/* Signal */}
                  <div className="col-span-2">
                    <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                      token.signal === 'strong' ? 'bg-green-500/20 text-green-400' :
                      token.signal === 'watch' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-slate-500/20 text-slate-400'
                    }`}>
                      {token.signal === 'strong' ? '🟢 强烈推荐' : token.signal === 'watch' ? '🟡 关注' : '⚪ 观望'}
                    </span>
                  </div>

                  {/* Trade Buttons */}
                  <div className="col-span-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      {platforms.map((p) => (
                        <a
                          key={p.exchange}
                          href={getTradeUrl(token.symbol, p.exchange)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all hover:scale-105 ${
                            p.exchange === 'binance' 
                              ? 'bg-yellow-400 text-black hover:bg-yellow-300' 
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

                {/* Trading Plan Row */}
                <div className="grid grid-cols-12 gap-2 px-4 py-2 bg-slate-800/30 border-t border-slate-800/50 text-xs">
                  <div className="col-span-1"></div>
                  <div className="col-span-1 text-slate-500">入场</div>
                  <div className="col-span-1 text-cyan-400 font-medium">{formatPrice(token.tradingPlan.entry)}</div>
                  <div className="col-span-1 text-slate-500">目标</div>
                  <div className="col-span-1 text-green-400 font-medium">{formatPrice(token.tradingPlan.target)}</div>
                  <div className="col-span-1 text-slate-500">止损</div>
                  <div className="col-span-1 text-red-400 font-medium">{formatPrice(token.tradingPlan.stopLoss)}</div>
                  <div className="col-span-1 text-slate-500">盈亏比</div>
                  <div className="col-span-1 text-yellow-400 font-medium">1:{token.tradingPlan.riskReward}</div>
                  <div className="col-span-3"></div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-slate-500 text-sm">
          <p>实时名单：binance.com/en/alphaevents</p>
          <p className="mt-2">数据来源：CoinGecko API · 每30秒自动刷新</p>
        </div>
      </div>
    </div>
  );
}
