# 图片背景移除工具 - MVP需求文档

## 项目概述
**项目名称**: CleanBG - 在线图片背景移除工具  
**核心价值**: 简单、快速、免费的在线图片背景移除服务  
**目标用户**: 普通用户、电商卖家、内容创作者、社交媒体用户  
**技术栈**: Next.js + Tailwind CSS + Remove.bg API + Cloudflare Pages  

## 核心功能需求

### 1. 图片上传功能
- **支持格式**: JPG, PNG, WebP (常见图片格式)
- **上传方式**: 
  - 拖拽上传 (Drag & Drop)
  - 点击选择文件
  - 移动端适配
- **文件限制**: 
  - 最大文件大小: 5MB (Remove.bg API限制)
  - 最小尺寸: 100x100像素
  - 最大尺寸: 2500x2500像素

### 2. 背景移除处理
- **处理流程**:
  1. 前端将图片转为Base64编码
  2. 调用Remove.bg API (POST请求)
  3. 接收返回的透明PNG图片
  4. 前端解码并显示结果
- **API配置**:
  - 使用Remove.bg免费API (50张/月)
  - 请求头: `X-Api-Key: [API_KEY]`
  - 参数: `size=auto`, `type=auto`

### 3. 结果展示与下载
- **预览功能**:
  - 左右对比视图 (原图 vs 移除背景后)
  - 切换背景颜色 (白/黑/透明/自定义)
  - 缩放查看细节
- **下载选项**:
  - 格式: PNG (透明背景)
  - 分辨率: 保持原图尺寸
  - 文件名: `cleanbg_[timestamp].png`

### 4. 用户体验需求
- **加载状态**: 上传中、处理中、完成状态显示
- **错误处理**: 
  - 文件过大/格式不支持提示
  - API调用失败提示
  - 网络错误处理
- **移动端优化**: 响应式设计，触摸友好

## 技术架构

### 前端架构
```
components/
  ├── UploadZone/      # 上传区域组件
  ├── Preview/         # 预览对比组件
  ├── Loading/         # 加载状态组件
  ├── Error/           # 错误提示组件
  └── Download/        # 下载按钮组件

pages/
  ├── index.js         # 主页面
  └── api/process.js   # API路由 (代理Remove.bg API)

styles/
  └── globals.css      # Tailwind配置
```

### API代理设计
```javascript
// pages/api/process.js
export default async function handler(req, res) {
  // 1. 验证请求 (防止滥用)
  // 2. 转发到Remove.bg API
  // 3. 返回处理结果
  // 4. 错误处理和日志
}
```

### 环境变量配置
```env
NEXT_PUBLIC_SITE_URL=https://cleanbg.pages.dev
REMOVEBG_API_KEY=your_api_key_here
```

## 非功能性需求

### 性能要求
- **页面加载**: < 2秒 (首次加载)
- **图片处理**: < 10秒 (取决于图片大小和网络)
- **并发处理**: 单用户单次处理 (免费版限制)

### 安全性
- **API密钥保护**: 通过Cloudflare环境变量存储
- **请求限制**: 防止API滥用
- **文件验证**: 前端和后端双重验证

### 可访问性
- **WCAG 2.1 AA标准**: 基础可访问性支持
- **键盘导航**: 完整键盘操作支持
- **屏幕阅读器**: 基本ARIA标签

## 部署方案

### Cloudflare Pages配置
```toml
# wrangler.toml
name = "cleanbg"
compatibility_date = "2026-03-26"

[env.production]
REMOVEBG_API_KEY = "{{REMOVEBG_API_KEY}}"
```

### 部署流程
1. **代码仓库**: GitHub (public/private)
2. **CI/CD**: Cloudflare Pages自动部署
3. **域名**: `cleanbg.pages.dev` (免费) 或自定义域名
4. **监控**: Cloudflare Analytics基础监控

## 开发计划

### 阶段1: MVP核心功能 (预计: 4-8小时)
- [ ] 项目初始化 (Next.js + Tailwind)
- [ ] 基础页面布局
- [ ] 图片上传组件
- [ ] Remove.bg API集成
- [ ] 结果预览和下载
- [ ] 基础错误处理
- [ ] 部署到Cloudflare Pages

### 阶段2: 体验优化 (后续)
- [ ] 拖拽上传优化
- [ ] 背景颜色切换
- [ ] 图片裁剪/调整
- [ ] 批量处理功能
- [ ] 用户反馈系统
- [ ] 使用统计

### 阶段3: 扩展功能 (可选)
- [ ] 用户账户系统
- [ ] 处理历史记录
- [ ] 高级编辑功能
- [ ] API服务收费
- [ ] 移动端App

## 成功指标

### 技术指标
- ✅ 网站可访问性: 99.9% uptime
- ✅ 图片处理成功率: >95%
- ✅ 平均处理时间: <5秒
- ✅ 移动端兼容性: 全平台支持

### 业务指标
- ✅ 每日活跃用户: 10+ (第一个月)
- ✅ 图片处理量: 50+/月 (免费API限制内)
- ✅ 用户满意度: 通过反馈收集
- ✅ 分享率: 社交分享功能使用率

## 风险与应对

### 技术风险
1. **Remove.bg API限制**: 免费版50张/月
   - 应对: 监控使用量，及时升级或切换方案
2. **图片大小限制**: 5MB可能不够
   - 应对: 前端压缩，提示用户优化图片
3. **API响应慢**: 影响用户体验
   - 应对: 优化加载状态，设置超时处理

### 业务风险
1. **竞争激烈**: 已有成熟工具
   - 应对: 专注简单易用，快速处理
2. **成本控制**: API调用费用
   - 应对: 免费版测试，验证需求后再考虑付费

## 下一步行动

### 立即行动 (今天)
1. [ ] 注册Remove.bg API Key
2. [ ] 创建GitHub仓库
3. [ ] 初始化Next.js项目
4. [ ] 搭建基础框架
5. [ ] 实现核心上传功能

### 短期行动 (本周)
1. [ ] 完成API集成
2. [ ] 实现预览下载功能
3. [ ] 基础UI/UX优化
4. [ ] 部署到Cloudflare
5. [ ] 基础测试验证

### 长期规划 (1-3个月)
1. [ ] 收集用户反馈
2. [ ] 优化性能体验
3. [ ] 考虑功能扩展
4. [ ] 探索商业模式

## 附录

### Remove.bg API文档
- 官方文档: https://www.remove.bg/api
- 免费额度: 50张/月
- 请求示例:
```bash
curl -H 'X-Api-Key: YOUR_API_KEY' \
  -F 'image_file=@input.jpg' \
  -f https://api.remove.bg/v1.0/removebg \
  -o no-bg.png
```

### 相关工具参考
1. **Remove.bg**: 市场领导者，API稳定
2. **BackgroundRemover**: 开源Python工具
3. **ClipDrop**: 多功能的AI图像工具
4. **Photopea**: 在线Photoshop，有背景移除功能

---

**文档版本**: v1.0  
**创建日期**: 2026-03-26  
**更新日期**: 2026-03-26  
**负责人**: 亭哥 + 小白  
**状态**: 草案 ✅