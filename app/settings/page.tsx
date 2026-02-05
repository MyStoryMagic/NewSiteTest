'use client'
import { BottomNav, Card, Btn, T } from '@/components/MagicUI'

export default function Settings() {
  return (
    <main className="min-h-screen" style={{ background: T.navy }}>
      <div className="max-w-md mx-auto p-5 pb-24 relative z-10">
        <h1 className="text-2xl font-semibold mb-6" style={{ color: T.white }}>Settings</h1>

        <Card className="p-5 mb-4">
          <h2 className="font-semibold mb-3" style={{ color: T.white }}>Account</h2>
          <div className="flex justify-between py-2 border-b" style={{ borderColor: T.border }}>
            <span style={{ color: T.muted }}>Email</span>
            <span style={{ color: T.white }}>demo@mystorymagic.com</span>
          </div>
          <div className="flex justify-between py-2 border-b" style={{ borderColor: T.border }}>
            <span style={{ color: T.muted }}>Plan</span>
            <span style={{ color: T.gold }}>⭐ Premium</span>
          </div>
        </Card>

        <Card className="p-5 mb-4">
          <h2 className="font-semibold mb-3" style={{ color: T.white }}>Children</h2>
          <div className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'rgba(255,255,255,.05)' }}>
            <span className="text-xl">👧</span>
            <div>
              <p className="font-medium" style={{ color: T.white }}>Emma</p>
              <p className="text-sm" style={{ color: T.muted }}>5 years · animals, space, fairies</p>
            </div>
          </div>
        </Card>

        <Card className="p-5 mb-4">
          <h2 className="font-semibold mb-3" style={{ color: T.white }}>Family Voices</h2>
          <div className="space-y-2">
            {[
              { name: 'Mummy', emoji: '👩', role: 'Mother' },
              { name: 'Daddy', emoji: '👨', role: 'Father' },
            ].map(v => (
              <div key={v.name} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'rgba(255,255,255,.05)' }}>
                <span className="text-xl">{v.emoji}</span>
                <div className="flex-1">
                  <p className="font-medium" style={{ color: T.white }}>{v.name}</p>
                  <p className="text-sm" style={{ color: T.muted }}>{v.role}</p>
                </div>
              </div>
            ))}
            <div className="p-3 rounded-xl text-center text-sm cursor-pointer" style={{ border: `1px dashed ${T.border}`, color: T.muted }}>
              + Add Another Voice (2 remaining)
            </div>
          </div>
        </Card>

        <Btn v="secondary" onClick={() => window.location.href = '/'}>Log Out</Btn>
      </div>
      <BottomNav active="settings" onChange={(t) => {
        if (t === 'stories') window.location.href = '/'
        if (t === 'classics') window.location.href = '/classics'
      }} />
    </main>
  )
}
