'use client';

import Link from 'next/link';
import { ArrowLeft, Book, Video, FileText, MessageCircle, ExternalLink } from 'lucide-react';

export default function ResourcesPage() {
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
            <Link href="/about" className="transition-colors hover:text-amber-400" style={{ color: '#94A3B8' }}>关于</Link>
            <Link href="/resources" className="font-medium" style={{ color: '#F59E0B' }}>资源</Link>
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

        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6" style={{ fontFamily: 'Exo, sans-serif', color: '#F1F5F9' }}>学习资源</h1>
          <p className="text-xl max-w-2xl mx-auto" style={{ color: '#94A3B8' }}>
            从入门到精通，全方位提升你的 Alpha 发现能力
          </p>
        </div>

        {/* 入门指南 */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-8 flex items-center gap-3" style={{ fontFamily: 'Exo, sans-serif', color: '#F1F5F9' }}>
            <Book className="w-6 h-6" style={{ color: '#F59E0B' }} />
            入门指南
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: 'Kairos 新手教程', desc: '5分钟快速上手，掌握热力榜和AI扫描器的基本使用', time: '5 分钟' },
              { title: '理解 AI 评分体系', desc: '深入了解六维评分的计算逻辑和指标含义', time: '10 分钟' },
              { title: '聪明钱追踪入门', desc: '学习如何识别和追踪机构投资者的持仓动向', time: '8 分钟' },
            ].map((item, i) => (
              <div key={i} className="p-6 rounded-xl transition-all hover:scale-[1.02]" style={{ backgroundColor: '#1E293B', border: '1px solid #334155' }}>
                <h3 className="font-semibold mb-2" style={{ color: '#F1F5F9' }}>{item.title}</h3>
                <p className="text-sm mb-4" style={{ color: '#94A3B8' }}>{item.desc}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs" style={{ color: '#64748B' }}>{item.time}</span>
                  <button className="flex items-center gap-1 text-sm font-medium" style={{ color: '#F59E0B' }}>
                    阅读 <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 视频教程 */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-8 flex items-center gap-3" style={{ fontFamily: 'Exo, sans-serif', color: '#F1F5F9' }}>
            <Video className="w-6 h-6" style={{ color: '#F59E0B' }} />
            视频教程
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { title: 'Kairos 功能全景介绍', desc: '全面了解 Kairos 的核心功能和界面布局', duration: '12:34' },
              { title: '实战：如何用 AI 扫描发现潜力币', desc: '通过实际案例演示 AI 扫描器的使用技巧', duration: '18:22' },
            ].map((item, i) => (
              <div key={i} className="p-6 rounded-xl flex gap-4" style={{ backgroundColor: '#1E293B', border: '1px solid #334155' }}>
                <div className="w-32 h-20 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#0F172A' }}>
                  <Video className="w-8 h-8" style={{ color: '#64748B' }} />
                </div>
                <div>
                  <h3 className="font-semibold mb-1" style={{ color: '#F1F5F9' }}>{item.title}</h3>
                  <p className="text-sm mb-2" style={{ color: '#94A3B8' }}>{item.desc}</p>
                  <span className="text-xs px-2 py-1 rounded" style={{ backgroundColor: '#0F172A', color: '#64748B' }}>{item.duration}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 深度内容 */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-8 flex items-center gap-3" style={{ fontFamily: 'Exo, sans-serif', color: '#F1F5F9' }}>
            <FileText className="w-6 h-6" style={{ color: '#F59E0B' }} />
            深度内容
          </h2>
          <div className="space-y-4">
            {[
              { title: 'Alpha 发现策略：如何识别叙事爆发前的信号', category: '策略', date: '2026-01-15' },
              { title: '聪明钱追踪完全指南：从理论到实践', category: '教程', date: '2026-01-10' },
              { title: 'DeFi 安全手册：如何在 Kairos 的帮助下规避风险', category: '安全', date: '2026-01-05' },
              { title: 'Kairos 六维评分体系详解', category: '技术', date: '2025-12-28' },
            ].map((item, i) => (
              <div key={i} className="p-5 rounded-xl flex items-center justify-between" style={{ backgroundColor: '#1E293B', border: '1px solid #334155' }}>
                <div className="flex items-center gap-4">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#F59E0B' }} />
                  <div>
                    <h3 className="font-medium" style={{ color: '#F1F5F9' }}>{item.title}</h3>
                    <div className="flex items-center gap-3 text-xs mt-1" style={{ color: '#64748B' }}>
                      <span className="px-2 py-0.5 rounded" style={{ backgroundColor: '#0F172A' }}>{item.category}</span>
                      <span>{item.date}</span>
                    </div>
                  </div>
                </div>
                <button className="flex items-center gap-1 text-sm font-medium" style={{ color: '#F59E0B' }}>
                  阅读 <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div>
          <h2 className="text-2xl font-bold mb-8 flex items-center gap-3" style={{ fontFamily: 'Exo, sans-serif', color: '#F1F5F9' }}>
            <MessageCircle className="w-6 h-6" style={{ color: '#F59E0B' }} />
            常见问题
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { q: 'Kairos 的数据来源是什么？', a: '我们聚合了多个链上数据源、DEX 行情数据和社交媒体数据，通过 AI 模型进行综合分析。' },
              { q: 'AI 评分多久更新一次？', a: '基础数据实时更新，AI 评分每 5 分钟重新计算一次，确保信息的时效性。' },
              { q: '如何联系客服？', a: '你可以通过邮件 support@kairos.io 或加入我们的 Telegram 群组获得支持。' },
              { q: 'Kairos 适合新手使用吗？', a: '当然！我们设计了直观的界面和详细的新手教程，任何人都能快速上手。' },
            ].map((item, i) => (
              <div key={i} className="p-6 rounded-xl" style={{ backgroundColor: '#1E293B', border: '1px solid #334155' }}>
                <h4 className="font-semibold mb-2" style={{ color: '#F59E0B' }}>{item.q}</h4>
                <p className="text-sm" style={{ color: '#94A3B8' }}>{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
