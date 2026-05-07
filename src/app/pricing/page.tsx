'use client';

import Link from 'next/link';
import { ArrowLeft, Check, Zap, Crown, Star } from 'lucide-react';

export default function PricingPage() {
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
            <Link href="/pricing" className="font-medium" style={{ color: '#F59E0B' }}>定价</Link>
            <Link href="/about" className="transition-colors hover:text-amber-400" style={{ color: '#94A3B8' }}>关于</Link>
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

        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6" style={{ fontFamily: 'Exo, sans-serif', color: '#F1F5F9' }}>简单透明的定价</h1>
          <p className="text-xl max-w-2xl mx-auto" style={{ color: '#94A3B8' }}>
            年付更划算，专业版比月付省 ¥1000+。币安 Alpha 机会稍纵即逝，工具投资回报看得见。
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-20">
          {/* 免费版 */}
          <div className="p-8 rounded-2xl" style={{ backgroundColor: '#1E293B', border: '1px solid #334155' }}>
            <div className="mb-6">
              <h3 className="text-xl font-bold mb-2" style={{ color: '#F1F5F9' }}>免费版</h3>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-extrabold" style={{ color: '#F1F5F9' }}>¥0</span>
                <span style={{ color: '#64748B' }}>/月</span>
              </div>
            </div>
            <p className="mb-6 text-sm" style={{ color: '#94A3B8' }}>适合入门用户，体验核心功能</p>
            <ul className="space-y-3 mb-8">
              {['热力榜浏览（前20）', '基础 AI 评分', '24h 价格追踪', '3 条链支持', '邮件支持'].map((feature, i) => (
                <li key={i} className="flex items-center gap-2 text-sm" style={{ color: '#94A3B8' }}>
                  <Check className="w-4 h-4" style={{ color: '#10B981' }} /> {feature}
                </li>
              ))}
            </ul>
            <button className="w-full py-3 rounded-full font-semibold transition-all hover:scale-105" style={{ backgroundColor: '#1E293B', border: '1px solid #334155', color: '#F1F5F9' }}>
              当前方案
            </button>
          </div>

          {/* 专业版 */}
          <div className="p-8 rounded-2xl relative" style={{ background: 'linear-gradient(180deg, #1E293B 0%, #292524 100%)', border: '2px solid #F59E0B' }}>
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-semibold" style={{ backgroundColor: '#F59E0B', color: '#FFFFFF' }}>
              最受欢迎
            </div>
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <Crown className="w-5 h-5" style={{ color: '#F59E0B' }} />
                <h3 className="text-xl font-bold" style={{ color: '#F1F5F9' }}>专业版</h3>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-extrabold" style={{ color: '#F59E0B' }}>¥2999</span>
                <span style={{ color: '#64748B' }}>/年</span>
              </div>
              <div className="text-xs mt-1" style={{ color: '#64748B' }}>相当于 ¥250/月，比月付省 ¥1000+</div>
            </div>
            <p className="mb-6 text-sm" style={{ color: '#94A3B8' }}>适合活跃交易者，解锁全部功能</p>
            <ul className="space-y-3 mb-8">
              {['完整热力榜（无限）', '高级 AI 深度扫描', '聪明钱追踪', '全部链支持', '实时预警通知', 'API 访问权限', '优先邮件支持'].map((feature, i) => (
                <li key={i} className="flex items-center gap-2 text-sm" style={{ color: '#94A3B8' }}>
                  <Check className="w-4 h-4" style={{ color: '#F59E0B' }} /> {feature}
                </li>
              ))}
            </ul>
            <button className="w-full py-3 rounded-full font-semibold transition-all hover:scale-105" style={{ background: 'linear-gradient(135deg, #F59E0B, #D97706)', color: '#FFFFFF' }}>
              立即升级
            </button>
          </div>

          {/* 机构版 */}
          <div className="p-8 rounded-2xl" style={{ backgroundColor: '#1E293B', border: '1px solid #334155' }}>
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <Star className="w-5 h-5" style={{ color: '#8B5CF6' }} />
                <h3 className="text-xl font-bold" style={{ color: '#F1F5F9' }}>机构版</h3>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-extrabold" style={{ color: '#F1F5F9' }}>¥5999</span>
                <span style={{ color: '#64748B' }}>/年</span>
              </div>
              <div className="text-xs mt-1" style={{ color: '#64748B' }}>相当于 ¥500/月，专属服务</div>
            </div>
            <p className="mb-6 text-sm" style={{ color: '#94A3B8' }}>适合专业团队，高级定制服务</p>
            <ul className="space-y-3 mb-8">
              {['专业版全部功能', '多用户协作', '自定义警报规则', '专属数据报表', 'WebSocket 实时推送', '7x24 专属支持', '定制化功能开发'].map((feature, i) => (
                <li key={i} className="flex items-center gap-2 text-sm" style={{ color: '#94A3B8' }}>
                  <Check className="w-4 h-4" style={{ color: '#8B5CF6' }} /> {feature}
                </li>
              ))}
            </ul>
            <button className="w-full py-3 rounded-full font-semibold transition-all hover:scale-105" style={{ backgroundColor: '#1E293B', border: '1px solid #8B5CF6', color: '#8B5CF6' }}>
              联系销售
            </button>
          </div>
        </div>

        {/* FAQ */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8" style={{ fontFamily: 'Exo, sans-serif', color: '#F1F5F9' }}>常见问题</h2>
          <div className="space-y-4">
            {[
              { q: '可以随时切换方案吗？', a: '是的，你可以随时升级或降级方案。升级立即生效，降级将在当前计费周期结束后生效。' },
              { q: '年付有什么优势？', a: '年付比月付更划算：专业版年付省 ¥1000+，机构版年付省 ¥6000+。按年计费也更适合长期使用。' },
              { q: '支持退款吗？', a: '付费后7天内可申请全额退款，逾期不予退款但可取消续订。' },
              { q: '如何获取团队报价？', a: '请联系我们的销售团队，提供团队规模和需求，我们会为你定制方案。' },
            ].map((item, i) => (
              <div key={i} className="p-6 rounded-xl" style={{ backgroundColor: '#1E293B', border: '1px solid #334155' }}>
                <h4 className="font-semibold mb-2" style={{ color: '#F59E0B' }}>{item.q}</h4>
                <p style={{ color: '#94A3B8' }}>{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
