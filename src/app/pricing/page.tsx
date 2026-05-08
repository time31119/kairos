'use client';

import Link from 'next/link';
import { ArrowLeft, Check, Zap, Crown, Star } from 'lucide-react';

export default function PricingPage() {
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
              <Link href="/pricing" className="text-blue-400 font-medium">
                定价
              </Link>
              <Link href="/about" className="text-slate-400 hover:text-white transition">
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

        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6 text-white">简单透明的定价</h1>
          <p className="text-xl max-w-2xl mx-auto text-slate-400">
            年付更划算，专业版比月付省 ¥1000+。币安 Alpha 机会稍纵即逝，工具投资回报看得见。
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-20">
          {/* 免费版 */}
          <div className="p-8 rounded-2xl bg-slate-800/50 border border-blue-900/30">
            <div className="mb-6">
              <h3 className="text-xl font-bold mb-2 text-white">免费版</h3>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-white">¥0</span>
                <span className="text-slate-500">/月</span>
              </div>
            </div>
            <p className="mb-6 text-sm text-slate-400">适合入门用户，体验核心功能</p>
            <ul className="space-y-3 mb-8">
              {['热力榜浏览（前20）', '基础 AI 评分', '24h 价格追踪', '3 条链支持', '邮件支持'].map((feature, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-slate-400">
                  <Check className="w-4 h-4 text-green-400" /> {feature}
                </li>
              ))}
            </ul>
            <button className="w-full py-3 rounded-full font-semibold transition-all hover:scale-105 bg-slate-900/50 border border-blue-900/30 text-white">
              当前方案
            </button>
          </div>

          {/* 专业版 */}
          <div className="p-8 rounded-2xl relative bg-gradient-to-b from-blue-900/30 to-slate-800/50 border-2 border-blue-500">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-semibold bg-blue-500 text-white">
              最受欢迎
            </div>
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <Crown className="w-5 h-5 text-blue-400" />
                <h3 className="text-xl font-bold text-white">专业版</h3>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-blue-400">¥2999</span>
                <span className="text-slate-500">/年</span>
              </div>
              <div className="text-xs mt-1 text-slate-500">相当于 ¥250/月，比月付省 ¥1000+</div>
            </div>
            <p className="mb-6 text-sm text-slate-400">适合活跃交易者，解锁全部功能</p>
            <ul className="space-y-3 mb-8">
              {['完整热力榜（无限）', '高级 AI 深度扫描', '聪明钱追踪', '全部链支持', '实时预警通知', 'API 访问权限', '优先邮件支持'].map((feature, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-slate-400">
                  <Check className="w-4 h-4 text-blue-400" /> {feature}
                </li>
              ))}
            </ul>
            <button className="w-full py-3 rounded-full font-semibold transition-all hover:scale-105 bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
              立即升级
            </button>
          </div>

          {/* 机构版 */}
          <div className="p-8 rounded-2xl bg-slate-800/50 border border-blue-900/30">
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <Star className="w-5 h-5 text-cyan-400" />
                <h3 className="text-xl font-bold text-white">机构版</h3>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-white">¥5999</span>
                <span className="text-slate-500">/年</span>
              </div>
              <div className="text-xs mt-1 text-slate-500">相当于 ¥500/月，专属服务</div>
            </div>
            <p className="mb-6 text-sm text-slate-400">适合专业团队，高级定制服务</p>
            <ul className="space-y-3 mb-8">
              {['专业版全部功能', '多用户协作', '自定义警报规则', '专属数据报表', 'WebSocket 实时推送', '7x24 专属支持', '定制化功能开发'].map((feature, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-slate-400">
                  <Check className="w-4 h-4 text-cyan-400" /> {feature}
                </li>
              ))}
            </ul>
            <button className="w-full py-3 rounded-full font-semibold transition-all hover:scale-105 bg-slate-900/50 border border-cyan-500 text-cyan-400">
              联系销售
            </button>
          </div>
        </div>

        {/* FAQ */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8 text-white">常见问题</h2>
          <div className="space-y-4">
            {[
              { q: '可以随时切换方案吗？', a: '是的，你可以随时升级或降级方案。升级立即生效，降级将在当前计费周期结束后生效。' },
              { q: '年付有什么优势？', a: '年付比月付更划算：专业版年付省 ¥1000+，机构版年付省 ¥6000+。按年计费也更适合长期使用。' },
              { q: '支持退款吗？', a: '付费后7天内可申请全额退款，逾期不予退款但可取消续订。' },
              { q: '如何获取团队报价？', a: '请联系我们的销售团队，提供团队规模和需求，我们会为你定制方案。' },
            ].map((item, i) => (
              <div key={i} className="p-6 rounded-xl bg-slate-800/50 border border-blue-900/30">
                <h4 className="font-semibold mb-2 text-blue-400">{item.q}</h4>
                <p className="text-slate-400">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
