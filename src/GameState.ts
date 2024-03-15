import Grid from './Grid'
import { SoundManagerHook } from './hooks/sound/useSoundManagerLogic'
import { TILES, Tile } from './Tiles'

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
  grid: Grid<Tile>
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

  const centerTile = gameGridClone.getRelative(0, 0) ?? TILES.NOTHING
  const directinTile =
    gameGridClone.getRelative(directionX, directionY) ?? TILES.NOTHING

  if (directinTile === TILES.BEDROCK) {
    return state
  } else if (directinTile === TILES.DIRT || directinTile === TILES.NOTHING) {
    gameGridClone.setRelative(directionX, directionY, centerTile)
    gameGridClone.setRelative(0, 0, TILES.NOTHING)

    if (typeof action.soundManager !== 'undefined')
      if (directinTile === TILES.DIRT) {
        action.soundManager.playInteraction('digging-dirt', {
          id: 1,
          volume: 0.5,
          loop: false,
        })
      }
  } else if (
    [TILES.DIRT_DIAMOND, TILES.BEDROCK_DIAMOND].includes(directinTile)
  ) {
    if (typeof action.soundManager !== 'undefined')
      action.soundManager.playInteraction('collecting-diamond', {
        id: 2,
        volume: 0.5,
        loop: false,
      })

    gameGridClone.setRelative(directionX, directionY, centerTile)
    gameGridClone.setRelative(0, 0, TILES.NOTHING)
  } else if (directinTile === TILES.FINISH) {
    alert('WE HAVE A WINNER!')
    return state
  } else if (
    [TILES.DIRT_BOULDER, TILES.BEDROCK_BOULDER].includes(directinTile) &&
    directionX === 1 &&
    gameGridClone.getRelative(2, 0) === TILES.NOTHING
  ) {
    // right
    gameGridClone.setRelative(directionX, directionY, centerTile)
    gameGridClone.setRelative(directionX + 1, directionY, TILES.BEDROCK_BOULDER)
    gameGridClone.setRelative(0, 0, TILES.NOTHING)
  } else if (
    directinTile === TILES.DIRT_BOULDER &&
    directionX === -1 &&
    gameGridClone.getRelative(-2, 0) === TILES.NOTHING
  ) {
    // left
    gameGridClone.setRelative(directionX, directionY, centerTile)
    gameGridClone.setRelative(directionX - 1, directionY, TILES.DIRT_BOULDER)
    gameGridClone.setRelative(0, 0, TILES.NOTHING)
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
  let playDiamondPickupSound = false
  let playExplosionSound = false

  gameGridClone
    .toItterArray()
    .reverse()
    .filter(
      ([, x, y]) =>
        y > 0 &&
        y < gameGridClone.height - 1 &&
        x > 0 &&
        x < gameGridClone.width - 1,
    )
    .filter(([tile]) =>
      [
        TILES.DIRT_BOULDER,
        TILES.BEDROCK_BOULDER,
        TILES.FALLING_BOULDER,
        TILES.EXPLOSION,
        TILES.DIRT_DIAMOND,
        TILES.BEDROCK_DIAMOND,
      ].includes(tile),
    )
    .forEach(([tile, x, y]) => {
      gameGridClone.setRelativeCenter(x, y)

      // Remove explosion
      if (tile === TILES.EXPLOSION) {
        gameGridClone.setRelative(0, 0, TILES.NOTHING)
        return
      }

      // Falling boulder player kill
      if (
        tile === TILES.FALLING_BOULDER &&
        gameGridClone.getRelative(0, 1) === TILES.PLAYER
      ) {
        for (let iy = 0; iy <= 2; iy++)
          for (let ix = -1; ix <= 1; ix++)
            if (gameGridClone.getRelative(ix, iy) !== TILES.BEDROCK)
              gameGridClone.setRelative(ix, iy, TILES.EXPLOSION)

        playExplosionSound = true
        return
      }

      // Falling gem pick up
      if (
        [TILES.DIRT_DIAMOND, TILES.BEDROCK_DIAMOND].includes(tile) &&
        gameGridClone.getRelative(0, 1) === TILES.PLAYER
      ) {
        gameGridClone.setRelative(0, 0, TILES.NOTHING)
        playDiamondPickupSound = true
        return
      }

      // Falling down
      if (gameGridClone.getRelative(0, 1) === TILES.NOTHING) {
        let fallVariant = tile
        if (tile === TILES.DIRT_BOULDER || tile === TILES.BEDROCK_BOULDER)
          fallVariant = TILES.FALLING_BOULDER
        else if (tile === TILES.DIRT_DIAMOND)
          fallVariant = TILES.BEDROCK_DIAMOND

        gameGridClone.setRelative(0, 0, TILES.NOTHING)
        gameGridClone.setRelative(0, 1, fallVariant)

        if ([TILES.DIRT_DIAMOND, TILES.BEDROCK_DIAMOND].includes(tile))
          playDiamondFallingSound = true
        else playStoneFallingSound = true
        return
      }

      // Falling left
      if (
        gameGridClone.getRelative(-1, 0) === TILES.NOTHING &&
        gameGridClone.getRelative(-1, 1) === TILES.NOTHING
      ) {
        let fallVariant = tile
        if (tile === TILES.DIRT_BOULDER || tile === TILES.BEDROCK_BOULDER)
          fallVariant = TILES.FALLING_BOULDER
        else if (tile === TILES.DIRT_DIAMOND)
          fallVariant = TILES.BEDROCK_DIAMOND

        gameGridClone.setRelative(0, 0, TILES.NOTHING)
        gameGridClone.setRelative(-1, 0, fallVariant)

        if ([TILES.DIRT_DIAMOND, TILES.BEDROCK_DIAMOND].includes(tile))
          playDiamondFallingSound = true
        else playStoneFallingSound = true
        return
      }

      // Falling right
      if (
        gameGridClone.getRelative(1, 0) === TILES.NOTHING &&
        gameGridClone.getRelative(1, 1) === TILES.NOTHING
      ) {
        let fallVariant = tile
        if (tile === TILES.DIRT_BOULDER || tile === TILES.BEDROCK_BOULDER)
          fallVariant = TILES.FALLING_BOULDER
        else if (tile === TILES.DIRT_DIAMOND)
          fallVariant = TILES.BEDROCK_DIAMOND

        gameGridClone.setRelative(0, 0, TILES.NOTHING)
        gameGridClone.setRelative(1, 0, fallVariant)

        if ([TILES.DIRT_DIAMOND, TILES.BEDROCK_DIAMOND].includes(tile))
          playDiamondFallingSound = true
        else playStoneFallingSound = true
        return
      }

      // Reset falling boulder
      if (tile === TILES.FALLING_BOULDER) {
        gameGridClone.setRelative(0, 0, TILES.BEDROCK_BOULDER)
        return
      }
    })

  if (typeof action.soundManager !== 'undefined') {
    if (playExplosionSound)
      action.soundManager.playInteraction('stone-explode', {
        id: 3,
        volume: 0.5,
        loop: false,
      })

    if (playStoneFallingSound)
      action.soundManager.playInteraction('falling-stone', {
        id: 4,
        volume: 0.2,
        loop: false,
      })

    if (playDiamondFallingSound)
      action.soundManager.playInteraction('falling-diamond', {
        id: 5,
        volume: 0.2,
        loop: false,
      })

    if (playDiamondPickupSound)
      action.soundManager.playInteraction('collecting-diamond', {
        id: 6,
        volume: 0.5,
        loop: false,
      })
  }

  return {
    ...state,
    grid: gameGridClone,
  }
}
