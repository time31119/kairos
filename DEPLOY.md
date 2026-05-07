# Kairos Alpha Platform - 部署指南

## 方式一：Vercel 部署（推荐，免费）

### 步骤 1：推送代码到 GitHub

```bash
cd /workspace/projects

# 初始化 Git（如果还未初始化）
git init
git add .
git commit -m "Kairos Alpha Platform"

# 创建 GitHub 仓库并推送
git remote add origin https://github.com/你的用户名/kairos.git
git push -u origin main
```

### 步骤 2：Vercel 部署

1. 访问 [vercel.com](https://vercel.com)
2. 用 GitHub 账号登录
3. 点击 **"New Project"**
4. 选择 `kairos` 仓库
5. 点击 **"Deploy"**

### 步骤 3：完成！🎉

访问 Vercel 提供的域名即可使用！

---

## 方式二：使用部署脚本

```bash
cd /workspace/projects
chmod +x scripts/deploy-vercel.sh
./scripts/deploy-vercel.sh
```

---

## 方式三：本地预览

```bash
cd /workspace/projects
npm install
npm run dev
```

访问 http://localhost:5000

---

## 环境变量（可选）

如需完整功能，在 Vercel 中配置：

| 变量名 | 说明 | 必需 |
|--------|------|------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase 项目 URL | 否 |
| `COZE_SUPABASE_SERVICE_ROLE_KEY` | Supabase 服务密钥 | 否 |
| `AUTH_SECRET` | NextAuth 密钥 | 否 |

---

## 部署后功能

| 功能 | 说明 |
|------|------|
| 真实币安数据 | 自动获取币安 API 数据 |
| Alpha 热力榜 | 实时展示 Alpha 代币 |
| 今日推荐 | 每日 5 个推荐代币 |
| AI 扫描器 | 六维评分分析 |

---

## 常见问题

### Q: 部署需要付费吗？
A: 个人使用 Vercel Hobby 方案完全免费。

### Q: 如何绑定自定义域名？
A: Vercel → Project → Settings → Domains

### Q: 数据是实时的吗？
A: 是的，部署后自动获取币安官方实时数据。
