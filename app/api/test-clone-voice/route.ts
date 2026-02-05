import { NextRequest, NextResponse } from 'next/server'
import { ElevenLabsClient } from 'elevenlabs'

const elevenlabs = new ElevenLabsClient({
  apiKey: process.env.ELEVENLABS_API_KEY
})

export async function POST(request: NextRequest) {
  try {
    const { audioBase64, provider = 'elevenlabs' } = await request.json()

    if (!audioBase64) {
      return NextResponse.json(
        { error: 'Missing audio data' },
        { status: 400 }
      )
    }

    console.log('=== Testing voice clone ===')
    console.log('Provider:', provider)

    // Convert base64 to buffer
    const base64Data = audioBase64.split(',')[1] || audioBase64
    const buffer = Buffer.from(base64Data, 'base64')
    console.log('Audio buffer size:', buffer.length, 'bytes')

    if (provider === 'elevenlabs') {
      // Test with ElevenLabs
      console.log('Calling ElevenLabs API...')
      
      const voice = await elevenlabs.voices.add({
        name: `Test_Voice_${Date.now()}`,
        files: [new File([buffer], 'voice.webm', { type: 'audio/webm' })]
      })

      console.log('✅ Voice created!', voice)

      return NextResponse.json({
        success: true,
        provider: 'elevenlabs',
        voiceId: voice.voice_id,
        voiceName: voice.voice_id
      })

    } else if (provider === 'google') {
      // Placeholder for Google Chirp 3
      return NextResponse.json({
        success: false,
        error: 'Google voice cloning not yet implemented'
      })
    }

    return NextResponse.json({
      success: false,
      error: 'Unknown provider'
    })

  } catch (error) {
    console.error('Voice clone test error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Voice cloning failed'
    }, { status: 500 })
  }
}
