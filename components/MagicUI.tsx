'use client';
import React, { useState } from 'react';

/* ─── colour tokens ─── */
export const T = {
  navy: '#1a1a2e', navyDim: '#141422', navyXDim: '#0d0d18',
  charcoal: '#2d2d44', border: '#3d3d54',
  lavender: '#b8a9d9', cream: '#e8d5b7', gold: '#d4a574', green: '#7cb97c',
  white: '#f5f5f5', muted: '#a0a0a0', dimmed: '#6a6a8a',
} as const;

/* ─── Sparkles ─── */
const STARS = [
  { l: '10%', t: '8%', s: 3, d: 0 }, { l: '25%', t: '15%', s: 2, d: .5 },
  { l: '85%', t: '10%', s: 3, d: 1 }, { l: '70%', t: '20%', s: 2, d: 1.5 },
  { l: '45%', t: '5%', s: 4, d: .3 }, { l: '90%', t: '25%', s: 2, d: .8 },
];
export function Sparkles({ count = 6 }: { count?: number }) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {STARS.slice(0, count).map((s, i) => (
        <div key={i} className="absolute animate-pulse-soft" style={{ left: s.l, top: s.t, animationDelay: `${s.d}s` }}>
          <div className="rounded-full" style={{ width: s.s, height: s.s, background: T.cream, opacity: .6 }} />
        </div>
      ))}
    </div>
  );
}

/* ─── Button ─── */
export function Btn({ children, onClick, v = 'primary', disabled, className = '' }: {
  children: React.ReactNode; onClick?: () => void; v?: 'primary' | 'secondary' | 'ghost' | 'gold'; disabled?: boolean; className?: string;
}) {
  const map = {
    primary: `bg-[${T.lavender}] text-[${T.navy}]`,
    secondary: `border border-[${T.border}] text-[${T.white}]`,
    ghost: `text-[${T.lavender}]`,
    gold: `bg-gradient-to-r from-[${T.cream}] to-[${T.gold}] text-[${T.navy}]`,
  };
  return (
    <button onClick={onClick} disabled={disabled}
      className={`w-full py-3.5 px-6 rounded-[30px] font-semibold text-[15px] transition-all
        disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 active:scale-[.98] ${className}`}
      style={{
        background: v === 'primary' ? T.lavender : v === 'gold' ? `linear-gradient(135deg,${T.cream},${T.gold})` : 'transparent',
        color: (v === 'primary' || v === 'gold') ? T.navy : v === 'ghost' ? T.lavender : T.white,
        border: v === 'secondary' ? `1px solid ${T.border}` : 'none',
      }}
    >{children}</button>
  );
}

/* ─── Card ─── */
export function Card({ children, className = '', onClick, active }: {
  children: React.ReactNode; className?: string; onClick?: () => void; active?: boolean;
}) {
  return (
    <div onClick={onClick}
      className={`rounded-2xl transition-all ${onClick ? 'cursor-pointer hover:brightness-110' : ''} ${className}`}
      style={{ background: T.charcoal, border: `1px solid ${active ? T.lavender : 'transparent'}` }}
    >{children}</div>
  );
}

/* ─── Avatar ─── */
export function Avatar({ initials, custom, size = 48, active }: {
  initials: string; custom?: boolean; size?: number; active?: boolean;
}) {
  return (
    <div className={`rounded-full flex items-center justify-center font-bold ${active ? 'ring-2 ring-[#b8a9d9]' : ''}`}
      style={{
        width: size, height: size, fontSize: size * .35,
        background: custom ? `linear-gradient(135deg,${T.cream},${T.gold})` : T.charcoal,
        color: custom ? T.navy : T.white,
      }}
    >{initials}</div>
  );
}

/* ─── Badge ─── */
export function Badge({ children, v = 'default' }: { children: React.ReactNode; v?: 'default' | 'lavender' | 'gold' | 'green' }) {
  const bg = { default: T.charcoal, lavender: `${T.lavender}33`, gold: `${T.gold}33`, green: `${T.green}33` };
  const fg = { default: T.white, lavender: T.lavender, gold: T.gold, green: T.green };
  return <span className="px-2.5 py-1 rounded-xl text-[11px] font-semibold" style={{ background: bg[v], color: fg[v] }}>{children}</span>;
}

/* ─── ProgressBar ─── */
export function ProgressBar({ pct, thumb = true, h = 4 }: { pct: number; thumb?: boolean; h?: number }) {
  return (
    <div className="rounded-full relative" style={{ height: h, background: 'rgba(255,255,255,.15)' }}>
      <div className="h-full rounded-full transition-all duration-300" style={{ width: `${pct}%`, background: T.white }} />
      {thumb && <div className="absolute top-1/2 w-3 h-3 rounded-full" style={{ left: `${pct}%`, transform: 'translate(-50%,-50%)', background: T.white }} />}
    </div>
  );
}

