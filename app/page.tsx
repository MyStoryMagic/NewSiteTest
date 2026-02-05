'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Sparkles, Btn, Card, Badge, ProgressBar, BottomNav, ModeSelector, Avatar, PlayIcon, PauseIcon, SkipBack, SkipFwd, ChevDown, T } from '@/components/MagicUI'

const STORIES = [
  { id: 1, title: 'Luna and the Fireflies', theme: 'Calm', dur: '4:35', emoji: '🐰', pct: 65 },
  { id: 2, title: 'The Brave Little Cloud', theme: 'Courage', dur: '3:48', emoji: '☁️', pct: 0 },
  { id: 3, title: "Captain Whiskers' Adventure", theme: 'Adventure', dur: '5:12', emoji: '🐱', pct: 0 },
]

const AI_VOICES = [
  { id: 'kore', name: 'Kore', init: 'KO', desc: 'Warm, friendly' },
  { id: 'aoede', name: 'Aoede', init: 'AO', desc: 'Gentle, soothing' },
  { id: 'charon', name: 'Charon', init: 'CH', desc: 'Calm, deep' },
  { id: 'puck', name: 'Puck', init: 'PU', desc: 'Playful, fun' },
]

const THEMES = [
  { id: 'adventure', name: 'Adventure', emoji: '🗺️' },
  { id: 'magic', name: 'Magic', emoji: '✨' },
  { id: 'animals', name: 'Animals', emoji: '🐾' },
  { id: 'space', name: 'Space', emoji: '🚀' },
  { id: 'bedtime', name: 'Calm', emoji: '🌙' },
]

