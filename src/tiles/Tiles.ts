import { SubGrid } from '../Grid'

export interface SoundList {
  diggingDirt: boolean
  stoneFalling: boolean
  diamondFalling: boolean
  diamondPickup: boolean
  explosion: boolean
}

export interface onPhysicsParams {
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
  onPlayerMove?: (params: onPlayerMoveParams) => void
  onPhysics?: (params: onPhysicsParams) => void
}

export interface TileList {
  [name: string]: Tile
}

let TileCollection: TileList = {}

import Nothing from './Nothing'
TileCollection = { ...TileCollection, ...Nothing }

import Bedrock from './Bedrock'
TileCollection = { ...TileCollection, ...Bedrock }

import Dirt from './Dirt'
TileCollection = { ...TileCollection, ...Dirt }

import Boulder from './Boulder'
TileCollection = { ...TileCollection, ...Boulder }

import Diamond from './Diamond'
TileCollection = { ...TileCollection, ...Diamond }

import Explosion from './Explosion'
TileCollection = { ...TileCollection, ...Explosion }

import Player from './Player'
TileCollection = { ...TileCollection, ...Player }

import Finish from './Finish'
import { GameAction, GameState } from '../GameState'
TileCollection = { ...TileCollection, ...Finish }

export const TILES = TileCollection
export default TILES
Object.freeze(TILES)

export const symbolToTile: { [symbol: string]: Tile } = Object.values(
  TILES,
).reduce<{ [symbol: string]: Tile }>((symbolList, tileData) => {
  if (typeof tileData.symbol === 'undefined') return symbolList
  if (tileData.symbol in symbolList) {
    const conflictedData = symbolList[tileData.symbol]
    console.error(
      `ERROR: Tile '${tileData.name}' with symbol '${tileData.symbol}' collides with '${conflictedData.name}'!`,
    )
    return symbolList
  }

  symbolList[tileData.symbol] = tileData
  return symbolList
}, {})
Object.freeze(symbolToTile)
