# ImageMatte - Cloudflare Pages 部署指南

## 一键部署到 Cloudflare Pages

### 前提条件
1. Cloudflare 账户（免费）
2. GitHub 仓库：`hxl999/image-background-remover3`

### 步骤1：获取 Cloudflare API Token

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com)
2. 进入 **My Profile** → **API Tokens**
3. 点击 **Create Token**
4. 选择模板：**Edit Cloudflare Workers**
5. 权限设置：
   - Account: Workers Scripts: Edit
   - Account: Workers Routes: Edit
   - Zone: Zone: Read
6. 点击 **Continue to summary** → **Create Token**
7. 复制生成的 Token（只显示一次）

### 步骤2：获取 Cloudflare Account ID

1. 在 Cloudflare Dashboard 首页
2. 右侧找到 **Account ID**（格式：`xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`）
3. 复制 Account ID

### 步骤3：配置 GitHub Secrets

在 GitHub 仓库设置中配置以下 Secrets：

1. 打开：`https://github.com/hxl999/image-background-remover3/settings/secrets/actions`
2. 点击 **New repository secret**
3. 添加以下 Secrets：

| Secret 名称 | 值 | 说明 |
|------------|-----|------|
| `CLOUDFLARE_API_TOKEN` | 你的 Cloudflare API Token | 步骤1获取 |
| `CLOUDFLARE_ACCOUNT_ID` | 你的 Cloudflare Account ID | 步骤2获取 |
| `REMOVEBG_API_KEY` | `wnPqYWXaesV49H3yUvp3eToA` | Remove.bg API Key |

### 步骤4：手动触发部署

1. 打开 GitHub Actions 页面：
   `https://github.com/hxl999/image-background-remover3/actions`
2. 点击 **Deploy to Cloudflare Pages** 工作流
3. 点击 **Run workflow** → **Run workflow**
4. 等待部署完成（约2-3分钟）

### 步骤5：访问网站

部署成功后，访问：
**https://imagematte.pages.dev**

## 自动部署配置

推送代码到 `main` 分支会自动触发部署。

## 环境变量配置

### 生产环境变量（Cloudflare Pages）
在 Cloudflare Pages 项目中配置：

1. 打开 Cloudflare Pages 项目
2. 进入 **Settings** → **Environment variables**
3. 添加变量：
   - `REMOVEBG_API_KEY`: `wnPqYWXaesV49H3yUvp3eToA`
   - `NODE_VERSION`: `22`
   - `NEXT_PUBLIC_APP_ENV`: `production`

## 故障排除

### 常见问题

#### 1. 部署失败：API Token 无效
- 检查 Token 权限是否正确
- 重新生成 Token

#### 2. 构建失败：环境变量缺失
- 确保所有 Secrets 已正确配置
- 检查 `.env.local` 文件

#### 3. API 调用失败
- 检查 Remove.bg API Key 是否有效
- 验证 API 配额（免费版每月50张）

#### 4. 网站无法访问
- 检查 Cloudflare Pages 项目状态
- 查看部署日志

### 查看日志

1. **GitHub Actions 日志**：
   `https://github.com/hxl999/image-background-remover3/actions`

2. **Cloudflare Pages 日志**：
   - 登录 Cloudflare Dashboard
   - 进入 Pages 项目
   - 点击 **Deployments** → 查看部署日志

## 手动部署命令

如果需要手动部署，可以使用 Wrangler CLI：

```bash
# 安装 Wrangler
npm install -g wrangler

# 登录 Cloudflare
wrangler login

# 部署到 Cloudflare Pages
wrangler pages deploy .next --project-name=imagematte
```

## 技术支持

如有问题，请检查：
1. [Cloudflare Pages 文档](https://developers.cloudflare.com/pages/)
2. [Next.js 部署指南](https://nextjs.org/docs/deployment)
3. [Remove.bg API 文档](https://www.remove.bg/api)

---

**部署状态**：✅ 配置完成  
**预计部署时间**：2-3分钟  
**生成域名**：https://imagematte.pages.dev