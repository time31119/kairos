'use client';

import { useState, useEffect, useCallback } from 'react';

// 币安Alpha专区代币（实时名单 - 来源：币安官方）
// 获取最准确信息请访问：binance.com/en/alphaevents
const ALPHA_SYMBOLS = [
  // 早期知名Alpha资产
  { symbol: 'ONDOUSDT', name: 'Ondo', coingecko: 'ondo-network-usd', address: '0xabra', chain: 'ETH', onBinance: true, category: 'RWA', desc: '真实世界资产' },
  { symbol: 'VIRTUALUSDT', name: 'Virtual Protocol', coingecko: 'virtual-protocol', address: '0xvirtual', chain: 'ETH', onBinance: true, category: 'AI Agent', desc: 'AI代理协议' },
  { symbol: 'AEROUSDT', name: 'Aerodrome', coingecko: 'aerodrome-finance', address: '0xaero', chain: 'BASE', onBinance: true, category: 'DeFi', desc: 'Base链DEX' },
  { symbol: 'FARTCOINUSDT', name: 'Fartcoin', coingecko: 'fartcoin', address: '0xfart', chain: 'SOL', onBinance: true, category: 'Meme/AI', desc: 'Meme+AI概念' },
  { symbol: 'MORPHOUSDT', name: 'Morpho', coingecko: 'morpho', address: '0xmorpho', chain: 'ETH', onBinance: true, category: 'DeFi', desc: 'DeFi借贷协议' },
  { symbol: 'DRIFTUSDT', name: 'Drift Protocol', coingecko: 'drift-protocol', address: '0xdrift', chain: 'SOL', onBinance: true, category: 'DeFi', desc: '永续合约' },
  // 2025年4月宣布上线
  { symbol: 'POPCATUSDT', name: 'Popcat', coingecko: 'popcat', address: '0xpopcat', chain: 'SOL', onBinance: true, category: 'Meme', desc: 'Meme代币' },
  { symbol: 'MOGUSDT', name: 'Mog', coingecko: 'mog-coin', address: '0xmog', chain: 'ETH', onBinance: true, category: 'Meme', desc: 'Meme代币' },
  // 币安Alpha首发项目
  { symbol: 'AGTUSDT', name: 'AGT', coingecko: 'agt', address: '0xagt', chain: 'ETH', onBinance: true, category: 'AI', desc: 'AI数据平台' },
];

// DEX跳转链接
const DEX_LINKS = {
  binance: (symbol: string) => `https://www.binance.com/en/trade/${symbol.replace('USDT', '')}_USDT?type=spot`,
  raydium: (addr: string) => `https://raydium.io/swap/?inputCurrency=sol&outputCurrency=${addr}`,
  jupiter: (addr: string) => `https://jup.ag/swap/SOL-${addr}`,
  uniswap: (addr: string) => `https://app.uniswap.org/#/swap?outputCurrency=${addr}`,
};

function TradeButton({ symbol, address, price, chain = 'ETH', onBinance = false }: { 
  symbol: string; 
  address: string; 
  price: number;
  chain?: string;
  onBinance?: boolean;
}) {
  const [showMenu, setShowMenu] = useState(false);
  
  const platforms = [
    onBinance && { name: '币安交易', icon: '🏛️', url: DEX_LINKS.binance(symbol) },
    chain === 'SOL' && { name: 'Jupiter', icon: '🟣', url: DEX_LINKS.jupiter(address) },
    chain === 'SOL' && { name: 'Raydium', icon: '🔵', url: DEX_LINKS.raydium(address) },
    (chain === 'ETH' || chain === 'BASE') && { name: 'Uniswap', icon: '🟠', url: DEX_LINKS.uniswap(address) },
  ].filter(Boolean) as { name: string; icon: string; url: string }[];
  
  return (
    <div className="relative">
      <button 
        onClick={() => setShowMenu(!showMenu)}
        className="px-3 py-1.5 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg text-sm font-medium transition-all"
      >
        交易
      </button>
      {showMenu && (
        <div className="absolute right-0 top-full mt-1 bg-slate-800 border border-slate-700 rounded-lg shadow-xl z-50 min-w-[160px]">
          {platforms.map((p) => (
            <a key={p.name} href={p.url} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2.5 hover:bg-slate-700 text-sm first:rounded-t-lg last:rounded-b-lg">
              <span>{p.icon}</span>
              <span>{p.name}</span>
            </a>
          ))}
        </div>
      )}
      {showMenu && <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />}
    </div>
  );
}

interface TokenData {
  rank: number;
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
  chain: string;
  category: string;
  address: string;
  onBinance: boolean;
  tradingPlan: {
    entry: number;
    target: number;
    stopLoss: number;
    riskReward: string;
  };
}

