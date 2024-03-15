import { useEffect, useRef } from 'react'
import { determineSoundFile } from './utils/soundUtils'
import { DEFAULT_DURATION } from './constants/soundConstants'

export interface SoundOptions {
  id: number
  duration?: number
  volume?: number
  loop?: boolean
}

export interface SoundManagerHook {
  playInteraction: (interactionType: string, options?: SoundOptions) => void
  clearSounds: () => void
  hasSound: (id: number) => boolean
}

export const useSoundManagerLogic = () => {
  interface SoundState {
    id: number
    audio: HTMLAudioElement
    loop: boolean
  }

  const sounds = useRef<Map<number, SoundState>>(new Map<number, SoundState>())
  const nonLoopingSounds = useRef<number[]>([])

  const hasSound = (id: number): boolean => sounds.current.has(id)

  useEffect(() => {
    const cleanupSounds = () => {
      nonLoopingSounds.current.forEach((id) => {
        const audio = sounds.current.get(id)?.audio
        if (audio) {
          audio.pause()
          audio.src = ''
        }
      })
      sounds.current.clear()
      nonLoopingSounds.current = []
    }

    window.addEventListener('beforeunload', cleanupSounds)

    return () => {
      cleanupSounds()
      window.removeEventListener('beforeunload', cleanupSounds)
    }
  }, [])

  const playInteraction = (
    interactionType: string,
    options: SoundOptions = { id: 0 },
  ): void => {
    const {
      id = sounds.current.size + 1,
      loop = false,
      duration = DEFAULT_DURATION,
      volume = 1,
    } = options

    if (!loop) nonLoopingSounds.current.push(id)

    let sound = sounds.current.get(id)
    if (!sound) {
      const audio = new Audio(determineSoundFile(interactionType))
      audio.volume = volume
      audio.loop = loop

      audio.addEventListener('error', (error) => {
        console.error('Error loading audio:', error)
        // Cleanup the audio element if an error occurs
        audio.pause()
        audio.src = ''
        sounds.current.delete(id)
        // Remove the id from nonLoopingSounds array if it exists
        const index = nonLoopingSounds.current.indexOf(id)
        if (index !== -1) {
          nonLoopingSounds.current.splice(index, 1)
        }
      })

      sound = { id, audio, loop }
      sounds.current.set(id, sound)
    }

    sound.audio.currentTime = 0

    if (!loop) {
      setTimeout(() => {
        sound?.audio.pause()
        // Remove the id from nonLoopingSounds array after duration
        const index = nonLoopingSounds.current.indexOf(id)
        if (index !== -1) {
          nonLoopingSounds.current.splice(index, 1)
        }
      }, duration)
    }

    sound.audio
      .play()
      .catch((error) => console.error('Error playing audio:', error))
  }

  const clearSounds = () => {
    nonLoopingSounds.current.forEach((id) => {
      const audio = sounds.current.get(id)?.audio
      if (audio) {
        audio.pause()
        audio.src = ''
      }
    })
    sounds.current.clear()
    nonLoopingSounds.current = []
    console.log('Sounds cleared')
  }

  const out: SoundManagerHook = { playInteraction, clearSounds, hasSound }
  return out
}
