# Kairos · AI驱动Alpha发现平台

## 项目概述

Kairos 是一个 AI 驱动的加密货币 Alpha 发现平台，通过实时链上数据分析和 AI 模型识别市场中的「关键时刻」，帮助用户发现潜力代币和投资机会。

### 核心功能
- **市场热力榜**：跨链聚合潜力代币，AI 热度指数实时排名
- **AI 深度扫描器**：六维评分（叙事/社区/筹码/流动性/催化剂/安全）
- **热点雷达**：预测 24-48 小时内潜力叙事
- **用户系统**：支持邮箱登录、扫描历史、自选代币

### 技术栈
- **Framework**: Next.js 16 (App Router)
- **Core**: React 19
- **Language**: TypeScript 5
- **AI**: coze-coding-dev-sdk (Doubao/DeepSeek/Kimi 模型)
- **Database**: Supabase (PostgreSQL)
- **Auth**: NextAuth.js v5
- **Data**: CoinGecko API
- **Styling**: Tailwind CSS 4

## API 端点

| 端点 | 方法 | 功能 |
|------|------|------|
| `/api/trending` | GET | 获取热力榜数据（真实价格） |
| `/api/waitlist` | POST | 加入候补名单 |
| `/api/scan` | POST | AI 扫描器（流式输出） |
| `/api/auth/[...nextauth]` | GET/POST | 用户认证 |

## 目录结构

```
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── trending/route.ts   # 热力榜 API
│   │   │   ├── waitlist/route.ts  # 候补名单 API
│   │   │   ├── scan/route.ts       # AI 扫描器 API
│   │   │   └── auth/[...nextauth]/ # NextAuth 路由
│   │   ├── auth/                   # 认证页面
│   │   │   ├── signin/page.tsx     # 登录页
│   │   │   └── callback/           # OAuth 回调
│   │   ├── product/                # 产品页
│   │   ├── pricing/                # 定价页
│   │   ├── about/                 # 关于页
│   │   ├── resources/              # 资源页
│   │   ├── trending/               # 完整榜单页
│   │   ├── globals.css             # 全局样式
│   │   ├── layout.tsx             # 根布局
│   │   └── page.tsx               # 首页
│   ├── components/
│   │   ├── Navbar.tsx             # 导航栏组件
│   │   ├── AuthButton.tsx         # 认证按钮
│   │   └── SessionProvider.tsx    # Session 提供者
│   ├── services/
│   │   ├── priceService.ts        # CoinGecko 价格服务
│   │   └── aiScanService.ts       # AI 扫描服务
│   ├── storage/
│   │   └── database/              # Supabase 数据库
│   │       ├── supabase-admin.ts  # 管理员客户端
│   │       └── shared/
│   │           └── schema.ts      # 数据库 Schema
│   ├── auth.ts                    # NextAuth 配置
│   └── lib/
│       └── utils.ts               # 工具函数
├── public/                        # 静态资源
└── scripts/                       # 构建与启动脚本
```

## 环境变量

```env
# Supabase
COZE_SUPABASE_URL=https://xxx.supabase.co
COZE_SUPABASE_SERVICE_ROLE_KEY=xxx

# NextAuth
AUTH_SECRET=xxx
NEXTAUTH_URL=http://localhost:5000
```

## 开发命令

```bash
pnpm dev      # 开发环境（端口 5000）
pnpm build    # 生产构建
pnpm start    # 生产环境
```

## 数据存储

- 候补名单数据存储在 `data/waitlist.json`
- 开发环境：项目根目录下的 `data/`
- 生产环境：`/tmp/data/`

---

# 项目上下文

### 版本技术栈

- **Framework**: Next.js 16 (App Router)
- **Core**: React 19
- **Language**: TypeScript 5
- **UI 组件**: shadcn/ui (基于 Radix UI)
- **Styling**: Tailwind CSS 4

## 目录结构

```
├── public/                 # 静态资源
├── scripts/                # 构建与启动脚本
│   ├── build.sh            # 构建脚本
│   ├── dev.sh              # 开发环境启动脚本
│   ├── prepare.sh          # 预处理脚本
│   └── start.sh            # 生产环境启动脚本
├── src/
│   ├── app/                # 页面路由与布局
│   │   ├── api/            # API 路由
│   │   ├── globals.css     # 全局样式
│   │   ├── layout.tsx      # 根布局
│   │   └── page.tsx        # 首页
│   ├── components/ui/      # Shadcn UI 组件库
│   ├── hooks/              # 自定义 Hooks
│   ├── lib/                # 工具库
│   │   └── utils.ts        # 通用工具函数 (cn)
│   └── server.ts           # 自定义服务端入口
├── next.config.ts          # Next.js 配置
├── package.json            # 项目依赖管理
└── tsconfig.json           # TypeScript 配置
```

- 项目文件（如 app 目录、pages 目录、components 等）默认初始化到 `src/` 目录下。

## 包管理规范

**仅允许使用 pnpm** 作为包管理器，**严禁使用 npm 或 yarn**。
**常用命令**：
- 安装依赖：`pnpm add <package>`
- 安装开发依赖：`pnpm add -D <package>`
- 安装所有依赖：`pnpm install`
- 移除依赖：`pnpm remove <package>`

## 开发规范

### 编码规范

- 默认按 TypeScript `strict` 心智写代码；优先复用当前作用域已声明的变量、函数、类型和导入，禁止引用未声明标识符或拼错变量名。
- 禁止隐式 `any` 和 `as any`；函数参数、返回值、解构项、事件对象、`catch` 错误在使用前应有明确类型或先完成类型收窄，并清理未使用的变量和导入。

### next.config 配置规范

- 配置的路径不要写死绝对路径，必须使用 path.resolve(__dirname, ...)、import.meta.dirname 或 process.cwd() 动态拼接。

### Hydration 问题防范

1. 严禁在 JSX 渲染逻辑中直接使用 typeof window、Date.now()、Math.random() 等动态数据。**必须使用 'use client' 并配合 useEffect + useState 确保动态内容仅在客户端挂载后渲染**；同时严禁非法 HTML 嵌套（如 <p> 嵌套 <div>）。
2. **禁止使用 head 标签**，优先使用 metadata，详见文档：https://nextjs.org/docs/app/api-reference/functions/generate-metadata
   1. 三方 CSS、字体等资源可在 `globals.css` 中顶部通过 `@import` 引入或使用 next/font
   2. preload, preconnect, dns-prefetch 通过 ReactDOM 的 preload、preconnect、dns-prefetch 方法引入
   3. json-ld 可阅读 https://nextjs.org/docs/app/guides/json-ld

## UI 设计与组件规范 (UI & Styling Standards)

- 模板默认预装核心组件库 `shadcn/ui`，位于`src/components/ui/`目录下
- Next.js 项目**必须默认**采用 shadcn/ui 组件、风格和规范，**除非用户指定用其他的组件和规范。**
