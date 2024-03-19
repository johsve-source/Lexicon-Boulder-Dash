import { useEffect, useRef } from 'react'
import { determineSoundFile } from './utils/soundUtils'
import { DEFAULT_DURATION } from './constants/soundConstants'

export interface SoundOptions {
  id: number
  duration?: number
  volume?: number
  loop?: boolean
  trailing?: boolean
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
    trailing: boolean
  }

  const sounds = useRef<Map<number, SoundState[]>>(
    new Map<number, SoundState[]>(),
  )
  const nonLoopingSounds = useRef<number[]>([])

  const hasSound = (id: number): boolean => sounds.current.has(id)

  const cleanupSound = (id: number) => {
    const soundInstances = sounds.current.get(id)
    if (soundInstances) {
      soundInstances.forEach(({ audio }) => {
        audio.pause()
        audio.src = ''
      })
      sounds.current.delete(id)
    }
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
      volume = 1,
      trailing = false,
      duration = DEFAULT_DURATION, // 3000
    } = options

    // Check if the sound with the same ID is already playing
    if (sounds.current.has(id)) {
      const soundInstances = sounds.current.get(id)
      const isAlreadyPlaying =
        soundInstances && soundInstances.some((sound) => !sound.audio.paused)

      // If the sound is already playing and should not repeat, exit early
      if (isAlreadyPlaying && !loop && !trailing) {
        return
      }

      // If the sound is already playing and should repeat, stop the current instances
      if (isAlreadyPlaying && !trailing) {
        soundInstances.forEach(({ audio }) => {
          audio.pause()
          audio.currentTime = 0
        })
      }
    }

    let soundInstances = sounds.current.get(id)
    if (!soundInstances) {
      soundInstances = []
      sounds.current.set(id, soundInstances)
    }

    const audio = new Audio(determineSoundFile(interactionType))
    audio.volume = volume
    audio.loop = loop

    audio.addEventListener('error', (error) => {
      console.error('Error loading audio:', error)
      cleanupSound(id) // Cleanup if an error occurs
    })

    soundInstances.push({ id, audio, loop, trailing })

    audio.currentTime = 0

    if (!loop && !trailing) {
      audio
        .play()
        .catch((error) => console.error('Error playing audio:', error))

      // Pause and cleanup the sound after the specified duration
      setTimeout(() => {
        audio.pause()
        cleanupSound(id)
      }, duration)
    } else if (trailing) {
      audio
        .play()
        .catch((error) => console.error('Error playing audio:', error))
    }
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
