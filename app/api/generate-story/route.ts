import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@supabase/supabase-js'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!
})

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Tier limits
const TIER_LIMITS = {
  free: { storiesPerMonth: 3, maxLength: [3], worldsEnabled: false },
  basic: { storiesPerMonth: Infinity, maxLength: [3], worldsEnabled: true },
  premium: { storiesPerMonth: Infinity, maxLength: [3, 5, 10], worldsEnabled: true },
}

// Protected IP - PHRASE-BASED
const PROTECTED_IP_PHRASES = [
  'elsa', 'anna and elsa', 'queen elsa', 'princess anna', 'olaf the snowman', 'arendelle', 'let it go',
  'merida', 'princess merida', 'brave movie', 'clan dunbroch',
  'moana', 'maui demigod', 'te fiti', 'simba', 'mufasa', 'scar lion king', 'timon and pumbaa',
  'nemo', 'finding nemo', 'finding dory', 'dory fish', 'marlin clownfish',
  'buzz lightyear', 'woody cowboy', 'woody and buzz', 'to infinity and beyond', 'toy story',
  'lightning mcqueen', 'mater tow truck', 'radiator springs',
  'sulley and mike', 'monsters inc', 'mike wazowski',
  'mr incredible', 'elastigirl', 'the incredibles', 'frozone',
  'rapunzel', 'flynn rider', 'tangled tower',
  'cinderella', 'prince charming', 'fairy godmother cinderella', 'glass slipper',
  'snow white', 'seven dwarfs', 'magic mirror on the wall',
  'ariel', 'little mermaid', 'flounder fish', 'sebastian crab', 'ursula sea witch',
  'belle', 'beauty and the beast', 'gaston', 'lumiere',
  'jasmine', 'aladdin', 'genie lamp', 'abu monkey', 'jafar',
  'mulan', 'mushu dragon',
  'lilo and stitch', 'stitch alien', 'experiment 626',
  'peter pan', 'tinker bell', 'captain hook', 'neverland', 'wendy darling',
  'alice wonderland', 'mad hatter', 'queen of hearts', 'cheshire cat',
  'winnie the pooh', 'piglet pooh', 'tigger', 'eeyore', 'hundred acre wood',
  'harry potter', 'hogwarts', 'hermione', 'ron weasley', 'dumbledore', 'voldemort',
  'slytherin', 'gryffindor', 'hufflepuff', 'ravenclaw', 'quidditch', 'muggle',
  'hagrid', 'snape', 'draco malfoy', 'dobby elf', 'diagon alley',
  'gruffalo', 'room on the broom', 'stick man', 'zog dragon', 'highway rat',
  'cat in the hat', 'thing one', 'thing two', 'grinch', 'whoville', 'the lorax', 'green eggs and ham',
  'bfg', 'big friendly giant', 'matilda wormwood', 'willy wonka', 'charlie chocolate', 'oompa loompa',
  'peppa pig', 'george pig', 'daddy pig', 'mummy pig',
  'bluey', 'bingo bluey', 'bandit heeler', 'chilli heeler',
  'paw patrol', 'chase paw', 'marshall paw', 'skye paw', 'ryder paw patrol',
  'cocomelon', 'jj cocomelon', 'baby shark doo',
  'dora explorer', 'boots monkey dora', 'swiper fox',
  'spongebob', 'patrick star', 'squidward', 'bikini bottom',
  'thomas tank engine', 'thomas the train', 'sodor',
  'teletubbies', 'in the night garden', 'iggle piggle',
  'hey duggee', 'ben and holly', 'bing bunny',
  'mario', 'luigi', 'princess peach', 'bowser', 'yoshi', 'donkey kong',
  'zelda', 'link zelda', 'hyrule', 'triforce',
  'pikachu', 'pokemon', 'pokeball', 'ash ketchum',
  'spider-man', 'spiderman', 'peter parker',
  'iron man', 'tony stark', 'hulk bruce banner', 'thor odinson', 'captain america',
  'batman', 'bruce wayne batman', 'gotham city', 'joker batman',
  'superman', 'clark kent', 'wonder woman',
  'shrek', 'donkey shrek', 'fiona ogre',
  'kung fu panda', 'po panda', 'master shifu',
  'how to train your dragon', 'hiccup dragon', 'toothless dragon',
  'minions', 'gru despicable',
  'paddington bear', 'marmalade sandwich',
  'star wars', 'luke skywalker', 'darth vader', 'yoda', 'lightsaber', 'jedi',
  'frodo', 'gandalf', 'middle earth', 'mordor', 'bilbo baggins', 'gollum',
]

