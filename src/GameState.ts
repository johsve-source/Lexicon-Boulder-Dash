import { useEffect, useReducer } from 'react'
import { SoundManagerHook } from './hooks/sound/useSoundManagerLogic'
import { loadLevelData, LevelData } from './LevelLoader'
import { TILES, Tile, SoundList } from './tiles/Tiles'
import { explode } from './tiles/Explosion'
import Grid from './Grid'

/**A list of supported _gameReducer_ actions. */
export enum ActionEnum {
  MOVE_UP = 'MOVE_UP',
  MOVE_DOWN = 'MOVE_DOWN',
  MOVE_LEFT = 'MOVE_LEFT',
  MOVE_RIGHT = 'MOVE_RIGHT',
  LOAD_LEVEL = 'LOAD_LEVEL',
  PHYSICS_TICK = 'PHYSICS_TICK',
  TIME_TICK = 'TIME_TICK',
}

/**A interface defining _gameReducer_ action params. */
export interface GameAction {
  /**The type of action. */
  type: ActionEnum

  /**The Leveldata when loading a level.
   *
   * _**NOTE:** is required by the **LOAD_LEVEL** action._
   */
  Leveldata?: LevelData

  /**The callback function for requesting to load different a level.
   *
   * _**NOTE:** is required by the **MOVE_UP**, **MOVE_DOWN**, **MOVE_LEFT**, **MOVE_RIGHT** and **TIME_STEP** action._
   */
  loadLevelCallback?: (path: string) => void

  /**The SoundManagerHook hook.
   *
   * _**NOTE:** is required by the **MOVE_UP**, **MOVE_DOWN**, **MOVE_LEFT**, **MOVE_RIGHT** and **TIME_STEP** action._
   */
  soundManager?: SoundManagerHook

  endTime?: number
}

/**Loads and sets the gamestate based on provided level name. */
export async function loadLevel(
  gameDispatch: React.Dispatch<GameAction>,
  path: string,
) {
  if (!path) return

  return await loadLevelData(`/levels/${path}.json`).then((Leveldata) =>
    gameDispatch({ type: ActionEnum.LOAD_LEVEL, Leveldata }),
  )
}

/**A shorthand funtion tu setup a gameReducer with all the data set.
 *
 * Returns gameState and gameDispatch.
 */
export function GetGameReducer(): [GameState, React.Dispatch<GameAction>] {
  const [gameState, gameDispatch] = useReducer(gameReducer, new GameState())

  useEffect(() => {
    loadLevel(gameDispatch, 'level1')
  }, [])

  return [gameState, gameDispatch]
}

/**The reducer function for gameReducer.
 *
 * Runs reduction function based on action type.
 */
export function gameReducer(state: GameState, action: GameAction): GameState {
  // Player movement.
  // prettier-ignore
  if (action.type === ActionEnum.MOVE_UP ||
        action.type === ActionEnum.MOVE_DOWN ||
        action.type === ActionEnum.MOVE_LEFT ||
        action.type === ActionEnum.MOVE_RIGHT) {
          return state.processPlayerMovement(action)
    }

  // Start timer and update time state.
  if (action.type === ActionEnum.TIME_TICK) {
    return state.clone().processTime(action)
  }

  // Physics update.
  if (action.type === ActionEnum.PHYSICS_TICK) {
    return state.processPhysics(action)
  }

  // Load level.
  if (
    action.type === ActionEnum.LOAD_LEVEL &&
    typeof action.Leveldata !== 'undefined'
  ) {
    return state.applyLevelData(action.Leveldata)
  }

  throw new Error(`Invalid action type "${action.type}"!`)
}

