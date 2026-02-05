'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Sparkles, Badge, Card, ChapterProgress, ProgressBar, BottomNav, Avatar, PlayIcon, PauseIcon, SkipBack, SkipFwd, CheckIcon, T } from '@/components/MagicUI'

const CL = [
  { id: 'alice', title: 'Alice in Wonderland', by: 'Lewis Carroll', emoji: '🐰', col: '#9333ea',
    eps: [
      { t: 'Down the Rabbit Hole', d: '3:12', done: true },
      { t: 'The Pool of Tears', d: '3:08', done: true },
      { t: "The Queen's Garden", d: '3:15', done: false },
      { t: 'A Mad Tea Party', d: '2:58', done: false },
      { t: 'The Trial', d: '3:22', done: false },
    ] },
  { id: 'peter', title: 'Peter Pan', by: 'J.M. Barrie', emoji: '🧚', col: '#14b8a6',
    eps: [
      { t: 'The Shadow', d: '3:05', done: false },
      { t: 'Flight to Neverland', d: '3:18', done: false },
      { t: 'The Lost Boys', d: '3:02', done: false },
      { t: 'Captain Hook', d: '3:12', done: false },
      { t: 'The Final Battle', d: '3:08', done: false },
    ] },
  { id: 'oz', title: 'The Wizard of Oz', by: 'L. Frank Baum', emoji: '🌪️', col: '#10b981',
    eps: [
      { t: 'The Cyclone', d: '3:10', done: false },
      { t: 'The Scarecrow', d: '3:05', done: false },
      { t: 'The Tin Man', d: '3:12', done: false },
      { t: 'The Cowardly Lion', d: '3:00', done: false },
      { t: 'The Emerald City', d: '3:28', done: false },
    ] },
  { id: 'jungle', title: 'The Jungle Book', by: 'Rudyard Kipling', emoji: '🐻', col: '#f97316',
    eps: [
      { t: "Mowgli's Brothers", d: '3:15', done: false },
      { t: "Baloo's Lessons", d: '3:08', done: false },
      { t: "Kaa's Hunting", d: '3:12', done: false },
      { t: 'Tiger! Tiger!', d: '3:05', done: false },
      { t: 'The Spring Running', d: '3:20', done: false },
    ] },
]

