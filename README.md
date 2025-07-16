# MoeCTF 2024 邀请函生成器

一个基于 Nuxt 3 的邀请函海报生成器，支持自定义团队名称。

## 🚀 快速开始

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
IMAGE_FONT_FAMILY=Arial, sans-serif
IMAGE_TEXT_COLOR=white
IMAGE_POSITION_Y_OFFSET=25
IMAGE_OUTPUT_FORMAT=png
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

## 🛠️ 技术栈

- **框架**: Nuxt 3
- **样式**: Tailwind CSS + DaisyUI
- **图片处理**: Sharp
- **语言**: TypeScript
- **部署**: 静态生成

## 📁 项目结构

```
├── components/          # Vue 组件
├── composables/        # 可复用的逻辑
├── server/api/         # API 端点
├── types/              # TypeScript 类型定义
├── utils/              # 工具函数
├── public/             # 静态资源
├── .env                # 环境变量配置
└── .env.example        # 环境变量示例
```

## 🎨 功能特性

- ✅ 实时海报生成
- ✅ 防抖输入优化
- ✅ 响应式设计
- ✅ 统一错误处理
- ✅ 环境变量配置
- ✅ TypeScript 类型支持
- ✅ 图片缓存优化

## 🔧 配置说明

### 环境变量

所有配置都通过环境变量管理，支持不同环境的配置：

- **开发环境**: `.env` 文件
- **生产环境**: 通过部署平台设置环境变量

### 配置分类

1. **应用配置**: 应用名称、描述等基础信息
2. **比赛配置**: 比赛时间、标题等比赛相关信息
3. **图片配置**: 字体、颜色、质量等图片生成参数

> 注意：API配置和错误消息已经在代码中写死，无需通过环境变量配置。

## 📱 使用方法

1. 在输入框中输入团队名称
2. 点击"制作"按钮或等待自动生成
3. 生成的海报将显示在右侧
4. 点击"Download"按钮下载海报

## 🚀 部署

### 静态生成

```bash
npm run generate
```

### 构建

```bash
npm run build
```

## 📝 开发说明

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