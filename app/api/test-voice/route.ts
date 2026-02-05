import { NextRequest, NextResponse } from 'next/server'
import { ElevenLabsClient } from 'elevenlabs'

const elevenlabs = new ElevenLabsClient({
  apiKey: process.env.ELEVENLABS_API_KEY
})

export async function POST(request: NextRequest) {
  try {
    console.log('=== Starting voice clone test ===')
    console.log('API Key loaded:', !!process.env.ELEVENLABS_API_KEY)
    
    // Test basic connection
    console.log('Testing ElevenLabs connection...')
    const voicesList = await elevenlabs.voices.getAll()
    console.log('✅ Connected! Found', voicesList.voices.length, 'voices')
    
    const formData = await request.formData()
    const audioFile = formData.get('audio') as File
    
    if (!audioFile) {
      return NextResponse.json({ error: 'No audio' }, { status: 400 })
    }

    console.log('Audio file received:', audioFile.size, 'bytes')

    const buffer = Buffer.from(await audioFile.arrayBuffer())
    
    console.log('Attempting to clone voice...')
    
    const voice = await elevenlabs.voices.add({
      name: 'Test' + Date.now(),
      files: [new File([buffer], 'voice.webm', { type: 'audio/webm' })]
    })

    console.log('✅ Voice cloned! ID:', voice.voice_id)

    const story = 'Once upon a time, Luna loved bedtime stories. Every night brought magical adventures.'

    console.log('Generating audio with cloned voice...')

    const audio = await elevenlabs.generate({
      voice: voice.voice_id,
      text: story,
      model_id: 'eleven_monolingual_v1'
    })

    console.log('Converting audio stream...')

    const chunks: Buffer[] = []
    for await (const chunk of audio) {
      chunks.push(chunk)
    }
    const audioBuffer = Buffer.concat(chunks)

    console.log('✅ Success! Audio size:', audioBuffer.length, 'bytes')

    return new NextResponse(audioBuffer, {
      headers: { 'Content-Type': 'audio/mpeg' }
    })

  } catch (error) {
    console.error('❌ Error occurred:')
    console.error('Message:', error instanceof Error ? error.message : 'Unknown')
    console.error('Cause:', error instanceof Error ? error.cause : undefined)
    console.error('Full error:', error)
    
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Voice cloning failed' 
    }, { status: 500 })
  }
}