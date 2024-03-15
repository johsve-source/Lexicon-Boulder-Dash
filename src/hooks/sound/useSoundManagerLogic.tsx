import { useEffect, useRef } from 'react'
import { determineSoundFile } from './utils/soundUtils'
import { DEFAULT_DURATION } from './constants/soundConstants'

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
    // Check if both loop and duration are provided
    if (options.loop !== undefined && options.duration !== undefined) {
      console.error(
        "Error: Sound is not playable since you can't set both loop and duration at the same time.",
      )
      return
    }

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

    // Set loop property to true if it's explicitly set to true in options, otherwise default to false
    audio.loop = options.loop === true

    // Set the starting point of the audio file if duration is provided
    if (options.duration) {
      audio.currentTime = options.duration
    }

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
    audio.addEventListener('loadedmetadata', () => {
      // Wait for audio to load metadata before scheduling to stop it
      const duration =
        options.duration !== undefined ? options.duration : DEFAULT_DURATION

      setTimeout(() => {
        if (!audio.loop) {
          audio.pause()
          audio.currentTime = 0 // Reset currentTime to ensure proper playback next time
        }
      }, duration)

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
