import './style.css'
import { Application, Graphics } from 'pixi.js'
import gsap from 'gsap'

// 宝石颜色
const GEM_COLORS = [0xff4444, 0x44ff44, 0x4444ff, 0xffff44, 0xff44ff]

// 画布尺寸
const CANVAS_WIDTH = 400
const CANVAS_HEIGHT = 600

// 目标位置（画布下方中央）
const TARGET_Y = CANVAS_HEIGHT - 100
const TARGET_X = CANVAS_WIDTH / 2

async function initApp() {
  const app = new Application()

  // 初始化 Pixi 应用
  await app.init({
    width: CANVAS_WIDTH,
    height: CANVAS_HEIGHT,
    backgroundColor: 0x1a1a2e,
    canvas: document.getElementById('game-canvas') as HTMLCanvasElement,
  })

  // 创建一枚宝石
  function createGem(color: number): Graphics {
    const gem = new Graphics()

    // 画宝石形状（菱形）
    const size = 30
    gem.poly([
      { x: 0, y: -size },
      { x: size, y: 0 },
      { x: 0, y: size },
      { x: -size, y: 0 },
    ])
    gem.fill(color)
    gem.stroke({ width: 2, color: 0xffffff })

    // 画高光
    gem.poly([
      { x: -size * 0.3, y: -size * 0.5 },
      { x: 0, y: -size * 0.2 },
      { x: -size * 0.5, y: 0 },
    ])
    gem.fill({ color: 0xffffff, alpha: 0.4 })

    gem.x = TARGET_X
    gem.y = -50 // 初始位置在屏幕上方
    gem.rotation = Math.random() * Math.PI * 2

    return gem
  }

  // 带旋转和缩放的入场动画（从顶部生成落下）
  function spawnGemWithEffect(gem: Graphics): gsap.core.Timeline {
    const tl = gsap.timeline()

    gem.scale.set(0)
    gem.rotation = Math.PI * 4

    tl.to(gem.scale, {
      x: 1,
      y: 1,
      duration: 0.3,
      ease: 'back.out(1.7)',
    })
    .to(
      gem,
      {
        y: TARGET_Y,
        rotation: 0,
        duration: 0.6,
        ease: 'bounce.out',
      },
      '<',
    )

    return tl
  }

  // 创建并生成一枚新宝石
  function spawnNewGem(): Graphics {
    const color = GEM_COLORS[Math.floor(Math.random() * GEM_COLORS.length)]
    const gem = createGem(color)
    app.stage.addChild(gem)
    spawnGemWithEffect(gem)
    return gem
  }

  // 初始生成一枚宝石
  spawnNewGem()

  // 点击画布生成新宝石
  app.canvas.addEventListener('click', () => {
    spawnNewGem()
  })

  console.log('Pixi.js + GSAP Gem Spawn Demo initialized')
}

initApp()
