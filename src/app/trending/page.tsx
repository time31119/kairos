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
  dataSource: string;
}

interface Platform {
  name: string;
  exchange: string;
}

// 币安上市代币白名单
const BINANCE_LISTED = ['ONDO', 'VIRTUAL', 'AERO', 'DRIFT', 'POPCAT', 'MORPHO', 'FARTCOIN', 'MOG', 'AGT'];

// 备用数据
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

function getTradePlatforms(symbol: string, chain: string): Platform[] {
  const platforms: Platform[] = [];
  
  if (BINANCE_LISTED.includes(symbol)) {
    platforms.push({ name: '币安交易', exchange: 'binance' });
  }
  
  if (chain === 'SOL') {
    platforms.push({ name: 'Jupiter', exchange: 'jupiter' });
    platforms.push({ name: 'Raydium', exchange: 'raydium' });
  } else if (chain === 'ETH' || chain === 'BASE') {
    platforms.push({ name: 'Uniswap', exchange: 'uniswap' });
  } else if (chain === 'BNB') {
    platforms.push({ name: 'PancakeSwap', exchange: 'pancakeswap' });
  }
  
  return platforms;
}

function getTradeUrl(symbol: string, exchange: string): string {
  const urls: Record<string, Record<string, string>> = {
    binance: {
      ONDO: 'https://www.binance.com/en/trade/ONDO_USDT',
      VIRTUAL: 'https://www.binance.com/en/trade/VIRTUAL_USDT',
      AERO: 'https://www.binance.com/en/trade/AERO_USDT',
      DRIFT: 'https://www.binance.com/en/trade/DRIFT_USDT',
      POPCAT: 'https://www.binance.com/en/trade/POPCAT_USDT',
      MORPHO: 'https://www.binance.com/en/trade/MORPHO_USDT',
      FARTCOIN: 'https://www.binance.com/en/trade/FARTCOIN_USDT',
      MOG: 'https://www.binance.com/en/trade/MOG_USDT',
      AGT: 'https://www.binance.com/en/trade/AGT_USDT',
    },
    jupiter: { default: 'https://jup.ag/swap/SOL' },
    raydium: { default: 'https://raydium.io/swap/' },
    uniswap: { default: 'https://app.uniswap.org/#/swap' },
    pancakeswap: { default: 'https://pancakeswap.finance/swap' },
  };
  
  if (exchange === 'binance') {
    return urls.binance[symbol] || `https://www.binance.com/en/trade/${symbol}_USDT`;
  }
  
  return urls[exchange]?.default || 'https://www.binance.com';
}

function formatPrice(price: number): string {
  if (price >= 1) return '$' + price.toFixed(2);
  if (price >= 0.01) return '$' + price.toFixed(4);
  if (price >= 0.0001) return '$' + price.toFixed(6);
  return '$' + price.toFixed(8);
}

function formatVolume(volume: number): string {
  if (volume >= 1e9) return '$' + (volume / 1e9).toFixed(1) + 'B';
  if (volume >= 1e6) return '$' + (volume / 1e6).toFixed(1) + 'M';
  if (volume >= 1e3) return '$' + (volume / 1e3).toFixed(1) + 'K';
  return '$' + volume.toFixed(0);
}

