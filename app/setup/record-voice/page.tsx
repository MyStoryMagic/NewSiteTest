'use client'
import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import SleepyBear from '@/components/SleepyBear'
import { Sparkles } from '@/components/MagicUI'
import { supabase } from '@/lib/supabase'

const VOICE_ROLES = [
  { id: 'mum', name: 'Mum', emoji: '👩' },
  { id: 'dad', name: 'Dad', emoji: '👨' },
  { id: 'nanna', name: 'Nanna', emoji: '👵' },
  { id: 'pop', name: 'Pop', emoji: '👴' },
  { id: 'aunty', name: 'Aunty', emoji: '👩‍🦰' },
  { id: 'uncle', name: 'Uncle', emoji: '👨‍🦱' },
  { id: 'other', name: 'Other', emoji: '🎤' },
]

const PART_1_PROMPT = `Tell us about your day yesterday, or what you did today. Chat naturally - include the "ums" and "ahs" - that's what makes your voice sound real! Talk about anything: what you ate, who you talked to, something funny that happened...`

const PART_2_STORY = `Once upon a time, in a cozy little house at the end of Mulberry Lane, there lived a curious child named Jamie. 

"What a beautiful morning!" Jamie whispered, watching golden sunlight dance through the window. The clock showed seven fifteen, and outside, three little birds were singing their favourite song.

Jamie tiptoed downstairs — one, two, three, four, five steps — being very, very quiet. In the kitchen, something wonderful was happening. Could it be? Yes! Grandma was making pancakes, round and fluffy, stacked up high.

"Would you like blueberries or strawberries today?" Grandma asked with a warm smile.

"Both please!" Jamie giggled. "And maybe just a tiny bit of honey?"

After breakfast, they walked through the garden together. The red roses swayed gently, and a fuzzy caterpillar crawled slowly across a big green leaf. 

"Shhhh," Grandma said softly. "Look over there, by the old oak tree."

A small rabbit was nibbling clover, its nose twitching this way and that. How wonderful! How magical! Jamie held very still, barely breathing.

As evening came, the sky turned pink and purple and orange — like someone had painted it just for them. The moon began to rise, round and silver and bright.

"Time for bed now, little one," Grandma said, giving Jamie the cosiest hug.

And as Jamie's eyes grew heavy, the stars came out to watch over all the sleeping children, keeping them safe and warm until morning came again.

Goodnight, sleep tight, sweet dreams tonight.`

const PROCESSING_MESSAGES = [
  "Listening to your voice...",
  "Learning your unique sound...",
  "Capturing your warmth...",
  "Adding the magic touches...",
  "Creating your voice clone...",
  "Almost there...",
]

function ProcessingOverlay({ message, progress }: { message: string, progress: number }) {
  return (
    <div className="fixed inset-0 bg-purple-900/95 backdrop-blur-sm z-50 flex items-center justify-center">
      <Sparkles count={20} />
      <div className="text-center relative z-10 px-8">
        <div className="relative w-32 h-32 mx-auto mb-6">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-6xl animate-bounce">
            🎤
          </div>
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute text-2xl animate-ping"
              style={{
                top: `${20 + Math.random() * 60}%`,
                left: `${20 + Math.random() * 60}%`,
                animationDelay: `${i * 0.2}s`,
                animationDuration: `${1 + Math.random()}s`,
              }}
            >
              {['✨', '⭐', '🌟', '💫'][i % 4]}
            </div>
          ))}
        </div>
        
        <SleepyBear mood="excited" size="medium" />
        
        <h2 className="text-white text-2xl font-display mt-4 mb-2">
          {message}
        </h2>
        <p className="text-purple-200 mb-6">This takes about 30-60 seconds...</p>
        
        <div className="w-64 mx-auto bg-purple-800/50 rounded-full h-3 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          >
            <div className="h-full bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
          </div>
        </div>
        <p className="text-purple-300 text-sm mt-2">{Math.round(progress)}% complete</p>
      </div>
    </div>
  )
}

