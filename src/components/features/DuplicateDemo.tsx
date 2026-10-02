import { useId, useState } from 'react'

type Variant = 'original' | 'resized' | 'edited' | 'similar' | 'different'

type Candidate = { name: string; note: string; distance: number; exact?: boolean; variant: Variant }

const REFERENCE = 'IMG_2041.HEIC'

// Sample files; distances are illustrative.
const CANDIDATES: Candidate[] = [
  { name: 'IMG_2041 (1).HEIC', note: 'Byte-for-byte copy', distance: 0, exact: true, variant: 'original' },
  { name: 'IMG_2041-small.jpg', note: 'Resized and re-encoded', distance: 3, variant: 'resized' },
  { name: 'IMG_2041-edit.jpg', note: 'Cropped, warmer colours', distance: 7, variant: 'edited' },
  { name: 'IMG_2077.HEIC', note: 'Same place, different shot', distance: 13, variant: 'similar' },
  { name: 'DSC_0193.JPG', note: 'Unrelated photo', distance: 29, variant: 'different' },
]

// TidyFlow's default (duplicates.hamming_distance_threshold in config.yaml).
const DEFAULT_THRESHOLD = 8

export function DuplicateDemo() {
  const [threshold, setThreshold] = useState(DEFAULT_THRESHOLD)
  const sliderId = useId()
  const flagged = CANDIDATES.filter((c) => c.exact || c.distance <= threshold).length

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <Photo variant="original" className="size-12 shrink-0" />
        <div className="min-w-0">
          <p className="truncate text-sm font-medium">{REFERENCE}</p>
          <p className="text-xs text-mist-dim">Compared against every other image in the folder</p>
        </div>
      </div>

      <ul className="divide-y divide-white/[0.06] rounded-lg border border-white/[0.08]">
        {CANDIDATES.map((c) => {
          const status = c.exact ? 'exact' : c.distance <= threshold ? 'near' : 'unique'
          return (
            <li key={c.name} className="flex items-center gap-3 px-3 py-2.5">
              <Photo variant={c.variant} className={`size-9 shrink-0 transition-opacity ${status === 'unique' ? 'opacity-45' : ''}`} />
              <div className="min-w-0 flex-1">
                <p className="truncate font-mono text-[0.78rem] text-white/90">{c.name}</p>
                <p className="truncate text-[0.72rem] text-mist-dim">{c.note}</p>
              </div>
              <span className="hidden w-20 shrink-0 text-right font-mono text-[0.7rem] text-mist sm:block">
                {c.exact ? 'identical' : `${c.distance} bits off`}
              </span>
              <span
                className={`w-[6.5rem] shrink-0 rounded border py-0.5 text-center font-mono text-[0.66rem] ${
                  status === 'unique' ? 'border-white/10 text-mist-dim' : 'border-[#dd5b00]/40 bg-[#4a1c07]/40 text-app-warn'
                }`}
              >
                {status === 'exact' ? 'Duplicate' : status === 'near' ? 'Near-duplicate' : 'Keep'}
              </span>
            </li>
          )
        })}
      </ul>

      <div>
        <div className="flex items-center justify-between gap-3">
          <label htmlFor={sliderId} className="text-sm text-mist">
            Hamming distance threshold
          </label>
          <span className="font-mono text-sm text-white">{threshold}</span>
        </div>
        <input
          id={sliderId}
          type="range"
          min={0}
          max={20}
          value={threshold}
          onChange={(e) => setThreshold(Number(e.target.value))}
          aria-valuetext={`${threshold}, ${flagged} of ${CANDIDATES.length} flagged`}
          className="mt-2 w-full cursor-pointer accent-brand-bright"
        />
        <p className="mt-1 text-xs text-mist-dim" aria-live="polite">
          {flagged} of {CANDIDATES.length} flagged. Lower is stricter.
        </p>
      </div>
    </div>
  )
}

const SKIES: Record<Variant, [string, string]> = {
  original: ['#24346f', '#f4b6c8'],
  resized: ['#24346f', '#f4b6c8'],
  edited: ['#4a2a73', '#ffb27a'],
  similar: ['#1f3d6e', '#f7c9a8'],
  different: ['#0e3a45', '#5fe0b0'],
}

/** A tiny generated "photo", so the demo needs no image files. */
function Photo({ variant, className = '' }: { variant: Variant; className?: string }) {
  const [top, bottom] = SKIES[variant]
  const crop = variant === 'edited' ? 'scale(1.25) translate(4%, 4%)' : undefined
  return (
    <div aria-hidden="true" className={`relative overflow-hidden rounded-md ring-1 ring-white/10 ${className}`}>
      <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, ${top}, ${bottom})`, transform: crop, filter: variant === 'resized' ? 'blur(0.6px)' : undefined }}>
        <div
          className="absolute aspect-square w-[30%] rounded-full bg-[#fff4d8]"
          style={{ left: variant === 'similar' ? '18%' : variant === 'different' ? '62%' : '56%', top: '20%' }}
        />
        <div
          className="absolute inset-x-0 bottom-0 h-3/5 bg-[#151b38]"
          style={{
            clipPath:
              variant === 'different'
                ? 'polygon(0 100%, 0 70%, 35% 40%, 70% 75%, 100% 45%, 100% 100%)'
                : 'polygon(0 100%, 0 55%, 22% 25%, 40% 60%, 62% 15%, 85% 55%, 100% 35%, 100% 100%)',
          }}
        />
        <div
          className="absolute inset-x-0 bottom-0 h-2/5 bg-[#0a0e20]"
          style={{ clipPath: variant === 'similar' ? 'polygon(0 100%, 0 40%, 45% 70%, 75% 30%, 100% 60%, 100% 100%)' : 'polygon(0 100%, 0 60%, 30% 30%, 55% 70%, 78% 40%, 100% 65%, 100% 100%)' }}
        />
      </div>
    </div>
  )
}
