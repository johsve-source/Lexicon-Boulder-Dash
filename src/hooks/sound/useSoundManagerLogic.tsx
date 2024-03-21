/*
  Denna anpassade React-hook, useSoundManagerLogic, ger funktionalitet för att hantera ljud i en React-applikation.

  Den exporterar en hook-funktion som kapslar in logiken för att spela, stoppa och rensa upp ljud, samt kontrollera om ett ljud med ett visst ID finns.

  Hooket använder useRef för att behålla tillstånd för alla spelade ljud och ljud som inte löper, vilket säkerställer att ljudinstanser hanteras korrekt över komponentrenderingar.

  Gränssnittet SoundOptions definierar de valfria parametrarna som kan skickas vid uppspelning av ett ljud, inklusive ljudets ID, längd, volymnivå, slingbeteende och eftersläpningsbeteende.

  Gränssnittet SoundManagerHook definierar de funktioner som utsätts av hooket:
  - playInteraction: Spelar upp ett ljud baserat på den angivna interaktionstypen och valfria ljudalternativ.
  - cleanupAllSounds: Rensar upp alla spelade ljud och återställer internt tillstånd.
  - hasSound: Kontrollerar om ett ljud med ett visst ID finns.

  Hooket hanterar internt en karta över ljudinstanser, där varje ljud representeras av ett HTMLAudioElement tillsammans med metadata som dess sling- och eftersläpningsbeteende.

  Dessutom registrerar hooket en händelselyssnare vid montering av komponenten för att säkerställa korrekt rensning av alla ljud vid demontering av komponenten eller händelser för beforeunload. Beforeunload säkerställer att ljudet rensas för alla ljudinstanser.

  Sammantaget erbjuder useSoundManagerLogic en flexibel och robust lösning för att integrera ljudhantering i React-applikationer, vilket möjliggör sömlös integration av ljudåterkoppling och interaktioner.

* ------------------------------USAGE-------------------------------------
* import { useSoundManagerLogic } from './hooks/sound/useSoundManagerLogic'
*
* const soundManager = useSoundManagerLogic()
*
* soundManager.playInteraction('ambiance', {
*   id: 7,
*   volume: 0.2,
*   loop: true,
*   trailing: true,
* })
*
* Optional:
*   ID       - Default: Self-Assignable
*   Duration - Default: 3000ms
*   Volume   - Default: 1.0
*   Loop     - Default: False
*   Trailing - Default: False
*/

import { useEffect, useRef } from 'react'
import { determineSoundFile } from './utils/soundUtils' // Importing a function to determine the sound file path
import { DEFAULT_DURATION } from './constants/soundConstants' // Importing a constant for default duration

// Interface defining options for playing a sound
export interface SoundOptions {
  id: number // Unique identifier for the sound
  duration?: number // Optional duration for how long the sound should play
  volume?: number // Optional volume level for the sound (0 to 1)
  loop?: boolean // Optional boolean indicating if the sound should loop
  trailing?: boolean // Optional boolean indicating if the sound should play after previous instances finish
}

// Interface defining the sound manager hook
export interface SoundManagerHook {
  playInteraction: (
    interactionType: string, // Type of interaction triggering the sound
    options?: SoundOptions, // Optional sound options
  ) => void
  cleanupAllSounds: () => void // Function to clean up all playing sounds
  hasSound: (id: number) => boolean // Function to check if a sound with a given ID exists
}

