import { SubGrid } from '../Grid'
import { GameAction, GameState } from '../GameState'

/**SoundList contains a list of posible sounds a tile can play on _onPlayerMove_ and _onPhysics_. */
export interface SoundList {
  diggingDirt: boolean
  stoneFalling: boolean
  diamondFalling: boolean
  diamondPickup: boolean
  explosion: boolean
}

/**onPhysicsParams contains all the variables that a tile can access on _onPhysics_. */
export interface onPhysicsParams {
  /**The tile _globa position_ x. */
  x: number
  /**The tile _globa position_ y. */
  y: number
  /**The tile _itself_. */
  tile: Tile

  /**A SubGrid centered on the tile itself.
   * ```
   * local.get(0,0) // Returns the curent tile
   * ```
   */
  local: SubGrid<Tile>

  /**```
   * function updateLocal(x: number, y: number, width: number = 1, height: number = 1)
   * ```
   * A function to mark locally for physics updates.
   * ```
   * updateLocal(0,0) // Marks the curent tile position for physics update
   * ```
   */
  updateLocal: (x: number, y: number, width?: number, height?: number) => void

  /**The gamestate itself.
   * Can be mutated in order to change the gamestate.
   */
  gameState: GameState

  /**The GameAction passed for the uppdate incase external dependencies are needed. */
  action: GameAction

  /**SoundList contains a list of posible sounds a tile can play on _onPlayerMove_ and _onPhysics_. */
  soundList: SoundList
}

/**onPlayerMoveParams contains all the variables that a tile can access on _onPlayerMove_.
 * Extends _onPhysicsParams_.
 */
export interface onPlayerMoveParams extends onPhysicsParams {
  /**The global position of the _onMove center_ / _player_. */
  from: {
    /**The global **x** position of the _onMove center_ / _player_. */
    x: number
    /**The global **y** position of the _onMove center_ / _player_. */
    y: number
  }

  /**The _player_ movment direction. */
  moveDirection: {
    /**The _player_ **x** movment direction. */
    x: number
    /**The _player_ **y** movment direction. */
    y: number
  }
}

/** The _Tile_ interface defines the data a tile contains. */
export interface Tile {
  /**The name of the tile.
   *
   * _**NOTE:** this is not the same as the name acessed by **TILES**._
   */
  name: string

  /**The url path to the tile texture. */
  texture: string
  /**Optional character symbol that represents the tile in level files. */
  symbol?: string
  /**Optional animation string. */
  animation?: string
  /**Optional animation frame. */
  frame?: number

  /**Optional function that is called when the player moves nearby. */
  onPlayerMove?: (params: onPlayerMoveParams) => void

  /**Optional function that is called when physics update is applied to the tile. */
  onPhysics?: (params: onPhysicsParams) => void
}

/**Defines a list of tiles. */
export interface TileList {
  [name: string]: Tile
}

/**TILES contains all the defined tiles in the game. */
export const TILES: TileList = {}
export default TILES

/**symbolToTile contains all the defined level symbol tile mappings.
 * ```
 * symbolToTile['a'] // Gets the tile with defined symbol 'a'
 * ```
 */
export const symbolToTile: { [symbol: string]: Tile } = {}

function addTiles(tiles: TileList) {
  Object.entries(tiles).forEach(([NAME, DATA]) => {
    if (NAME in TILES) {
      console.error(`ERROR: Tile name '${NAME}' is already defined!`)
      return
    }

    TILES[NAME] = DATA

    if (typeof DATA.symbol !== 'undefined') {
      if (DATA.symbol in symbolToTile) {
        const conflictedData = symbolToTile[DATA.symbol]
        console.error(
          `ERROR: Tile '${DATA.name}' with symbol '${DATA.symbol}' collides with '${conflictedData.name}'!`,
        )
        return
      }

      symbolToTile[DATA.symbol] = DATA
    }
  })
}

import Nothing from './Nothing'
addTiles(Nothing)

import Bedrock from './Bedrock'
addTiles(Bedrock)

import Dirt from './Dirt'
addTiles(Dirt)

import Boulder from './Boulder'
addTiles(Boulder)

import Diamond from './Diamond'
addTiles(Diamond)

import Explosion from './Explosion'
addTiles(Explosion)

import Player from './Player'
addTiles(Player)

import Finish from './Finish'
addTiles(Finish)

Object.freeze(TILES)
Object.freeze(symbolToTile)
