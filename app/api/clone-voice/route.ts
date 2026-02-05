import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { audioData, name } = await request.json()

    if (!audioData) {
      return NextResponse.json(
        { success: false, error: 'No audio data provided' },
        { status: 400 }
      )
    }

    const apiKey = process.env.ELEVENLABS_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        { success: false, error: 'ElevenLabs API key not configured' },
        { status: 500 }
      )
    }

    // Convert base64 to blob
    const base64Data = audioData.split(',')[1] || audioData
    const binaryData = Buffer.from(base64Data, 'base64')

    // Create form data for ElevenLabs
    const formData = new FormData()
    formData.append('name', name || 'Parent Voice')
    formData.append('description', 'Voice clone for My Story Magic bedtime stories')
    formData.append('files', new Blob([binaryData], { type: 'audio/webm' }), 'recording.webm')

    console.log('=== Cloning voice with ElevenLabs ===')
    console.log('Name:', name)
    console.log('Audio size:', binaryData.length, 'bytes')

    // Call ElevenLabs Instant Voice Clone API
    const response = await fetch('https://api.elevenlabs.io/v1/voices/add', {
      method: 'POST',
      headers: {
        'xi-api-key': apiKey,
      },
      body: formData,
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('ElevenLabs error:', errorText)
      return NextResponse.json(
        { success: false, error: `Voice cloning failed: ${response.status}` },
        { status: 500 }
      )
    }

    const data = await response.json()
    console.log('✅ Voice cloned successfully:', data.voice_id)

    return NextResponse.json({
      success: true,
      voiceId: data.voice_id,
      name: data.name
    })

  } catch (error) {
    console.error('Clone voice error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to clone voice' },
      { status: 500 }
    )
  }
}