# 在线工具集

常用开发工具，开箱即用。基于 React + TypeScript + Vite 构建的 Web 应用。

## 功能列表

### JSON 工具

| 工具 | 路径 | 描述 |
|------|------|------|
| **JSON 美化/压缩** | `/json-formatter` | 格式化、美化、压缩 JSON 字符串，支持语法高亮和错误提示 |
| **序列化转 JSON** | `/serialize-to-json` | 将 QueryString、PHP Serialize、键值对等序列化字符串转为 JSON |

### 编码工具

| 工具 | 路径 | 描述 |
|------|------|------|
| **Base64 编码/解码** | `/base64` | Base64 编码与解码，支持 UTF-8 中文字符 |
| **URL 编码/解码** | `/url-codec` | URL 编码与解码，支持 encodeURI 和 encodeURIComponent |

### 生成器

| 工具 | 路径 | 描述 |
|------|------|------|
| **二维码生成** | `/qrcode` | 输入文本或链接生成二维码，支持尺寸、纠错级别和颜色配置 |
| **条形码生成** | `/barcode` | 生成多种格式条形码，支持 CODE128、EAN13、CODE39 等 |

## 技术栈

- **框架**: React 19 + TypeScript
- **构建**: Vite 7
- **样式**: Tailwind CSS 4
- **路由**: React Router DOM 7
- **其他**: qrcode.react、react-barcode、react-hot-toast、react-icons

## 快速开始

### 安装依赖

```bash
npm install
```

### 开发

```bash
npm run dev
```

### 构建

```bash
npm run build
```

### 预览构建结果

```bash
npm run preview
```

### 测试

```bash
npm run test
```

### 代码检查

```bash
npm run lint
```

## 项目结构

```
src/
├── components/     # 通用组件
├── config/         # 工具配置
├── pages/          # 页面组件
├── utils/          # 工具函数
├── __tests__/      # 单元测试
└── App.tsx
```

## License

MIT
