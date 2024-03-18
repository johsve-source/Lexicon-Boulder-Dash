import { useEffect, useReducer } from 'react'
import { SoundManagerHook } from './hooks/sound/useSoundManagerLogic'
import { loadLevelData, LevelData } from './LevelLoader'
import { TILES, Tile } from './Tiles'
import Grid from './Grid'

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
  Leveldata?: LevelData
  loadLevelCallback?: (path: string) => void
  soundManager?: SoundManagerHook
}

export interface GameState {
  grid: Grid<Tile>
  updateCords: Map<string, { x: number; y: number }>
  playerPos: { x: number; y: number }
  time: number
  score: number
  curentLevel?: LevelData
  nextLevel?: string
}

export async function loadLevel(
  gameDispatch: React.Dispatch<GameAction>,
  path: string,
) {
  if (!path) return

  return await loadLevelData(`/levels/${path}.json`).then((Leveldata) =>
    gameDispatch({ type: ActionEnum.LOAD_LEVEL, Leveldata }),
  )
}

export function GetGameReducer(): [GameState, React.Dispatch<GameAction>] {
  const [gameState, gameDispatch] = useReducer(gameReducer, {
    grid: new Grid<Tile>(),
    updateCords: new Map<string, { x: number; y: number }>(),
    playerPos: { x: 1, y: 1 },
    time: 0,
    score: 0,
  })

  useEffect(() => {
    loadLevel(gameDispatch, 'level1')
  }, [])

  return [gameState, gameDispatch]
}

export function gameReducer(state: GameState, action: GameAction): GameState {
  // prettier-ignore
  if (action.type === ActionEnum.MOVE_UP ||
        action.type === ActionEnum.MOVE_DOWN ||
        action.type === ActionEnum.MOVE_LEFT ||
        action.type === ActionEnum.MOVE_RIGHT) {
          return processPlayerMovement(state, action)
    }

  if (action.type === ActionEnum.TIME_STEP) {
    return processPhysics(state, action)
  }

  if (
    action.type === ActionEnum.LOAD_LEVEL &&
    typeof action.Leveldata !== 'undefined'
  ) {
    return applyLevelData(state, action.Leveldata)
  }

  throw new Error(`Invalid action type "${action.type}"!`)
}

function updateCord(
  updateCords: Map<string, { x: number; y: number }>,
  x: number,
  y: number,
) {
  updateCords.set(x + ',' + y, { x, y })
}

function updateArea(
  updateCords: Map<string, { x: number; y: number }>,
  x: number,
  y: number,
  width: number = 3,
  height: number = 3,
) {
  for (let iy = y; iy < y + height; iy++)
    for (let ix = x; ix < x + width; ix++) updateCord(updateCords, ix, iy)
}

