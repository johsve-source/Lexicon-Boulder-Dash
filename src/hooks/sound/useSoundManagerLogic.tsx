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
    sounds.current.forEach((sound: SoundState) => {
      const { audio } = sound
      if (audio) {
        // Check if audio is defined
        audio
          .play()
          .catch((error: string) =>
            console.error('Error playing audio:', error),
          )

        // If loop is set to true, configure the audio element to loop indefinitely
        if (!sound.loop) {
          // Set up event listener for non-looping sounds
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
      }
    })

    // Cleanup on unmount for all sounds
    return () => {
      sounds.current.forEach((sound: SoundState) => {
        if (sound.audio && !sound.loop) {
          // Check if audio is defined and not looping
          sound.audio.pause()
          sound.audio.src = ''
        }
      })
    }
  }, [])

  const playInteraction = (
    interactionType: string,
    options: SoundOptions = { id: 0 },
  ): void => {
    // Clear all sounds from the state
    clearSounds()

    const calculatedSoundFile = determineSoundFile(interactionType)
    const soundId =
      options.id ||
      (sounds.current.length > 0
        ? Math.max(...sounds.current.map((sound) => sound.id)) + 1
        : 1)

    // Create a new audio instance
    const audio = new Audio(calculatedSoundFile)
    audio.volume = options.volume !== undefined ? options.volume : 1

    // Set loop property to true if it's not explicitly set to false in options
    audio.loop = options.loop !== false

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
