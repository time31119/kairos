import { NextRequest, NextResponse } from "next/server";
import { writeFileSync, existsSync, mkdirSync, readFileSync } from "fs";
import { join } from "path";

const DATA_DIR = process.env.NODE_ENV === "production" ? "/tmp" : join(process.cwd(), "data");
const WAITLIST_FILE = join(DATA_DIR, "waitlist.json");

interface WaitlistEntry {
  email: string;
  timestamp: string;
}

function ensureDataDir() {
  if (!existsSync(DATA_DIR)) {
    mkdirSync(DATA_DIR, { recursive: true });
  }
}

function getWaitlist(): WaitlistEntry[] {
  ensureDataDir();
  if (!existsSync(WAITLIST_FILE)) {
    return [];
  }
  try {
    const data = readFileSync(WAITLIST_FILE, "utf-8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

function saveWaitlist(list: WaitlistEntry[]) {
  ensureDataDir();
  writeFileSync(WAITLIST_FILE, JSON.stringify(list, null, 2));
}

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "请提供有效的邮箱地址" },
        { status: 400 }
      );
    }

    const list = getWaitlist();
    const exists = list.some((entry) => entry.email === email);

    if (exists) {
      return NextResponse.json(
        { message: "该邮箱已在候补名单中", alreadyExists: true },
        { status: 200 }
      );
    }

    const newEntry: WaitlistEntry = {
      email,
      timestamp: new Date().toISOString(),
    };

    list.push(newEntry);
    saveWaitlist(list);

    return NextResponse.json({
      message: "已成功加入候补名单",
      alreadyExists: false,
      totalCount: list.length,
    });
  } catch (error) {
    console.error("[Waitlist API Error]", error);
    return NextResponse.json(
      { error: "服务器错误，请稍后重试" },
      { status: 500 }
    );
  }
}

export async function GET() {
  const list = getWaitlist();
  return NextResponse.json({
    totalCount: list.length,
    recentEntries: list.slice(-10),
  });
}