export default function Home() {
  const [tab, setTab] = useState('stories')
  const [view, setView] = useState<'home' | 'create' | 'mode' | 'play'>('home')
  const [story, setStory] = useState(STORIES[0])
  const [selTheme, setSelTheme] = useState('')
  const [selVoice, setSelVoice] = useState('kore')

  const goTab = (t: string) => {
    if (t === 'classics') { window.location.href = '/classics'; return }
    if (t === 'settings') { window.location.href = '/settings'; return }
    setTab(t)
  }

  /* ─── HOME ─── */
  if (view === 'home') return (
    <main className="min-h-screen" style={{ background: T.navy }}>
      <Sparkles />
      <div className="max-w-md mx-auto p-5 pb-24 relative z-10">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold mb-1" style={{ color: T.white }}>Good evening</h1>
          <p className="text-sm" style={{ color: T.muted }}>Stories for Emma, Age 5</p>
        </div>

        {/* Continue */}
        <div className="mb-6">
          <p className="text-xs uppercase tracking-wider mb-3" style={{ color: T.muted }}>Continue Listening</p>
          <Card onClick={() => { setStory(STORIES[0]); setView('mode'); }} className="p-4">
            <div className="flex gap-4">
              <div className="w-20 h-20 rounded-xl flex items-center justify-center text-4xl shrink-0"
                style={{ background: 'linear-gradient(135deg,#2d2d5a,#1a1a3a)' }}>{STORIES[0].emoji}</div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold mb-1 truncate" style={{ color: T.white }}>{STORIES[0].title}</h3>
                <p className="text-sm mb-3" style={{ color: T.muted }}>{STORIES[0].theme} · {STORIES[0].dur}</p>
                <ProgressBar pct={STORIES[0].pct} thumb={false} h={3} />
                <p className="text-xs mt-2" style={{ color: T.lavender }}>{STORIES[0].pct}% complete</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Quick links */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <Link href="/classics">
            <Card className="p-4 text-center">
              <div className="text-3xl mb-2">📚</div>
              <p className="text-sm font-medium" style={{ color: T.white }}>15 Min Classics</p>
              <p className="text-xs" style={{ color: T.muted }}>Timeless stories</p>
            </Card>
          </Link>
          <Card onClick={() => setView('create')} className="p-4 text-center">
            <div className="text-3xl mb-2">✨</div>
            <p className="text-sm font-medium" style={{ color: T.white }}>New Story</p>
            <p className="text-xs" style={{ color: T.muted }}>Create magic</p>
          </Card>
        </div>

        {/* Recent */}
        <p className="text-xs uppercase tracking-wider mb-3" style={{ color: T.muted }}>Recent Stories</p>
        <div className="space-y-3">
          {STORIES.slice(1).map(s => (
            <Card key={s.id} onClick={() => { setStory(s); setView('mode'); }} className="p-4 flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl" style={{ background: T.border }}>{s.emoji}</div>
              <div className="flex-1">
                <p className="text-[15px] font-medium" style={{ color: T.white }}>{s.title}</p>
                <p className="text-sm" style={{ color: T.muted }}>{s.theme} · {s.dur}</p>
              </div>
              <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: T.lavender }}>
                <PlayIcon s={14} />
              </div>
            </Card>
          ))}
        </div>
      </div>
      <BottomNav active={tab} onChange={goTab} />
    </main>
  )

  /* ─── CREATE ─── */
  if (view === 'create') return (
    <main className="min-h-screen" style={{ background: T.navy }}>
      <Sparkles />
      <div className="max-w-md mx-auto p-5 pb-24 relative z-10">
        <button onClick={() => setView('home')} className="flex items-center gap-1 text-sm mb-4" style={{ color: T.muted }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg> Back
        </button>
        <h1 className="text-2xl font-semibold mb-6" style={{ color: T.white }}>Create a Story</h1>

        <p className="text-sm mb-3" style={{ color: T.muted }}>Choose a theme</p>
        <div className="grid grid-cols-5 gap-2 mb-6">
          {THEMES.map(th => (
            <button key={th.id} onClick={() => setSelTheme(th.id)}
              className="p-3 rounded-xl text-center transition-all"
              style={{ background: selTheme === th.id ? T.lavender : T.charcoal, color: selTheme === th.id ? T.navy : T.white }}>
              <span className="text-2xl block mb-1">{th.emoji}</span>
              <span className="text-[10px]">{th.name}</span>
            </button>
          ))}
        </div>

        <p className="text-sm mb-3" style={{ color: T.muted }}>Choose narrator</p>
        <div className="grid grid-cols-4 gap-2 mb-6">
          {AI_VOICES.map(v => (
            <button key={v.id} onClick={() => setSelVoice(v.id)}
              className="p-3 rounded-xl text-center transition-all"
              style={{ background: selVoice === v.id ? T.lavender : T.charcoal, color: selVoice === v.id ? T.navy : T.white }}>
              <div className="mx-auto mb-1"><Avatar initials={v.init} size={32} /></div>
              <span className="text-xs block">{v.name}</span>
              <span className="text-[10px] opacity-70">{v.desc}</span>
            </button>
          ))}
        </div>

        <Btn onClick={() => { setView('play'); }} disabled={!selTheme}>✨ Generate Story</Btn>
      </div>
      <BottomNav active={tab} onChange={goTab} />
    </main>
  )

  /* ─── MODE SELECT ─── */
  if (view === 'mode') return (
    <main className="min-h-screen" style={{ background: T.navy }}>
      <div className="max-w-md mx-auto p-5 relative z-10">
        <button onClick={() => setView('home')} className="flex items-center gap-1 text-sm mb-4" style={{ color: T.muted }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg> Back
        </button>
        <Card className="p-5 mb-8">
          <div className="flex gap-4 items-center">
            <div className="w-16 h-16 rounded-xl flex items-center justify-center text-3xl"
              style={{ background: 'linear-gradient(135deg,#2d2d5a,#1a1a3a)' }}>{story.emoji}</div>
            <div>
              <h2 className="text-xl font-semibold" style={{ color: T.white }}>{story.title}</h2>
              <p className="text-sm" style={{ color: T.muted }}>{story.theme} · {story.dur}</p>
            </div>
          </div>
        </Card>
        <p className="text-xs uppercase tracking-wider mb-4" style={{ color: T.muted }}>How would you like to enjoy this story?</p>
        <ModeSelector onNarrate={() => setView('play')} onRead={() => { window.location.href = '/reading'; }} />
      </div>
    </main>
  )

  /* ─── PLAYBACK ─── */
  const PlayView = () => {
    const [playing, setPlaying] = useState(false)
    return (
      <main className="min-h-screen flex flex-col" style={{ background: T.navy }}>
        <div className="p-5 flex items-center">
          <button onClick={() => setView('mode')} className="flex items-center gap-1 text-sm" style={{ color: T.muted }}>
            <ChevDown /> Playing from Library
          </button>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center px-5">
          <div className="w-64 h-64 rounded-3xl flex items-center justify-center text-8xl mb-8 relative"
            style={{ background: 'linear-gradient(135deg,#2d2d5a,#1a1a3a)', boxShadow: '0 30px 80px rgba(0,0,0,.4)' }}>
            <div className="absolute top-8 right-10 w-10 h-10 rounded-full"
              style={{ background: `linear-gradient(135deg,${T.cream},${T.gold})` }} />
            {story.emoji}
          </div>
          <h2 className="text-xl font-semibold text-center mb-1" style={{ color: T.white }}>{story.title}</h2>
          <p className="text-sm" style={{ color: T.muted }}>{story.theme} · {story.dur}</p>
        </div>
        <div className="px-6 pb-10">
          <ProgressBar pct={35} />
          <div className="flex justify-between mt-2 text-xs" style={{ color: T.muted }}><span>1:35</span><span>-3:00</span></div>
          <div className="flex items-center justify-center gap-8 my-4">
            <button className="p-2"><SkipBack /></button>
            <button onClick={() => setPlaying(!playing)} className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: T.white }}>
              {playing ? <PauseIcon /> : <PlayIcon />}
            </button>
            <button className="p-2"><SkipFwd /></button>
          </div>
          <div className="rounded-xl p-3 flex items-center gap-3" style={{ background: 'rgba(255,255,255,.08)' }}>
            <Avatar initials="BG" size={36} />
            <div className="flex-1">
              <p className="text-sm font-semibold" style={{ color: T.white }}>British Grandmother</p>
              <p className="text-xs" style={{ color: T.muted }}>Tap to change voice</p>
            </div>
            <ChevDown />
          </div>
        </div>
      </main>
    )
  }

  return <PlayView />
}
