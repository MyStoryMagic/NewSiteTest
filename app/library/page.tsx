'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import SleepyBear from '@/components/SleepyBear'
import { Sparkles } from '@/components/MagicUI'
import { supabase } from '@/lib/supabase'

export default function LibraryPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [stories, setStories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [playingId, setPlayingId] = useState<string | null>(null)

  useEffect(() => {
    loadStories()
  }, [])

  async function loadStories() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/signup')
      return
    }
    setUser(user)

    // Get stories with audio
    const { data } = await supabase
      .from('stories')
      .select('*, children(name)')
      .eq('user_id', user.id)
      .not('audio_url', 'is', null)
      .order('created_at', { ascending: false })

    setStories(data || [])
    setLoading(false)
  }

  async function deleteStory(storyId: string, audioUrl: string) {
    if (!confirm('Delete this story from your library?')) return

    try {
      // Delete audio from storage
      const fileName = audioUrl.split('/').pop()
      if (fileName) {
        await supabase.storage
          .from('story-audio')
          .remove([`${user.id}/${fileName}`])
      }

      // Update story record (remove audio_url, keep story text)
      await supabase
        .from('stories')
        .update({ audio_url: null })
        .eq('id', storyId)

      // Remove from local state
      setStories(stories.filter(s => s.id !== storyId))
    } catch (error) {
      console.error('Delete error:', error)
      alert('Failed to delete story')
    }
  }

  function formatDate(dateString: string) {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-AU', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

  function getThemeEmoji(theme: string) {
    const emojis: Record<string, string> = {
      fun: '🎉',
      homework: '📚',
      sharing: '🤝',
      bedtime: '🌙',
      bravery: '🦁'
    }
    return emojis[theme] || '✨'
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-magic-gradient p-6 flex items-center justify-center">
        <div className="text-white text-center">
          <SleepyBear mood="sleeping" size="medium" />
          <p className="mt-4">Loading your library...</p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-magic-gradient p-6">
      <Sparkles count={8} />

      <div className="mb-6 relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <SleepyBear mood="happy" size="small" />
            <div>
              <h1 className="text-white text-2xl font-display">Story Library</h1>
              <p className="text-purple-200 text-sm">{stories.length} saved stories</p>
            </div>
          </div>
          <button
            onClick={() => router.push('/stories')}
            className="px-4 py-2 bg-white/10 rounded-xl text-purple-200 hover:bg-white/20 transition"
          >
            ✨ New Story
          </button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto relative z-10">
        {stories.length === 0 ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 p-8 text-center">
            <SleepyBear mood="sleeping" size="medium" />
            <h2 className="text-white text-xl font-display mt-4 mb-2">No stories yet!</h2>
            <p className="text-purple-200 mb-6">Create a story and save it to your library</p>
            <button
              onClick={() => router.push('/stories')}
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-semibold text-white hover:opacity-90 transition"
            >
              ✨ Create Your First Story
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {stories.map(story => (
              <div
                key={story.id}
                className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 p-4"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xl">{getThemeEmoji(story.theme)}</span>
                      <h3 className="text-white font-display">
                        {story.children?.name}'s Story
                      </h3>
                    </div>
                    <p className="text-purple-300 text-sm">{formatDate(story.created_at)}</p>
                  </div>
                  <button
                    onClick={() => deleteStory(story.id, story.audio_url)}
                    className="text-purple-400 hover:text-red-400 transition p-2"
                    title="Delete from library"
                  >
                    🗑️
                  </button>
                </div>

                <p className="text-purple-100 text-sm mb-4 line-clamp-2">
                  {story.content.substring(0, 150)}...
                </p>

                {story.audio_url && (
                  <audio
                    controls
                    src={story.audio_url}
                    className="w-full"
                    onPlay={() => setPlayingId(story.id)}
                    onPause={() => setPlayingId(null)}
                    onEnded={() => setPlayingId(null)}
                  />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}