export default function RecordVoicePage() {
  const router = useRouter()
  const [step, setStep] = useState<'select-role' | 'record'>('select-role')
  const [selectedRole, setSelectedRole] = useState<typeof VOICE_ROLES[0] | null>(null)
  const [customName, setCustomName] = useState('')
  const [currentPart, setCurrentPart] = useState<1 | 2>(1)
  const [isRecording, setIsRecording] = useState(false)
  const [part1Blob, setPart1Blob] = useState<Blob | null>(null)
  const [part2Blob, setPart2Blob] = useState<Blob | null>(null)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [user, setUser] = useState<any>(null)
  const [existingVoices, setExistingVoices] = useState<any[]>([])
  const [processingMessage, setProcessingMessage] = useState('')
  const [processingProgress, setProcessingProgress] = useState(0)
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const minTime = currentPart === 1 ? 60 : 120
  const maxTime = currentPart === 1 ? 90 : 180

  useEffect(() => {
    loadUser()
  }, [])

  useEffect(() => {
    if (isProcessing) {
      let msgIndex = 0
      const msgInterval = setInterval(() => {
        msgIndex = (msgIndex + 1) % PROCESSING_MESSAGES.length
        setProcessingMessage(PROCESSING_MESSAGES[msgIndex])
      }, 3000)

      const progressInterval = setInterval(() => {
        setProcessingProgress(p => {
          if (p < 70) return p + 2
          if (p < 90) return p + 0.5
          if (p < 95) return p + 0.1
          return p
        })
      }, 200)

      return () => {
        clearInterval(msgInterval)
        clearInterval(progressInterval)
      }
    }
  }, [isProcessing])

  async function loadUser() {
    // Check if just upgraded from URL params
    const urlParams = new URLSearchParams(window.location.search)
    const justUpgraded = urlParams.get('upgraded') === 'true'
    
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/signup')
      return
    }
    setUser(user)

    // Add small delay if just upgraded to let DB sync
    if (justUpgraded) {
      await new Promise(resolve => setTimeout(resolve, 1000))
    }

    const { data: sub } = await supabase
      .from('subscriptions')
      .select('tier')
      .eq('user_id', user.id)
      .single()

    // Skip tier check if user just upgraded (prevents race condition)
    if (!justUpgraded && sub?.tier !== 'premium') {
      router.push('/upgrade')
      return
    }

    // Load existing voice clones
    const { data: voices } = await supabase
      .from('voice_clones')
      .select('*')
      .eq('user_id', user.id)

    setExistingVoices(voices || [])
  }

  function selectRole(role: typeof VOICE_ROLES[0]) {
    setSelectedRole(role)
    if (role.id !== 'other') {
      setCustomName(role.name)
    }
  }

  function startRecordingFlow() {
    if (!selectedRole) return
    if (selectedRole.id === 'other' && !customName.trim()) {
      alert('Please enter a name')
      return
    }
    setStep('record')
  }

  async function startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100
        } 
      })
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported('audio/webm;codecs=opus') 
          ? 'audio/webm;codecs=opus' 
          : 'audio/webm'
      })
      mediaRecorderRef.current = mediaRecorder
      chunksRef.current = []

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data)
        }
      }

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
        if (currentPart === 1) {
          setPart1Blob(blob)
        } else {
          setPart2Blob(blob)
        }
        setAudioUrl(URL.createObjectURL(blob))
        stream.getTracks().forEach(track => track.stop())
      }

      mediaRecorder.start()
      setIsRecording(true)
      setRecordingTime(0)
      setAudioUrl(null)
      
      timerRef.current = setInterval(() => {
        setRecordingTime(t => {
          if (t >= maxTime - 1) {
            stopRecording()
          }
          return t + 1
        })
      }, 1000)
    } catch (error) {
      alert('Could not access microphone. Please allow microphone access.')
    }
  }

  function stopRecording() {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }

  function resetRecording() {
    if (currentPart === 1) {
      setPart1Blob(null)
    } else {
      setPart2Blob(null)
    }
    setAudioUrl(null)
    setRecordingTime(0)
  }

  function nextPart() {
    setCurrentPart(2)
    setAudioUrl(null)
    setRecordingTime(0)
  }

  function goBackToPart1() {
    setCurrentPart(1)
    setAudioUrl(part1Blob ? URL.createObjectURL(part1Blob) : null)
    setRecordingTime(0)
  }

  async function processVoice() {
    if (!part1Blob || !part2Blob || !user || !selectedRole) return

    setIsProcessing(true)
    setProcessingMessage(PROCESSING_MESSAGES[0])
    setProcessingProgress(0)

    try {
      const combinedBlob = new Blob([part1Blob, part2Blob], { type: 'audio/webm' })
      
      const reader = new FileReader()
      
      reader.onloadend = async () => {
        const base64Audio = reader.result as string
        const voiceName = selectedRole.id === 'other' ? customName : selectedRole.name

        const response = await fetch('/api/clone-voice', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            audioData: base64Audio,
            name: voiceName
          })
        })

        const data = await response.json()

        if (data.success && data.voiceId) {
          setProcessingProgress(95)
          
          // Save to voice_clones table
          await supabase
            .from('voice_clones')
            .insert({
              user_id: user.id,
              name: voiceName,
              role: selectedRole.id,
              emoji: selectedRole.emoji,
              voice_id: data.voiceId
            })

          setProcessingProgress(100)
          
          setTimeout(() => {
            router.push('/setup/voice-success')
          }, 500)
        } else {
          alert(data.error || 'Failed to process voice. Please try again.')
          setIsProcessing(false)
        }
      }
      
      reader.readAsDataURL(combinedBlob)
    } catch (error) {
      console.error('Voice processing error:', error)
      alert('Failed to process voice. Please try again.')
      setIsProcessing(false)
    }
  }

  function formatTime(seconds: number) {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const canProceed = recordingTime >= minTime
  const alreadyRecorded = (roleId: string) => existingVoices.some(v => v.role === roleId)

  if (isProcessing) {
    return <ProcessingOverlay message={processingMessage} progress={processingProgress} />
  }

  // Step 1: Select who's recording
  if (step === 'select-role') {
    return (
      <main className="min-h-screen bg-magic-gradient p-6">
        <Sparkles count={12} />

        <div className="max-w-xl mx-auto relative z-10">
          <button
            onClick={() => router.back()}
            className="text-purple-300 hover:text-white mb-6"
          >
            ← Back
          </button>

          <div className="text-center mb-8">
            <SleepyBear mood="happy" size="medium" />
            <h1 className="text-white text-3xl font-display mt-4 mb-2">
              🎤 Who's Recording?
            </h1>
            <p className="text-purple-200">
              Select who's voice we're cloning today
            </p>
          </div>

          {/* Existing Voices */}
          {existingVoices.length > 0 && (
            <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 p-6 mb-6">
              <h2 className="text-white font-semibold mb-3">Already Recorded:</h2>
              <div className="flex flex-wrap gap-2">
                {existingVoices.map(voice => (
                  <div key={voice.id} className="px-3 py-2 bg-green-500/20 rounded-xl text-green-300 text-sm flex items-center gap-2">
                    <span>{voice.emoji}</span>
                    <span>{voice.name}</span>
                    <span>✓</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Role Selection */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 p-6">
            <div className="grid grid-cols-2 gap-3 mb-4">
              {VOICE_ROLES.map(role => {
                const recorded = alreadyRecorded(role.id)
                return (
                  <button
                    key={role.id}
                    onClick={() => !recorded && selectRole(role)}
                    disabled={recorded}
                    className={`p-4 rounded-xl text-center transition ${
                      selectedRole?.id === role.id
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                        : recorded
                        ? 'bg-white/5 text-purple-500 cursor-not-allowed'
                        : 'bg-white/10 text-purple-200 hover:bg-white/15'
                    }`}
                  >
                    <div className="text-3xl mb-2">{role.emoji}</div>
                    <div className="font-semibold">{role.name}</div>
                    {recorded && <div className="text-xs text-green-400 mt-1">✓ Recorded</div>}
                  </button>
                )
              })}
            </div>

            {/* Custom name for "Other" */}
            {selectedRole?.id === 'other' && (
              <div className="mb-4">
                <label className="text-purple-200 text-sm mb-2 block">Enter name:</label>
                <input
                  type="text"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  placeholder="e.g., Grandpa Joe"
                  className="w-full bg-white/10 text-white rounded-xl px-4 py-3 border border-white/10 focus:border-purple-400 focus:outline-none"
                />
              </div>
            )}

            <button
              onClick={startRecordingFlow}
              disabled={!selectedRole}
              className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-bold text-white text-lg hover:opacity-90 transition disabled:opacity-50"
            >
              Continue to Recording →
            </button>
          </div>
        </div>
      </main>
    )
  }

  // Step 2: Recording
  return (
    <main className="min-h-screen bg-magic-gradient p-6">
      <Sparkles count={12} />

      <div className="max-w-xl mx-auto relative z-10">
        <button
          onClick={() => setStep('select-role')}
          className="text-purple-300 hover:text-white mb-6"
        >
          ← Back
        </button>

        {/* Progress Steps */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <div className={`flex items-center gap-2 ${currentPart >= 1 ? 'text-white' : 'text-purple-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
              part1Blob ? 'bg-green-500' : currentPart === 1 ? 'bg-gradient-to-r from-purple-500 to-pink-500' : 'bg-purple-700'
            }`}>
              {part1Blob ? '✓' : '1'}
            </div>
            <span className="text-sm">Chat</span>
          </div>
          
          <div className={`w-12 h-0.5 ${part1Blob ? 'bg-green-500' : 'bg-purple-700'}`} />
          
          <div className={`flex items-center gap-2 ${currentPart >= 2 ? 'text-white' : 'text-purple-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
              part2Blob ? 'bg-green-500' : currentPart === 2 ? 'bg-gradient-to-r from-purple-500 to-pink-500' : 'bg-purple-700'
            }`}>
              {part2Blob ? '✓' : '2'}
            </div>
            <span className="text-sm">Story</span>
          </div>
          
          <div className={`w-12 h-0.5 ${part2Blob ? 'bg-green-500' : 'bg-purple-700'}`} />
          
          <div className="flex items-center gap-2 text-purple-400">
            <div className="w-8 h-8 rounded-full bg-purple-700 flex items-center justify-center text-sm font-bold">
              ✨
            </div>
            <span className="text-sm">Done</span>
          </div>
        </div>

        <div className="text-center mb-6">
          <div className="text-5xl mb-2">{selectedRole?.emoji}</div>
          <h1 className="text-white text-2xl font-display mb-2">
            Recording {selectedRole?.id === 'other' ? customName : selectedRole?.name}'s Voice
          </h1>
          <p className="text-purple-200">
            {currentPart === 1 
              ? 'Part 1: Natural Chat (1 minute)' 
              : 'Part 2: Story Reading (2 minutes)'}
          </p>
        </div>

        {/* Content Card */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 p-6 mb-6 max-h-64 overflow-y-auto">
          {currentPart === 1 ? (
            <>
              <p className="text-purple-300 text-sm mb-3">Talk naturally about:</p>
              <p className="text-purple-100 leading-relaxed">
                {PART_1_PROMPT}
              </p>
            </>
          ) : (
            <>
              <p className="text-purple-300 text-sm mb-3">Read this story aloud:</p>
              <p className="text-purple-100 leading-relaxed whitespace-pre-line">
                {PART_2_STORY}
              </p>
            </>
          )}
        </div>

        {/* Recording Controls */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 p-6">
          
          {/* Timer */}
          <div className="text-center mb-4">
            <div className={`text-5xl font-mono font-bold ${isRecording ? 'text-red-400' : 'text-white'}`}>
              {formatTime(recordingTime)}
            </div>
            <p className="text-purple-300 text-sm mt-2">
              {recordingTime < minTime 
                ? `${formatTime(minTime - recordingTime)} more needed`
                : '✓ Minimum reached!'}
            </p>
          </div>

          {/* Waveform */}
          {isRecording && (
            <div className="flex justify-center items-end gap-1 mb-4 h-16">
              {[...Array(32)].map((_, i) => (
                <div
                  key={i}
                  className="w-1.5 bg-gradient-to-t from-purple-500 to-pink-500 rounded-full transition-all duration-75"
                  style={{
                    height: `${Math.max(8, Math.random() * 60)}px`,
                  }}
                />
              ))}
            </div>
          )}

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between text-xs text-purple-300 mb-1">
              <span>0:00</span>
              <span className="text-green-400">{formatTime(minTime)} min</span>
              <span>{formatTime(maxTime)} max</span>
            </div>
            <div className="h-3 bg-purple-800/50 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-300 ${
                  recordingTime >= minTime 
                    ? 'bg-gradient-to-r from-green-500 to-green-400' 
                    : 'bg-gradient-to-r from-purple-500 to-pink-500'
                }`}
                style={{ width: `${Math.min(100, (recordingTime / maxTime) * 100)}%` }}
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="space-y-3">
            {!audioUrl ? (
              <button
                onClick={isRecording ? stopRecording : startRecording}
                className={`w-full py-4 rounded-xl font-bold text-lg transition ${
                  isRecording
                    ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse'
                    : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:opacity-90'
                }`}
              >
                {isRecording ? '⏹ Stop Recording' : '🎤 Start Recording'}
              </button>
            ) : (
              <div className="flex gap-3">
                <button
                  onClick={resetRecording}
                  className="flex-1 py-4 rounded-xl font-bold bg-white/10 text-purple-200 hover:bg-white/20 transition"
                >
                  🔄 Re-record
                </button>
                {currentPart === 1 ? (
                  <button
                    onClick={nextPart}
                    disabled={!canProceed}
                    className="flex-1 py-4 rounded-xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:opacity-90 transition disabled:opacity-50"
                  >
                    Next: Story →
                  </button>
                ) : (
                  <button
                    onClick={processVoice}
                    disabled={!canProceed}
                    className="flex-1 py-4 rounded-xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:opacity-90 transition disabled:opacity-50"
                  >
                    ✨ Create Voice
                  </button>
                )}
              </div>
            )}
            
            {currentPart === 2 && (
              <button
                onClick={goBackToPart1}
                className="w-full py-2 text-purple-300 hover:text-white transition text-sm"
              >
                ← Back to Part 1
              </button>
            )}
          </div>

          {/* Playback */}
          {audioUrl && (
            <div className="mt-4 pt-4 border-t border-white/10">
              <p className="text-purple-300 text-sm mb-2">Preview:</p>
              <audio controls src={audioUrl} className="w-full" />
            </div>
          )}
        </div>

        {/* Tips */}
        <div className="mt-6 bg-purple-500/20 rounded-xl p-4">
          <h3 className="text-white font-semibold mb-2">💡 Tips:</h3>
          <ul className="text-purple-200 text-sm space-y-1">
            {currentPart === 1 ? (
              <>
                <li>• Speak naturally — ums, pauses and all!</li>
                <li>• Pretend you're chatting to a friend</li>
                <li>• Don't read — just talk freely</li>
              </>
            ) : (
              <>
                <li>• Read like you're telling a bedtime story</li>
                <li>• Use expression — excitement, whispers, warmth</li>
                <li>• Take your time, no need to rush</li>
              </>
            )}
            <li>• Find a quiet room with no background noise</li>
            <li>• Hold phone about 15cm from your mouth</li>
          </ul>
        </div>
      </div>
    </main>
  )
}