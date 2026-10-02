type Particle = {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  maxLife: number
  size: number
  color: string
  star: boolean
}

const COLORS = ['255,255,255', '214,232,255', '159,208,255']
const MAX_PARTICLES = 220

type EmitOptions = {
  count?: number
  /** Base velocity in px/s. */
  vx?: number
  vy?: number
  spread?: number
  /** Positional jitter in px. */
  jitter?: number
}

/** Tiny canvas particle system for the wizard's magic trail. Coordinates are CSS pixels. */
export class SparkleField {
  private canvas: HTMLCanvasElement
  private ctx: CanvasRenderingContext2D
  private particles: Particle[] = []
  private width = 0
  private height = 0

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas
    this.ctx = canvas.getContext('2d')!
  }

  resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const rect = this.canvas.getBoundingClientRect()
    this.width = rect.width
    this.height = rect.height
    this.canvas.width = Math.round(rect.width * dpr)
    this.canvas.height = Math.round(rect.height * dpr)
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  }

  get size() {
    return { width: this.width, height: this.height }
  }

  get active() {
    return this.particles.length > 0
  }

  emit(x: number, y: number, { count = 1, vx = -60, vy = 10, spread = 40, jitter = 6 }: EmitOptions = {}) {
    for (let i = 0; i < count && this.particles.length < MAX_PARTICLES; i++) {
      const maxLife = 0.7 + Math.random() * 0.9
      this.particles.push({
        x: x + (Math.random() - 0.5) * jitter,
        y: y + (Math.random() - 0.5) * jitter,
        vx: vx + (Math.random() - 0.5) * spread,
        vy: vy + (Math.random() - 0.5) * spread,
        life: maxLife,
        maxLife,
        size: 0.6 + Math.random() * 1.8,
        color: COLORS[(Math.random() * COLORS.length) | 0],
        star: Math.random() < 0.12,
      })
    }
  }

  /** Advance by `dt` seconds and redraw. */
  step(dt: number) {
    const { ctx } = this
    ctx.clearRect(0, 0, this.width, this.height)
    ctx.globalCompositeOperation = 'lighter'

    const alive: Particle[] = []
    for (const p of this.particles) {
      p.life -= dt
      if (p.life <= 0) continue
      p.vx *= 1 - 1.4 * dt
      p.vy = p.vy * (1 - 1.4 * dt) + 14 * dt
      p.x += p.vx * dt
      p.y += p.vy * dt
      alive.push(p)

      const t = p.life / p.maxLife
      const alpha = Math.min(1, t * 1.6) * 0.9
      if (p.star) {
        const r = p.size * 3.2 * t
        ctx.strokeStyle = `rgba(${p.color},${alpha})`
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.moveTo(p.x - r, p.y)
        ctx.lineTo(p.x + r, p.y)
        ctx.moveTo(p.x, p.y - r)
        ctx.lineTo(p.x, p.y + r)
        ctx.stroke()
      }
      ctx.fillStyle = `rgba(${p.color},${alpha * 0.18})`
      ctx.beginPath()
      ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2)
      ctx.fill()
      ctx.fillStyle = `rgba(${p.color},${alpha})`
      ctx.beginPath()
      ctx.arc(p.x, p.y, p.size * 0.8, 0, Math.PI * 2)
      ctx.fill()
    }
    this.particles = alive
  }

  clear() {
    this.particles = []
    this.ctx.clearRect(0, 0, this.width, this.height)
  }
}
