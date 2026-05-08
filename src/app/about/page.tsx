'use client';

import Link from 'next/link';
import { ArrowLeft, Users, Target, Zap, Heart } from 'lucide-react';

export default function AboutPage() {
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
              <Link href="/product" className="text-slate-400 hover:text-white transition">
                产品
              </Link>
              <Link href="/pricing" className="text-slate-400 hover:text-white transition">
                定价
              </Link>
              <Link href="/about" className="text-blue-400 font-medium">
                关于
              </Link>
              <Link href="/resources" className="text-slate-400 hover:text-white transition">
                资源
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Link href="/" className="inline-flex items-center gap-2 mb-8 text-slate-400 hover:text-white transition">
          <ArrowLeft className="w-4 h-4" /> 返回首页
        </Link>

        {/* Hero */}
        <div className="text-center mb-20">
          <h1 className="text-5xl font-bold mb-6 text-white">
            关于 Kairos
          </h1>
          <p className="text-xl max-w-3xl mx-auto text-slate-400">
            我们相信，在加密货币市场中，<span className="font-semibold text-blue-400">时机就是一切</span>。
            Kairos 致力于用 AI 技术帮助用户识别那些稍纵即逝的投资机会。
          </p>
        </div>

        {/* 品牌故事 */}
        <div className="grid md:grid-cols-2 gap-12 mb-20">
          <div>
            <h2 className="text-2xl font-bold mb-6 text-white">我们的故事</h2>
            <div className="space-y-4 text-slate-400">
              <p>
                2024 年初，我们团队的几位成员在 DeFi 热潮中损失惨重。不是因为缺乏信息，而是因为信息太多、太杂、太滞后。
              </p>
              <p>
                当我们终于注意到某个代币暴涨时，往往已经错过了最佳时机。K线告诉我们"什么时候发生"，却从不告诉我们"该不该动"。
              </p>
              <p>
                于是我们开始思考：能否用 AI 来解决这个问题？不是预测价格，而是识别"关键时刻"——那些聪明钱异动、社群情绪爆发、叙事转向的瞬间。
              </p>
              <p>
                Kairos 就这样诞生了。它是我们对"时机"这件事的终极思考，也是我们想送给每个普通投资者的礼物。
              </p>
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-6 text-white">我们的使命</h2>
            <div className="p-8 rounded-2xl bg-slate-800/50 border border-blue-900/30">
              <Target className="w-12 h-12 mb-4 text-blue-400" />
              <p className="text-lg mb-4 text-white">
                用 AI 技术<span className="font-semibold text-blue-400"> democratize alpha</span>，
                让每一个普通投资者都能在关键时刻做出正确的决策。
              </p>
              <p className="text-slate-400">
                我们希望打破信息不对称，让机构投资者和散户站在同一起跑线上。无论你是刚入门的新手还是经验丰富的老手，Kairos 都能帮助你更好地把握时机。
              </p>
            </div>
          </div>
        </div>

        {/* 价值观 */}
        <div className="mb-20">
          <h2 className="text-2xl font-bold text-center mb-10 text-white">我们的价值观</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { icon: Zap, title: '速度', desc: '在信息战场上，速度就是生命。我们追求极致的信号延迟。' },
              { icon: Target, title: '精准', desc: '不追求预测价格，只追求识别关键时刻。' },
              { icon: Users, title: '公平', desc: '让机构级工具为每个普通投资者所用。' },
              { icon: Heart, title: '透明', desc: '数据来源清晰，分析逻辑公开，风险提示醒目。' },
            ].map((value, i) => (
              <div key={i} className="p-6 rounded-xl text-center bg-slate-800/50 border border-blue-900/30">
                <value.icon className="w-10 h-10 mx-auto mb-4 text-blue-400" />
                <h3 className="font-semibold mb-2 text-white">{value.title}</h3>
                <p className="text-sm text-slate-400">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 团队 */}
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-10 text-white">核心团队</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { name: 'Alex Chen', role: '创始人 & CEO', bio: '前某头部交易所数据负责人，10年+加密行业经验' },
              { name: 'Sarah Liu', role: 'CTO', bio: 'AI/ML 专家，前大厂算法工程师，斯坦福 CS 硕士' },
              { name: 'Michael Wang', role: '产品负责人', bio: '资深产品设计师，连续创业者，专注金融科技产品' },
            ].map((member, i) => (
              <div key={i} className="p-6 rounded-xl bg-slate-800/50 border border-blue-900/30">
                <div className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl font-bold bg-slate-900/50 text-blue-400">
                  {member.name.split(' ').map(n => n[0]).join('')}
                </div>
                <h3 className="font-semibold mb-1 text-white">{member.name}</h3>
                <p className="text-sm mb-2 text-blue-400">{member.role}</p>
                <p className="text-sm text-slate-500">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
