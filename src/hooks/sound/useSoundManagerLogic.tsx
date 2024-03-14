import { useState, useEffect } from 'react'
import { determineSoundFile } from './utils/soundUtils'

interface SoundState {
  id: number
  audio: HTMLAudioElement
}

export interface SoundOptions {
  id: number
  duration?: number
  volume?: number
}

export interface SoundManagerHook {
  playInteraction: (interactionType: string, options?: SoundOptions) => void
  clearSounds: () => void
  hasSound: (id: number) => boolean
}

export const useSoundManagerLogic = () => {
  const [sounds, setSounds] = useState<SoundState[]>([])

  const hasSound = (id: number): boolean => {
    return sounds.some((sound) => sound.id === id)
  }

  useEffect(() => {
    const playAudio = (audio: HTMLAudioElement) => {
      audio
        .play()
        .catch((error) => console.error('Error playing audio:', error))
    }

    sounds.forEach((sound) => {
      const { audio } = sound
      playAudio(audio)

      const clearSound = () => {
        setSounds((prevSounds) =>
          prevSounds.filter((prevSound) => prevSound.id !== sound.id),
        )
        // Cleanup
        audio.removeEventListener('ended', audioEndedHandler)
        audio.pause()
        audio.src = ''
      }

      const audioEndedHandler = () => {
        clearSound()
      }

      audio.addEventListener('ended', audioEndedHandler)
    })

    // Cleanup on unmount
    return () => {
      sounds.forEach((sound) => {
        sound.audio.pause()
        sound.audio.src = ''
      })
    }
  }, [sounds])

  const playInteraction = (
    interactionType: string,
    options: SoundOptions = {
      id: 0,
    },
  ): void => {
    const calculatedSoundFile = determineSoundFile(interactionType)
    const soundId = options.id || Math.random() // Assign a random id if not provided

    // Create a new audio instance
    const audio = new Audio(calculatedSoundFile)
    audio.volume = options.volume !== undefined ? options.volume : 1

    // Add the new sound to the list
    setSounds((prevSounds) => [
      ...prevSounds,
      {
        id: soundId,
        audio: audio,
      },
    ])

    // Cleanup audio after playing (remove it from sounds state)
    audio.addEventListener('ended', () => {
      setSounds((prevSounds) =>
        prevSounds.filter((sound) => sound.id !== soundId),
      )
    })

    // Preload audio before playing
    audio.preload = 'auto'
    audio.addEventListener('loadeddata', () => {
      audio
        .play()
        .catch((error) => console.error('Error playing audio:', error))
    })
  }

  const clearSounds = () => {
    setSounds([])
  }

  const out: SoundManagerHook = { playInteraction, clearSounds, hasSound }
  return out
}
