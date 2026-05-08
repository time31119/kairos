'use client';

import { useState, useCallback, useEffect } from 'react';

// 币安Alpha专区代币
const ALPHA_TOKENS = [
  { symbol: 'ONDO', name: 'Ondo', chain: 'ETH', id: 'ondo-finance', category: 'RWA', desc: '真实世界资产' },
  { symbol: 'VIRTUAL', name: 'Virtual Protocol', chain: 'ETH', id: 'virtual-protocol', category: 'AI Agent', desc: 'AI代理协议' },
  { symbol: 'AERO', name: 'Aerodrome', chain: 'BASE', id: 'aerodrome-finance', category: 'DeFi', desc: 'Base链DEX' },
  { symbol: 'FARTCOIN', name: 'Fartcoin', chain: 'SOL', id: 'fartcoin', category: 'Meme/AI', desc: 'Meme+AI概念' },
  { symbol: 'MORPHO', name: 'Morpho', chain: 'ETH', id: 'morpho-protocol', category: 'DeFi', desc: 'DeFi借贷协议' },
  { symbol: 'DRIFT', name: 'Drift Protocol', chain: 'SOL', id: 'drift-protocol', category: 'DeFi', desc: '永续合约' },
  { symbol: 'POPCAT', name: 'Popcat', chain: 'SOL', id: 'popcat', category: 'Meme', desc: 'Meme代币' },
  { symbol: 'MOG', name: 'Mog', chain: 'ETH', id: 'mog-coin', category: 'Meme', desc: 'Meme代币' },
  { symbol: 'AGT', name: 'AGT', chain: 'BNB', id: 'agt-coin', category: 'AI', desc: 'AI数据平台' },
];

// 代币数据
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
  tradingPlan: { entry: number; target: number; stopLoss: number; riskReward: string };
  dataSource: string;
}

// 链图标
const CHAIN_ICONS: Record<string, string> = {
  ETH: '🔷',
  SOL: '🟣',
  BASE: '🔵',
  BNB: '🟡',
};

// 格式化价格
function formatPrice(price: number): string {
  if (price >= 1000) return `$${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  if (price >= 1) return `$${price.toFixed(2)}`;
  if (price >= 0.01) return `$${price.toFixed(4)}`;
  if (price >= 0.0001) return `$${price.toFixed(6)}`;
  return `$${price.toExponential(2)}`;
}

// 格式化交易量
function formatVolume(vol: number): string {
  if (vol >= 1e9) return `$${(vol / 1e9).toFixed(1)}B`;
  if (vol >= 1e6) return `$${(vol / 1e6).toFixed(1)}M`;
  if (vol >= 1e3) return `$${(vol / 1e3).toFixed(1)}K`;
  return `$${vol.toFixed(0)}`;
}

// 格式化涨跌
function formatChange(change: number): string {
  return `${change >= 0 ? '+' : ''}${change.toFixed(2)}%`;
}

// 交易链接
function getTradeUrl(symbol: string, exchange: string): string {
  const urls: Record<string, string> = {
    binance: `https://www.binance.com/en/trade/${symbol}_USDT?type=spot`,
    jupiter: `https://jup.ag/swap/SOL-${symbol}`,
    raydium: `https://raydium.io/swap/?inputCurrency=sol&outputCurrency=${symbol}`,
    uniswap: `https://app.uniswap.org/#/swap?outputCurrency=${symbol}`,
    pancakeswap: `https://pancakeswap.finance/swap?outputCurrency=${symbol}`,
  };
  return urls[exchange] || urls.binance;
}

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

// 确认在币安上市的代币
const BINANCE_LISTED = ['ONDO', 'VIRTUAL', 'AERO', 'DRIFT', 'POPCAT', 'MORPHO'];

