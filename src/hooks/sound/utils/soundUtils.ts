import * as SoundConstants from '../constants/soundConstants.ts'

export const determineSoundFile = (interactionType: string): string => {
  switch (interactionType) {
    case 'start-game':
      return SoundConstants.START_GAME
    case 'game-over':
      return SoundConstants.GAME_OVER
    case 'ui-interaction':
      return SoundConstants.UI_INTERACTION
    case 'ambiance':
      return SoundConstants.AMBIANCE
    case 'digging-dirt':
      return SoundConstants.DIGGING_DIRT
    case 'falling-stone':
      return SoundConstants.FALLING_STONE
    case 'stone-explode':
      return SoundConstants.STONE_EXPLODE
    case 'collecting-diamond':
      return SoundConstants.COLLECTING_DIAMOND
    case 'collecting-powerup':
      return SoundConstants.COLLECTING_POWERUP
    case 'game-level-2':
      return SoundConstants.GAME_LEVEL_2
    case 'game-level-3':
      return SoundConstants.GAME_LEVEL_3
    default:
      throw new Error(`Unknown interaction type: ${interactionType}`)
  }
}
