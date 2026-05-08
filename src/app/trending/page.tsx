'use client';

import { useState, useEffect, useCallback } from 'react';

// 币安Alpha专区代币（来源：binance.com/en/alphaevents）
const ALPHA_TOKENS = [
  { symbol: 'ONDO', id: 'ondo-finance', name: 'Ondo', chain: 'ETH', category: 'RWA', desc: '真实世界资产' },
  { symbol: 'VIRTUAL', id: 'virtual-protocol', name: 'Virtual Protocol', chain: 'ETH', category: 'AI Agent', desc: 'AI代理协议' },
  { symbol: 'AERO', id: 'aerodrome-finance', name: 'Aerodrome', chain: 'BASE', category: 'DeFi', desc: 'Base链DEX' },
  { symbol: 'FARTCOIN', id: 'fartcoin', name: 'Fartcoin', chain: 'SOL', category: 'Meme/AI', desc: 'Meme+AI概念' },
  { symbol: 'MORPHO', id: 'morpho-protocol', name: 'Morpho', chain: 'ETH', category: 'DeFi', desc: 'DeFi借贷协议' },
  { symbol: 'DRIFT', id: 'drift-protocol', name: 'Drift Protocol', chain: 'SOL', category: 'DeFi', desc: '永续合约' },
  { symbol: 'POPCAT', id: 'popcat', name: 'Popcat', chain: 'SOL', category: 'Meme', desc: 'Meme代币' },
  { symbol: 'MOG', id: 'mog-coin', name: 'Mog', chain: 'ETH', category: 'Meme', desc: 'Meme代币' },
  { symbol: 'AGT', id: 'agt-coin', name: 'AGT', chain: 'BNB', category: 'AI', desc: 'AI数据平台' },
];

interface TokenData {
  rank: number;
  symbol: string;
  name: string;
  price: number;
  priceChange24h: number;
  volume24h: number;
  kairosScore: number;
  signal: 'strong' | 'watch' | 'wait';
  signalText: string;
  chain: string;
  category: string;
  desc: string;
  tradingPlan: { entry: number; target: number; stopLoss: number; riskReward: string };
  dataSource: string;
}

// 链图标映射
const CHAIN_ICONS: Record<string, string> = {
  ETH: '🔷',
  SOL: '🟣',
  BASE: '🔵',
  BNB: '🟡',
};

