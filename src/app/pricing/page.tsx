'use client';

import Link from 'next/link';
import { ArrowLeft, Check, Users, Building2, Shield, AlertTriangle } from 'lucide-react';

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

        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-6 text-white">简单透明的定价</h1>
          <p className="text-xl max-w-2xl mx-auto text-slate-400">
            按席位收费，杜绝账号共享，确保平台可持续发展
          </p>
        </div>

        {/* 防共享说明 */}
        <div className="max-w-3xl mx-auto mb-12 p-4 rounded-xl bg-red-500/10 border border-red-500/30">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
            <div className="text-sm">
              <p className="text-red-400 font-medium mb-1">账号共享管控</p>
              <p className="text-slate-400">
                Kairos 采用设备检测、IP监控、同时在线限制等技术手段防止账号共享。
                违规者将被永久封禁，概不退款。
              </p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto mb-16">
          {/* 免费版 */}
          <div className="p-6 rounded-2xl bg-slate-800/50 border border-blue-900/30">
            <div className="mb-6">
              <h3 className="text-lg font-bold text-white mb-2">免费版</h3>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-extrabold text-white">¥0</span>
                <span className="text-slate-500">/永久</span>
              </div>
            </div>
            <p className="text-sm text-slate-400 mb-6">体验核心功能，适合尝鲜</p>
            <div className="text-xs text-slate-500 mb-4 flex items-center gap-2">
              <Users className="w-4 h-4" />
              1个账号 · 禁止共享
            </div>
            <ul className="space-y-3 mb-6">
              {['每日3个Alpha机会', '基础AI评分', '24h价格追踪', '仅Solana链'].map((feature, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-400">
                  <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" /> 
                  <span>{feature}</span>
                </li>
              ))}
              {['高级AI深度扫描', '多链支持', '聪明钱追踪'].map((feature, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                  <span className="w-4 h-4 mt-0.5 flex-shrink-0">-</span> 
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <button className="w-full py-3 rounded-full font-semibold bg-slate-900/50 border border-blue-900/30 text-white hover:border-blue-500 transition">
              免费开始
            </button>
          </div>

          {/* 专业版 - 单账号 */}
          <div className="p-6 rounded-2xl bg-gradient-to-b from-blue-900/20 to-slate-800/50 border-2 border-blue-500 relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500 text-white">
              个人使用
            </div>
            <div className="mb-6">
              <h3 className="text-lg font-bold text-white mb-2">专业版</h3>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-extrabold text-blue-400">¥299</span>
                <span className="text-slate-500">/月</span>
              </div>
              <div className="text-xs text-slate-500 mt-1">或 ¥2499/年，省 ¥590</div>
            </div>
            <p className="text-sm text-slate-400 mb-6">个人用户，解锁全部功能</p>
            <div className="text-xs text-slate-500 mb-4 flex items-center gap-2">
              <Shield className="w-4 h-4 text-blue-400" />
              1个账号 · 设备绑定 · 禁止共享
            </div>
            <ul className="space-y-3 mb-6">
              {['全部Alpha机会（无限）', '高级AI深度扫描', '全链支持（6条链）', '聪明钱追踪', '实时预警通知', '历史数据分析'].map((feature, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-400">
                  <Check className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" /> 
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <button className="w-full py-3 rounded-full font-semibold bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:from-blue-500 hover:to-cyan-500 transition">
              立即订阅
            </button>
          </div>

          {/* 团队版 - 多席位 */}
          <div className="p-6 rounded-2xl bg-gradient-to-b from-cyan-900/20 to-slate-800/50 border-2 border-cyan-500 relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500 text-white">
              热门推荐
            </div>
            <div className="mb-6">
              <h3 className="text-lg font-bold text-white mb-2">团队版</h3>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-extrabold text-cyan-400">¥99</span>
                <span className="text-slate-500">/席位/月</span>
              </div>
              <div className="text-xs text-slate-500 mt-1">5席位起购，年付85折</div>
            </div>
            <p className="text-sm text-slate-400 mb-6">小团队协作，独立账号管理</p>
            <div className="text-xs text-slate-500 mb-4 flex items-center gap-2">
              <Users className="w-4 h-4 text-cyan-400" />
              5-20席位 · 需验证公司邮箱
            </div>
            <ul className="space-y-3 mb-6">
              {['专业版全部功能', '5-20个独立账号', '公司邮箱验证绑定', '团队持仓监控', '使用量统计面板', '优先邮件支持', '席位灵活增减'].map((feature, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-400">
                  <Check className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" /> 
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <button className="w-full py-3 rounded-full font-semibold bg-gradient-to-r from-cyan-600 to-blue-600 text-white hover:from-cyan-500 hover:to-blue-500 transition">
              创建团队
            </button>
          </div>

          {/* 企业版 */}
          <div className="p-6 rounded-2xl bg-slate-800/50 border border-slate-600">
            <div className="mb-6">
              <h3 className="text-lg font-bold text-white mb-2">企业版</h3>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-extrabold text-white">定制</span>
              </div>
              <div className="text-xs text-slate-500 mt-1">不限席位，按需定价</div>
            </div>
            <p className="text-sm text-slate-400 mb-6">大型团队，SSO集成，完全自定义</p>
            <div className="text-xs text-slate-500 mb-4 flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              无限席位 · SSO · API · SLA
            </div>
            <ul className="space-y-3 mb-6">
              {['团队版全部功能', '不限席位数量', 'SAML/SSO集成', '私有化部署', '专属客户成功经理', '7x24电话支持', 'SLA 99.9%保障', '定制功能开发'].map((feature, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-400">
                  <Check className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" /> 
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <button className="w-full py-3 rounded-full font-semibold bg-slate-900/50 border border-purple-500/50 text-purple-400 hover:border-purple-400 transition">
              联系销售
            </button>
          </div>
        </div>

        {/* 席位对比 */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8 text-white">席位说明</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 rounded-xl bg-slate-800/50 border border-blue-900/30">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-400" />
                什么是席位？
              </h3>
              <p className="text-slate-400 text-sm mb-4">
                席位 = 1个独立账号。每个团队成员需要自己的账号才能登录使用。
              </p>
              <ul className="space-y-2 text-sm text-slate-400">
                <li>• 5人团队 = 5个席位 = 5个独立账号</li>
                <li>• 每个账号独立邮箱、独立设备</li>
                <li>• 支持中途增加或减少席位</li>
              </ul>
            </div>

            <div className="p-6 rounded-xl bg-slate-800/50 border border-red-900/30">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-red-400" />
                防共享措施
              </h3>
              <ul className="space-y-2 text-sm text-slate-400">
                <li>• 同一账号最多2台设备同时在线</li>
                <li>• IP异常检测（异地登录警报）</li>
                <li>• 设备指纹绑定验证</li>
                <li>• API调用频率限制</li>
                <li>• 违规账号永久封禁，不退款</li>
              </ul>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="max-w-3xl mx-auto mt-16">
          <h2 className="text-2xl font-bold text-center mb-8 text-white">常见问题</h2>
          <div className="space-y-4">
            {[
              { q: '可以多个人共用一个账号吗？', a: '不可以。账号共享会导致永久封禁。每个用户需要独立的账号和邮箱。团队使用请购买团队版。' },
              { q: '如何增加或减少席位？', a: '团队版用户可以在管理后台随时调整席位数量，按天计费。' },
              { q: '年付可以退款吗？', a: '年付7天内可申请全额退款，逾期不予退款但可取消续订。共享违规不退款。' },
              { q: '公司邮箱验证是什么？', a: '团队版要求验证公司域名邮箱（如 @company.com），防止个人邮箱注册多个席位。' },
              { q: '免费版和专业版有什么区别？', a: '免费版功能受限（仅3条机会、1条链），专业版解锁全部功能，支持全链和高级AI扫描。' },
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
