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

    return cleanupSounds
  }, [])

  const playInteraction = (
    interactionType: string,
    options: SoundOptions = { id: 0 },
  ): void => {
    // Check if both loop and duration are provided
    if (options.loop !== undefined && options.duration !== undefined) {
      console.error(
        "Error: Sound is not playable since you can't set both loop and duration at the same time.",
      )
      return
    }

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

      sound = { id, audio, loop }
      sounds.current.set(id, sound)
    }

    sound.audio.currentTime = 0

    if (loop) {
      sound.audio
        .play()
        .catch((error) => console.error('Error playing audio:', error))
    } else {
      sound.audio
        .play()
        .catch((error) => console.error('Error playing audio:', error))
      setTimeout(() => {
        sound?.audio.pause()
      }, duration)
    }
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
