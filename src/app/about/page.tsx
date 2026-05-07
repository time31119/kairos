'use client';

import Link from 'next/link';
import { ArrowLeft, Users, Target, Zap, Heart } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0F172A' }}>
      {/* 导航栏 */}
      <nav className="border-b" style={{ borderColor: '#1E293B', backgroundColor: 'rgba(15, 23, 42, 0.95)', backdropFilter: 'blur(12px)' }}>
        <div className="max-w-6xl mx-auto px-6 py-5 flex justify-between items-center flex-wrap gap-4">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #F59E0B, #FBBF24)' }}>
              <span className="text-white font-bold text-lg">K</span>
            </div>
            <span className="text-xl font-bold" style={{ fontFamily: 'Exo, sans-serif', color: '#F1F5F9' }}>KAIROS</span>
          </Link>
          <div className="flex gap-8 items-center flex-wrap">
            <Link href="/product" className="transition-colors hover:text-amber-400" style={{ color: '#94A3B8' }}>产品</Link>
            <Link href="/pricing" className="transition-colors hover:text-amber-400" style={{ color: '#94A3B8' }}>定价</Link>
            <Link href="/about" className="font-medium" style={{ color: '#F59E0B' }}>关于</Link>
            <Link href="/resources" className="transition-colors hover:text-amber-400" style={{ color: '#94A3B8' }}>资源</Link>
            <button
              onClick={() => document.getElementById('waitlist')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-5 py-2 rounded-full text-sm font-semibold transition-all hover:scale-105"
              style={{ backgroundColor: '#F59E0B', color: '#FFFFFF' }}
            >
              内测预约
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-16">
        <Link href="/" className="inline-flex items-center gap-2 mb-8 transition-colors hover:text-amber-400" style={{ color: '#64748B' }}>
          <ArrowLeft className="w-4 h-4" /> 返回首页
        </Link>

        {/* Hero */}
        <div className="text-center mb-20">
          <h1 className="text-5xl font-bold mb-6" style={{ fontFamily: 'Exo, sans-serif', color: '#F1F5F9' }}>
            关于 Kairos
          </h1>
          <p className="text-xl max-w-3xl mx-auto" style={{ color: '#94A3B8' }}>
            我们相信，在加密货币市场中，<span className="font-semibold" style={{ color: '#F59E0B' }}>时机就是一切</span>。
            Kairos 致力于用 AI 技术帮助用户识别那些稍纵即逝的投资机会。
          </p>
        </div>

        {/* 品牌故事 */}
        <div className="grid md:grid-cols-2 gap-12 mb-20">
          <div>
            <h2 className="text-2xl font-bold mb-6" style={{ fontFamily: 'Exo, sans-serif', color: '#F1F5F9' }}>我们的故事</h2>
            <div className="space-y-4" style={{ color: '#94A3B8' }}>
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
            <h2 className="text-2xl font-bold mb-6" style={{ fontFamily: 'Exo, sans-serif', color: '#F1F5F9' }}>我们的使命</h2>
            <div className="p-8 rounded-2xl" style={{ backgroundColor: '#1E293B', border: '1px solid #334155' }}>
              <Target className="w-12 h-12 mb-4" style={{ color: '#F59E0B' }} />
              <p className="text-lg mb-4" style={{ color: '#F1F5F9' }}>
                用 AI 技术<span className="font-semibold" style={{ color: '#F59E0B' }}> democratize alpha</span>，
                让每一个普通投资者都能在关键时刻做出正确的决策。
              </p>
              <p style={{ color: '#94A3B8' }}>
                我们希望打破信息不对称，让机构投资者和散户站在同一起跑线上。无论你是刚入门的新手还是经验丰富的老手，Kairos 都能帮助你更好地把握时机。
              </p>
            </div>
          </div>
        </div>

        {/* 价值观 */}
        <div className="mb-20">
          <h2 className="text-2xl font-bold text-center mb-10" style={{ fontFamily: 'Exo, sans-serif', color: '#F1F5F9' }}>我们的价值观</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { icon: Zap, title: '速度', desc: '在信息战场上，速度就是生命。我们追求极致的信号延迟。' },
              { icon: Target, title: '精准', desc: '不追求预测价格，只追求识别关键时刻。' },
              { icon: Users, title: '公平', desc: '让机构级工具为每个普通投资者所用。' },
              { icon: Heart, title: '透明', desc: '数据来源清晰，分析逻辑公开，风险提示醒目。' },
            ].map((value, i) => (
              <div key={i} className="p-6 rounded-xl text-center" style={{ backgroundColor: '#1E293B', border: '1px solid #334155' }}>
                <value.icon className="w-10 h-10 mx-auto mb-4" style={{ color: '#F59E0B' }} />
                <h3 className="font-semibold mb-2" style={{ color: '#F1F5F9' }}>{value.title}</h3>
                <p className="text-sm" style={{ color: '#94A3B8' }}>{value.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 团队 */}
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-10" style={{ fontFamily: 'Exo, sans-serif', color: '#F1F5F9' }}>核心团队</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { name: 'Alex Chen', role: '创始人 & CEO', bio: '前某头部交易所数据负责人，10年+加密行业经验' },
              { name: 'Sarah Liu', role: 'CTO', bio: 'AI/ML 专家，前大厂算法工程师，斯坦福 CS 硕士' },
              { name: 'Michael Wang', role: '产品负责人', bio: '资深产品设计师，连续创业者，专注金融科技产品' },
            ].map((member, i) => (
              <div key={i} className="p-6 rounded-xl" style={{ backgroundColor: '#1E293B', border: '1px solid #334155' }}>
                <div className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl font-bold" style={{ backgroundColor: '#0F172A', color: '#F59E0B' }}>
                  {member.name.split(' ').map(n => n[0]).join('')}
                </div>
                <h3 className="font-semibold mb-1" style={{ color: '#F1F5F9' }}>{member.name}</h3>
                <p className="text-sm mb-2" style={{ color: '#F59E0B' }}>{member.role}</p>
                <p className="text-sm" style={{ color: '#64748B' }}>{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
