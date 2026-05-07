'use client';

import Link from 'next/link';
import { Sparkles, TrendingUp, Brain, Radio, ArrowLeft, Zap, Shield, Users, LineChart, Eye, Target, Bell } from 'lucide-react';
import { Navbar } from '@/components/Navbar';

export default function ProductPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0F172A' }}>
      <Navbar />

      <div className="max-w-6xl mx-auto px-6 py-16">
        <Link href="/" className="inline-flex items-center gap-2 mb-8 transition-colors hover:text-amber-400" style={{ color: '#64748B' }}>
          <ArrowLeft className="w-4 h-4" /> 返回首页
        </Link>

        <h1 className="text-5xl font-bold mb-6" style={{ fontFamily: 'Exo, sans-serif', color: '#F1F5F9' }}>产品功能</h1>
        <p className="text-xl max-w-3xl mb-8" style={{ color: '#94A3B8' }}>
          Kairos 整合实时链上数据、社交媒体情绪、聪明钱动态等多维信息，通过 AI 算法生成评分与排序，帮助你在代币真正爆发前发现潜在热点，提前布局币安 Alpha。
        </p>

        {/* 核心价值主张 */}
        <div className="grid grid-cols-3 gap-4 mb-12">
          {[
            { icon: '🔗', label: '实时链上数据', desc: '追踪资金流向、Gas 变化' },
            { icon: '💬', label: '社交情绪分析', desc: 'Twitter/Telegram 热度监测' },
            { icon: '💰', label: '聪明钱动态', desc: '顶级地址异动追踪' },
          ].map((item, i) => (
            <div key={i} className="p-4 rounded-xl text-center" style={{ backgroundColor: '#1E293B', border: '1px solid #334155' }}>
              <div className="text-2xl mb-2">{item.icon}</div>
              <div className="font-semibold text-sm mb-1" style={{ color: '#F1F5F9' }}>{item.label}</div>
              <div className="text-xs" style={{ color: '#64748B' }}>{item.desc}</div>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {[
            { icon: TrendingUp, title: 'Alpha 热力榜', desc: '专注追踪币安 Alpha 候选代币热度，智能排序帮助快速发现潜力标的。实时监控链上信号、社交情绪、资金流向。', features: ['Alpha 候选代币实时排名', '链上信号追踪', '聪明钱动向监控'] },
            { icon: Brain, title: 'AI Alpha 扫描器', desc: '输入任意合约地址，AI 六维深度分析（叙事/社区/筹码/流动性/催化剂/安全），一键判断是否值得布局 Alpha。', features: ['六维雷达评分', 'Alpha 潜力评估', '风险智能检测'] },
            { icon: Radio, title: 'Alpha 预判雷达', desc: 'AI 分析链上资金流向、社群情绪变化，预测哪些代币最有可能进入币安 Alpha 专区，提前布局获取 Alpha。', features: ['资金流向分析', '社群情绪监测', 'Alpha 进入预测'] },
            { icon: Shield, title: '安全检测', desc: '集成 GoPlus 安全数据库，实时检测合约风险、Rug Pull 概率和代币安全性，保护你的 Alpha 仓位。', features: ['合约风险评估', '流动性安全', '代币安全评分'] },
            { icon: Users, title: '聪明钱追踪', desc: '追踪顶级投资机构和聪明钱地址的持仓变化，第一时间捕捉机构建仓信号，提前发现 Alpha 机会。', features: ['机构持仓追踪', '大户异动监控', 'Alpha 资金监测'] },
            { icon: LineChart, title: '多维数据看板', desc: '实时价格、K 线、资金费率、合约持仓等多维度数据一屏掌握，辅助 Alpha 决策。', features: ['实时价格图表', '链上数据监控', '市场情绪指标'] },
          ].map((feature, i) => (
            <div key={i} className="p-8 rounded-2xl transition-all duration-300 hover:scale-[1.02]" style={{ backgroundColor: '#1E293B', border: '1px solid #334155' }}>
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6" style={{ backgroundColor: '#0F172A' }}>
                <feature.icon className="w-7 h-7" style={{ color: '#F59E0B' }} />
              </div>
              <h3 className="text-xl font-semibold mb-3" style={{ color: '#F1F5F9' }}>{feature.title}</h3>
              <p className="mb-4" style={{ color: '#94A3B8' }}>{feature.desc}</p>
              <ul className="space-y-2 text-sm" style={{ color: '#64748B' }}>
                {feature.features.map((f, j) => (
                  <li key={j} className="flex items-center gap-2">
                    <Zap className="w-4 h-4" style={{ color: '#F59E0B' }} /> {f}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* 附加功能 */}
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-8" style={{ fontFamily: 'Exo, sans-serif', color: '#F1F5F9' }}>更多功能</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { icon: Eye, title: '叙事追踪' },
              { icon: Target, title: '精准预警' },
              { icon: Bell, title: '实时通知' },
              { icon: Sparkles, title: 'AI 助手' },
            ].map((item, i) => (
              <div key={i} className="p-6 rounded-xl text-center transition-all hover:scale-105" style={{ backgroundColor: '#1E293B', border: '1px solid #334155' }}>
                <item.icon className="w-8 h-8 mx-auto mb-3" style={{ color: '#F59E0B' }} />
                <div className="font-medium" style={{ color: '#F1F5F9' }}>{item.title}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
