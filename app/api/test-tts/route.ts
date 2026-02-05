import { NextRequest, NextResponse } from 'next/server'
import { ElevenLabsClient } from 'elevenlabs'

const elevenlabs = new ElevenLabsClient({
  apiKey: process.env.ELEVENLABS_API_KEY
})

// Test story snippet for comparison
const TEST_STORY = `Luna loved bedtime more than anything. Every night, when the stars began to twinkle and the moon rose high above the rooftops, she would snuggle deep into her cozy blankets and wait for the magic to begin.

"Are you ready for an adventure?" her dad would ask, sitting on the edge of her bed.

Luna always nodded, her eyes wide with excitement.`

export async function POST(request: NextRequest) {
  try {
    const { voiceId, provider, customText } = await request.json()

    if (!voiceId) {
      return NextResponse.json(
        { error: 'Missing voiceId' },
        { status: 400 }
      )
    }

    const text = customText || TEST_STORY
    console.log(`=== Generating TTS with ${provider} ===`)
    console.log('Voice ID:', voiceId)
    console.log('Text length:', text.length, 'characters')

    if (provider === 'elevenlabs') {
      // Generate with ElevenLabs
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

      console.log('✅ ElevenLabs audio generated:', audioBuffer.length, 'bytes')

      return new NextResponse(audioBuffer, {
        headers: {
          'Content-Type': 'audio/mpeg',
          'Content-Disposition': 'attachment; filename="test_elevenlabs.mp3"',
          'X-Provider': 'elevenlabs'
        }
      })

    } else if (provider === 'google') {
      // Google Chirp 3 - placeholder
      console.log('⚠️ Google Chirp 3 TTS not yet implemented')
      
      return NextResponse.json({
        success: false,
        provider: 'google',
        error: 'Google Chirp 3 TTS not yet implemented'
      }, { status: 501 })
    }

    return NextResponse.json(
      { error: 'Invalid provider' },
      { status: 400 }
    )

  } catch (error) {
    console.error('TTS test error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'TTS generation failed'
    }, { status: 500 })
  }
}

// GET endpoint to retrieve the test story text
export async function GET() {
  return NextResponse.json({
    testStory: TEST_STORY,
    description: 'Default story snippet used for voice quality comparison'
  })
}
