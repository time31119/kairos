'use client';

import Link from 'next/link';
import { useState } from 'react';
import { 
  ArrowLeft, Crown, Shield, Zap, Users, TrendingUp, Gift, Star,
  ChevronRight, Lock, Check, Sparkles, Rocket, Globe, MessageCircle,
  Trophy, Medal, Award, Target, Clock, DollarSign, User, CreditCard
} from 'lucide-react';

const MEMBERSHIP_TIERS = [
  {
    id: 'bronze',
    name: 'Bronze',
    icon: Medal,
    color: 'from-amber-600 to-amber-800',
    borderColor: 'border-amber-600',
    textColor: 'text-amber-400',
    price: 0,
    requirement: '免费注册',
    features: [
      '每日3条Alpha信号',
      '基础社区访问',
      '公开策略讨论',
      '新手入门指南',
    ],
    notIncluded: [
      'VIP专属Alpha',
      '优先购买权限',
      '1v1策略咨询',
      '线下活动邀请',
    ],
    stats: { members: '12,847', active: '34%' },
  },
  {
    id: 'silver',
    name: 'Silver',
    icon: Star,
    color: 'from-slate-300 to-slate-500',
    borderColor: 'border-slate-400',
    textColor: 'text-slate-300',
    price: 99,
    period: '/月',
    requirement: '月交易量 > $10,000',
    features: [
      '全部Bronze权益',
      '每日10条精选Alpha',
      'Silver专属社区',
      '聪明钱追踪工具',
      '实时价格预警',
      '历史数据分析',
    ],
    notIncluded: [
      'VIP专属Alpha',
      '优先购买权限',
      '1v1策略咨询',
    ],
    stats: { members: '3,241', active: '67%' },
    popular: true,
  },
  {
    id: 'gold',
    name: 'Gold',
    icon: Trophy,
    color: 'from-yellow-400 to-yellow-600',
    borderColor: 'border-yellow-400',
    textColor: 'text-yellow-400',
    price: 299,
    period: '/月',
    requirement: '月交易量 > $50,000',
    features: [
      '全部Silver权益',
      '无限制Alpha信号',
      'Gold专属私密群',
      '机构级深度报告',
      '新币首发预警',
      '组合持仓建议',
      '24h优先级支持',
      '推荐奖励20%佣金',
    ],
    notIncluded: [
      'Diamond专属服务',
    ],
    stats: { members: '856', active: '82%' },
  },
  {
    id: 'diamond',
    name: 'Diamond',
    icon: Crown,
    color: 'from-blue-400 to-purple-600',
    borderColor: 'border-blue-400',
    textColor: 'text-blue-400',
    price: '定制',
    requirement: '月交易量 > $500,000 或 持仓 $100K+',
    features: [
      '全部Gold权益',
      '一对一专属顾问',
      '私募项目优先权',
      '链上仓位监控',
      '定制化投资组合',
      '优先体验新功能',
      '线下高端聚会',
      '投资社区人脉',
      '推荐奖励30%佣金',
      'API深度集成',
    ],
    notIncluded: [],
    stats: { members: '127', active: '94%' },
    vip: true,
  },
];

const EXCLUSIVE_BENEFITS = [
  {
    icon: Zap,
    title: '实时Alpha信号',
    description: '比市场快5-30分钟的买入信号，基于链上数据+AI预测',
    tag: '每日推送',
    tier: 'Silver+',
  },
  {
    icon: Rocket,
    title: '私募项目优先权',
    description: '第一时间获取优质私募份额，Diamond会员独家白名单',
    tag: '高收益',
    tier: 'Gold+',
  },
  {
    icon: TrendingUp,
    title: '聪明钱追踪',
    description: '追踪顶级操盘手的链上地址，跟随买入卖出',
    tag: '复制跟单',
    tier: 'Silver+',
  },
  {
    icon: Shield,
    title: '风险预警',
    description: '实时监控异常交易，第一时间预警Rug Pull风险',
    tag: '安全',
    tier: '所有会员',
  },
  {
    icon: MessageCircle,
    title: '私密社区',
    description: '与专业交易者直接交流，获取一手市场洞察',
    tag: '社交',
    tier: 'Gold+',
  },
  {
    icon: Gift,
    title: '推荐奖励',
    description: '成功推荐好友加入，双方获得额外30天会员时长',
    tag: '奖励',
    tier: 'Gold+',
  },
];

