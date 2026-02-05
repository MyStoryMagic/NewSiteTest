'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Prompt, XIcon, T } from '@/components/MagicUI'

const PG = [
  { text: "Once upon a time, in a meadow filled with golden sunflowers, there lived a little rabbit named Luna.", ill: '🌻🐰🌻', pr: null },
  { text: "Luna had the softest silver fur and the most curious whiskers that twitched whenever she discovered something new.", ill: '✨🐰✨', pr: { type: 'action' as const, text: 'Wiggle your nose like Luna!' } },
  { text: "One evening, as the stars began to peek through the purple sky, Luna noticed something magical happening in the old oak tree.", ill: '🌟🌳🌙', pr: null },
  { text: "A gentle glow was coming from a hollow in the trunk, warm and inviting like a tiny lantern in the night.", ill: '🌳💡✨', pr: { type: 'question' as const, text: 'What do you think is glowing?' } },
  { text: "Luna hopped closer, her heart beating with excitement and just a little bit of wonder.", ill: '🐰💫', pr: null },
  { text: "Inside the hollow, she found a family of fireflies having a celebration, their lights dancing like tiny stars.", ill: '✨🪲✨🪲✨', pr: { type: 'action' as const, text: 'Flicker your fingers like fireflies!' } },
  { text: '"Would you like to join us?" asked the eldest firefly. Luna smiled, feeling the warmth of new friendship.', ill: '🐰🤝🪲', pr: { type: 'hug' as const, text: 'Time for a friendship hug!' } },
  { text: "And so, under the canopy of stars, Luna danced with the fireflies until her eyes grew heavy with happy dreams.", ill: '😴💤🌙', pr: { type: 'end' as const, text: 'Close your eyes and dream of fireflies...' } },
]

const DIM = [
  { bg: '#1a1a2e', fg: '#f5f5f5' },
  { bg: '#141422', fg: '#d0d0d0' },
  { bg: '#0d0d18', fg: '#a0a0a0' },
]

const FS: Record<string, string> = { medium: '20px', large: '26px', xlarge: '32px' }

export default function Reading() {
  const router = useRouter()
  const [pg, setPg] = useState(0)
  const [fs, setFs] = useState<'medium' | 'large' | 'xlarge'>('large')
  const [dim, setDim] = useState(0)
  const [prompts, setPrompts] = useState(true)
  const [settings, setSettings] = useState(false)

  const p = PG[pg], c = DIM[dim]
  const next = () => pg < PG.length - 1 ? setPg(pg + 1) : router.push('/')
  const prev = () => pg > 0 && setPg(pg - 1)

  return (
    <div onClick={next} className="min-h-screen flex flex-col cursor-pointer transition-colors duration-500 relative select-none"
      style={{ background: c.bg, fontFamily: 'Georgia, serif' }}>

      {/* header */}
      <div className="p-4 flex justify-between items-center" style={{ opacity: .7 }}>
        <button onClick={e => { e.stopPropagation(); router.push('/') }} className="w-10 h-10 flex items-center justify-center">
          <XIcon c={c.fg} />
        </button>
        <span className="text-sm" style={{ color: c.fg, fontFamily: 'Inter,system-ui' }}>{pg + 1} / {PG.length}</span>
        <button onClick={e => { e.stopPropagation(); setSettings(!settings) }} className="w-10 h-10 flex items-center justify-center">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c.fg} strokeWidth="2">
            <circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
          </svg>
        </button>
      </div>

      {/* settings panel */}
      {settings && (
        <div onClick={e => e.stopPropagation()} className="absolute top-16 right-4 w-64 rounded-2xl p-5 z-50 shadow-xl"
          style={{ background: T.charcoal, fontFamily: 'Inter,system-ui' }}>
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-sm font-semibold" style={{ color: T.white }}>Reading Settings</h4>
            <button onClick={() => setSettings(false)} className="text-xs" style={{ color: T.muted }}>✕</button>
          </div>
          <p className="text-xs mb-2" style={{ color: T.muted }}>Text Size</p>
          <div className="flex gap-2 mb-4">
            {(['medium','large','xlarge'] as const).map(s => (
              <button key={s} onClick={() => setFs(s)} className="flex-1 py-2 rounded-lg font-semibold transition-colors"
                style={{ background: fs === s ? T.lavender : T.border, color: fs === s ? T.navy : T.muted, fontSize: s === 'medium' ? 12 : s === 'large' ? 14 : 16 }}>Aa</button>
            ))}
          </div>
          <p className="text-xs mb-2" style={{ color: T.muted }}>Brightness</p>
          <div className="flex gap-2 mb-4">
            {[0,1,2].map(l => (
              <button key={l} onClick={() => setDim(l)} className="flex-1 py-2 rounded-lg text-[10px] font-medium transition-colors"
                style={{ background: dim === l ? T.lavender : T.border, color: dim === l ? T.navy : T.muted }}>{['Normal','Dim','Extra'][l]}</button>
            ))}
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm" style={{ color: T.white }}>Prompts</span>
            <button onClick={() => setPrompts(!prompts)} className="w-11 h-6 rounded-full relative transition-colors"
              style={{ background: prompts ? T.lavender : T.border }}>
              <div className="w-4 h-4 rounded-full bg-white absolute top-1 transition-all" style={{ left: prompts ? 24 : 4 }} />
            </button>
          </div>
        </div>
      )}

      {/* story content */}
      <div className="flex-1 flex flex-col justify-center px-7">
        <div className="text-center text-5xl mb-8" style={{ opacity: dim === 2 ? .6 : .8 }}>{p.ill}</div>
        <p className="text-center" style={{ color: c.fg, fontSize: FS[fs], lineHeight: '1.8' }}>{p.text}</p>
      </div>

      {/* prompt */}
      {prompts && p.pr && (
        <div className="px-7 pb-5"><Prompt type={p.pr.type} text={p.pr.text} /></div>
      )}

      {/* dots */}
      <div className="flex justify-center gap-1.5 pb-4">
        {PG.map((_, i) => (
          <div key={i} onClick={e => { e.stopPropagation(); setPg(i) }}
            className="rounded-full cursor-pointer transition-all"
            style={{ width: i === pg ? 20 : 6, height: 6, background: i === pg ? T.lavender : `${c.fg}40` }} />
        ))}
      </div>
      <div className="text-center pb-5" style={{ opacity: .4 }}>
        <p className="text-xs" style={{ color: c.fg, fontFamily: 'Inter,system-ui' }}>Tap anywhere to continue</p>
      </div>

      {/* back tap zone */}
      <div onClick={e => { e.stopPropagation(); prev() }}
        className="absolute left-0 top-16 bottom-20 w-14 cursor-pointer" style={{ opacity: pg > 0 ? 1 : 0 }} />
    </div>
  )
}
