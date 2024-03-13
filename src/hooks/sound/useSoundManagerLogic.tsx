import { useState, useEffect } from 'react'
import { determineSoundFile } from './utils/soundUtils'
import * as SoundConstants from './constants/soundConstants.ts'

interface SoundState {
  id: number
  playing: boolean
  soundFile: string
  loop: boolean
}

interface SoundOptions {
  id: number
  loop?: boolean
  playOnce?: boolean
  duration?: number
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

    sounds.forEach((sound) => {
      const audio = new Audio(sound.soundFile)
      audio.loop = sound.loop

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
      },
    ])

    if (!options.playOnce) {
      setTimeout(() => {
        setSounds((prevSounds) =>
          prevSounds.filter((sound) => sound.id !== soundId),
        )
      }, options.duration || SoundConstants.DEFAULT_DURATION)
    }
  }

  const clearSounds = () => {
    setSounds([])
  }

  return { playInteraction, clearSounds }
}
