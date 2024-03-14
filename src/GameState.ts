import Grid from './Grid'
import { SoundManagerHook } from './hooks/sound/useSoundManagerLogic'

export enum ActionEnum {
  MOVE_UP = 'MOVE_UP',
  MOVE_DOWN = 'MOVE_DOWN',
  MOVE_LEFT = 'MOVE_LEFT',
  MOVE_RIGHT = 'MOVE_RIGHT',
  TIME_STEP = 'TIME_STEP',
  LOAD_LEVEL = 'LOAD_LEVEL',
}

export interface GameAction {
  type: ActionEnum
  //Leveldata?: unknown data type
  soundManager?: SoundManagerHook
}

export interface GameState {
  grid: Grid<string>
  playerPos: { x: number; y: number }
  time: number
  score: number
}

export function gameReducer(state: GameState, action: GameAction): GameState {
  // prettier-ignore
  if (action.type === ActionEnum.MOVE_UP ||
        action.type === ActionEnum.MOVE_DOWN ||
        action.type === ActionEnum.MOVE_LEFT ||
        action.type === ActionEnum.MOVE_RIGHT) {
        return processPlayerMovement(state, action)
    }

  else if (action.type === ActionEnum.TIME_STEP) {
    return processPhysics(state, action)
  }
 
  else {
    throw new Error(`Invalid action type "${action.type}"!`)
  }
}

function processPlayerMovement(
  state: GameState,
  action: GameAction,
): GameState {
  let directionX = 0
  let directionY = 0

  if (action.type === ActionEnum.MOVE_UP) directionY = -1
  if (action.type === ActionEnum.MOVE_DOWN) directionY = 1
  if (action.type === ActionEnum.MOVE_LEFT) directionX = -1
  if (action.type === ActionEnum.MOVE_RIGHT) directionX = 1

  const gameGridClone = state.grid.clone()
  gameGridClone.setRelativeCenter(state.playerPos.x, state.playerPos.y)

  const centerTile = gameGridClone.getRelative(0, 0) ?? 'default'
  const directinTile =
    gameGridClone.getRelative(directionX, directionY) ?? 'default'

  if (directinTile === 'b') {
    return state
  } else if (directinTile === 'd' || directinTile === 'n') {
    gameGridClone.setRelative(directionX, directionY, centerTile)
    gameGridClone.setRelative(0, 0, 'n')

    if (typeof action.soundManager !== 'undefined')
      if (directinTile === 'd') {
        action.soundManager.playInteraction('digging-dirt', {
          id: 1,
          volume: 0.5,
        })
      }
  } else if (directinTile === 'i') {
    if (typeof action.soundManager !== 'undefined')
      action.soundManager.playInteraction('collecting-diamond', {
        id: 2,
        volume: 0.5,
      })

    gameGridClone.setRelative(directionX, directionY, centerTile)
    gameGridClone.setRelative(0, 0, 'n')
  } else if (directinTile === 'f') {
    alert('WE HAVE A WINNER!')
    return state
  } else if (
    directinTile === 's' &&
    directionX === 1 &&
    gameGridClone.getRelative(2, 0) === 'n'
  ) {
    // right
    gameGridClone.setRelative(directionX, directionY, centerTile)
    gameGridClone.setRelative(directionX + 1, directionY, 's')
    gameGridClone.setRelative(0, 0, 'n')
  } else if (
    directinTile === 's' &&
    directionX === -1 &&
    gameGridClone.getRelative(-2, 0) === 'n'
  ) {
    // left
    gameGridClone.setRelative(directionX, directionY, centerTile)
    gameGridClone.setRelative(directionX - 1, directionY, 's')
    gameGridClone.setRelative(0, 0, 'n')
  } else {
    return state
  }

  return {
    ...state,
    grid: gameGridClone,
    playerPos: {
      x: state.playerPos.x + directionX,
      y: state.playerPos.y + directionY,
    },
  }
}

function processPhysics(state: GameState, action: GameAction): GameState {
  const gameGridClone = state.grid.clone()
  let playStoneFallingSound = false
  let playDiamondFallingSound = false

  gameGridClone
    .toItterArray()
    .reverse()
    .filter(
      ([block, , y]) =>
        (block === 's' || block === 'i') && y < gameGridClone.height - 1,
    )
    .filter(([, x, y]) => gameGridClone.get(x, y + 1) === 'n')
    .forEach(([tile, x, y]) => {
      gameGridClone.setRelativeCenter(x, y)
      gameGridClone.setRelative(0, 0, 'n')
      gameGridClone.setRelative(0, 1, tile)

      if (gameGridClone.get(x, y + 1) === 's') {
        playStoneFallingSound = true
      }

      if (gameGridClone.get(x, y + 1) === 'i') {
        playDiamondFallingSound = true
      }
    })

  if (playStoneFallingSound && action?.soundManager) {
    try {
      action.soundManager.playInteraction('falling-stone', {
        id: 3,
        volume: 0.2,
      })
    } catch (error) {
      console.log('Error playing stone falling sound: ', error)
    }
  }

  if (playDiamondFallingSound && action?.soundManager) {
    try {
      action.soundManager.playInteraction('falling-diamond', {
        id: 4,
        volume: 0.2,
      })
    } catch (error) {
      console.log('Error playing diamond falling sound: ', error)
    }
  }

  return {
    ...state,
    grid: gameGridClone,
  }
}
