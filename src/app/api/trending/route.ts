import { NextResponse } from "next/server";
import { getTrendingTokens, fetchTopCoins } from "@/services/priceService";

export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "20");
    const chain = searchParams.get("chain");
    const sortBy = searchParams.get("sortBy") || "rank";

    // 获取真实数据
    const tokens = await getTrendingTokens(limit);

    // 按链筛选
    let filteredTokens = chain && chain !== "all"
      ? tokens.filter(t => t.chain.toLowerCase() === chain.toLowerCase())
      : tokens;

    // 按指定字段排序
    switch (sortBy) {
      case "aiScore":
        filteredTokens.sort((a, b) => b.aiScore - a.aiScore);
        break;
      case "volume":
        // 需要解析 volume 字符串进行排序
        filteredTokens.sort((a, b) => {
          const aVol = parseVolume(a.volume);
          const bVol = parseVolume(b.volume);
          return bVol - aVol;
        });
        break;
      case "change":
        filteredTokens.sort((a, b) => {
          const aChange = parseFloat(a.price_change_24h.replace(/[^0-9.-]/g, ""));
          const bChange = parseFloat(b.price_change_24h.replace(/[^0-9.-]/g, ""));
          return bChange - aChange;
        });
        break;
      default:
        // 默认按 rank 排序
        filteredTokens.sort((a, b) => a.rank - b.rank);
    }

    return NextResponse.json({
      success: true,
      data: filteredTokens,
      source: "CoinGecko API",
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error("Trending API error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch trending data" },
      { status: 500 }
    );
  }
}

// 解析交易量字符串
function parseVolume(volume: string): number {
  const match = volume.match(/[\d.]+/);
  if (!match) return 0;
  const num = parseFloat(match[0]);
  if (volume.includes("B")) return num * 1e9;
  if (volume.includes("M")) return num * 1e6;
  if (volume.includes("K")) return num * 1e3;
  return num;
}