export default function TrendingPage() {
  const [tokens, setTokens] = useState<TokenData[]>(BACKUP_DATA);
  const [filter, setFilter] = useState<'all' | 'strong' | 'watch'>('all');
  const [lastUpdate, setLastUpdate] = useState('--:--:--');

  useEffect(() => {
    // 每分钟更新时间
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
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Alpha热力榜</h1>
              <p className="text-slate-400 text-sm mt-1">
                币安Alpha专区代币 · 实时数据 · 更新: {lastUpdate}
              </p>
            </div>
            <div className="text-right">
              <p className="text-cyan-400 text-sm">数据来源：binance.com/en/alphaevents</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4">
            <p className="text-slate-400 text-sm">Alpha 代币</p>
            <p className="text-3xl font-bold text-white mt-1">{tokens.length}</p>
          </div>
          <div className="bg-green-900/20 border border-green-800 rounded-xl p-4">
            <p className="text-green-400 text-sm">强烈推荐</p>
            <p className="text-3xl font-bold text-green-400 mt-1">{strongCount}</p>
          </div>
          <div className="bg-yellow-900/20 border border-yellow-800 rounded-xl p-4">
            <p className="text-yellow-400 text-sm">关注</p>
            <p className="text-3xl font-bold text-yellow-400 mt-1">{watchCount}</p>
          </div>
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4">
            <p className="text-slate-400 text-sm">数据来源</p>
            <p className="text-cyan-400 text-lg font-semibold mt-1">CoinGecko</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === 'all' ? 'bg-cyan-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
            }`}
          >
            全部
          </button>
          <button
            onClick={() => setFilter('strong')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === 'strong' ? 'bg-green-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
            }`}
          >
            强烈推荐
          </button>
          <button
            onClick={() => setFilter('watch')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === 'watch' ? 'bg-yellow-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
            }`}
          >
            关注
          </button>
        </div>

        {/* Token Cards */}
        <div className="space-y-4">
          {filteredTokens.map((token) => {
            const platforms = getTradePlatforms(token.symbol, token.chain);
            
            return (
              <div
                key={token.symbol}
                className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden hover:border-cyan-500/50 transition-colors"
              >
                {/* Header */}
                <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg ${
                      token.rank === 1 ? 'bg-gradient-to-br from-yellow-400 to-amber-600 text-white' :
                      token.rank === 2 ? 'bg-gradient-to-br from-slate-300 to-slate-500 text-white' :
                      token.rank === 3 ? 'bg-gradient-to-br from-amber-600 to-amber-800 text-white' :
                      'bg-slate-800 text-slate-300'
                    }`}>
                      {token.rank <= 3 ? ['🥇', '🥈', '🥉'][token.rank - 1] : token.rank}
                    </div>
                    <div>
                      <h3 className="text-white font-bold text-lg">{token.symbol}</h3>
                      <p className="text-slate-400 text-sm">{token.name} · {token.chain} · {token.category}</p>
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                    token.signal === 'strong' ? 'bg-green-500/20 text-green-400' :
                    token.signal === 'watch' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-slate-500/20 text-slate-400'
                  }`}>
                    {token.signal === 'strong' ? '🟢 强烈推荐' :
                     token.signal === 'watch' ? '🟡 关注' : '⚪ 观望'}
                  </div>
                </div>

                {/* Stats */}
                <div className="px-4 pb-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-slate-400 text-xs">价格</p>
                    <p className="text-white font-semibold">{formatPrice(token.price)}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-xs">24h涨跌</p>
                    <p className={`font-semibold ${token.priceChange24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {token.priceChange24h >= 0 ? '+' : ''}{token.priceChange24h.toFixed(2)}%
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-xs">交易量</p>
                    <p className="text-white font-semibold">{formatVolume(token.volume24h)}</p>
                  </div>
                  <div>
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
                      <span className="text-white font-semibold text-sm">{token.kairosScore}</span>
                    </div>
                  </div>
                </div>

                {/* Trading Plan */}
                <div className="px-4 py-3 bg-slate-800/50 border-t border-slate-800">
                  <div className="grid grid-cols-4 gap-2 text-center text-sm">
                    <div>
                      <p className="text-slate-400 text-xs">入场</p>
                      <p className="text-cyan-400 font-medium">{formatPrice(token.tradingPlan.entry)}</p>
                    </div>
                    <div>
                      <p className="text-slate-400 text-xs">目标</p>
                      <p className="text-green-400 font-medium">{formatPrice(token.tradingPlan.target)}</p>
                    </div>
                    <div>
                      <p className="text-slate-400 text-xs">止损</p>
                      <p className="text-red-400 font-medium">{formatPrice(token.tradingPlan.stopLoss)}</p>
                    </div>
                    <div>
                      <p className="text-slate-400 text-xs">盈亏比</p>
                      <p className="text-white font-medium">{token.tradingPlan.riskReward}</p>
                    </div>
                  </div>
                </div>

                {/* Trade Buttons */}
                <div className="px-4 py-3 border-t border-slate-800 flex flex-wrap gap-2">
                  {platforms.map((p) => (
                    <a
                      key={p.exchange}
                      href={getTradeUrl(token.symbol, p.exchange)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-sm font-medium transition-colors"
                    >
                      跳转 {p.name}
                    </a>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {filteredTokens.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-400 text-lg">暂无符合条件的代币</p>
          </div>
        )}
      </div>
    </div>
  );
}