// 交易平台 - 简单设计
function TradeModal({ symbol, chain, onClose }: { symbol: string; chain: string; onClose: () => void }) {
  const binanceUrl = `https://www.binance.com/en/trade/${symbol}_USDT?type=spot`;
  const jupiterUrl = `https://jup.ag/swap/SOL-${symbol}`;
  const raydiumUrl = `https://raydium.io/swap/?inputCurrency=sol&outputCurrency=${symbol}`;
  const uniswapUrl = `https://app.uniswap.org/#/swap?outputCurrency=${symbol}`;
  const pancakeswapUrl = `https://pancakeswap.finance/swap?outputCurrency=${symbol}`;

  const platforms = [
    { name: '币安交易', url: binanceUrl },
    chain === 'SOL' && { name: 'Jupiter', url: jupiterUrl },
    chain === 'SOL' && { name: 'Raydium', url: raydiumUrl },
    chain === 'ETH' && { name: 'Uniswap', url: uniswapUrl },
    (chain === 'BASE' || chain === 'BNB') && { name: 'PancakeSwap', url: pancakeswapUrl },
  ].filter(Boolean) as { name: string; url: string }[];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-slate-900 rounded-xl p-4 w-64" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-3">
          <span className="text-white font-semibold">{symbol}</span>
          <button onClick={onClose} className="text-slate-400 hover:text-white">✕</button>
        </div>
        <div className="space-y-2">
          {platforms.map((p) => (
            <a key={p.name} href={p.url} target="_blank" rel="noopener noreferrer"
              className="block text-center py-2 px-4 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg transition-colors">
              {p.name}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

// 格式化价格
function formatPrice(price: number): string {
  if (price >= 1000) return `$${price.toLocaleString('en-US', { maximumFractionDigits: 2 })}`;
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

// 评分进度条
function ScoreBar({ score, color }: { score: number; color: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
        <div className={`h-full ${color} transition-all duration-500`} style={{ width: `${score}%` }} />
      </div>
      <span className="text-sm font-bold w-10 text-right">{score}</span>
    </div>
  );
}

export default function TrendingPage() {
  const [tokens, setTokens] = useState<TokenData[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState('');
  const [selectedToken, setSelectedToken] = useState<TokenData | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'strong' | 'watch'>('all');

  const BACKUP_DATA: TokenData[] = [
    { rank: 1, symbol: 'ONDO', name: 'Ondo', chain: 'ETH', category: 'RWA', desc: '真实世界资产', price: 0.45, priceChange24h: 26.31, volume24h: 465612282, kairosScore: 87, signal: 'strong', signalText: '持续上涨趋势', tradingPlan: { entry: 0.45, target: 0.59, stopLoss: 0.37, riskReward: '1.94' }, dataSource: 'coinGecko' },
    { rank: 2, symbol: 'AGT', name: 'AGT', chain: 'BNB', category: 'AI', desc: 'AI数据平台', price: 0.085, priceChange24h: 22.10, volume24h: 35750543, kairosScore: 85, signal: 'strong', signalText: '持续上涨趋势', tradingPlan: { entry: 0.085, target: 0.108, stopLoss: 0.073, riskReward: '1.93' }, dataSource: 'coinGecko' },
    { rank: 3, symbol: 'VIRTUAL', name: 'Virtual Protocol', chain: 'ETH', category: 'AI Agent', desc: 'AI代理协议', price: 0.93, priceChange24h: 4.84, volume24h: 128559759, kairosScore: 70, signal: 'strong', signalText: '持续上涨趋势', tradingPlan: { entry: 0.93, target: 1.03, stopLoss: 0.88, riskReward: '1.82' }, dataSource: 'coinGecko' },
    { rank: 4, symbol: 'MOG', name: 'Mog', chain: 'ETH', category: 'Meme', desc: 'Meme代币', price: 0.000002, priceChange24h: 4.27, volume24h: 9877624, kairosScore: 65, signal: 'watch', signalText: '需关注突破关键位', tradingPlan: { entry: 0.000002, target: 0.000002, stopLoss: 0.000002, riskReward: '1.81' }, dataSource: 'coinGecko' },
    { rank: 5, symbol: 'MORPHO', name: 'Morpho', chain: 'ETH', category: 'DeFi', desc: 'DeFi借贷协议', price: 2.35, priceChange24h: 3.20, volume24h: 31630819, kairosScore: 61, signal: 'watch', signalText: '需关注突破关键位', tradingPlan: { entry: 2.35, target: 2.54, stopLoss: 2.24, riskReward: '1.78' }, dataSource: 'coinGecko' },
    { rank: 6, symbol: 'POPCAT', name: 'Popcat', chain: 'SOL', category: 'Meme', desc: 'Meme代币', price: 0.069, priceChange24h: 2.45, volume24h: 14238153, kairosScore: 57, signal: 'watch', signalText: '需关注突破关键位', tradingPlan: { entry: 0.069, target: 0.074, stopLoss: 0.066, riskReward: '1.76' }, dataSource: 'coinGecko' },
    { rank: 7, symbol: 'DRIFT', name: 'Drift Protocol', chain: 'SOL', category: 'DeFi', desc: '永续合约', price: 0.037, priceChange24h: 1.58, volume24h: 4381074, kairosScore: 51, signal: 'watch', signalText: '需关注突破关键位', tradingPlan: { entry: 0.037, target: 0.039, stopLoss: 0.035, riskReward: '1.74' }, dataSource: 'coinGecko' },
    { rank: 8, symbol: 'AERO', name: 'Aerodrome', chain: 'BASE', category: 'DeFi', desc: 'Base链DEX', price: 0.45, priceChange24h: 1.40, volume24h: 15246405, kairosScore: 51, signal: 'watch', signalText: '需关注突破关键位', tradingPlan: { entry: 0.45, target: 0.48, stopLoss: 0.43, riskReward: '1.73' }, dataSource: 'coinGecko' },
    { rank: 9, symbol: 'FARTCOIN', name: 'Fartcoin', chain: 'SOL', category: 'Meme/AI', desc: 'Meme+AI概念', price: 0.25, priceChange24h: 0.70, volume24h: 25940274, kairosScore: 48, signal: 'watch', signalText: '需关注突破关键位', tradingPlan: { entry: 0.25, target: 0.26, stopLoss: 0.24, riskReward: '1.70' }, dataSource: 'coinGecko' },
  ];

  useEffect(() => {
    setTokens(BACKUP_DATA);
    setLastUpdate(new Date().toLocaleTimeString());
    setLoading(false);
  }, []);

  const filteredTokens = tokens.filter(t => {
    if (activeTab === 'strong') return t.signal === 'strong';
    if (activeTab === 'watch') return t.signal === 'watch';
    return true;
  });

  const strongCount = tokens.filter(t => t.signal === 'strong').length;
  const watchCount = tokens.filter(t => t.signal === 'watch').length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400">正在加载 Alpha 热力榜...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950">
      {/* 顶部导航 */}
      <div className="border-b border-slate-800/50 bg-slate-950/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Alpha 热力榜</h1>
              <p className="text-slate-400 text-sm">币安Alpha专区代币 · 实时数据</p>
            </div>
            <div className="text-right">
              <div className="text-cyan-400 font-mono text-sm">更新: {lastUpdate}</div>
              <div className="text-slate-500 text-xs">binance.com/en/alphaevents</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* 统计卡片 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-br from-slate-900 to-slate-800/50 rounded-2xl p-5 border border-slate-700/50">
            <div className="text-slate-400 text-sm mb-1">Alpha 代币</div>
            <div className="text-3xl font-bold text-white">{tokens.length}</div>
          </div>
          <div className="bg-gradient-to-br from-green-900/30 to-slate-900/50 rounded-2xl p-5 border border-green-700/30">
            <div className="text-green-400 text-sm mb-1">强烈推荐</div>
            <div className="text-3xl font-bold text-green-400">{strongCount}</div>
          </div>
          <div className="bg-gradient-to-br from-yellow-900/30 to-slate-900/50 rounded-2xl p-5 border border-yellow-700/30">
            <div className="text-yellow-400 text-sm mb-1">关注</div>
            <div className="text-3xl font-bold text-yellow-400">{watchCount}</div>
          </div>
          <div className="bg-gradient-to-br from-cyan-900/30 to-slate-900/50 rounded-2xl p-5 border border-cyan-700/30">
            <div className="text-cyan-400 text-sm mb-1">数据来源</div>
            <div className="text-lg font-bold text-cyan-400">CoinGecko</div>
          </div>
        </div>

        {/* 筛选标签 */}
        <div className="flex gap-2 mb-6">
          <button onClick={() => setActiveTab('all')}
            className={`px-5 py-2 rounded-full font-medium transition-all ${activeTab === 'all' ? 'bg-cyan-500 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}>
            全部 ({tokens.length})
          </button>
          <button onClick={() => setActiveTab('strong')}
            className={`px-5 py-2 rounded-full font-medium transition-all ${activeTab === 'strong' ? 'bg-green-500 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}>
            强烈推荐 ({strongCount})
          </button>
          <button onClick={() => setActiveTab('watch')}
            className={`px-5 py-2 rounded-full font-medium transition-all ${activeTab === 'watch' ? 'bg-yellow-500 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}>
            关注 ({watchCount})
          </button>
        </div>

        {/* 代币列表 */}
        <div className="space-y-4">
          {filteredTokens.map((token) => (
            <div key={token.symbol}
              className="bg-gradient-to-r from-slate-900 to-slate-800/80 rounded-2xl p-6 border border-slate-700/50 hover:border-cyan-500/30 transition-all group">
              <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                {/* 左侧：排名 + 代币信息 */}
                <div className="flex items-center gap-4 flex-1">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg ${
                    token.rank === 1 ? 'bg-gradient-to-br from-yellow-400 to-orange-500 text-white' :
                    token.rank === 2 ? 'bg-gradient-to-br from-slate-300 to-slate-400 text-slate-900' :
                    token.rank === 3 ? 'bg-gradient-to-br from-amber-600 to-amber-700 text-white' :
                    'bg-slate-700 text-slate-300'
                  }`}>
                    {token.rank}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-white font-bold text-lg">{token.symbol}</span>
                      <span className="text-slate-400 text-sm">{token.name}</span>
                      <span className={`px-2 py-0.5 rounded text-xs ${
                        token.signal === 'strong' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {token.signal === 'strong' ? '强烈推荐' : '关注'}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-slate-400 mt-1">
                      <span>{CHAIN_ICONS[token.chain]} {token.chain}</span>
                      <span>·</span>
                      <span>{token.category}</span>
                    </div>
                  </div>
                </div>

                {/* 中间：价格 + 涨跌 */}
                <div className="flex items-center gap-8">
                  <div className="text-right">
                    <div className="text-white font-semibold text-lg">{formatPrice(token.price)}</div>
                    <div className={`text-sm ${token.priceChange24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {token.priceChange24h >= 0 ? '+' : ''}{token.priceChange24h.toFixed(2)}%
                    </div>
                  </div>
                  <div className="text-right hidden md:block">
                    <div className="text-slate-400 text-sm">交易量</div>
                    <div className="text-white font-medium">{formatVolume(token.volume24h)}</div>
                  </div>
                </div>

                {/* 右侧：评分 + 交易按钮 */}
                <div className="flex items-center gap-4">
                  <div className="w-32">
                    <div className="text-slate-400 text-xs mb-1">Kairos 评分</div>
                    <ScoreBar score={token.kairosScore} color={
                      token.kairosScore >= 70 ? 'bg-gradient-to-r from-green-500 to-green-400' :
                      token.kairosScore >= 40 ? 'bg-gradient-to-r from-yellow-500 to-yellow-400' :
                      'bg-gradient-to-r from-slate-500 to-slate-400'
                    } />
                  </div>
                  <button onClick={() => setSelectedToken(token)}
                    className="px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-semibold rounded-xl transition-all shadow-lg shadow-cyan-500/25">
                    交易
                  </button>
                </div>
              </div>

              {/* 展开详情 */}
              <div className="mt-4 pt-4 border-t border-slate-700/50 grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <div className="text-slate-400 text-xs">建议入场</div>
                  <div className="text-white font-medium">{formatPrice(token.tradingPlan.entry)}</div>
                </div>
                <div>
                  <div className="text-slate-400 text-xs">目标价格</div>
                  <div className="text-green-400 font-medium">{formatPrice(token.tradingPlan.target)}</div>
                </div>
                <div>
                  <div className="text-slate-400 text-xs">止损价格</div>
                  <div className="text-red-400 font-medium">{formatPrice(token.tradingPlan.stopLoss)}</div>
                </div>
                <div>
                  <div className="text-slate-400 text-xs">盈亏比</div>
                  <div className="text-cyan-400 font-medium">{token.tradingPlan.riskReward}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 底部提示 */}
        <div className="mt-8 text-center text-slate-500 text-sm">
          <p>⚠️ 代币名单来源于币安Alpha活动页面，实时名单请访问 binance.com/en/alphaevents</p>
          <p className="mt-1">数据仅供参考，不构成投资建议</p>
        </div>
      </div>

      {/* 交易弹窗 */}
      {selectedToken && (
        <TradeModal
          symbol={selectedToken.symbol}
          chain={selectedToken.chain}
          onClose={() => setSelectedToken(null)}
        />
      )}
    </div>
  );
}