const HARMFUL_PATTERNS = [
  'kill', 'murder', 'blood', 'death', 'die', 'dead', 'corpse',
  'gun', 'shoot', 'stab', 'knife attack',
  'nightmare', 'horror', 'terrifying', 'demon', 'devil', 'hell',
  'zombie', 'ghost scary', 'monster attack',
  'abuse', 'bullying', 'assault',
  'drugs', 'alcohol', 'drunk', 'smoking',
  'racist', 'sexist', 'hate',
  'romance', 'dating', 'boyfriend', 'girlfriend', 'kissing',
  'sexy', 'naked',
]

function checkForProtectedIP(text: string): { found: boolean; matches: string[] } {
  const lowerText = text.toLowerCase()
  const matches = PROTECTED_IP_PHRASES.filter(phrase => lowerText.includes(phrase))
  return { found: matches.length > 0, matches }
}

function checkForHarmfulContent(text: string): { found: boolean; matches: string[] } {
  const lowerText = text.toLowerCase()
  const matches = HARMFUL_PATTERNS.filter(pattern => lowerText.includes(pattern))
  return { found: matches.length > 0, matches }
}

function suggestAlternative(ipMatch: string): string {
  const alternatives: Record<string, string> = {
    'elsa': 'a brave ice princess with magical frost powers',
    'moana': 'a brave island girl who loves the ocean',
    'simba': 'a young lion cub learning to be brave',
    'harry potter': 'a young wizard learning magic at a special school',
    'peppa pig': 'a cheerful little pig who loves muddy puddles',
    'bluey': 'a playful blue puppy who loves games',
    'spider-man': 'a brave hero with amazing climbing powers',
    'pikachu': 'a cute electric creature',
  }
  for (const [key, value] of Object.entries(alternatives)) {
    if (ipMatch.toLowerCase().includes(key)) return value
  }
  return 'an original magical character'
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
    const body = await request.json()
    const {
      userId,
      childName, childAge, interests, theme,
      worldName, worldSetting, sagaName, sagaDescription,
      episodeNumber, previousEpisodes, characters, customPrompt,
      storyLength = 3, wordCount = 450,
      includeChild = true,
      adventureLevel = 'gentle',
      storyStyle = 'descriptive'
    } = body

    // ============ TIER CHECK ============
    if (!userId) {
      return NextResponse.json({ error: 'User not authenticated' }, { status: 401 })
    }

    // Get or create subscription
    let { data: sub } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (!sub) {
      // Create free subscription
      const { data: newSub } = await supabase
        .from('subscriptions')
        .insert({
          user_id: userId,
          tier: 'free',
          stories_used_this_month: 0,
          voice_stories_used_this_month: 0,
          cycle_reset_date: new Date().toISOString(),
        })
        .select()
        .single()
      sub = newSub
    }

    const tier = (sub?.tier || 'free') as 'free' | 'basic' | 'premium'
    const limits = TIER_LIMITS[tier]

    // Reset monthly counters if needed (for paid tiers)
    if (tier !== 'free' && shouldResetCycle(sub?.cycle_reset_date)) {
      await supabase
        .from('subscriptions')
        .update({
          stories_used_this_month: 0,
          voice_stories_used_this_month: 0,
          cycle_reset_date: new Date().toISOString(),
        })
        .eq('user_id', userId)
      sub.stories_used_this_month = 0
    }

    const storiesUsed = sub?.stories_used_this_month || 0

    // Check story limit
    if (limits.storiesPerMonth !== Infinity && storiesUsed >= limits.storiesPerMonth) {
      return NextResponse.json({
        error: tier === 'free'
          ? `You've used all 3 free stories! Upgrade to Basic ($4.99/month) for unlimited stories.`
          : 'Monthly story limit reached.',
        limitReached: true,
        tier,
        usage: { storiesUsed, limit: limits.storiesPerMonth }
      }, { status: 403 })
    }

    // Check story length restriction
    if (!limits.maxLength.includes(storyLength)) {
      return NextResponse.json({
        error: `${storyLength} minute stories are a Premium feature. Upgrade to unlock longer stories!`,
        featureLocked: true,
        tier,
        allowedLengths: limits.maxLength
      }, { status: 403 })
    }

    // Check worlds access
    if (worldName && !limits.worldsEnabled) {
      return NextResponse.json({
        error: 'Story Worlds are available for Basic and Premium subscribers. Upgrade to explore magical worlds!',
        featureLocked: true,
        tier
      }, { status: 403 })
    }

    // ============ SAFETY CHECKS ============
    if (customPrompt) {
      const harmfulCheck = checkForHarmfulContent(customPrompt)
      if (harmfulCheck.found) {
        return NextResponse.json({ error: `Let's keep our stories magical! Please avoid: ${harmfulCheck.matches.slice(0, 2).join(', ')}`, blockedContent: 'harmful' }, { status: 400 })
      }
      const ipCheck = checkForProtectedIP(customPrompt)
      if (ipCheck.found) {
        return NextResponse.json({ error: `We create original stories! Instead of "${ipCheck.matches[0]}", how about "${suggestAlternative(ipCheck.matches[0])}"?`, blockedContent: 'ip', suggestion: suggestAlternative(ipCheck.matches[0]) }, { status: 400 })
      }
    }

    if (characters?.length > 0) {
      for (const char of characters) {
        const charCheck = checkForProtectedIP(char.name + ' ' + (char.role || ''))
        if (charCheck.found) {
          return NextResponse.json({ error: `Let's use original characters! Instead of "${charCheck.matches[0]}", try "${suggestAlternative(charCheck.matches[0])}"`, blockedContent: 'ip' }, { status: 400 })
        }
      }
    }

    // ============ BUILD PROMPT ============
    // Calculate word count based on story length
    const lengthWordCounts: Record<number, number> = {
      3: 450,
      5: 750,
      10: 1500,
    }
    const targetWordCount = lengthWordCounts[storyLength] || wordCount

    let prompt = `Write a magical bedtime story`
    
    if (includeChild && childName) {
      prompt += ` for ${childName}, who is ${childAge} years old`
      if (interests?.length > 0) prompt += ` and loves ${interests.join(', ')}`
      prompt += `. ${childName} should be the main character.`
    } else {
      prompt += ` suitable for a ${childAge} year old child. The child is NOT a character - focus entirely on the world characters.`
    }

    if (worldName && worldSetting) {
      prompt += `\n\nSetting: ${worldName} - ${worldSetting}`
    }

    if (sagaName) {
      prompt += `\n\nThis is Episode ${episodeNumber} of "${sagaName}".`
      if (sagaDescription) prompt += ` About: ${sagaDescription}`
      if (previousEpisodes?.length > 0) {
        prompt += `\n\nPrevious episodes:`
        for (const ep of previousEpisodes) prompt += `\n- Episode ${ep.episode}: ${ep.summary}`
        prompt += `\n\nContinue with new adventures while maintaining continuity.`
      }
    }

    if (characters?.length > 0) {
      prompt += `\n\nCharacters to include:`
      for (const char of characters) prompt += `\n- ${char.name}${char.role ? ` (${char.role})` : ''}`
    }

    if (theme && !worldName) prompt += `\n\nTheme: ${theme}`
    if (customPrompt) prompt += `\n\nStory idea: ${customPrompt}`

    // TONE based on adventure level
    let toneInstructions = ''
    if (adventureLevel === 'adventurous') {
      toneInstructions = `
TONE: ADVENTUROUS (Think Julia Donaldson's storytelling style)
- Build tension through repetition and rhythm, like "The Gruffalo" does
- Include a clever twist or reversal where the small/unlikely hero outwits the threat
- Use cumulative storytelling - each new challenge builds on the last
- Create memorable, slightly scary-but-not-too-scary antagonists
- The hero should use wit and cleverness, not strength
- Include satisfying poetic justice for any baddies
- Repetitive refrains that children can anticipate ("Silly old fox, doesn't he know...")
- Build to a climactic moment, then resolve with warmth
- Rhyming couplets or rhythmic prose in key moments
- The adventure should have real stakes but age-appropriate resolution
- Characters face genuine challenges but triumph through courage and smarts`
    } else {
      toneInstructions = `
TONE: GENTLE & SOOTHING
- Keep the story calm and peaceful throughout
- No real conflict or danger
- Focus on friendship, discovery, and wonder
- Soft, dreamy atmosphere perfect for bedtime
- Gentle emotions - happiness, curiosity, warmth
- End with peaceful, sleepy conclusion`
    }

    // STYLE based on story style
    let styleInstructions = ''
    if (storyStyle === 'playful') {
      styleInstructions = `
STYLE: PLAYFUL & DIALOGUE-HEAVY (Blend of Bluey, Roald Dahl, and David Walliams)

DIALOGUE STYLE (like Bluey):
- Natural, realistic conversations between characters
- Characters play imaginative games and get carried away
- Warm family dynamics with gentle teasing
- Kids and adults talk TO each other, not AT each other
- Moments of emotional truth wrapped in play
- Characters have their own agendas that playfully collide
- "But DAAAAD!" / "Hang on, hang on..." type exchanges
- Inside jokes and callbacks

HUMOR STYLE (like Roald Dahl & David Walliams):
- Gleefully subversive and slightly naughty (but never mean)
- Adults can be ridiculous, pompous, or wonderfully silly
- Delicious made-up words and funny names
- Gross-out moments that make kids giggle (burps, smells, slime - but tasteful!)
- Unexpected reversals - the small defeats the big, the meek surprises everyone
- Wicked wordplay and puns
- Characters with exaggerated quirks played for comedy
- Knowing winks to the audience
- Villains/antagonists who are more silly than scary
- Satisfying comeuppance for anyone too full of themselves

STRUCTURE:
- 70% dialogue, 30% description
- Snappy back-and-forth exchanges
- Build running gags that pay off
- Moments of silliness punctuated by heart
- Catchphrases and repeated funny phrases
- Sound effects and onomatopoeia ("SPLOOOSH!", "FWAAAARP!", "Boing-oing-oing!")
- Let the characters' personalities drive the comedy
- End with warmth underneath the laughs`
    } else {
      styleInstructions = `
STYLE: DESCRIPTIVE & IMMERSIVE
- Rich, vivid descriptions of settings and scenes
- Paint pictures with words
- Describe colors, textures, sounds, smells
- Create atmosphere and mood
- Balance description with some dialogue
- Use sensory details to bring the world alive`
    }

    prompt += `

${toneInstructions}

${styleInstructions}

REQUIREMENTS:
- Write approximately ${targetWordCount} words
- Create ONLY original content - no copyrighted characters, names, or settings
- Never reference Disney, Pixar, Harry Potter, Gruffalo, Bluey, or any existing franchises by name
- You're inspired by these authors' STYLES, not their specific characters or stories
- Use simple language appropriate for a ${childAge} year old
- End with a satisfying conclusion`

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2000,
      messages: [{ role: 'user', content: prompt }]
    })

    const story = message.content[0].type === 'text' ? message.content[0].text : ''

    // Post-generation safety
    const postIpCheck = checkForProtectedIP(story)
    if (postIpCheck.found) {
      const retryMessage = await anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 2000,
        messages: [{ role: 'user', content: prompt + `\n\nCRITICAL: Do NOT include "${postIpCheck.matches[0]}". Create 100% original content.` }]
      })
      const retryStory = retryMessage.content[0].type === 'text' ? retryMessage.content[0].text : ''
      const secondCheck = checkForProtectedIP(retryStory)
      if (secondCheck.found) {
        return NextResponse.json({ error: 'Unable to generate without copyrighted content. Try different theme.', blockedContent: 'ip' }, { status: 400 })
      }

      // ============ INCREMENT USAGE ============
      await supabase
        .from('subscriptions')
        .update({ stories_used_this_month: storiesUsed + 1 })
        .eq('user_id', userId)

      return NextResponse.json({ 
        story: retryStory,
        usage: { storiesUsed: storiesUsed + 1, limit: limits.storiesPerMonth === Infinity ? 'unlimited' : limits.storiesPerMonth }
      })
    }

    // ============ INCREMENT USAGE ============
    await supabase
      .from('subscriptions')
      .update({ stories_used_this_month: storiesUsed + 1 })
      .eq('user_id', userId)

    return NextResponse.json({ 
      story,
      usage: { storiesUsed: storiesUsed + 1, limit: limits.storiesPerMonth === Infinity ? 'unlimited' : limits.storiesPerMonth }
    })

  } catch (error) {
    console.error('Story generation error:', error)
    return NextResponse.json({ error: 'Failed to generate story' }, { status: 500 })
  }
}
