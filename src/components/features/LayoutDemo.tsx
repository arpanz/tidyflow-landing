import { useEffect, useRef, useState, type CSSProperties, type FormEvent } from 'react'
import { useInView, useReducedMotion } from '../../lib/hooks'

type TreeNode = { name: string; children?: TreeNode[] }
type Preset = { prompt: string; tree: TreeNode[] }

// The Architect proposes folders before anything is scanned, so these are structures only, without file counts.
const PRESETS: Preset[] = [
  {
    prompt: 'Split photos by year, keep screenshots separate',
    tree: [
      {
        name: 'Personal',
        children: [{ name: 'Photos', children: [{ name: '2024' }, { name: '2025' }, { name: '2026' }] }, { name: 'Screenshots' }],
      },
      { name: 'Documents' },
    ],
  },
  {
    prompt: 'Invoices by client, receipts by month',
    tree: [
      {
        name: 'Finance',
        children: [
          { name: 'Invoices', children: [{ name: 'Acme Corp' }, { name: 'Northwind' }] },
          { name: 'Receipts', children: [{ name: '2026-01' }, { name: '2026-02' }] },
          { name: 'Tax' },
        ],
      },
    ],
  },
  {
    prompt: 'Keep work and personal apart, code on its own',
    tree: [
      { name: 'Work', children: [{ name: 'Documents' }, { name: 'Presentations' }, { name: 'Spreadsheets' }] },
      { name: 'Personal', children: [{ name: 'Photos' }, { name: 'Notes' }] },
      { name: 'Development', children: [{ name: 'Code' }] },
    ],
  },
]

type Line = { name: string; guide: string; depth: number }

function flatten(nodes: TreeNode[], prefix = '', depth = 0, out: Line[] = []) {
  nodes.forEach((node, i) => {
    const last = i === nodes.length - 1
    out.push({ name: node.name, guide: prefix + (last ? '└─ ' : '├─ '), depth })
    if (node.children) flatten(node.children, prefix + (last ? '   ' : '│  '), depth + 1, out)
  })
  return out
}

/** Demo only: maps free text to the closest sample layout. */
function matchPreset(text: string) {
  const t = text.toLowerCase()
  if (/client|invoice|receipt|month|financ|bill|tax/.test(t)) return 1
  if (/work|personal|code|project|job|dev/.test(t)) return 2
  return 0
}

export function LayoutDemo() {
  const reduced = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, threshold: 0.5 })
  const [text, setText] = useState('')
  const [shown, setShown] = useState<number | null>(null)
  const [version, setVersion] = useState(0)
  const [job, setJob] = useState<{ target: number } | null>(null)
  const typing = job !== null

  const start = (target: number) => {
    if (reduced) {
      setText(PRESETS[target].prompt)
      setShown(target)
      setVersion((v) => v + 1)
      return
    }
    setText('')
    setJob({ target })
  }

  // Type the chosen prompt, then show its folders.
  useEffect(() => {
    if (!job) return
    const prompt = PRESETS[job.target].prompt
    let i = 0
    const timer = window.setInterval(() => {
      i += 1
      setText(prompt.slice(0, i))
      if (i >= prompt.length) {
        window.clearInterval(timer)
        setShown(job.target)
        setVersion((v) => v + 1)
        setJob(null)
      }
    }, 26)
    return () => window.clearInterval(timer)
  }, [job])

  // Play the first example once, the first time the demo is on screen.
  useEffect(() => {
    if (!inView) return
    const t = window.setTimeout(() => start(0), 250)
    return () => window.clearTimeout(t)
    // Runs once per mount; `start` is stable enough for that.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView])

  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (!text.trim() || typing) return
    setShown(matchPreset(text))
    setVersion((v) => v + 1)
  }

  const lines = shown === null ? [] : flatten(PRESETS[shown].tree)

  return (
    <div ref={ref} className="grid grid-cols-1 gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <div className="flex flex-col gap-3">
        <form onSubmit={submit} className="rounded-lg border border-white/10 bg-black/30 focus-within:border-brand-bright/60">
          <label htmlFor="layout-prompt" className="sr-only">
            Describe the categories you want
          </label>
          <textarea
            id="layout-prompt"
            rows={3}
            value={text}
            readOnly={typing}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) submit(e)
            }}
            className="block w-full resize-none bg-transparent px-3 pt-3 text-[0.95rem] leading-snug text-white placeholder:text-mist-dim focus:outline-none"
            placeholder="Describe your ideal categories or file rules in plain English…"
          />
          <div className="flex justify-end p-2">
            <button type="submit" className="btn btn-primary !h-8 !px-3.5 text-xs">
              Propose folders
            </button>
          </div>
        </form>

        <div className="flex flex-wrap gap-2" role="group" aria-label="Example requests">
          {PRESETS.map((p, i) => (
            <button
              key={p.prompt}
              type="button"
              onClick={() => start(i)}
              disabled={typing}
              className="rounded-md border border-white/10 px-2.5 py-1.5 text-left text-xs text-mist transition-colors hover:border-white/25 hover:text-white disabled:opacity-50"
            >
              {p.prompt}
            </button>
          ))}
        </div>
        <p className="mt-auto text-xs leading-relaxed text-mist-dim">
          In the app, the Architect sends your request to the model. Here, your words are matched to one of three sample layouts.
        </p>
      </div>

      <div className="min-h-[13rem] rounded-lg border border-white/[0.07] bg-black/30 p-4" aria-live="polite">
        <p className="font-mono text-xs text-mist">Proposed structure</p>
        {lines.length === 0 ? (
          <p className="mt-3 text-sm text-mist-dim">{typing ? 'Reading your request…' : 'Folders appear here.'}</p>
        ) : (
          <ul key={version} className="mt-2 font-mono text-[0.8rem] leading-[1.8]">
            {lines.map((line, i) => (
              <li key={i} className="tree-in whitespace-pre" style={{ '--delay': `${i * 45}ms` } as CSSProperties}>
                <span className="text-white/25">{line.guide}</span>
                <span className={line.depth === 0 ? 'text-white' : 'text-white/75'}>{line.name}/</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
