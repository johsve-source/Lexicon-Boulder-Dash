import { decryptData } from './encryption'

export const DEFAULT_KEY_NAME = 'highscore' as const

export type HighscoreEntry = {
  playerId: string
  score: number
}

export function loadHighscoresFromLocal(storedData: string): HighscoreEntry[] {
  const decryptedData: HighscoreEntry[] = decryptData(storedData)
  if (Array.isArray(decryptedData)) {
    return decryptedData
  } else {
    throw new Error('Invalid highscore data')
  }
}

export function loadIndividualHighscore(
  storedData: string,
  playerId: string,
): number | null {
  const decryptedData: HighscoreEntry[] = decryptData(storedData)
  if (Array.isArray(decryptedData)) {
    const playerHighscore: HighscoreEntry | undefined = decryptedData.find(
      (entry: HighscoreEntry) => entry.playerId === playerId,
    )
    return playerHighscore ? playerHighscore.score : null
  } else {
    throw new Error('Invalid highscore data')
  }
}