function processPlayerMovement(
  state: GameState,
  action: GameAction,
): GameState {
  let directionX = 0
  let directionY = 0

  if (action.type === ActionEnum.MOVE_UP) directionY = -1
  else if (action.type === ActionEnum.MOVE_DOWN) directionY = 1
  else if (action.type === ActionEnum.MOVE_LEFT) directionX = -1
  else if (action.type === ActionEnum.MOVE_RIGHT) directionX = 1

  const gameGridClone = state.grid.clone()
  gameGridClone.setRelativeCenter(state.playerPos.x, state.playerPos.y)

  const centerTile = gameGridClone.getRelative(0, 0) ?? TILES.NOTHING
  const directinTile =
    gameGridClone.getRelative(directionX, directionY) ?? TILES.NOTHING

  // Check if the player is alive
  if (centerTile !== TILES.PLAYER) {
    if (typeof state.curentLevel !== 'undefined')
      return applyLevelData(state, state.curentLevel)
    else return state
  }

  // Bedrock
  if (directinTile === TILES.BEDROCK) {
    return state
  }

  // Finish
  if (directinTile === TILES.FINISH) {
    if (
      typeof action.loadLevelCallback !== 'undefined' &&
      typeof state.nextLevel !== 'undefined'
    )
      action.loadLevelCallback(state.nextLevel)

    return state
  }

  // Dirt
  if (directinTile === TILES.DIRT || directinTile === TILES.NOTHING) {
    gameGridClone.setRelative(directionX, directionY, centerTile)
    gameGridClone.setRelative(0, 0, TILES.NOTHING)

    if (typeof action.soundManager !== 'undefined')
      if (directinTile === TILES.DIRT) {
        action.soundManager.playInteraction('digging-dirt', {
          id: 1,
          volume: 0.5,
          loop: false,
          trailing: true,
        })
      }

    // Diamond
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

    // Pushing boulder right
  } else if (
    directionX === 1 &&
    gameGridClone.getRelative(2, 0) === TILES.NOTHING &&
    [TILES.DIRT_BOULDER, TILES.BEDROCK_BOULDER].includes(directinTile)
  ) {
    gameGridClone.setRelative(directionX, directionY, centerTile)
    gameGridClone.setRelative(directionX + 1, directionY, TILES.BEDROCK_BOULDER)
    gameGridClone.setRelative(0, 0, TILES.NOTHING)

    // Pushing boulder left
  } else if (
    directionX === -1 &&
    gameGridClone.getRelative(-2, 0) === TILES.NOTHING &&
    [TILES.DIRT_BOULDER, TILES.BEDROCK_BOULDER].includes(directinTile)
  ) {
    gameGridClone.setRelative(directionX, directionY, centerTile)
    gameGridClone.setRelative(directionX - 1, directionY, TILES.BEDROCK_BOULDER)
    gameGridClone.setRelative(0, 0, TILES.NOTHING)
  } else {
    return state
  }

  updateArea(
    state.updateCords,
    state.playerPos.x - 1 + Math.min(directionX, 0),
    state.playerPos.y - 1 + Math.min(directionY, 0),
    3 + Math.abs(directionX),
    3 + Math.abs(directionY),
  )

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
  if (state.updateCords.size <= 0) return state

  console.log(`Physics: ${state.updateCords.size} items. `)

  const gameGridClone = state.grid.clone()
  const nextUpdateCords = new Map<string, { x: number; y: number }>()

  let playStoneFallingSound = false
  let playDiamondFallingSound = false
  let playDiamondPickupSound = false
  let playExplosionSound = false

  const sortedUpdates = [...state.updateCords.values()].sort((a, b) => {
    if (b.y !== a.y) return b.y - a.y
    return b.x - a.x
  })

  for (let i = 0; i < sortedUpdates.length; i++)
    for (let j = i + 1; j < sortedUpdates.length; j++)
      if (
        sortedUpdates[i].x === sortedUpdates[j].x &&
        sortedUpdates[i].y === sortedUpdates[j].y
      )
        console.log(sortedUpdates[i])

  sortedUpdates.forEach(({ x, y }) => {
    gameGridClone.setRelativeCenter(x, y)
    const tile = gameGridClone.getRelative(0, 0)

    // Check if tile is physics object
    if (
      ![
        TILES.DIRT_BOULDER,
        TILES.BEDROCK_BOULDER,
        TILES.FALLING_BOULDER,
        TILES.EXPLOSION,
        TILES.DIRT_DIAMOND,
        TILES.BEDROCK_DIAMOND,
      ].includes(tile)
    )
      return

    // Remove explosion
    if (tile === TILES.EXPLOSION) {
      gameGridClone.setRelative(0, 0, TILES.NOTHING)
      updateArea(nextUpdateCords, x - 1, y - 1)
    }

    // Falling boulder player kill
    else if (
      tile === TILES.FALLING_BOULDER &&
      gameGridClone.getRelative(0, 1) === TILES.PLAYER
    ) {
      for (let iy = 0; iy <= 2; iy++)
        for (let ix = -1; ix <= 1; ix++)
          if (gameGridClone.getRelative(ix, iy) !== TILES.BEDROCK) {
            gameGridClone.setRelative(ix, iy, TILES.EXPLOSION)
            updateCord(nextUpdateCords, ix + x, iy + y)
          }

      playExplosionSound = true
    }

    // Falling gem pick up
    else if (
      [TILES.DIRT_DIAMOND, TILES.BEDROCK_DIAMOND].includes(tile) &&
      gameGridClone.getRelative(0, 1) === TILES.PLAYER
    ) {
      gameGridClone.setRelative(0, 0, TILES.NOTHING)
      updateArea(nextUpdateCords, x - 1, y - 1)

      playDiamondPickupSound = true
    }

    // Falling down
    else if (gameGridClone.getRelative(0, 1) === TILES.NOTHING) {
      let fallVariant = tile
      if (tile === TILES.DIRT_BOULDER || tile === TILES.BEDROCK_BOULDER)
        fallVariant = TILES.FALLING_BOULDER
      else if (tile === TILES.DIRT_DIAMOND) fallVariant = TILES.BEDROCK_DIAMOND

      gameGridClone.setRelative(0, 0, TILES.NOTHING)
      gameGridClone.setRelative(0, 1, fallVariant)
      updateArea(nextUpdateCords, x - 1, y - 1, 3, 4)

      if ([TILES.DIRT_DIAMOND, TILES.BEDROCK_DIAMOND].includes(tile))
        playDiamondFallingSound = true
      else playStoneFallingSound = true
    }

    // Falling left
    else if (
      gameGridClone.getRelative(-1, 0) === TILES.NOTHING &&
      gameGridClone.getRelative(-1, 1) === TILES.NOTHING
    ) {
      let fallVariant = tile
      if (tile === TILES.DIRT_BOULDER || tile === TILES.BEDROCK_BOULDER)
        fallVariant = TILES.FALLING_BOULDER
      else if (tile === TILES.DIRT_DIAMOND) fallVariant = TILES.BEDROCK_DIAMOND

      gameGridClone.setRelative(0, 0, TILES.NOTHING)
      gameGridClone.setRelative(-1, 0, fallVariant)
      updateArea(nextUpdateCords, x - 2, y - 1, 4, 3)

      if ([TILES.DIRT_DIAMOND, TILES.BEDROCK_DIAMOND].includes(tile))
        playDiamondFallingSound = true
      else playStoneFallingSound = true
    }

    // Falling right
    else if (
      gameGridClone.getRelative(1, 0) === TILES.NOTHING &&
      gameGridClone.getRelative(1, 1) === TILES.NOTHING
    ) {
      let fallVariant = tile
      if (tile === TILES.DIRT_BOULDER || tile === TILES.BEDROCK_BOULDER)
        fallVariant = TILES.FALLING_BOULDER
      else if (tile === TILES.DIRT_DIAMOND) fallVariant = TILES.BEDROCK_DIAMOND

      gameGridClone.setRelative(0, 0, TILES.NOTHING)
      gameGridClone.setRelative(1, 0, fallVariant)
      updateArea(nextUpdateCords, x - 1, y - 1, 4, 3)

      if ([TILES.DIRT_DIAMOND, TILES.BEDROCK_DIAMOND].includes(tile))
        playDiamondFallingSound = true
      else playStoneFallingSound = true
    }

    // Reset falling boulder
    else if (tile === TILES.FALLING_BOULDER) {
      gameGridClone.setRelative(0, 0, TILES.BEDROCK_BOULDER)
    }
  })

  if (typeof action.soundManager !== 'undefined') {
    if (playExplosionSound)
      action.soundManager.playInteraction('stone-explode', {
        id: 3,
        volume: 0.5,
        loop: false,
        trailing: true,
      })

    if (playStoneFallingSound)
      action.soundManager.playInteraction('falling-stone', {
        id: 4,
        volume: 0.2,
        loop: false,
        trailing: true,
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
    updateCords: nextUpdateCords,
  }
}

function applyLevelData(state: GameState, Leveldata: LevelData) {
  return {
    ...state,
    grid: Leveldata.grid.clone(),
    playerPos: {
      x: Leveldata.playerPos.x,
      y: Leveldata.playerPos.y,
    },
    curentLevel: Leveldata,
    nextLevel: Leveldata.nextLevel,
  }
}