const LEADERBOARD = [
  { rank: 1, name: '0x7a3...f2e1', tier: 'Diamond', profit: '+247.8%', trades: 342, winRate: '87%' },
  { rank: 2, name: '0x4b8...c9d3', tier: 'Gold', profit: '+189.3%', trades: 289, winRate: '82%' },
  { rank: 3, name: '0x2c5...a7f6', tier: 'Gold', profit: '+156.2%', trades: 256, winRate: '79%' },
  { rank: 4, name: '0x9d1...e4b8', tier: 'Silver', profit: '+134.7%', trades: 198, winRate: '76%' },
  { rank: 5, name: '0x6f2...b3c5', tier: 'Silver', profit: '+112.4%', trades: 167, winRate: '74%' },
];

const RECENT_ALPHA = [
  { token: 'FWOG', signal: '买入', price: '$0.0234', target: '$0.045', return: '+92%', time: '2小时前', tier: 'Silver+' },
  { token: 'PNUT', signal: '买入', price: '$0.342', target: '$0.58', return: '+69%', time: '5小时前', tier: 'Gold+' },
  { token: 'POPCAT', signal: '加仓', price: '$0.891', target: '$1.24', return: '+39%', time: '8小时前', tier: 'Silver+' },
  { token: 'NEIRO', signal: '买入', price: '$0.0156', target: '$0.028', return: '+79%', time: '12小时前', tier: 'Silver+' },
];