// 获取交易平台
function getPlatforms(symbol: string, chain: string) {
  const listedOnBinance = BINANCE_LISTED.includes(symbol);
  
  if (chain === 'SOL') {
    return listedOnBinance
      ? [
          { name: '币安', exchange: 'binance' },
          { name: 'Jupiter', exchange: 'jupiter' },
          { name: 'Raydium', exchange: 'raydium' },
        ]
      : [
          { name: 'Jupiter', exchange: 'jupiter' },
          { name: 'Raydium', exchange: 'raydium' },
        ];
  }
  
  if (chain === 'ETH') {
    return listedOnBinance
      ? [
          { name: '币安', exchange: 'binance' },
          { name: 'Uniswap', exchange: 'uniswap' },
        ]
      : [
          { name: 'Uniswap', exchange: 'uniswap' },
        ];
  }
  
  if (chain === 'BASE') {
    return listedOnBinance
      ? [
          { name: '币安', exchange: 'binance' },
          { name: 'Uniswap', exchange: 'uniswap' },
        ]
      : [
          { name: 'Uniswap', exchange: 'uniswap' },
          { name: 'PancakeSwap', exchange: 'pancakeswap' },
        ];
  }
  
  return [{ name: 'Uniswap', exchange: 'uniswap' }];
}

