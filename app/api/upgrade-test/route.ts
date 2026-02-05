import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const { code, userId } = await request.json()

    if (!userId) {
      return NextResponse.json({ error: 'Missing userId' }, { status: 400 })
    }

    let newTier = ''
    let message = ''

    if (code === 'Premo') {
      newTier = 'premium'
      message = '🎉 Upgraded to Premium!'
    } else if (code === 'Basic') {
      newTier = 'basic'
      message = '✅ Set to Basic tier'
    } else if (code === 'Free') {
      newTier = 'free'
      message = '🔄 Reset to Free tier'
    } else {
      return NextResponse.json({ error: 'Invalid code' }, { status: 400 })
    }

    const { error } = await supabase
      .from('subscriptions')
      .update({ tier: newTier })
      .eq('user_id', userId)

    if (error) {
      console.error('Upgrade error:', error)
      return NextResponse.json({ error: 'Failed to upgrade' }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true, 
      message,
      tier: newTier
    })

  } catch (error) {
    console.error('Upgrade test error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}