export default function AlphaClubPage() {
  const [selectedTier, setSelectedTier] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900">
      {/* 导航栏 */}
      <nav className="border-b border-blue-900/30 bg-slate-950/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-2xl font-bold text-white">
                <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  Kairos
                </span>
              </Link>
              <span className="text-xs text-blue-400/60 bg-blue-500/10 px-2 py-1 rounded">
                Alpha Discovery
              </span>
            </div>
            <div className="hidden md:flex items-center space-x-6">
              <Link href="/product" className="text-slate-400 hover:text-white transition">产品</Link>
              <Link href="/pricing" className="text-slate-400 hover:text-white transition">定价</Link>
              <Link href="/about" className="text-slate-400 hover:text-white transition">关于</Link>
              <Link href="/resources" className="text-slate-400 hover:text-white transition">资源</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-blue-600/20 blur-3xl" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/30 mb-6">
              <Crown className="w-4 h-4 text-blue-400" />
              <span className="text-sm text-blue-400">Exclusive Membership</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white">
              Kairos <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Alpha Club</span>
            </h1>
            <p className="text-xl text-slate-400 mb-8 max-w-2xl mx-auto">
              加入全球最顶尖的Alpha发现社区，获取机构级投资信号，与顶级交易者并肩作战
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <div className="flex items-center gap-2 text-slate-400">
                <Users className="w-4 h-4 text-blue-400" />
                <span className="text-white font-semibold">17,071</span> 会员
              </div>
              <div className="flex items-center gap-2 text-slate-400">
                <TrendingUp className="w-4 h-4 text-green-400" />
                <span className="text-white font-semibold">¥2.3M+</span> 会员累计收益
              </div>
              <div className="flex items-center gap-2 text-slate-400">
                <Star className="w-4 h-4 text-yellow-400" />
                <span className="text-white font-semibold">78%</span> 平均胜率
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Exclusive Benefits */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">专属权益</h2>
          <p className="text-slate-400">会员独享的特权与功能</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {EXCLUSIVE_BENEFITS.map((benefit, i) => (
            <div key={i} className="p-6 rounded-2xl bg-slate-800/50 border border-blue-900/30 hover:border-blue-500/50 transition group">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 rounded-xl bg-blue-500/10">
                  <benefit.icon className="w-6 h-6 text-blue-400" />
                </div>
                <span className="text-xs px-2 py-1 rounded-full bg-blue-500/20 text-blue-400">{benefit.tier}</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">{benefit.title}</h3>
              <p className="text-sm text-slate-400">{benefit.description}</p>
              <div className="mt-4 flex items-center gap-1 text-xs text-blue-400 opacity-0 group-hover:opacity-100 transition">
                <Sparkles className="w-3 h-3" />
                {benefit.tag}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Membership Tiers */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">会员等级</h2>
          <p className="text-slate-400">选择最适合您的等级，解锁专属权益</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {MEMBERSHIP_TIERS.map((tier) => {
            const Icon = tier.icon;
            return (
              <div 
                key={tier.id}
                className={`relative p-6 rounded-2xl bg-slate-800/50 border-2 transition-all cursor-pointer hover:scale-105 ${
                  tier.borderColor
                } ${tier.popular ? 'ring-2 ring-blue-500' : ''} ${
                  tier.vip ? 'bg-gradient-to-b from-slate-800/80 to-slate-900/80' : ''
                }`}
                onClick={() => setSelectedTier(tier.id)}
              >
                {tier.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500 text-white">
                    最受欢迎
                  </div>
                )}
                {tier.vip && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                    顶级尊享
                  </div>
                )}
                
                <div className={`p-3 rounded-xl bg-gradient-to-br ${tier.color} w-fit mb-4`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
                
                <h3 className={`text-2xl font-bold ${tier.textColor} mb-1`}>{tier.name}</h3>
                <p className="text-xs text-slate-500 mb-4">{tier.requirement}</p>
                
                <div className="mb-6">
                  {typeof tier.price === 'number' ? (
                    <>
                      <span className="text-3xl font-bold text-white">¥{tier.price}</span>
                      <span className="text-slate-500">{tier.period || '/永久'}</span>
                    </>
                  ) : (
                    <span className="text-3xl font-bold text-white">{tier.price}</span>
                  )}
                </div>

                <div className="flex gap-4 mb-6 text-xs text-slate-500">
                  <div>
                    <div className="text-white font-semibold">{tier.stats.members}</div>
                    <div>会员</div>
                  </div>
                  <div>
                    <div className="text-green-400 font-semibold">{tier.stats.active}</div>
                    <div>活跃率</div>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  {tier.features.map((feature, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm">
                      <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                      <span className="text-slate-300">{feature}</span>
                    </div>
                  ))}
                  {tier.notIncluded.map((feature, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm opacity-50">
                      <Lock className="w-4 h-4 text-slate-600 mt-0.5 flex-shrink-0" />
                      <span className="text-slate-600">{feature}</span>
                    </div>
                  ))}
                </div>

                <button className={`w-full py-3 rounded-full font-semibold transition ${
                  tier.popular 
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:from-blue-500 hover:to-cyan-500'
                    : tier.vip
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-500 hover:to-purple-500'
                    : 'bg-slate-700 text-white hover:bg-slate-600'
                }`}>
                  {tier.price === 0 ? '免费加入' : tier.price === '定制' ? '咨询详情' : '立即订阅'}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Live Alpha Signals */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">最新Alpha信号</h2>
            <p className="text-slate-400">会员专属实时推送</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-sm text-green-400">实时更新中</span>
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="rounded-2xl bg-slate-800/50 border border-blue-900/30 overflow-hidden">
            <div className="p-4 border-b border-blue-900/30 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-400" />
                <span className="font-semibold text-white">最新信号</span>
              </div>
              <span className="text-xs text-slate-500">过去24小时</span>
            </div>
            <div className="divide-y divide-blue-900/30">
              {RECENT_ALPHA.map((signal, i) => (
                <div key={i} className="p-4 flex items-center justify-between hover:bg-blue-900/10 transition">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                      signal.signal === '买入' ? 'bg-green-500/20 text-green-400' : 'bg-blue-500/20 text-blue-400'
                    }`}>
                      {signal.token.slice(0, 2)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-white">{signal.token}</span>
                        <span className={`text-xs px-2 py-0.5 rounded ${
                          signal.signal === '买入' ? 'bg-green-500/20 text-green-400' : 'bg-blue-500/20 text-blue-400'
                        }`}>
                          {signal.signal}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500">
                        买入价 {signal.price} → 目标 {signal.target}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-green-400 font-semibold">{signal.return}</div>
                    <div className="text-xs text-slate-500">{signal.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Leaderboard */}
          <div className="rounded-2xl bg-slate-800/50 border border-blue-900/30 overflow-hidden">
            <div className="p-4 border-b border-blue-900/30 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-yellow-400" />
                <span className="font-semibold text-white">收益排行榜</span>
              </div>
              <span className="text-xs text-slate-500">本周</span>
            </div>
            <div className="divide-y divide-blue-900/30">
              {LEADERBOARD.map((user, i) => (
                <div key={i} className="p-4 flex items-center justify-between hover:bg-blue-900/10 transition">
                  <div className="flex items-center gap-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      i === 0 ? 'bg-yellow-500/20 text-yellow-400' :
                      i === 1 ? 'bg-slate-400/20 text-slate-300' :
                      i === 2 ? 'bg-amber-600/20 text-amber-500' :
                      'bg-slate-700/50 text-slate-400'
                    }`}>
                      {user.rank}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm text-white">{user.name}</span>
                        <span className={`text-xs px-2 py-0.5 rounded ${
                          user.tier === 'Diamond' ? 'bg-blue-500/20 text-blue-400' :
                          user.tier === 'Gold' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-slate-500/20 text-slate-400'
                        }`}>
                          {user.tier}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500">
                        {user.trades}笔交易 · 胜率{user.winRate}
                      </div>
                    </div>
                  </div>
                  <div className="text-green-400 font-bold">{user.profit}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* How to Join */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">如何加入</h2>
          <p className="text-slate-400">简单三步，开启您的Alpha之旅</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { step: 1, icon: User, title: '注册账号', desc: '使用邮箱快速注册，验证身份' },
            { step: 2, icon: CreditCard, title: '选择套餐', desc: '根据交易量选择合适的会员等级' },
            { step: 3, icon: Zap, title: '开启Alpha', desc: '立即接收专属Alpha信号和社区特权' },
          ].map((item, i) => (
            <div key={i} className="text-center p-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">{item.step}</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
              <p className="text-sm text-slate-400">{item.desc}</p>
              {i < 2 && (
                <ChevronRight className="w-6 h-6 text-slate-600 mx-auto mt-4 hidden md:block" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="rounded-3xl bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 p-12 text-center">
          <Crown className="w-12 h-12 text-blue-400 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-white mb-4">准备好加入Alpha Club了吗？</h2>
          <p className="text-slate-400 mb-8 max-w-xl mx-auto">
            加入全球最顶尖的Alpha发现社区，与专业交易者并肩作战，获取第一手投资机会
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button className="px-8 py-4 rounded-full font-semibold bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:from-blue-500 hover:to-cyan-500 transition flex items-center gap-2">
              <Rocket className="w-5 h-5" />
              立即加入 Alpha Club
            </button>
            <button className="px-8 py-4 rounded-full font-semibold bg-slate-800 text-white hover:bg-slate-700 transition">
              预约演示
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-blue-900/30 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-2xl font-bold text-white">
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Kairos</span>
            </div>
            <div className="flex gap-6 text-sm text-slate-400">
              <Link href="/product" className="hover:text-white transition">产品</Link>
              <Link href="/pricing" className="hover:text-white transition">定价</Link>
              <Link href="/about" className="hover:text-white transition">关于</Link>
              <Link href="/resources" className="hover:text-white transition">资源</Link>
            </div>
            <div className="text-sm text-slate-500">
              © 2024 Kairos. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
