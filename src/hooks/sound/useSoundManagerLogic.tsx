import { useEffect, useRef } from 'react'
import { determineSoundFile } from './utils/soundUtils'

interface SoundState {
  id: number
  audio: HTMLAudioElement
  loop: boolean
}

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
  const sounds = useRef<SoundState[]>([])

  const hasSound = (id: number): boolean => {
    return sounds.current.some((sound: { id: number }) => sound.id === id)
  }

  useEffect(() => {
    sounds.current.forEach((sound: { loop?: boolean; id?: number; audio?: any }) => {
      const { audio } = sound
      audio
        .play()
        .catch((error: string) => console.error('Error playing audio:', error))

      // If loop is set to true, configure the audio element to loop indefinitely
      if (sound.loop) {
        audio.loop = true
      } else {
        // Otherwise, set up event listeners for cleanup
        const audioEndedHandler = () => {
          sounds.current = sounds.current.filter(
            (prevSound: { id: number }) => prevSound.id !== sound.id,
          )
          // Cleanup
          audio.removeEventListener('ended', audioEndedHandler)
          audio.pause()
          audio.src = ''
        }

        audio.addEventListener('ended', audioEndedHandler)
      }
    })

    // Cleanup on unmount for non-looping sounds
    return () => {
      sounds.current.forEach((sound: { loop: boolean; audio: { pause: () => void; src: string } }) => {
        if (!sound.loop) {
          sound.audio.pause()
          sound.audio.src = ''
        }
      })
    }
  }, [])

  const playInteraction = (
    interactionType: string,
    options: SoundOptions = {
      id: 0,
    },
  ): void => {
    // Clear all sounds from the state
    clearSounds()

    const calculatedSoundFile = determineSoundFile(interactionType)
    const soundId = options.id || Math.random() // Assign a random id if not provided

    // Create a new audio instance
    const audio = new Audio(calculatedSoundFile)
    audio.volume = options.volume !== undefined ? options.volume : 1

    // Add the new sound to the list
    sounds.current = [
      {
        id: soundId,
        audio: audio,
        loop: options.loop || false, // Set loop property from options or default to false
      },
    ]

    // Preload audio before playing
    audio.preload = 'auto'
    audio.addEventListener('loadeddata', () => {
      audio
        .play()
        .catch((error) => console.error('Error playing audio:', error))
    })
  }

  const clearSounds = () => {
    sounds.current = []
    console.log('Sounds cleared')
  }

  const out: SoundManagerHook = { playInteraction, clearSounds, hasSound }
  return out
}
