# MoeCTF 邀请函生成器

一个基于 Nuxt 3 的邀请函海报生成器，支持自定义团队名称。

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

复制 `.env.example` 文件到 `.env`:

```bash
cp .env.example .env
```

根据需要修改 `.env` 文件中的配置：

```env
# 应用信息
APP_NAME=MoeCTF 2024
APP_DESCRIPTION=Generate custom invitation posters for MoeCTF 2024

# 比赛信息
CONTEST_START_TIME=2024/01/01 00:00(UTC+8)
CONTEST_END_TIME=2024/01/03 22:00(UTC+8)
CONTEST_TITLE=MoeCTF 2024

# 图片生成配置
IMAGE_MAX_NAME_LENGTH=50
IMAGE_DEFAULT_FONT_SIZE=100
IMAGE_MIN_FONT_SIZE=24
IMAGE_FONT_FAMILY=Noto Sans SC
IMAGE_TEXT_COLOR=white
IMAGE_POSITION_Y_OFFSET=25
IMAGE_QUALITY=90
IMAGE_COMPRESSION_LEVEL=6

# 图片阴影配置
IMAGE_SHADOW_DX=2
IMAGE_SHADOW_DY=2
IMAGE_SHADOW_STD_DEVIATION=3
IMAGE_SHADOW_FLOOD_COLOR=#000
IMAGE_SHADOW_FLOOD_OPACITY=0.3
```

### 3. 运行开发服务器

```bash
npm run dev
```

访问 `http://localhost:3000` 查看应用。

## 技术栈

- **框架**: Nuxt 3
- **样式**: Tailwind CSS + DaisyUI
- **图片处理**: Sharp
- **语言**: TypeScript
- **部署**: Vercel Serverless（Nuxt SSR）

## 项目结构

```
├── components/          # Vue 组件
├── composables/        # 可复用的逻辑
├── server/
│   ├── api/            # API 端点
│   └── assets/         # 构建时从 public/ 同步的底图（勿手动维护）
├── scripts/            # 构建与部署脚本
├── types/              # TypeScript 类型定义
├── utils/              # 工具函数
├── public/             # 静态资源
├── .env                # 环境变量配置
└── .env.example        # 环境变量示例
```

## 功能特性

- 实时海报生成
- 防抖输入优化
- 响应式设计
- 统一错误处理
- 环境变量配置
- TypeScript 类型支持
- 图片生成与下载

## 配置说明

### 环境变量

所有配置都通过环境变量管理，支持不同环境的配置：

- **开发环境**: `.env` 文件
- **生产环境**: 通过部署平台设置环境变量

### 配置分类

1. **应用配置**: 应用名称、描述等基础信息
2. **比赛配置**: 比赛时间、标题等比赛相关信息
3. **图片配置**: 字体、颜色、质量等图片生成参数

> 注意：API配置和错误消息已经在代码中写死，无需通过环境变量配置。

## 使用方法

1. 在输入框中输入团队名称
2. 点击"制作"按钮或等待自动生成
3. 生成的海报将显示在右侧
4. 点击「下载」按钮保存海报

## 部署

### Vercel（推荐）

本项目包含 `/api/generate-poster` 服务端 API，请使用 **SSR / Serverless** 部署，**不要**使用 `npm run generate` 静态导出。

#### 部署步骤

1. 将仓库导入 [Vercel](https://vercel.com)
2. Framework Preset 选 **Nuxt.js**，Build Command 保持 `npm run build`
3. 在 **Settings → Environment Variables** 配置下表变量（Production / Preview 建议都配）
4. Deploy 完成后运行 smoke test 验证 API

#### Vercel 环境变量清单

| 变量 | 必填 | 说明 |
|------|------|------|
| `CONTEST_TITLE` | 建议 | 页面主标题 |
| `CONTEST_START_TIME` | 建议 | 比赛开始时间展示 |
| `CONTEST_END_TIME` | 建议 | 比赛结束时间展示 |
| `APP_NAME` | 可选 | 浏览器标题，默认 `MoeCTF 2024` |
| `APP_DESCRIPTION` | 可选 | SEO 描述 |
| `IMAGE_*` | 可选 | 海报字体、颜色、质量等，均有默认值 |

> 未配置时使用 `nuxt.config.ts` 中的默认值，本地开发可复制 `.env.example` 为 `.env`。

#### 底图维护

只需替换 **`public/invitations.png`**。构建时会自动同步底图与中文字体到 `server/assets/` 并打进 Serverless 函数：

```bash
npm run prebuild   # 或任意 npm run dev / npm run build 时自动执行
```

> 海报文字通过 **opentype.js** 将 **Noto Sans SC** 转为 SVG 路径再合成（Sharp/librsvg 不支持 SVG `@font-face` 嵌入字体，Vercel Linux 上会乱码）。

#### 部署后验证（Smoke Test）

```bash
# 替换为你的 Vercel 域名
npm run smoke-test -- https://your-app.vercel.app

# 本地 preview 验证
npm run build && npm run preview
npm run smoke-test -- http://localhost:3000
```

成功时会输出 `OK: ... size=... bytes`。

#### 本地构建验证

```bash
npm run build
```

### 静态生成（不适用本项目）

若移除服务端 API 后才可使用：

```bash
npm run generate
```

## 开发说明

### 添加新功能

1. 在 `.env.example` 中添加新的环境变量（如果是动态配置）
2. 更新 `nuxt.config.ts` 中的 `runtimeConfig`
3. 在 `utils/config.ts` 中添加配置访问函数
4. 在相关组件中使用新配置

> 对于固定的配置（如错误消息、API设置），建议直接在 `utils/config.ts` 中定义常量。

### 环境变量命名规范

- 应用相关: `APP_*`
- 比赛相关: `CONTEST_*`
- 图片相关: `IMAGE_*`