// Custom hook for managing sounds
export const useSoundManagerLogic = () => {
  // Interface defining the state of a sound
  interface SoundState {
    id: number // Unique identifier for the sound
    audio: HTMLAudioElement // The audio element representing the sound
    loop: boolean // Indicates if the sound is set to loop
    trailing: boolean // Indicates if the sound is set to play after previous instances finish
  }

  // Using useRef to keep track of sounds and non-looping sounds
  const sounds = useRef<Map<number, SoundState[]>>(
    new Map<number, SoundState[]>(), // Initialize the sounds map
  )
  const nonLoopingSounds = useRef<number[]>([]) // Using useRef to keep track of non-looping sounds

  // Function to check if a sound with given ID exists
  const hasSound = (id: number): boolean => sounds.current.has(id)

  // Function to clean up a sound by given ID
  const cleanupSound = (id: number) => {
    // Function to clean up a sound
    const soundInstances = sounds.current.get(id) // Get the sound instances for the given ID
    if (soundInstances) {
      // If there are sound instances
      soundInstances.forEach(({ audio }) => {
        // For each sound instance, stop the audio
        audio.pause() // Stop the audio
        audio.src = '' // Clear the audio source
      })
      sounds.current.delete(id) // Remove the sound from the sounds map
    }
    const index = nonLoopingSounds.current.indexOf(id) // Get the index of the sound in the non-looping sounds array
    if (index !== -1) {
      // If the sound is found in the non-looping sounds array
      nonLoopingSounds.current.splice(index, 1) // Remove the sound from the non-looping sounds array
    }
  }

  // Effect hook to clean up all sounds on component unmount or beforeunload event
  useEffect(() => {
    const cleanupAllSounds = () => {
      // Function to clean up all sounds
      nonLoopingSounds.current.forEach((id) => {
        // For each non-looping sound, cleanup the sound
        cleanupSound(id)
      })
      sounds.current.forEach((_value, key) => {
        // For each sound instance, cleanup the sound
        cleanupSound(key)
      })
    }

    window.addEventListener('beforeunload', cleanupAllSounds) // Add an event listener for beforeunload, which calls the cleanupAllSounds function

    return () => {
      cleanupAllSounds() // Call the cleanupAllSounds function when the component unmounts
      window.removeEventListener('beforeunload', cleanupAllSounds) // Remove the event listener
    }
  }, []) // Empty dependency array to run the effect only once

  // Function to play a sound based on interaction type and options
  const playInteraction = (
    interactionType: string, // Type of interaction triggering the sound
    options: SoundOptions = { id: 0 }, // Optional sound options
  ): void => {
    const {
      id = sounds.current.size + 1, // Unique identifier for the sound
      loop = false, // Indicates if the sound should loop
      volume = 1, // Volume level for the sound (0 to 1)
      trailing = false, // Indicates if the sound should play after previous instances finish
      duration = DEFAULT_DURATION, // Default duration for how long the sound should play
    } = options

    // Check if the sound with the same ID is already playing
    if (sounds.current.has(id)) {
      const soundInstances = sounds.current.get(id) // Get the sound instances for the given ID
      const isAlreadyPlaying =
        soundInstances && soundInstances.some((sound) => !sound.audio.paused) // Checks if the sound is already playing

      // If the sound is already playing and should not repeat, exit early
      if (isAlreadyPlaying && !loop && !trailing) {
        return
      }

      // If the sound is already playing and should repeat, stop the current instances
      if (isAlreadyPlaying && !trailing) {
        // Checks if the sound is already playing and should not repeat
        soundInstances.forEach(({ audio }) => {
          // For each sound instance, stop the audio
          audio.pause() // Stop the audio
          audio.currentTime = 0 // Reset the audio playback position
        })
      }
    }

    let soundInstances = sounds.current.get(id) // Get the sound instances for the given ID
    if (!soundInstances) {
      // If there are no sound instances, create a new array
      soundInstances = [] // Create an empty array
      sounds.current.set(id, soundInstances) // Set the sound instances for the given ID
    }

    const audio = new Audio(determineSoundFile(interactionType)) // Creating an audio element for the sound, checks the soundUtils for determining the sound file
    audio.volume = volume // Setting the volume level
    audio.loop = loop // Setting whether the sound should loop

    // Event listener for handling audio loading errors
    audio.addEventListener('error', (error) => {
      // Event listener for handling audio loading errors
      console.error('Error loading audio:', error) // Logging the error
      cleanupSound(id) // Cleanup if an error occurs
    })

    soundInstances.push({ id, audio, loop, trailing }) // Adding the sound instance to the list

    audio.currentTime = 0 // Resetting the audio playback position

    // If the sound is not looping and not trailing, play it for the specified duration
    if (!loop && !trailing) {
      // Checks if the sound is not looping nor trailing
      audio
        .play() // Initiating playback
        .catch((error) => console.error('Error playing audio:', error)) // Handling errors during playback

      // Pause and cleanup the sound after the specified duration
      setTimeout(() => {
        // Setting up a timeout
        audio.pause() // Pausing the sound
        cleanupSound(id) // Cleanup the sound
      }, duration) // Pausing and cleaning up the sound after the specified duration
    } else if (trailing) {
      // If the sound is trailing, play it without resetting the playback position
      audio
        .play() // Initiating playback
        .catch((error) => console.error('Error playing audio:', error)) // Handling errors during playback
    }
  }

  // Function to clean up all sounds
  const cleanupAllSounds = () => {
    nonLoopingSounds.current.forEach((id) => {
      // Loops through all non-looping sounds
      cleanupSound(id) // Cleans up each sound
    })
    nonLoopingSounds.current = [] // Clears the non-looping sounds array
    sounds.current.forEach((_value, key) => {
      // Loops through all sounds
      cleanupSound(key) // Cleans up each sound
    })
    sounds.current.clear() // Clears the sounds map in the useRef hook
  }

  // Returning functions for interacting with sound manager hook
  const out: SoundManagerHook = {
    playInteraction, // Function to play a sound based on interaction type and options
    hasSound, // Function to check if a sound with given ID exists
    cleanupAllSounds, // Function to clean up all sounds
  }
  return out // Returning the hook
}
