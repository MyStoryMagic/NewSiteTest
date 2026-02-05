import { NextRequest, NextResponse } from 'next/server'
import { ElevenLabsClient } from 'elevenlabs'
import { createClient } from '@supabase/supabase-js'

const elevenlabs = new ElevenLabsClient({
  apiKey: process.env.ELEVENLABS_API_KEY
})

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Voice story limits per tier
const VOICE_STORY_LIMITS = {
  free: 0,
  basic: 0,
  premium: 20, // 20 custom voice stories per month
}

// Check if billing cycle needs reset
function shouldResetCycle(cycleResetDate: string | null): boolean {
  if (!cycleResetDate) return true
  const resetDate = new Date(cycleResetDate)
  const now = new Date()
  return now.getMonth() !== resetDate.getMonth() || now.getFullYear() !== resetDate.getFullYear()
}

export async function POST(request: NextRequest) {
  try {
    const { text, voiceId, userId } = await request.json()

    if (!text || !voiceId) {
      return NextResponse.json(
        { error: 'Missing text or voiceId' },
        { status: 400 }
      )
    }

    // ============ TIER CHECK ============
    if (!userId) {
      return NextResponse.json({ error: 'User not authenticated' }, { status: 401 })
    }

    // Get subscription
    const { data: sub } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .single()

    const tier = (sub?.tier || 'free') as 'free' | 'basic' | 'premium'

    // Custom voice is Premium only
    if (tier !== 'premium') {
      return NextResponse.json({
        error: 'Custom voice narration is a Premium feature. Upgrade to hear stories in your own voice!',
        featureLocked: true,
        tier,
        requiredTier: 'premium'
      }, { status: 403 })
    }

    // Reset monthly counters if needed
    if (shouldResetCycle(sub?.cycle_reset_date)) {
      await supabase
        .from('subscriptions')
        .update({
          stories_used_this_month: 0,
          voice_stories_used_this_month: 0,
          cycle_reset_date: new Date().toISOString(),
        })
        .eq('user_id', userId)
      sub.voice_stories_used_this_month = 0
    }

    const voiceStoriesUsed = sub?.voice_stories_used_this_month || 0
    const limit = VOICE_STORY_LIMITS.premium

    // Check voice story limit
    if (voiceStoriesUsed >= limit) {
      return NextResponse.json({
        error: `You've used all ${limit} custom voice stories this month. They reset on the 1st! You can still use AI voices.`,
        limitReached: true,
        tier,
        usage: { voiceStoriesUsed, limit }
      }, { status: 403 })
    }

    // ============ GENERATE SPEECH ============
    const audio = await elevenlabs.textToSpeech.convert(voiceId, {
      text: text,
      model_id: 'eleven_multilingual_v2'
    })

    // Convert async iterable to buffer
    const chunks: Buffer[] = []
    for await (const chunk of audio) {
      chunks.push(chunk)
    }
    const audioBuffer = Buffer.concat(chunks)

    // ============ INCREMENT USAGE ============
    await supabase
      .from('subscriptions')
      .update({ voice_stories_used_this_month: voiceStoriesUsed + 1 })
      .eq('user_id', userId)

    // Return audio file with usage info in headers
    return new NextResponse(audioBuffer, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Length': audioBuffer.length.toString(),
        'X-Voice-Stories-Used': String(voiceStoriesUsed + 1),
        'X-Voice-Stories-Limit': String(limit),
      }
    })
  } catch (error) {
    console.error('TTS Error:', error)
    return NextResponse.json(
      { error: 'Failed to generate speech' },
      { status: 500 }
    )
  }
}
