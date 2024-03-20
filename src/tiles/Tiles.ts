import { SubGrid } from '../Grid'
import { GameAction, GameState } from '../GameState'

export interface SoundList {
  diggingDirt: boolean
  stoneFalling: boolean
  diamondFalling: boolean
  diamondPickup: boolean
  explosion: boolean
}

export interface onPhysicsParams {
  x: number
  y: number
  tile: Tile
  local: SubGrid<Tile>
  updateLocal: (x: number, y: number, width?: number, height?: number) => void
  gameState: GameState
  action: GameAction
  soundList: SoundList
}

export interface onPlayerMoveParams extends onPhysicsParams {
  from: { x: number; y: number }
  moveDirection: { x: number; y: number }
}

export interface Tile {
  name: string
  texture: string
  symbol?: string
  animation?: string
  frame?: number
  onPlayerMove?: (params: onPlayerMoveParams) => void
  onPhysics?: (params: onPhysicsParams) => void
}

export interface TileList {
  [name: string]: Tile
}

export const TILES: TileList = {}
export const symbolToTile: { [symbol: string]: Tile } = {}
export default TILES

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
