#!/bin/bash

# ============================================
# Kairos Alpha Platform - 部署脚本
# 部署到 Vercel (免费)
# ============================================

set -e

echo "=========================================="
echo "  Kairos Alpha Platform 部署脚本"
echo "=========================================="
echo ""

# 颜色定义
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# 检查命令
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# 步骤 1: 检查必要工具
echo -e "${YELLOW}[1/5] 检查必要工具...${NC}"

if ! command_exists git; then
    echo -e "${RED}✗ Git 未安装${NC}"
    echo "  请先安装 Git: https://git-scm.com/download"
    exit 1
fi
echo -e "${GREEN}✓ Git 已安装${NC}"

if ! command_exists node; then
    echo -e "${RED}✗ Node.js 未安装${NC}"
    echo "  请先安装 Node.js: https://nodejs.org/"
    exit 1
fi
echo -e "${GREEN}✓ Node.js 已安装${NC}"

# 步骤 2: 安装依赖
echo ""
echo -e "${YELLOW}[2/5] 安装项目依赖...${NC}"
npm install
echo -e "${GREEN}✓ 依赖安装完成${NC}"

# 步骤 3: 构建项目
echo ""
echo -e "${YELLOW}[3/5] 构建项目...${NC}"
npm run build
echo -e "${GREEN}✓ 构建完成${NC}"

# 步骤 4: Git 初始化和推送
echo ""
echo -e "${YELLOW}[4/5] Git 初始化...${NC}"

# 检查是否已有远程仓库
if git remote -v | grep -q origin; then
    echo -e "${YELLOW}  已存在远程仓库，跳过初始化${NC}"
else
    echo "  请输入你的 GitHub 用户名:"
    read -r GITHUB_USERNAME
    
    echo "  请输入仓库名称 (默认: kairos):"
    read -r REPO_NAME
    REPO_NAME=${REPO_NAME:-kairos}
    
    # 初始化 Git
    git init
    git add .
    git commit -m "Initial commit: Kairos Alpha Platform"
    git branch -M main
    
    # 创建远程仓库并推送
    echo ""
    echo -e "${YELLOW}  正在创建 GitHub 仓库...${NC}"
    
    # 使用 GitHub API 创建仓库
    curl -u "$GITHUB_USERNAME" https://api.github.com/user/repos -d "{\"name\":\"$REPO_NAME\",\"description\":\"Kairos Alpha - 币安 Alpha 代币热度预判平台\"}" 2>/dev/null || true
    
    git remote add origin "https://github.com/$GITHUB_USERNAME/$REPO_NAME.git"
    git push -u origin main
    
    echo -e "${GREEN}✓ GitHub 仓库创建并推送完成${NC}"
fi

# 步骤 5: Vercel 部署
echo ""
echo -e "${YELLOW}[5/5] Vercel 部署...${NC}"
echo ""
echo "  请按以下步骤操作:"
echo "  1. 访问 https://vercel.com 并登录 (推荐使用 GitHub 账号)"
echo "  2. 点击 'Add New...' → 'Project'"
echo "  3. 选择 '$REPO_NAME' 仓库"
echo "  4. 点击 'Deploy'"
echo ""
echo -e "${GREEN}==========================================${NC}"
echo "  部署说明"
echo -e "${GREEN}==========================================${NC}"
echo ""
echo "  部署完成后，你的网站将获得:"
echo "  ✓ 真实的币安 API 数据"
echo "  ✓ 全球 CDN 加速"
echo "  ✓ 免费 SSL 证书"
echo "  ✓ 自动部署"
echo ""
echo "  环境变量配置 (可选):"
echo "  - NEXT_PUBLIC_SUPABASE_URL"
echo "  - COZE_SUPABASE_SERVICE_ROLE_KEY"
echo "  - AUTH_SECRET"
echo ""

# 可选: 直接安装 Vercel CLI 并部署
echo ""
read -p "是否现在安装 Vercel CLI 并部署? (y/n): " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${YELLOW}  安装 Vercel CLI...${NC}"
    npm install -g vercel
    echo -e "${YELLOW}  请在浏览器中授权 Vercel 访问 GitHub${NC}"
    vercel login
    vercel --prod
    echo -e "${GREEN}✓ 部署完成!${NC}"
fi

echo ""
echo -e "${GREEN}==========================================${NC}"
echo "  部署脚本执行完毕!"
echo -e "${GREEN}==========================================${NC}"
