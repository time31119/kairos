import type { Metadata } from 'next';
import { Inter, Exo } from 'next/font/google';
import { Inspector } from 'react-dev-inspector';
import { SessionProvider } from '@/components/SessionProvider';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const exo = Exo({
  subsets: ['latin'],
  variable: '--font-exo',
});

export const metadata: Metadata = {
  title: {
    default: 'Kairos · 捕获关键时刻 | AI驱动Alpha发现平台',
    template: '%s | Kairos',
  },
  description:
    'Kairos 用AI穿透噪音，在聪明钱异动、社群沸腾、叙事转向的瞬间，为你捕捉 Alpha 爆发前的恰当时机。',
  keywords: [
    'Kairos',
    'Alpha',
    '加密货币',
    'AI分析',
    '聪明钱',
    '代币发现',
    '区块链',
  ],
  authors: [{ name: 'Kairos Team' }],
  icons: {
    icon: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"%3E%3Ccircle cx="16" cy="16" r="12" fill="%23F59E0B"/%3E%3Ccircle cx="16" cy="16" r="4" fill="%23FFFFFF"/%3E%3C/svg%3E',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN" className={`${inter.variable} ${exo.variable}`}>
      <body className="antialiased min-h-screen bg-white text-[#1A1F2E] font-sans">
        <SessionProvider>
          <Inspector />
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
