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
  cleanupAllSounds: () => void
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

  const cleanupSound = (id: number) => {
    const audio = sounds.current.get(id)?.audio
    if (audio) {
      audio.pause()
      audio.src = ''
    }
    sounds.current.delete(id)
    const index = nonLoopingSounds.current.indexOf(id)
    if (index !== -1) {
      nonLoopingSounds.current.splice(index, 1)
    }
  }

  useEffect(() => {
    const cleanupAllSounds = () => {
      nonLoopingSounds.current.forEach((id) => {
        cleanupSound(id)
      })
      sounds.current.forEach((_value, key) => {
        cleanupSound(key)
      })
    }

    window.addEventListener('beforeunload', cleanupAllSounds)

    return () => {
      cleanupAllSounds()
      window.removeEventListener('beforeunload', cleanupAllSounds)
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
        cleanupSound(id) // Cleanup if an error occurs
      })

      sound = { id, audio, loop }
      sounds.current.set(id, sound)
    }

    sound.audio.currentTime = 0

    if (!loop) {
      setTimeout(() => {
        sound?.audio.pause()
        cleanupSound(id) // Cleanup non-looping sound after duration
      }, duration)
    }

    sound.audio
      .play()
      .catch((error) => console.error('Error playing audio:', error))
  }

  const cleanupAllSounds = () => {
    nonLoopingSounds.current.forEach((id) => {
      cleanupSound(id)
    })
    nonLoopingSounds.current = []
    sounds.current.forEach((_value, key) => {
      cleanupSound(key)
    })
    sounds.current.clear()
  }

  const out: SoundManagerHook = {
    playInteraction,
    hasSound,
    cleanupAllSounds,
  }
  return out
}
