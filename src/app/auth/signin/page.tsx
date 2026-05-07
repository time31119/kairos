"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // 使用凭证登录（无密码）
      const result = await signIn("credentials", {
        email,
        redirect: false,
      });

      if (result?.error) {
        setError("登录失败，请重试");
        setLoading(false);
      } else {
        router.push("/");
        router.refresh();
      }
    } catch {
      setError("登录失败，请重试");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F172A] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl flex items-center justify-center">
              <span className="text-white text-xl font-bold">K</span>
            </div>
            <span className="text-2xl font-bold text-white">KAIROS</span>
          </Link>
        </div>

        {/* Form Card */}
        <div className="bg-[#1E293B] rounded-2xl p-8 border border-[#334155]">
          <h1 className="text-2xl font-bold text-white mb-2">欢迎回来</h1>
          <p className="text-[#94A3B8] mb-6">登录您的 Kairos 账户</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#94A3B8] mb-2">
                邮箱地址
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="w-full px-4 py-3 bg-[#0F172A] border border-[#334155] rounded-xl text-white placeholder-[#64748B] focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none transition-all"
              />
            </div>

            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-white font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  登录中...
                </span>
              ) : (
                "登录"
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-[#64748B]">
            <p>登录即表示同意我们的</p>
            <Link href="/terms" className="text-amber-500 hover:text-amber-400">
              服务条款
            </Link>
            <span className="mx-1">和</span>
            <Link href="/privacy" className="text-amber-500 hover:text-amber-400">
              隐私政策
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="mt-6 grid grid-cols-3 gap-4 text-center">
          <div className="p-4 bg-[#1E293B]/50 rounded-xl border border-[#334155]/50">
            <div className="text-amber-500 mb-2">🔍</div>
            <div className="text-xs text-[#94A3B8]">AI 智能扫描</div>
          </div>
          <div className="p-4 bg-[#1E293B]/50 rounded-xl border border-[#334155]/50">
            <div className="text-amber-500 mb-2">📊</div>
            <div className="text-xs text-[#94A3B8]">实时热力榜</div>
          </div>
          <div className="p-4 bg-[#1E293B]/50 rounded-xl border border-[#334155]/50">
            <div className="text-amber-500 mb-2">⚡</div>
            <div className="text-xs text-[#94A3B8]">热点预警</div>
          </div>
        </div>
      </div>
    </div>
  );
}