export default function Classics() {
  const [view, setView] = useState<'grid' | 'eps' | 'play'>('grid')
  const [sel, setSel] = useState(CL[0])
  const [epIdx, setEpIdx] = useState(0)

  /* ─── COLLECTION ─── */
  if (view === 'grid') return (
    <main className="min-h-screen" style={{ background: T.navy }}>
      <Sparkles />
      <div className="max-w-md mx-auto p-5 pb-24 relative z-10">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{ background: `linear-gradient(135deg,${T.cream},${T.gold})` }}>📚</div>
          <div>
            <h1 className="text-2xl font-semibold" style={{ color: T.white }}>15 Min Classics</h1>
            <p className="text-sm" style={{ color: T.muted }}>Timeless stories, bedtime-sized</p>
          </div>
        </div>
        <p className="text-sm my-4" style={{ color: T.muted }}>5 episodes × 3 minutes each. One classic across the week.</p>
        <div className="grid grid-cols-2 gap-4">
          {CL.map(c => {
            const done = c.eps.filter(e => e.done).length
            return (
              <div key={c.id} onClick={() => { setSel(c); setView('eps'); }}
                className="rounded-2xl p-4 cursor-pointer min-h-[180px] flex flex-col justify-between relative"
                style={{ background: `linear-gradient(135deg,${c.col}40,${T.navy})` }}>
                {done > 0 && <div className="absolute top-3 right-3"><Badge v="lavender">{done}/5</Badge></div>}
                <div className="w-16 h-16 rounded-xl flex items-center justify-center text-3xl" style={{ background: 'rgba(255,255,255,.1)' }}>{c.emoji}</div>
                <div>
                  <h3 className="text-[15px] font-semibold mb-1" style={{ color: T.white }}>{c.title}</h3>
                  <p className="text-xs mb-2" style={{ color: T.muted }}>{c.by}</p>
                  <p className="text-[11px]" style={{ color: T.cream }}>15 min · 5 episodes</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
      <BottomNav active="classics" onChange={(t) => { if (t === 'stories') window.location.href = '/'; if (t === 'settings') window.location.href = '/settings'; }} />
    </main>
  )

  /* ─── EPISODES ─── */
  if (view === 'eps') {
    const done = sel.eps.filter(e => e.done).length
    const cur = done
    return (
      <main className="min-h-screen" style={{ background: T.navy }}>
        <div className="pt-14 px-5 pb-6 relative" style={{ background: `linear-gradient(180deg,${sel.col}40,${T.navy})` }}>
          <button onClick={() => setView('grid')} className="absolute top-5 left-5 w-9 h-9 rounded-full flex items-center justify-center" style={{ background: 'rgba(255,255,255,.1)' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={T.white} strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
          </button>
          <div className="w-36 h-36 mx-auto mb-5 rounded-2xl flex items-center justify-center text-7xl" style={{ background: `${sel.col}40` }}>{sel.emoji}</div>
          <h1 className="text-2xl font-semibold text-center mb-1" style={{ color: T.white }}>{sel.title}</h1>
          <p className="text-sm text-center mb-1" style={{ color: T.muted }}>{sel.by}</p>
          <p className="text-sm text-center" style={{ color: T.cream }}>🎙️ British Grandmother</p>
        </div>
        <div className="px-5 py-6">
          <ChapterProgress eps={sel.eps} cur={cur} onTap={(i) => { setEpIdx(i); setView('play'); }} accent={sel.col} />
          <p className="text-xs text-center mt-2" style={{ color: T.muted }}>{done}/5 episodes complete</p>
        </div>
        <div className="px-5 pb-24">
          <p className="text-xs uppercase tracking-wider mb-3" style={{ color: T.muted }}>Episodes</p>
          <div className="space-y-2">
            {sel.eps.map((ep, i) => (
              <div key={i} onClick={() => { setEpIdx(i); setView('play'); }}
                className="rounded-xl p-4 flex items-center gap-3 cursor-pointer"
                style={{ background: i === cur ? `${sel.col}20` : T.charcoal, border: i === cur ? `1px solid ${sel.col}40` : '1px solid transparent' }}>
                <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
                  style={{ background: ep.done ? T.lavender : i === cur ? sel.col : T.border }}>
                  {ep.done ? <CheckIcon /> : i === cur ? <PlayIcon s={14} c="#fff" /> : <span className="text-sm font-semibold" style={{ color: T.muted }}>{i+1}</span>}
                </div>
                <div className="flex-1">
                  <p className="text-[15px] font-medium" style={{ color: T.white }}>{ep.t}</p>
                  <p className="text-sm" style={{ color: T.muted }}>Episode {i+1} · {ep.d}</p>
                </div>
                {i === cur && !ep.done && <Badge v="gold">CONTINUE</Badge>}
              </div>
            ))}
          </div>
        </div>
      </main>
    )
  }

  /* ─── PLAYBACK ─── */
  const PlayView = () => {
    const [playing, setPlaying] = useState(false)
    const ep = sel.eps[epIdx]
    return (
      <main className="min-h-screen flex flex-col" style={{ background: T.navy }}>
        <div className="p-5">
          <button onClick={() => setView('eps')} className="flex items-center gap-1 text-sm" style={{ color: T.muted }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
            {sel.title}
          </button>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center px-5">
          <div className="w-60 h-60 rounded-3xl flex items-center justify-center text-[100px] mb-8"
            style={{ background: `${sel.col}40`, boxShadow: '0 30px 80px rgba(0,0,0,.4)' }}>{sel.emoji}</div>
          <h2 className="text-xl font-semibold text-center mb-1" style={{ color: T.white }}>{ep.t}</h2>
          <p className="text-sm mb-5" style={{ color: T.muted }}>Episode {epIdx+1} of 5 · {ep.d}</p>
          <div className="flex gap-2 mb-6">
            {sel.eps.map((e, i) => (
              <div key={i} onClick={() => setEpIdx(i)} className="rounded-full cursor-pointer transition-all"
                style={{ width: i === epIdx ? 12 : 8, height: i === epIdx ? 12 : 8, background: e.done ? T.lavender : i === epIdx ? T.white : T.charcoal }} />
            ))}
          </div>
        </div>
        <div className="px-6 pb-10">
          <ProgressBar pct={35} />
          <div className="flex justify-between mt-2 text-xs" style={{ color: T.muted }}><span>1:05</span><span>-2:10</span></div>
          <div className="flex items-center justify-center gap-8 my-4">
            <button onClick={() => epIdx > 0 && setEpIdx(epIdx-1)} className="p-2" style={{ opacity: epIdx > 0 ? 1 : .3 }}><SkipBack /></button>
            <button onClick={() => setPlaying(!playing)} className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: T.white }}>
              {playing ? <PauseIcon /> : <PlayIcon />}
            </button>
            <button onClick={() => epIdx < 4 && setEpIdx(epIdx+1)} className="p-2" style={{ opacity: epIdx < 4 ? 1 : .3 }}><SkipFwd /></button>
          </div>
          <div className="flex items-center justify-center gap-2">
            <Avatar initials="BG" custom size={28} />
            <span className="text-sm" style={{ color: T.muted }}>British Grandmother</span>
          </div>
        </div>
      </main>
    )
  }

  return <PlayView />
}
