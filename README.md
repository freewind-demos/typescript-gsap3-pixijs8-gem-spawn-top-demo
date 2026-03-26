# GSAP 3 + Pixi.js 8 宝石生成入场动画

## 简介

这个 Demo 演示如何使用 Pixi.js 8 创建宝石图形，配合 GSAP 3 实现从屏幕上方掉落弹跳的入场动画效果。

## 快速开始

### 环境要求

- Node.js 18+
- npm

### 运行

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

点击画布可以生成新的宝石，观看入场动画效果。

## 概念讲解

### Pixi.js 8 画布初始化

```typescript
import { Application, Graphics } from 'pixi.js'

const app = new Application()

await app.init({
  width: 400,
  height: 600,
  backgroundColor: 0x1a1a2e,
  canvas: document.getElementById('game-canvas') as HTMLCanvasElement,
})
```

创建 Pixi 应用需要先 `new Application()` 然后调用 `init()` 异步初始化，返回的 canvas 元素可以直接放到 HTML 中。

### 用 Graphics 画宝石

```typescript
const gem = new Graphics()

// 画菱形宝石
gem.poly([
  { x: 0, y: -size },
  { x: size, y: 0 },
  { x: 0, y: size },
  { x: -size, y: 0 },
])
gem.fill(0xff4444)
gem.stroke({ width: 2, color: 0xffffff })
```

`Graphics` 对象使用 `poly()` 定义多边形顶点，然后通过 `fill()` 和 `stroke()` 填充和描边。

### GSAP 3 时间线

```typescript
import gsap from 'gsap'

const tl = gsap.timeline()

tl.to(gem.scale, {
  x: 1,
  y: 1,
  duration: 0.3,
  ease: 'back.out(1.7)',
})
.to(gem, {
  y: TARGET_Y,
  duration: 0.6,
  ease: 'bounce.out',
}, '<')
```

`gsap.timeline()` 可以把多个动画串联执行。`'<'` 表示新动画与前一个动画同时开始。`ease: 'bounce.out'` 制造弹跳效果。

## 完整示例

完整代码在 `src/main.ts`。

核心逻辑：
1. 初始化 Pixi.js 应用
2. 创建 `createGem()` 函数画宝石图形
3. 创建 `spawnGemWithEffect()` 函数用 GSAP 实现入场动画
4. 点击画布时调用 `spawnNewGem()` 生成新宝石

入场动画效果：
- 初始时宝石在屏幕上方（y = -50），缩放为 0，旋转 4 圈
- 先用 `back.out(1.7)` 弹跳放大到正常大小
- 同时向下弹跳落到目标位置
- 旋转也恢复到 0 度

## 注意事项

- Pixi.js 8 使用 `init()` 代替旧版的 `Application()` 构造函数参数方式
- GSAP 的 `ease` 参数支持多种预设，如 `bounce.out`、`back.out`、`power2.out` 等
- `<` 符号在 timeline 中表示"从上一个动画开始时开始"