/* ─── ChapterProgress ─── */
export function ChapterProgress({ eps, cur, onTap, accent = T.lavender }: {
  eps: { done: boolean }[]; cur: number; onTap?: (i: number) => void; accent?: string;
}) {
  return (
    <div className="flex items-center">
      {eps.map((e, i) => (
        <React.Fragment key={i}>
          <div onClick={() => onTap?.(i)}
            className="w-8 h-8 rounded-full flex items-center justify-center cursor-pointer transition-all"
            style={{
              background: e.done ? T.lavender : i === cur ? accent : T.charcoal,
              border: i === cur ? `2px solid ${accent}` : 'none',
            }}>
            {e.done
              ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={T.navy} strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
              : <span style={{ color: i === cur ? '#fff' : T.muted, fontSize: 12, fontWeight: 600 }}>{i + 1}</span>}
          </div>
          {i < eps.length - 1 && <div className="flex-1 h-0.5 mx-1" style={{ background: e.done ? T.lavender : T.charcoal }} />}
        </React.Fragment>
      ))}
    </div>
  );
}

/* ─── BottomNav ─── */
const NAV_ICONS: Record<string, React.ReactNode> = {
  stories: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>,
  classics: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  voices: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/></svg>,
  settings: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
};
export function BottomNav({ active, onChange }: { active: string; onChange: (t: string) => void }) {
  return (
    <div className="bottom-nav">
      {['stories', 'classics', 'voices', 'settings'].map(id => (
        <div key={id} onClick={() => onChange(id)} className="text-center cursor-pointer" style={{ opacity: active === id ? 1 : .45 }}>
          <div style={{ color: active === id ? T.lavender : T.muted }}>{NAV_ICONS[id]}</div>
          <p className="text-[10px] mt-1 capitalize" style={{ color: active === id ? T.lavender : T.muted }}>{id}</p>
          {active === id && <div className="w-1 h-1 rounded-full mx-auto mt-1" style={{ background: T.lavender }} />}
        </div>
      ))}
    </div>
  );
}

/* ─── EngagementPrompt ─── */
export function Prompt({ type, text }: { type: 'hug' | 'question' | 'action' | 'end'; text: string }) {
  const emoji = { hug: '🤗', question: '❓', action: '👆', end: '😴' };
  return (
    <div className={`rounded-2xl p-4 flex items-center gap-3 prompt-${type}`}>
      <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-lg shrink-0">{emoji[type]}</div>
      <p className="text-[15px] italic" style={{ color: T.white }}>{text}</p>
    </div>
  );
}

/* ─── ModeSelector ─── */
export function ModeSelector({ onNarrate, onRead }: { onNarrate: () => void; onRead: () => void }) {
  return (
    <div className="space-y-3">
      <Card onClick={onNarrate} className="p-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl" style={{ background: T.border }}>🔊</div>
          <div className="flex-1">
            <h4 className="font-semibold text-base" style={{ color: T.white }}>Read to Me</h4>
            <p className="text-sm" style={{ color: T.muted }}>Listen with narration</p>
          </div>
          <span style={{ color: T.muted }}>→</span>
        </div>
      </Card>
      <div onClick={onRead} className="rounded-2xl p-4 cursor-pointer transition-colors hover:brightness-110"
        style={{ background: `${T.lavender}18`, border: `1px solid ${T.lavender}40` }}>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl" style={{ background: T.lavender }}>📖</div>
          <div className="flex-1">
            <h4 className="font-semibold text-base" style={{ color: T.white }}>I'll Read</h4>
            <p className="text-sm mb-2" style={{ color: T.muted }}>Large text with prompts</p>
            <div className="flex gap-2"><Badge v="lavender">Night-friendly</Badge><Badge v="lavender">Prompts</Badge></div>
          </div>
          <span style={{ color: T.lavender }}>→</span>
        </div>
      </div>
    </div>
  );
}

/* ─── PlayIcon / PauseIcon (reusable) ─── */
export const PlayIcon  = ({ s = 28, c = T.navy }: { s?: number; c?: string }) => <svg width={s} height={s} viewBox="0 0 24 24" fill={c}><polygon points="5 3 19 12 5 21"/></svg>;
export const PauseIcon = ({ s = 28, c = T.navy }: { s?: number; c?: string }) => <svg width={s} height={s} viewBox="0 0 24 24" fill={c}><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>;
export const SkipBack  = () => <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={T.muted} strokeWidth="2"><polygon points="19 20 9 12 19 4"/><line x1="5" y1="19" x2="5" y2="5"/></svg>;
export const SkipFwd   = () => <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={T.muted} strokeWidth="2"><polygon points="5 4 15 12 5 20"/><line x1="19" y1="5" x2="19" y2="19"/></svg>;
export const ChevLeft  = ({ c = T.muted }: { c?: string }) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>;
export const ChevDown  = ({ c = T.muted }: { c?: string }) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>;
export const XIcon     = ({ c = T.white }: { c?: string }) => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;
export const CheckIcon = ({ c = T.navy }: { c?: string }) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>;
