import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenAI } from '@google/genai'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Helper to create WAV header for raw PCM data
function createWavHeader(dataLength: number, sampleRate: number = 24000, channels: number = 1, bitsPerSample: number = 16): Buffer {
  const headerLength = 44
  const byteRate = sampleRate * channels * (bitsPerSample / 8)
  const blockAlign = channels * (bitsPerSample / 8)
  
  const header = Buffer.alloc(headerLength)
  
  // RIFF header
  header.write('RIFF', 0)
  header.writeUInt32LE(dataLength + 36, 4) // File size - 8
  header.write('WAVE', 8)
  
  // fmt chunk
  header.write('fmt ', 12)
  header.writeUInt32LE(16, 16) // fmt chunk size
  header.writeUInt16LE(1, 20) // Audio format (1 = PCM)
  header.writeUInt16LE(channels, 22)
  header.writeUInt32LE(sampleRate, 24)
  header.writeUInt32LE(byteRate, 28)
  header.writeUInt16LE(blockAlign, 32)
  header.writeUInt16LE(bitsPerSample, 34)
  
  // data chunk
  header.write('data', 36)
  header.writeUInt32LE(dataLength, 40)
  
  return header
}

export async function POST(request: NextRequest) {
  try {
    const { text, voiceName = 'Kore', stylePrompt, userId } = await request.json()

    if (!text) {
      return NextResponse.json({ error: 'Missing text' }, { status: 400 })
    }

    // ============ OPTIONAL: Log usage for analytics ============
    // AI voices are available to ALL tiers - no restrictions
    // But we can track usage for analytics if userId provided
    if (userId) {
      // Just log, don't restrict
      console.log(`AI TTS request from user: ${userId}`)
    }

    // Get credentials from environment
    let credentials
    
    if (process.env.GOOGLE_SERVICE_ACCOUNT) {
      credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT)
    } else if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
      const fs = await import('fs')
      const path = await import('path')
      const credPath = path.resolve(process.env.GOOGLE_APPLICATION_CREDENTIALS)
      credentials = JSON.parse(fs.readFileSync(credPath, 'utf8'))
    } else {
      return NextResponse.json({ error: 'Google credentials not configured' }, { status: 500 })
    }

    // Initialize Google GenAI with Vertex AI
    const ai = new GoogleGenAI({
      vertexai: true,
      project: credentials.project_id,
      location: 'us-central1',
      googleAuthOptions: {
        credentials: credentials
      }
    })

    // Valid Gemini TTS voices
    const validVoices = ['Zephyr', 'Puck', 'Charon', 'Kore', 'Fenrir', 'Leda', 'Orus', 'Aoede']
    const selectedVoice = validVoices.includes(voiceName) ? voiceName : 'Kore'

    const promptText = stylePrompt 
      ? `${stylePrompt}\n\n${text}`
      : `Read this as a warm, soothing bedtime story with gentle pacing:\n\n${text}`

    console.log('Generating TTS with voice:', selectedVoice)

    // Generate TTS using Gemini
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-preview-tts',
      contents: [
        {
          role: 'user',
          parts: [{ text: promptText }]
        }
      ],
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: {
              voiceName: selectedVoice
            }
          }
        }
      }
    })

    // Extract audio data from response
    const candidate = response.candidates?.[0]
    const part = candidate?.content?.parts?.[0]
    const audioData = part?.inlineData?.data
    const mimeType = part?.inlineData?.mimeType || 'audio/L16;rate=24000'

    console.log('Response mimeType:', mimeType)

    if (!audioData) {
      console.error('No audio data in response:', JSON.stringify(response, null, 2))
      return NextResponse.json({ error: 'No audio generated' }, { status: 500 })
    }

    // Convert base64 to buffer
    const rawAudioBuffer = Buffer.from(audioData, 'base64')
    console.log('Raw audio buffer size:', rawAudioBuffer.length)

    // Check if it's raw PCM (L16) and needs WAV header
    if (mimeType.includes('L16') || mimeType.includes('pcm') || !mimeType.includes('wav')) {
      // Extract sample rate from mimeType if present (e.g., "audio/L16;rate=24000")
      let sampleRate = 24000
      const rateMatch = mimeType.match(/rate=(\d+)/)
      if (rateMatch) {
        sampleRate = parseInt(rateMatch[1])
      }

      console.log('Adding WAV header with sample rate:', sampleRate)

      // Create WAV header and combine with audio data
      const wavHeader = createWavHeader(rawAudioBuffer.length, sampleRate)
      const wavBuffer = Buffer.concat([wavHeader, rawAudioBuffer])

      return new NextResponse(wavBuffer, {
        headers: {
          'Content-Type': 'audio/wav',
          'Content-Length': wavBuffer.length.toString(),
        }
      })
    }

    // If already proper format, return as-is
    return new NextResponse(rawAudioBuffer, {
      headers: {
        'Content-Type': mimeType.split(';')[0] || 'audio/wav',
        'Content-Length': rawAudioBuffer.length.toString(),
      }
    })

  } catch (error) {
    console.error('Google TTS error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'TTS failed' },
      { status: 500 }
    )
  }
}