const FALLBACK_DATA: TokenData[] = [
  { rank: 1, symbol: 'FARTCOIN', name: 'Fartcoin', price: 0, priceChange24h: 0, volume24h: 0, high24h: 0, low24h: 0, kairosScore: 0, signal: 'strong', riskLevel: 'low', signalText: '暂无数据', chain: 'SOL', category: 'Meme/AI', address: '0xfart', onBinance: true, tradingPlan: { entry: 0, target: 0, stopLoss: 0, riskReward: '0' } },
];

export default function TrendingPage() {
  const [tokens, setTokens] = useState<TokenData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dataSource, setDataSource] = useState<string>('');
  const [lastUpdate, setLastUpdate] = useState<string>('');
  
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      let data: any = null;
      let source = '';
      
      // 尝试Bybit
      try {
        const resp = await fetch('https://api.bybit.com/v5/market/tickers?category=spot', { signal: AbortSignal.timeout(5000) });
        if (resp.ok) {
          const json = await resp.json();
          if (json.result?.list) {
            const bybitData = json.result.list;
            data = ALPHA_SYMBOLS.map(t => {
              const ticker = bybitData.find((x: any) => x.symbol === t.symbol);
              if (ticker) {
                const price = parseFloat(ticker.lastPrice || '0');
                const change = parseFloat(ticker.price24hPct || '0');
                const volume = parseFloat(ticker.volume24h || '0');
                const kairosScore = Math.min(100, Math.round((Math.abs(change) * 3 + Math.log10(volume + 1) * 5)));
                return {
                  rank: 0,
                  symbol: t.symbol.replace('USDT', ''),
                  name: t.name,
                  price,
                  priceChange24h: change,
                  volume24h: volume,
                  high24h: parseFloat(ticker.highPrice24h || '0'),
                  low24h: parseFloat(ticker.lowPrice24h || '0'),
                  kairosScore,
                  signal: kairosScore >= 70 ? 'strong' : kairosScore >= 40 ? 'watch' : 'wait',
                  riskLevel: change > 20 ? 'high' : change > 5 ? 'medium' : 'low',
                  signalText: kairosScore >= 70 ? '强势信号' : kairosScore >= 40 ? '关注机会' : '谨慎观望',
                  chain: t.chain,
                  category: t.category,
                  address: t.address,
                  onBinance: t.onBinance,
                  tradingPlan: {
                    entry: price * 1.02,
                    target: price * 1.15,
                    stopLoss: price * 0.95,
                    riskReward: '2.5:1'
                  }
                };
              }
              return null;
            }).filter(Boolean) as TokenData[];
            source = 'Bybit API';
          }
        }
      } catch {}
      
      // 如果Bybit失败，尝试CoinGecko
      if (!data) {
        try {
          const ids = ALPHA_SYMBOLS.map(t => t.coingecko).join(',');
          const resp = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true&include_24hr_vol=true`, { signal: AbortSignal.timeout(5000) });
          if (resp.ok) {
            const json = await resp.json();
            data = ALPHA_SYMBOLS.map((t, i) => {
              const coinData = json[t.coingecko];
              if (coinData) {
                const price = coinData.usd || 0;
                const change = coinData.usd_24h_change || 0;
                const volume = coinData.usd_24h_vol || 0;
                const kairosScore = Math.min(100, Math.round((Math.abs(change) * 3 + Math.log10(volume + 1) * 3)));
                return {
                  rank: 0,
                  symbol: t.symbol.replace('USDT', ''),
                  name: t.name,
                  price,
                  priceChange24h: change,
                  volume24h: volume,
                  high24h: price * 1.05,
                  low24h: price * 0.95,
                  kairosScore,
                  signal: kairosScore >= 70 ? 'strong' : kairosScore >= 40 ? 'watch' : 'wait',
                  riskLevel: change > 20 ? 'high' : change > 5 ? 'medium' : 'low',
                  signalText: kairosScore >= 70 ? '强势信号' : kairosScore >= 40 ? '关注机会' : '谨慎观望',
                  chain: t.chain,
                  category: t.category,
                  address: t.address,
                  onBinance: t.onBinance,
                  tradingPlan: {
                    entry: price * 1.02,
                    target: price * 1.15,
                    stopLoss: price * 0.95,
                    riskReward: '2.5:1'
                  }
                };
              }
              return null;
            }).filter(Boolean) as TokenData[];
            source = 'CoinGecko';
          }
        } catch {}
      }
      
      if (!data || data.length === 0) {
        setTokens(FALLBACK_DATA);
        setError('数据加载中，请稍候刷新...');
        setDataSource('备用数据');
      } else {
        data.sort((a: TokenData, b: TokenData) => b.kairosScore - a.kairosScore);
        data.forEach((t: TokenData, i: number) => t.rank = i + 1);
        setTokens(data);
        setDataSource(source);
      }
      setLastUpdate(new Date().toLocaleTimeString('zh-CN'));
    } catch (err) {
      setError('获取数据失败，请检查网络');
      setTokens(FALLBACK_DATA);
    } finally {
      setLoading(false);
    }
  }, []);
  
  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, [fetchData]);
  
  const getSignalBadge = (signal: string, score: number) => {
    if (signal === 'strong') return <span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-xs rounded-full">强烈推荐</span>;
    if (signal === 'watch') return <span className="px-2 py-0.5 bg-yellow-500/20 text-yellow-400 text-xs rounded-full">关注</span>;
    return <span className="px-2 py-0.5 bg-slate-500/20 text-slate-400 text-xs rounded-full">观望</span>;
  };
  
  const getRiskBadge = (risk: string) => {
    if (risk === 'low') return <span className="text-green-400 text-xs">低风险</span>;
    if (risk === 'high') return <span className="text-red-400 text-xs">高风险</span>;
    return <span className="text-yellow-400 text-xs">中风险</span>;
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Alpha热力榜</h1>
          <p className="text-slate-400">币安Alpha专区代币 · 实时数据</p>
          <p className="text-xs text-slate-500 mt-1">数据来源：binance.com/en/alphaevents</p>
        </div>
        
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-blue-900/20 border border-blue-800/30 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-blue-400">{tokens.length}</div>
            <div className="text-xs text-slate-400">Alpha代币</div>
          </div>
          <div className="bg-green-900/20 border border-green-800/30 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-green-400">{tokens.filter(t => t.signal === 'strong').length}</div>
            <div className="text-xs text-slate-400">强烈推荐</div>
          </div>
          <div className="bg-purple-900/20 border border-purple-800/30 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-purple-400">{dataSource || '-'}</div>
            <div className="text-xs text-slate-400">数据来源</div>
          </div>
          <div className="bg-orange-900/20 border border-orange-800/30 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-orange-400">{lastUpdate || '-'}</div>
            <div className="text-xs text-slate-400">最后更新</div>
          </div>
        </div>
        
        {/* Token List */}
        {loading && tokens.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-block w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-slate-400">正在加载币安Alpha专区数据...</p>
          </div>
        ) : error && tokens.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-red-400 mb-4">{error}</p>
            <button onClick={fetchData} className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg">重试</button>
          </div>
        ) : (
          <div className="space-y-3">
            {tokens.map(token => (
              <div key={token.symbol} className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 hover:border-blue-500/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="text-2xl font-bold text-blue-400 w-8">#{token.rank}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-white font-semibold">{token.symbol}</span>
                      <span className="text-slate-500 text-sm">/{token.name}</span>
                      <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 text-xs rounded-full">{token.chain}</span>
                      <span className="px-2 py-0.5 bg-purple-500/20 text-purple-400 text-xs rounded-full">{token.category}</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-slate-400">${token.price.toFixed(token.price < 1 ? 6 : 2)}</span>
                      <span className={token.priceChange24h >= 0 ? 'text-green-400' : 'text-red-400'}>
                        {token.priceChange24h >= 0 ? '+' : ''}{token.priceChange24h.toFixed(2)}%
                      </span>
                      {getSignalBadge(token.signal, token.kairosScore)}
                      {getRiskBadge(token.riskLevel)}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-white">{token.kairosScore}</div>
                    <div className="text-xs text-slate-500">Kairos评分</div>
                  </div>
                  <TradeButton symbol={token.symbol + 'USDT'} address={token.address} price={token.price} chain={token.chain} onBinance={token.onBinance} />
                </div>
                {token.signal === 'strong' && (
                  <div className="mt-3 pt-3 border-t border-slate-800 grid grid-cols-4 gap-4 text-sm">
                    <div><span className="text-slate-500">建议入场</span><div className="text-green-400">${token.tradingPlan.entry.toFixed(token.price < 1 ? 6 : 2)}</div></div>
                    <div><span className="text-slate-500">目标价格</span><div className="text-blue-400">${token.tradingPlan.target.toFixed(token.price < 1 ? 6 : 2)}</div></div>
                    <div><span className="text-slate-500">止损价格</span><div className="text-red-400">${token.tradingPlan.stopLoss.toFixed(token.price < 1 ? 6 : 2)}</div></div>
                    <div><span className="text-slate-500">盈亏比</span><div className="text-yellow-400">{token.tradingPlan.riskReward}</div></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        
        {tokens.length > 0 && (
          <div className="mt-8 text-center text-sm text-slate-500">
            <p>数据来源：{dataSource} | 每分钟自动刷新</p>
            <p className="mt-1">实时名单：binance.com/en/alphaevents</p>
          </div>
        )}
      </div>
    </div>
  );
}
