import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Use service role for storage operations
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const audioFile = formData.get('audio') as File
    const userId = formData.get('userId') as string
    const notes = formData.get('notes') as string || ''
    const durationSeconds = parseInt(formData.get('duration') as string) || 0

    if (!audioFile || !userId) {
      return NextResponse.json(
        { error: 'Missing audio file or userId' },
        { status: 400 }
      )
    }

    console.log('=== Uploading voice sample ===')
    console.log('User:', userId)
    console.log('File size:', audioFile.size, 'bytes')
    console.log('Duration:', durationSeconds, 'seconds')

    // Generate unique filename
    const timestamp = Date.now()
    const filename = `${userId}/${timestamp}_voice_sample.webm`

    // Convert File to Buffer
    const arrayBuffer = await audioFile.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('voice-samples')
      .upload(filename, buffer, {
        contentType: 'audio/webm',
        upsert: false
      })

    if (uploadError) {
      console.error('Storage upload error:', uploadError)
      return NextResponse.json(
        { error: 'Failed to upload audio file' },
        { status: 500 }
      )
    }

    console.log('✅ File uploaded to storage:', uploadData.path)

    // Get the URL (signed URL for private bucket)
    const { data: urlData } = await supabase.storage
      .from('voice-samples')
      .createSignedUrl(filename, 60 * 60 * 24 * 365) // 1 year expiry

    const audioUrl = urlData?.signedUrl || ''

    // Save record to database
    const { data: dbData, error: dbError } = await supabase
      .from('voice_samples')
      .insert({
        user_id: userId,
        audio_url: audioUrl,
        duration_seconds: durationSeconds,
        sample_type: 'full',
        notes: notes
      })
      .select()
      .single()

    if (dbError) {
      console.error('Database insert error:', dbError)
      return NextResponse.json(
        { error: 'Failed to save voice sample record' },
        { status: 500 }
      )
    }

    console.log('✅ Voice sample saved to database:', dbData.id)

    return NextResponse.json({
      success: true,
      sampleId: dbData.id,
      audioUrl: audioUrl,
      message: 'Voice sample uploaded successfully'
    })

  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Upload failed' },
      { status: 500 }
    )
  }
}
