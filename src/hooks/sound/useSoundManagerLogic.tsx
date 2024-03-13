import { useState, useEffect } from 'react'
import { determineSoundFile } from './utils/soundUtils'
import * as SoundConstants from './constants/soundConstants.ts'

interface SoundState {
  duration: number
  id: number
  playing: boolean
  soundFile: string
  loop: boolean
  volume?: number
}

interface SoundOptions {
  id: number
  loop?: boolean
  playOnce?: boolean
  duration?: number
  volume?: number
}

export const useSoundManagerLogic = () => {
  const [sounds, setSounds] = useState<SoundState[]>([])
  const [soundIdCounter, setSoundIdCounter] = useState(0)

  useEffect(() => {
    const playAudio = (audio: HTMLAudioElement) => {
      audio
        .play()
        .catch((error) => console.error('Error playing audio:', error))
    }

    const clearSound = (soundId: number) => {
      setSounds((prevSounds) =>
        prevSounds.filter((sound) => sound.id !== soundId),
      )
    }

    sounds.forEach((sound) => {
      const audio = new Audio(sound.soundFile)
      audio.loop = sound.loop
      audio.volume = sound.volume !== undefined ? sound.volume : 1

      const playPromise = audio.play()

      if (playPromise !== undefined) {
        playPromise
          .then(() => {})
          .catch((error) => {
            console.error('Autoplay prevented:', error)
            document.addEventListener('click', () => playAudio(audio), {
              once: true,
            })
          })
      }

      if (!sound.loop) {
        const timeoutId = setTimeout(() => {
          clearSound(sound.id)
        }, sound.duration || SoundConstants.DEFAULT_DURATION)

        return () => {
          clearTimeout(timeoutId)
          audio.pause()
          audio.src = ''
        }
      }

      return () => {
        audio.pause()
        audio.src = ''
      }
    })
  }, [sounds])

  const playInteraction = (
    interactionType: string,
    options: SoundOptions = {
      id: 0,
    },
  ): void => {
    const calculatedSoundFile = determineSoundFile(interactionType)
    const soundId = soundIdCounter + 1

    setSoundIdCounter((prevCounter) => prevCounter + 1)

    setSounds((prevSounds) => [
      ...prevSounds,
      {
        id: soundId,
        playing: true,
        soundFile: calculatedSoundFile,
        loop: !!options.loop,
        duration: options.duration || SoundConstants.DEFAULT_DURATION,
        volume: options.volume !== undefined ? options.volume : 1,
      },
    ])
  }

  const clearSounds = () => {
    setSounds([])
  }

  return { playInteraction, clearSounds }
}
