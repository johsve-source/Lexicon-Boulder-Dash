import { useEffect, useReducer } from 'react'
import { SoundManagerHook } from './hooks/sound/useSoundManagerLogic'
import { loadLevelData, LevelData } from './LevelLoader'
import { TILES, Tile, SoundList } from './tiles/Tiles'
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
  const [gameState, gameDispatch] = useReducer(gameReducer, new GameState())

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
          return state.clone().processPlayerMovement(action)
    }

  if (action.type === ActionEnum.TIME_STEP) {
    if (state.updateCords.size <= 0) return state
    else return state.clone().processPhysics(action)
  }

  if (
    action.type === ActionEnum.LOAD_LEVEL &&
    typeof action.Leveldata !== 'undefined'
  ) {
    return state.applyLevelData(action.Leveldata)
  }

  throw new Error(`Invalid action type "${action.type}"!`)
}

function playAudio(action: GameAction, soundList: SoundList) {
  if (typeof action.soundManager === 'undefined') return

  if (soundList.diggingDirt)
    action.soundManager.playInteraction('digging-dirt', {
      id: 1,
      volume: 0.5,
      loop: false,
      trailing: true,
    })

  if (soundList.diamondPickup)
    action.soundManager.playInteraction('collecting-diamond', {
      id: 2,
      volume: 0.5,
      loop: false,
    })

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

export class GameState {
  grid = new Grid<Tile>()
  updateCords = new Map<string, { x: number; y: number }>()
  playerPos = { x: 0, y: 0 }
  time = 0
  score = 0
  curentLevel?: LevelData
  nextLevel?: string

  processPlayerMovement(action: GameAction): GameState {
    const localGrid = this.subGrid(this.playerPos.x, this.playerPos.y)
    const playerTile = localGrid.get(0, 0)

    // Check if the player is alive
    if (playerTile !== TILES.PLAYER) {
      if (typeof this.curentLevel !== 'undefined')
        return this.applyLevelData(this.curentLevel)
      else return this
    }

    let directionX = 0
    let directionY = 0

    if (action.type === ActionEnum.MOVE_UP) directionY = -1
    else if (action.type === ActionEnum.MOVE_DOWN) directionY = 1
    else if (action.type === ActionEnum.MOVE_LEFT) directionX = -1
    else if (action.type === ActionEnum.MOVE_RIGHT) directionX = 1

    const soundList: SoundList = {
      diggingDirt: false,
      stoneFalling: false,
      diamondFalling: false,
      diamondPickup: false,
      explosion: false,
    }

    const update = (x: number, y: number) => {
      const tile = this.get(x, y)

      if (typeof tile.onPlayerMove !== 'undefined') {
        tile.onPlayerMove({
          x,
          y,
          tile,
          local: this.subGrid(x, y),

          updateLocal: (
            rx: number,
            ry: number,
            width: number = 1,
            height: number = 1,
          ) => {
            this.updateArea(x + rx, y + ry, width, height)
          },

          gameState: this,
          action,
          soundList,

          from: { x, y },
          moveDirection: { x: directionX, y: directionY },
        })
      }
    }

    for (let y = this.playerPos.y - 1; y <= this.playerPos.y + 1; y++)
      for (let x = this.playerPos.x - 1; x <= this.playerPos.x + 1; x++)
        if (!(x === this.playerPos.x && y === this.playerPos.y)) update(x, y)

    update(this.playerPos.x, this.playerPos.y)

    playAudio(action, soundList)

    return this
  }

  processPhysics(action: GameAction): GameState {
    if (this.updateCords.size <= 0) return this

    console.log(`Physics: ${this.updateCords.size} items. `)

    const soundList: SoundList = {
      diggingDirt: false,
      stoneFalling: false,
      diamondFalling: false,
      diamondPickup: false,
      explosion: false,
    }

    const sortedUpdates = [...this.updateCords.values()].sort((a, b) => {
      if (b.y !== a.y) return b.y - a.y
      return b.x - a.x
    })
    this.updateCords = new Map<string, { x: number; y: number }>()

    sortedUpdates.forEach(({ x, y }) => {
      const tile = this.get(x, y)

      if (typeof tile.onPhysics !== 'undefined') {
        tile.onPhysics({
          x,
          y,
          tile,
          local: this.subGrid(x, y),

          updateLocal: (
            rx: number,
            ry: number,
            width: number = 1,
            height: number = 1,
          ) => {
            this.updateArea(x + rx, y + ry, width, height)
          },

          gameState: this,
          action,
          soundList,
        })
      }
    })

    playAudio(action, soundList)

    return this
  }

  get(x: number, y: number) {
    return this.grid.get(x, y)
  }

  set(x: number, y: number, value: Tile) {
    return this.grid.set(x, y, value)
  }

  subGrid(x: number, y: number, width: number = 1, height: number = 1) {
    return this.grid.subGrid(x, y, width, height)
  }

  updateCord(x: number, y: number) {
    this.updateCords.set(x + ',' + y, { x, y })
  }

  updateArea(x: number, y: number, width: number = 3, height: number = 3) {
    for (let iy = y; iy < y + height; iy++)
      for (let ix = x; ix < x + width; ix++) this.updateCord(ix, iy)
  }

  applyLevelData(Leveldata: LevelData) {
    const clone = new GameState()

    clone.grid = Leveldata.grid.clone()
    clone.updateCords = this.updateCords
    clone.playerPos = { x: Leveldata.playerPos.x, y: Leveldata.playerPos.y }
    clone.time = this.time
    clone.score = this.score
    clone.curentLevel = Leveldata
    clone.nextLevel = Leveldata.nextLevel

    return clone
  }

  clone() {
    const clone = new GameState()

    clone.grid = this.grid.clone()
    clone.updateCords = this.updateCords
    clone.playerPos = { x: this.playerPos.x, y: this.playerPos.y }
    clone.time = this.time
    clone.score = this.score
    clone.curentLevel = this.curentLevel
    clone.nextLevel = this.nextLevel

    return clone
  }
}