/**A helper function for playing audio from a _SoundList_. */
function playAudio(action: GameAction, soundList: SoundList) {
  if (typeof action.soundManager === 'undefined') return

  if (soundList.diggingDirt)
    action.soundManager.playInteraction('digging-dirt', {
      id: 1,
      volume: 0.2,
      loop: false,
      trailing: true,
    })

  if (soundList.diamondPickup)
    action.soundManager.playInteraction('collecting-diamond', {
      id: 2,
      volume: 0.2,
      loop: false,
    })

  if (soundList.explosion)
    action.soundManager.playInteraction('stone-explode', {
      id: 3,
      volume: 0.2,
      loop: false,
      trailing: true,
    })

  if (soundList.stoneFalling)
    action.soundManager.playInteraction('falling-stone', {
      id: 4,
      volume: 0.1,
      loop: false,
      trailing: true,
    })

  if (soundList.diamondFalling)
    action.soundManager.playInteraction('falling-diamond', {
      id: 5,
      volume: 0.1,
      loop: false,
    })

  if (soundList.diamondPickup)
    action.soundManager.playInteraction('collecting-diamond', {
      id: 6,
      volume: 0.2,
      loop: false,
    })

  if (soundList.wood)
    action.soundManager.playInteraction('wood', {
      id: 77,
      volume: 0.2,
      loop: false,
      trailing: true,
    })

  if (soundList.leaf)
    action.soundManager.playInteraction('leaf', {
      id: 99,
      volume: 0.2,
      loop: false,
      trailing: true,
    })
}

/**A class to contain all the _GameState_ data and logic. */
export class GameState {
  /**Contains the current state of the game level. */
  grid = new Grid<Tile>()

  /**A Map/Hashmap containing all the coordinates awaiting physics update.
   *
   * _**NOTE:** every coordinate in the list is unique._
   */
  updateCords = new Map<string, { x: number; y: number }>()

  /**The current _player_ position. */
  playerPos = { x: 0, y: 0 }
  /**The _finish_ data. */
  finish = { x: 0, y: 0, tile: TILES.FINISH }
  /**The number of physics updates that have been preformed. */
  updateCount = 0
  /**The current _time_. */
  time = 120
  /**The current _score_. */
  score = 0
  /**The number of _diamonds_ remaining. */
  diamondsRemaining = 0
  /**The current state of the game. */
  isGameOver = false
  /**The _LevelData_ current level. */
  curentLevel?: LevelData

  /**Calls the _onLoad_ function on all the tiles. */
  onLevelLoad() {
    this.grid.forEach((tile, x, y) => {
      // Check if the tile has a onLoad function and run it.
      if (typeof tile.onLoad !== 'undefined') {
        tile.onLoad({
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
        })
      }
    })

    return this
  }

  processTime(action: GameAction): GameState {
    const stopTimer = (message: string) => {
      console.log(message)
      this.isGameOver = true
    }

    const updateTimer = () => {
      if (!action.endTime) {
        console.error('cannot get action.endTime')
        return this
      }

      const currentTime = new Date().getTime()
      const remainingTime = Math.round(
        Math.max((action.endTime - currentTime) / 1000, 0),
      )

      this.time = remainingTime
      console.log('new time: ', remainingTime)

      console.log(action.endTime)

      if (remainingTime <= 0) {
        stopTimer('time out')

        if (this.get(this.playerPos.x, this.playerPos.y) === TILES.PLAYER) {
          // which sounds that should be played
          const soundList: SoundList = {
            diggingDirt: false,
            stoneFalling: false,
            diamondFalling: false,
            diamondPickup: false,
            explosion: false,
            wood: false,
            leaf: false,
          }

          soundList.explosion = true

          explode(
            {
              x: this.playerPos.x,
              y: this.playerPos.y,
              tile: this.get(this.playerPos.x, this.playerPos.y),
              local: this.subGrid(this.playerPos.x, this.playerPos.y),

              updateLocal: (
                rx: number,
                ry: number,
                width: number = 1,
                height: number = 1,
              ) => {
                this.updateArea(
                  this.playerPos.x + rx,
                  this.playerPos.y + ry,
                  width,
                  height,
                )
              },

              gameState: this,
              action,
              soundList,
            },
            0,
            0,
          )

          playAudio(action, soundList)
        }
      }
      return this.time
    }

    // Check if the player is alive
    this.isGameOver =
      this.get(this.playerPos.x, this.playerPos.y) !== TILES.PLAYER

    if (!this.isGameOver) {
      updateTimer()
    } else if (this.isGameOver) {
      stopTimer('game over')
    }

    return this
  }

