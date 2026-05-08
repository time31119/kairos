'use client';

import Link from 'next/link';
import { ArrowLeft, Book, Video, FileText, MessageCircle, ExternalLink } from 'lucide-react';

export default function ResourcesPage() {
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
              <Link href="/about" className="text-slate-400 hover:text-white transition">
                关于
              </Link>
              <Link href="/resources" className="text-blue-400 font-medium">
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

        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6 text-white">学习资源</h1>
          <p className="text-xl max-w-2xl mx-auto text-slate-400">
            从入门到精通，全方位提升你的 Alpha 发现能力
          </p>
        </div>

        {/* 入门指南 */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-8 flex items-center gap-3 text-white">
            <Book className="w-6 h-6 text-blue-400" />
            入门指南
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: 'Kairos 新手教程', desc: '5分钟快速上手，掌握热力榜和AI扫描器的基本使用', time: '5 分钟' },
              { title: '理解 AI 评分体系', desc: '深入了解六维评分的计算逻辑和指标含义', time: '10 分钟' },
              { title: '聪明钱追踪入门', desc: '学习如何识别和追踪机构投资者的持仓动向', time: '8 分钟' },
            ].map((item, i) => (
              <div key={i} className="p-6 rounded-xl transition-all hover:scale-[1.02] bg-slate-800/50 border border-blue-900/30">
                <h3 className="font-semibold mb-2 text-white">{item.title}</h3>
                <p className="text-sm mb-4 text-slate-400">{item.desc}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500">{item.time}</span>
                  <button className="flex items-center gap-1 text-sm font-medium text-blue-400">
                    阅读 <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 视频教程 */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-8 flex items-center gap-3 text-white">
            <Video className="w-6 h-6 text-blue-400" />
            视频教程
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { title: 'Kairos 功能全景介绍', desc: '全面了解 Kairos 的核心功能和界面布局', duration: '12:34' },
              { title: '实战：如何用 AI 扫描发现潜力币', desc: '通过实际案例演示 AI 扫描器的使用技巧', duration: '18:22' },
            ].map((item, i) => (
              <div key={i} className="p-6 rounded-xl flex gap-4 bg-slate-800/50 border border-blue-900/30">
                <div className="w-32 h-20 rounded-lg flex items-center justify-center flex-shrink-0 bg-slate-900/50">
                  <Video className="w-8 h-8 text-slate-500" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1 text-white">{item.title}</h3>
                  <p className="text-sm mb-2 text-slate-400">{item.desc}</p>
                  <span className="text-xs px-2 py-1 rounded bg-slate-900/50 text-slate-500">{item.duration}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 深度内容 */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-8 flex items-center gap-3 text-white">
            <FileText className="w-6 h-6 text-blue-400" />
            深度内容
          </h2>
          <div className="space-y-4">
            {[
              { title: 'Alpha 发现策略：如何识别叙事爆发前的信号', category: '策略', date: '2026-01-15' },
              { title: '聪明钱追踪完全指南：从理论到实践', category: '教程', date: '2026-01-10' },
              { title: 'DeFi 安全手册：如何在 Kairos 的帮助下规避风险', category: '安全', date: '2026-01-05' },
              { title: 'Kairos 六维评分体系详解', category: '技术', date: '2025-12-28' },
            ].map((item, i) => (
              <div key={i} className="p-5 rounded-xl flex items-center justify-between bg-slate-800/50 border border-blue-900/30">
                <div className="flex items-center gap-4">
                  <div className="w-2 h-2 rounded-full bg-blue-400" />
                  <div>
                    <h3 className="font-medium text-white">{item.title}</h3>
                    <div className="flex items-center gap-3 text-xs mt-1 text-slate-500">
                      <span className="px-2 py-0.5 rounded bg-slate-900/50">{item.category}</span>
                      <span>{item.date}</span>
                    </div>
                  </div>
                </div>
                <button className="flex items-center gap-1 text-sm font-medium text-blue-400">
                  阅读 <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div>
          <h2 className="text-2xl font-bold mb-8 flex items-center gap-3 text-white">
            <MessageCircle className="w-6 h-6 text-blue-400" />
            常见问题
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { q: 'Kairos 的数据来源是什么？', a: '我们聚合了多个链上数据源、DEX 行情数据和社交媒体数据，通过 AI 模型进行综合分析。' },
              { q: 'AI 评分多久更新一次？', a: '基础数据实时更新，AI 评分每 5 分钟重新计算一次，确保信息的时效性。' },
              { q: '如何联系客服？', a: '你可以通过邮件 support@kairos.io 或加入我们的 Telegram 群组获得支持。' },
              { q: 'Kairos 适合新手使用吗？', a: '当然！我们设计了直观的界面和详细的新手教程，任何人都能快速上手。' },
            ].map((item, i) => (
              <div key={i} className="p-6 rounded-xl bg-slate-800/50 border border-blue-900/30">
                <h4 className="font-semibold mb-2 text-blue-400">{item.q}</h4>
                <p className="text-sm text-slate-400">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
