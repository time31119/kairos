"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AuthButton } from "./AuthButton";

const navLinks = [
  { href: "/product", label: "产品" },
  { href: "/alpha-club", label: "Alpha Club", highlight: true },
  { href: "/pricing", label: "定价" },
  { href: "/about", label: "关于" },
  { href: "/resources", label: "资源" },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <nav
      className="border-b sticky top-0 z-50"
      style={{
        borderColor: "rgba(59, 130, 246, 0.3)",
        backgroundColor: "rgba(15, 23, 42, 0.8)",
        backdropFilter: "blur(12px)",
      }}
    >
      <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #3B82F6, #06B6D4)" }}
          >
            <span className="text-white font-bold text-lg">K</span>
          </div>
          <span
            className="text-xl font-bold"
            style={{ fontFamily: "Exo, sans-serif", color: "#F1F5F9" }}
          >
            KAIROS
          </span>
        </Link>

        <div className="flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium transition-colors"
              style={{
                color: pathname === link.href ? "#3B82F6" : "#94A3B8",
              }}
              {...(link.highlight && {
                style: {
                  color: pathname === link.href ? "#60A5FA" : "#38BDF8",
                  textShadow: "0 0 20px rgba(56, 189, 248, 0.3)",
                }
              })}
            >
              {link.label}
            </Link>
          ))}
          <AuthButton />
        </div>
      </div>
    </nav>
  );
}