  processPlayerMovement(action: GameAction): GameState {
    /**A local grid centered a round the player */
    const localGrid = this.subGrid(this.playerPos.x, this.playerPos.y)
    const playerTile = localGrid.get(0, 0)

    // Check if the player is alive
    this.isGameOver = playerTile !== TILES.PLAYER
    if (this.isGameOver) {
      if (typeof this.curentLevel !== 'undefined')
        return this.applyLevelData(this.curentLevel) // restart
      else return this
    }

    /**The movment **x** component. */
    let directionX = 0
    /**The movment **y** component. */
    let directionY = 0

    // Updates player coordinates.
    if (action.type === ActionEnum.MOVE_UP) directionY = -1
    else if (action.type === ActionEnum.MOVE_DOWN) directionY = 1
    else if (action.type === ActionEnum.MOVE_LEFT) directionX = -1
    else if (action.type === ActionEnum.MOVE_RIGHT) directionX = 1

    // Create the next gamestate.
    const nextGameState = this.clone()

    // Which sounds that should be played.
    const soundList: SoundList = {
      diggingDirt: false,
      stoneFalling: false,
      diamondFalling: false,
      diamondPickup: false,
      explosion: false,
      wood: false,
      leaf: false,
    }

    /**A shrorthand function to update the grid based on player movement. */
    const update = (x: number, y: number) => {
      const tile = this.get(x, y)

      // Check if the tile has a onPlayerMove function and run it.
      if (typeof tile.onPlayerMove !== 'undefined') {
        tile.onPlayerMove({
          x,
          y,
          tile,
          local: nextGameState.subGrid(x, y),

          updateLocal: (
            rx: number,
            ry: number,
            width: number = 1,
            height: number = 1,
          ) => {
            nextGameState.updateArea(x + rx, y + ry, width, height)
          },

          gameState: nextGameState,
          action,
          soundList,

          from: { x, y },
          moveDirection: { x: directionX, y: directionY },
        })
      }
    }

    // Updates the 8 tiles around the player
    for (let y = this.playerPos.y - 1; y <= this.playerPos.y + 1; y++)
      for (let x = this.playerPos.x - 1; x <= this.playerPos.x + 1; x++)
        if (!(x === this.playerPos.x && y === this.playerPos.y)) update(x, y)

    // Update the player
    update(this.playerPos.x, this.playerPos.y)

    // Adds the finish tile when all the diamonds are picked up.
    if (this.diamondsRemaining <= 0) {
      nextGameState.set(
        this.finish.x,
        this.finish.y,
        [TILES.DIRT, TILES.DIRT_FINISH].includes(
          nextGameState.get(this.finish.x, this.finish.y),
        )
          ? TILES.DIRT_FINISH
          : TILES.BEDROCK_FINISH,
      )
    }

    playAudio(action, soundList)

    // Check if the player is alive
    this.isGameOver = playerTile !== TILES.PLAYER

    // Check if the player is alive
    this.isGameOver = playerTile !== TILES.PLAYER

    return nextGameState
  }

