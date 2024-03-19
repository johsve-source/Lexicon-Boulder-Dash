import { useEffect, useReducer } from 'react'
import { SoundManagerHook } from './hooks/sound/useSoundManagerLogic'
import { loadLevelData, LevelData } from './LevelLoader'
import { TILES, Tile } from './tiles/Tiles'
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
  const localGrid = gameGridClone.subGrid(state.playerPos.x, state.playerPos.y)

  const centerTile = localGrid.get(0, 0)
  const directinTile = localGrid.get(directionX, directionY)

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
    localGrid.set(directionX, directionY, centerTile)
    localGrid.set(0, 0, TILES.NOTHING)

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
    localGrid.set(directionX, directionY, centerTile)
    localGrid.set(0, 0, TILES.NOTHING)

    // Pushing boulder right
  } else if (
    directionX === 1 &&
    localGrid.get(2, 0) === TILES.NOTHING &&
    [TILES.DIRT_BOULDER, TILES.BEDROCK_BOULDER].includes(directinTile)
  ) {
    localGrid.set(directionX, directionY, centerTile)
    localGrid.set(directionX + 1, directionY, TILES.BEDROCK_BOULDER)
    localGrid.set(0, 0, TILES.NOTHING)

    // Pushing boulder left
  } else if (
    directionX === -1 &&
    localGrid.get(-2, 0) === TILES.NOTHING &&
    [TILES.DIRT_BOULDER, TILES.BEDROCK_BOULDER].includes(directinTile)
  ) {
    localGrid.set(directionX, directionY, centerTile)
    localGrid.set(directionX - 1, directionY, TILES.BEDROCK_BOULDER)
    localGrid.set(0, 0, TILES.NOTHING)
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

  const soundList = {
    stoneFalling: false,
    diamondFalling: false,
    diamondPickup: false,
    explosion: false,
  }

  const sortedUpdates = [...state.updateCords.values()].sort((a, b) => {
    if (b.y !== a.y) return b.y - a.y
    return b.x - a.x
  })

  sortedUpdates.forEach(({ x, y }) => {
    const localGrid = gameGridClone.subGrid(x, y)
    const tile = localGrid.get(0, 0)

    if (typeof tile.onPhysics !== 'undefined') {
      const updateCords = (
        rx: number,
        ry: number,
        width: number = 1,
        height: number = 1,
      ) => {
        updateArea(nextUpdateCords, x + rx, y + ry, width, height)
      }

      tile.onPhysics(localGrid, updateCords, soundList)
      return
    }
  })

  if (typeof action.soundManager !== 'undefined') {
    if (soundList.explosion)
      action.soundManager.playInteraction('stone-explode', {
        id: 3,
        volume: 0.5,
        loop: false,
        trailing: true,
      })

    if (soundList.stoneFalling)
      action.soundManager.playInteraction('falling-stone', {
        id: 4,
        volume: 0.2,
        loop: false,
        trailing: true,
      })

    if (soundList.diamondFalling)
      action.soundManager.playInteraction('falling-diamond', {
        id: 5,
        volume: 0.2,
        loop: false,
      })

    if (soundList.diamondPickup)
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
