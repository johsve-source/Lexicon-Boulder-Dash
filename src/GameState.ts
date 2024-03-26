import { useEffect, useReducer } from 'react'
import { SoundManagerHook } from './hooks/sound/useSoundManagerLogic'
import { loadLevelData, LevelData } from './LevelLoader'
import { TILES, Tile, SoundList } from './tiles/Tiles'
import Grid from './Grid'

/**A list of supported _gameReducer_ actions. */
export enum ActionEnum {
  MOVE_UP = 'MOVE_UP',
  MOVE_DOWN = 'MOVE_DOWN',
  MOVE_LEFT = 'MOVE_LEFT',
  MOVE_RIGHT = 'MOVE_RIGHT',
  TIMER_START = 'TIMER_START',
  PHYSICS_TICK = 'PHYSICS_TICK',
  LOAD_LEVEL = 'LOAD_LEVEL',
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
          return state.clone().processPlayerMovement(action)
    }

  // Start 'real' timer if the game
  if (action.type === ActionEnum.TIMER_START) {
    if (state.time > 0 && state.isGameOver === false) {
      return state.clone().processTime(state)
    } else {
      console.error('Cannot start timer: time is 0 or game is over')
      return state
    }
  }

  // Physics update.
  if (action.type === ActionEnum.PHYSICS_TICK) {
    if (state.updateCords.size <= 0) return state
    else return state.clone().processPhysics(action)
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
  /**The current _time_ position. */
  time = 160
  /**The current _score_ position. */
  score = 0
  /**The current state of the game. */
  isGameOver = false
  /**The _LevelData_ current level. */
  curentLevel?: LevelData
  /**The name of the next level. */
  nextLevel?: string

  processTime(state: GameState): GameState {    
    const startTime = performance.now(); // Get the initial timestamp when the countdown starts
    let lastUpdateTime = startTime; // Initialize last update time with start time

    const update = (timestamp: number) => {
      const deltaTime = timestamp - lastUpdateTime;  // Calculate the time passed since the last update

      if (deltaTime >= 1000) { // Check if one second has elapsed
        const elapsedTime = timestamp - startTime; // Calculate total elapsed time
        const timeLeft = Math.max(0, state.time - Math.floor(elapsedTime / 1000)); // Calculate remaining time based on initial 160 seconds
 
        console.log('time left: ', timeLeft);

        if (timeLeft <= 0) {
          console.log("Game Over");
          return {
            ...state,
            isGameOver: true
          };
        } else {
          state.time = timeLeft;
        }

        lastUpdateTime = timestamp; // Update last update time

        if (state.isGameOver) {
          return state;
        }
      }

      requestAnimationFrame(update);
    };

    requestAnimationFrame(update);

    return state;
}
  
//   processTime(state: GameState): GameState {    
//     const startTime = performance.now()
//     console.log("start time: ", startTime)

//     const update = (timestamp: number) => {
//       const deltaTime = timestamp - startTime  // time passed since start in milliseconds
//       const timeLeft = Math.floor((state.time - deltaTime / 1000)) // remaining time in seconds

//       console.log("delta: ", deltaTime)
//       console.log('time left: ', timeLeft)

//       if (deltaTime >= 1000) {
//         if (timeLeft <= 0) {
//           console.log("Game Over")
//           return {
//             ...state,
//             isGameOver: true
//           }
//         } else {
//           state.time = timeLeft
//         }  
//       }
    
//       if (state.isGameOver) {
//         return state
//       } else {
//         requestAnimationFrame(update)
//       }
//     };

//     requestAnimationFrame(update);

//     return state;
// }

  processPlayerMovement(action: GameAction): GameState {
    /**A local grid centered a round the player */
    const localGrid = this.subGrid(this.playerPos.x, this.playerPos.y)
    const playerTile = localGrid.get(0, 0)

    // Check if the player is alive
    if (playerTile !== TILES.PLAYER) {
      if (typeof this.curentLevel !== 'undefined')
        return this.applyLevelData(this.curentLevel) // restart
      else return this
    }

    /**The movment **x** component. */
    let directionX = 0
    /**The movment **y** component. */
    let directionY = 0

    // updates player coordinates
    if (action.type === ActionEnum.MOVE_UP) directionY = -1
    else if (action.type === ActionEnum.MOVE_DOWN) directionY = 1
    else if (action.type === ActionEnum.MOVE_LEFT) directionX = -1
    else if (action.type === ActionEnum.MOVE_RIGHT) directionX = 1

    // which sounds that should be played
    const soundList: SoundList = {
      diggingDirt: false,
      stoneFalling: false,
      diamondFalling: false,
      diamondPickup: false,
      explosion: false,
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

    // Updates the 8 tiles around the player
    for (let y = this.playerPos.y - 1; y <= this.playerPos.y + 1; y++)
      for (let x = this.playerPos.x - 1; x <= this.playerPos.x + 1; x++)
        if (!(x === this.playerPos.x && y === this.playerPos.y)) update(x, y)

    // Update the player
    update(this.playerPos.x, this.playerPos.y)

    playAudio(action, soundList)

    return this
  }

  /**Processes all the game physics. */
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

    // Turn all the updateCords in to an array and sort them bottom upp.
    const sortedUpdates = [...this.updateCords.values()].sort((a, b) => {
      if (b.y !== a.y) return b.y - a.y
      return b.x - a.x
    })
    // Clear the updateCords
    this.updateCords = new Map<string, { x: number; y: number }>()

    // Itterate thru all the tiles in the sorted update list
    sortedUpdates.forEach(({ x, y }) => {
      const tile = this.get(x, y)

      // Check if the tile has a onPhysics function and run it.
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
    clone.updateCords = this.updateCords
    clone.playerPos = { x: Leveldata.playerPos.x, y: Leveldata.playerPos.y }
    clone.time = this.time
    clone.score = this.score
    clone.curentLevel = Leveldata
    clone.nextLevel = Leveldata.nextLevel

    return clone
  }

  /**Creates a clone of GameState.
   *
   * **NOTE:** Some properties are shallowedly copied.
   */
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

