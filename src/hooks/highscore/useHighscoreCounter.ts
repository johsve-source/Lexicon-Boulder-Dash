import { useState, useEffect } from 'react'
import { encryptData } from './modules/encryption'
import {
  DEFAULT_KEY_NAME,
  loadHighscoresFromLocal,
  loadIndividualHighscore,
} from './modules/highscore'

export const useHighscoreCounter = (
  keyName: string = DEFAULT_KEY_NAME,
): {
  highscores: number[]
  updateHighscores: (newHighscores: number[]) => void
  resetHighscores: () => void
  loadPlayerHighscore: (playerId: string) => number | null
  handleUpdatedHighscore: (currentScore: number) => void
} => {
  const [highscores, setHighscores] = useState<number[]>([])

  const updateHighscores = (newHighscores: number[]): void => {
    setHighscores(newHighscores)
  }

  const resetHighscores = (): void => {
    setHighscores([])
  }

  useEffect(() => {
    // Load highscores from local storage on component mount
    const storedData = localStorage.getItem(keyName)
    if (storedData) {
      try {
        const decryptedHighscores = loadHighscoresFromLocal(storedData)
        const scores = decryptedHighscores.map((entry) => entry.score) // Extract scores from HighscoreEntry array
        setHighscores(scores)
      } catch (error) {
        console.error('Error loading highscores:', (error as Error).message)
        resetHighscores()
      }
    }
  }, [keyName])

  useEffect(() => {
    const saveHighscoresToLocal = (highscores: number[]): void => {
      try {
        const dataToEncrypt = { highscores }
        const encryptedData = encryptData(JSON.stringify(dataToEncrypt))
        localStorage.setItem(keyName, encryptedData as string)
      } catch (error) {
        console.error('Error saving highscores:', (error as Error).message)
      }
    }

    // Save highscores to local storage whenever they change
    saveHighscoresToLocal(highscores)
  }, [highscores, keyName])

  const loadPlayerHighscore = (playerId: string): number | null => {
    const storedData = localStorage.getItem(keyName)
    if (storedData) {
      try {
        return loadIndividualHighscore(storedData, playerId)
      } catch (error) {
        console.error(
          'Error loading individual highscore:',
          (error as Error).message,
        )
        return null
      }
    }
    return null
  }

  // Function to calculate the updated highscore
  const calculateUpdatedHighscore = (
    currentHighscores: number[],
    currentScore: number,
  ): number => {
    const currentHighscore = Math.max(...currentHighscores, 0) // Get the current highest score or 0 if no highscores
    return Math.max(currentHighscore, currentScore) // Return the highest of the current highscore and current score
  }

  // Function to handle diamond pickup and update highscore
  const handleUpdatedHighscore = (currentScore: number): void => {
    const updatedHighscore = calculateUpdatedHighscore(highscores, currentScore)
    updateHighscores([...highscores, updatedHighscore])
  }

  return {
    highscores,
    updateHighscores,
    resetHighscores,
    loadPlayerHighscore,
    handleUpdatedHighscore,
  }
}