  /**Processes all the game physics. */
  processPhysics(action: GameAction): GameState {
    if (this.updateCords.size <= 0) return this

    console.log(`Physics: ${this.updateCords.size} items. `)
    //console.log(`${this.diamondsRemaining} diamonds remaining. `)

    // Create the next gamestate.
    const nextGameState = this.clone()
    nextGameState.updateCount = this.updateCount + 1

    const soundList: SoundList = {
      diggingDirt: false,
      stoneFalling: false,
      diamondFalling: false,
      diamondPickup: false,
      explosion: false,
      wood: false,
      leaf: false,
    }

    // Turn all the updateCords in to an array and sort them bottom upp.
    const sortedUpdates = [...this.updateCords.values()].sort((a, b) => {
      if (b.y !== a.y) return b.y - a.y
      return b.x - a.x
    })
    // Clear the updateCords
    nextGameState.updateCords = new Map<string, { x: number; y: number }>()

    // Itterate thru all the tiles in the sorted update list
    sortedUpdates.forEach(({ x, y }) => {
      const tile = this.get(x, y)

      // Check if the tile is defined.
      if (typeof tile === 'undefined') return

      // Check if the tile has been changed.
      if (tile !== nextGameState.get(x, y)) return

      // Check if the tile has a onPhysics function and run it.
      if (typeof tile.onPhysics === 'undefined') return

      tile.onPhysics({
        x,
        y,
        tile,
        local: nextGameState.subGrid(x, y),

        updateLocal: (
          rx: number,
          ry: number,
          width: number = 1,
          height: number = 1,
        ) => {
          nextGameState.updateArea(x + rx, y + ry, width, height)
        },

        gameState: nextGameState,
        action,
        soundList,
      })
    })

    // Adds the finish tile when all the diamonds are picked up.
    if (this.diamondsRemaining <= 0) {
      nextGameState.set(
        this.finish.x,
        this.finish.y,
        [TILES.DIRT, TILES.DIRT_FINISH].includes(
          nextGameState.get(this.finish.x, this.finish.y),
        )
          ? TILES.DIRT_FINISH
          : TILES.BEDROCK_FINISH,
      )
    }

    playAudio(action, soundList)

    // Check if the player is alive
    this.isGameOver =
      this.get(this.playerPos.x, this.playerPos.y) !== TILES.PLAYER

    return nextGameState
  }

  /**A shorthand function for `this.grid.get(x, y)`*/
  get(x: number, y: number) {
    return this.grid.get(x, y)
  }

  /**A shorthand function for `this.grid.set(x, y, value)`*/
  set(x: number, y: number, value: Tile) {
    return this.grid.set(x, y, value)
  }

  /**A shorthand function for `this.grid.subGrid(x, y, width, height)`*/
  subGrid(x: number, y: number, width: number = 1, height: number = 1) {
    return this.grid.subGrid(x, y, width, height)
  }

  /**Adds the **x** **y** coordinates to be uppdated in _processPhysics_. */
  updateCord(x: number, y: number) {
    this.updateCords.set(x + ',' + y, { x, y })
  }

  /**Adds a region coordinates to be uppdated in _processPhysics_. */
  updateArea(x: number, y: number, width: number = 3, height: number = 3) {
    for (let iy = y; iy < y + height; iy++)
      for (let ix = x; ix < x + width; ix++) this.updateCord(ix, iy)
  }

  /**Applies the leveldata to the GameState. */
  applyLevelData(Leveldata: LevelData) {
    const clone = new GameState()

    clone.grid = Leveldata.grid.clone()
    clone.time = 120
    clone.score = this.score
    clone.diamondsRemaining = 0
    clone.curentLevel = Leveldata

    return clone.onLevelLoad()
  }

  /**Creates a clone of GameState.
   *
   * **NOTE:** Some properties are shallowedly copied.
   */
  clone() {
    const clone = new GameState()

    clone.grid = this.grid.clone()
    clone.updateCords = this.updateCords
    clone.playerPos = { ...this.playerPos }
    clone.finish = { ...this.finish }
    clone.updateCount = this.updateCount
    clone.time = this.time
    clone.score = this.score
    clone.diamondsRemaining = this.diamondsRemaining
    clone.curentLevel = this.curentLevel

    return clone
  }
}
