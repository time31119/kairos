"use client";

import { useState } from "react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";

export function AuthButton() {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(false);

  const handleSignOut = async () => {
    setLoading(true);
    await signOut({ callbackUrl: "/" });
    setLoading(false);
  };

  if (status === "loading") {
    return (
      <button
        disabled
        className="px-5 py-2 text-sm font-medium text-[#94A3B8] cursor-not-allowed"
      >
        加载中...
      </button>
    );
  }

  if (session?.user) {
    return (
      <div className="relative group">
        <button className="flex items-center gap-2 px-4 py-2 bg-[#1E293B] border border-[#334155] rounded-xl hover:border-amber-500/50 transition-all">
          <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-bold">
              {session.user.email?.[0]?.toUpperCase() || "U"}
            </span>
          </div>
          <span className="text-white text-sm font-medium hidden sm:inline">
            {session.user.name || session.user.email?.split("@")[0]}
          </span>
        </button>

        {/* Dropdown Menu */}
        <div className="absolute right-0 top-full mt-2 w-48 py-2 bg-[#1E293B] border border-[#334155] rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
          <div className="px-4 py-2 border-b border-[#334155]">
            <p className="text-white text-sm font-medium truncate">
              {session.user.email}
            </p>
          </div>
          <Link
            href="/dashboard"
            className="block px-4 py-2 text-sm text-[#94A3B8] hover:text-white hover:bg-[#334155]/50 transition-all"
          >
            📊 个人中心
          </Link>
          <Link
            href="/watchlist"
            className="block px-4 py-2 text-sm text-[#94A3B8] hover:text-white hover:bg-[#334155]/50 transition-all"
          >
            ⭐ 自选列表
          </Link>
          <Link
            href="/history"
            className="block px-4 py-2 text-sm text-[#94A3B8] hover:text-white hover:bg-[#334155]/50 transition-all"
          >
            📜 扫描历史
          </Link>
          <div className="border-t border-[#334155] mt-2 pt-2">
            <button
              onClick={handleSignOut}
              disabled={loading}
              className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-all"
            >
              {loading ? "退出中..." : "退出登录"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Link
      href="/auth/signin"
      className="px-5 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-white text-sm font-semibold rounded-xl transition-all shadow-lg shadow-amber-500/20"
    >
      登录
    </Link>
  );
}