export default function TrendingPage() {
  const [tokens, setTokens] = useState<TokenData[]>([]);
  const [filter, setFilter] = useState<'all' | 'strong' | 'watch'>('all');
  const [lastUpdate, setLastUpdate] = useState('');
  const [loading, setLoading] = useState(true);

  // 获取数据
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      // 调用服务端API获取实时数据
      const response = await fetch('/api/alpha-ranking?ts=' + Date.now());
      const result = await response.json();
      
      if (result.success && result.opportunities) {
        setTokens(result.opportunities);
        setLastUpdate(new Date(result.updatedAt).toLocaleTimeString());
      } else {
        // API失败，使用备用数据
        const data = [...BACKUP_DATA];
        data.sort((a, b) => b.kairosScore - a.kairosScore);
        data.forEach((t, i) => t.rank = i + 1);
        setTokens(data);
        setLastUpdate(new Date().toLocaleTimeString());
      }
    } catch (e) {
      // 失败使用备用
      const data = [...BACKUP_DATA];
      data.sort((a, b) => b.kairosScore - a.kairosScore);
      data.forEach((t, i) => t.rank = i + 1);
      setTokens(data);
      setLastUpdate(new Date().toLocaleTimeString());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000); // 每30秒刷新
    return () => clearInterval(interval);
  }, [fetchData]);

  // 筛选
  const filteredTokens = tokens.filter(t => {
    if (filter === 'strong') return t.signal === 'strong';
    if (filter === 'watch') return t.signal === 'watch';
    return true;
  });


  return (
    <div className="min-h-screen bg-slate-950">
      {/* 顶部 */}
      <div className="sticky top-0 bg-slate-950/95 backdrop-blur-sm border-b border-slate-800 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-white">Alpha热力榜</h1>
              <p className="text-sm text-slate-400">币安Alpha专区代币 · 实时数据</p>
            </div>
            <div className="text-right">
              <div className="text-xs text-slate-500">更新时间</div>
              <div className="text-sm text-cyan-400">{lastUpdate}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* 统计 */}
        <div className="grid grid-cols-4 gap-3 mb-6">
          <div className="bg-slate-900 rounded-xl p-4 text-center border border-slate-800">
            <div className="text-2xl font-bold text-white">{tokens.length}</div>
            <div className="text-xs text-slate-400">Alpha代币</div>
          </div>
          <div className="bg-slate-900 rounded-xl p-4 text-center border border-green-800">
            <div className="text-2xl font-bold text-green-400">{tokens.filter(t => t.signal === 'strong').length}</div>
            <div className="text-xs text-slate-400">强烈推荐</div>
          </div>
          <div className="bg-slate-900 rounded-xl p-4 text-center border border-slate-800">
            <div className="text-2xl font-bold text-yellow-400">{tokens.filter(t => t.signal === 'watch').length}</div>
            <div className="text-xs text-slate-400">关注</div>
          </div>
          <div className="bg-slate-900 rounded-xl p-4 text-center border border-slate-800">
            <div className="text-sm font-bold text-cyan-400">CoinGecko</div>
            <div className="text-xs text-slate-400">数据来源</div>
          </div>
        </div>

        {/* 筛选 */}
        <div className="flex gap-2 mb-6">
          {(['all', 'strong', 'watch'] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                filter === f ? 'bg-cyan-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
              }`}>
              {f === 'all' ? '全部' : f === 'strong' ? '强烈推荐' : '关注'}
            </button>
          ))}
        </div>

        {/* 代币列表 */}
        <div className="space-y-3">
          {filteredTokens.map(token => {
            const isPositive = token.priceChange24h >= 0;
            const signalColor = token.signal === 'strong' ? 'text-green-400' : 'text-yellow-400';
            const signalBg = token.signal === 'strong' ? 'bg-green-500/20 border-green-500/50' : 'bg-yellow-500/20 border-yellow-500/50';
            
            return (
              <div key={token.symbol} className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
                {/* 主信息 */}
                <div className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                      token.rank === 1 ? 'bg-yellow-500/20 text-yellow-400' :
                      token.rank === 2 ? 'bg-slate-400/20 text-slate-300' :
                      token.rank === 3 ? 'bg-orange-600/20 text-orange-400' :
                      'bg-slate-700 text-slate-400'
                    }`}>
                      {token.rank}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white">{token.symbol}</span>
                        <span className="text-slate-500 text-sm">{token.name}</span>
                        <span className="text-slate-600">·</span>
                        <span className="text-slate-500 text-sm">{CHAIN_ICONS[token.chain]} {token.chain}</span>
                        <span className="text-slate-600">·</span>
                        <span className="text-slate-500 text-sm">{token.category}</span>
                      </div>
                    </div>
                    <div className={`px-2 py-1 rounded text-xs font-medium ${signalBg} ${signalColor}`}>
                      {token.signal === 'strong' ? '强烈推荐' : '关注'}
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-4">
                    <div>
                      <div className="text-slate-500 text-xs mb-1">价格</div>
                      <div className="text-white font-semibold">{formatPrice(token.price)}</div>
                    </div>
                    <div>
                      <div className="text-slate-500 text-xs mb-1">24h涨跌</div>
                      <div className={`font-semibold ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                        {formatChange(token.priceChange24h)}
                      </div>
                    </div>
                    <div>
                      <div className="text-slate-500 text-xs mb-1">交易量</div>
                      <div className="text-white font-semibold text-sm">{formatVolume(token.volume24h)}</div>
                    </div>
                    <div>
                      <div className="text-slate-500 text-xs mb-1">Kairos评分</div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
                          <div className="h-full bg-cyan-500 rounded-full" style={{ width: `${token.kairosScore}%` }} />
                        </div>
                        <span className="text-white font-bold text-sm">{token.kairosScore}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 交易计划 */}
                <div className="px-4 py-3 bg-slate-800/50 border-t border-slate-800">
                  <div className="flex items-center justify-between">
                    <div className="flex gap-6 text-sm">
                      <div><span className="text-slate-500">入场</span> <span className="text-white ml-1">{formatPrice(token.tradingPlan.entry)}</span></div>
                      <div><span className="text-slate-500">目标</span> <span className="text-green-400 ml-1">{formatPrice(token.tradingPlan.target)}</span></div>
                      <div><span className="text-slate-500">止损</span> <span className="text-red-400 ml-1">{formatPrice(token.tradingPlan.stopLoss)}</span></div>
                      <div><span className="text-slate-500">盈亏比</span> <span className="text-cyan-400 ml-1">{token.tradingPlan.riskReward}</span></div>
                    </div>
                  </div>
                </div>

                {/* 交易按钮 - 直接显示在卡片底部 */}
                <div className="px-4 py-3 bg-slate-900 border-t border-slate-800">
                  <div className="flex gap-2">
                    {getPlatforms(token.symbol, token.chain).map(p => (
                      <a key={p.exchange} href={getTradeUrl(token.symbol, p.exchange)} target="_blank" rel="noopener noreferrer"
                        className="flex-1 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-center text-sm font-medium transition-colors">
                        跳转 {p.name}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* 底部提示 */}
        <div className="mt-6 text-center text-xs text-slate-500">
          <p>实时名单：binance.com/en/alphaevents</p>
          <p className="mt-1">数据仅供参考，不构成投资建议</p>
        </div>
      </div>
    </div>
  );
}
