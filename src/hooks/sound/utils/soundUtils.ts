import * as SoundConstants from '../constants/soundConstants.ts'

export const determineSoundFile = (interactionType: string): string => {
  switch (interactionType) {
    case 'start-game':
      return SoundConstants.START_GAME
    case 'game-over':
      return SoundConstants.GAME_OVER
    case 'timer-ending':
      return SoundConstants.TIMER_ENDING
    case 'ui-interaction':
      return SoundConstants.UI_INTERACTION
    case 'ambiance':
      return SoundConstants.AMBIANCE
    case 'ambiance-dark':
      return SoundConstants.AMBIANCE_DARK
    case 'ambiance-fire':
      return SoundConstants.AMBIANCE_FIRE
    case 'ambiance-forest':
      return SoundConstants.AMBIANCE_FOREST
    case 'digging-dirt':
      return SoundConstants.DIGGING_DIRT
    case 'falling-stone':
      return SoundConstants.FALLING_STONE
    case 'falling-diamond':
      return SoundConstants.FALLING_DIAMOND
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
    case 'theme':
      return SoundConstants.THEME
    case 'wood':
      return SoundConstants.WOOD
    case 'leaf':
      return SoundConstants.LEAF
    default:
      throw new Error(`Unknown interaction type: ${interactionType}`)
  }
}
