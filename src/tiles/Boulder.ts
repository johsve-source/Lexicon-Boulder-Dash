import { SubGrid } from '../Grid'
import { TILES, Tile, TileList } from './Tiles'
import { explode } from './Explosion'

export function boulderPhysics(
  grid: SubGrid<Tile>,
  updateCords: (x: number, y: number, width?: number, height?: number) => void,
  fallVariant: Tile,
  restVariant: Tile,
) {
  // Falling down
  if (grid.get(0, 1) === TILES.NOTHING) {
    grid.set(0, 0, TILES.NOTHING)
    grid.set(0, 1, fallVariant)
    updateCords(-1, -1, 3, 4)
    return true
  }

  // Falling left
  if (grid.get(-1, 0) === TILES.NOTHING && grid.get(-1, 1) === TILES.NOTHING) {
    grid.set(0, 0, TILES.NOTHING)
    grid.set(-1, 0, fallVariant)
    updateCords(-2, -1, 4, 3)
    return true
  }

  // Falling right
  if (grid.get(1, 0) === TILES.NOTHING && grid.get(1, 1) === TILES.NOTHING) {
    grid.set(0, 0, TILES.NOTHING)
    grid.set(1, 0, fallVariant)
    updateCords(-1, -1, 4, 3)
    return true
  }

  // Reset
  grid.set(0, 0, restVariant)
  return false
}

const EXPORT: TileList = {
  DIRT_BOULDER: {
    name: 'DIRT_BOULDER',
    texture: '/textures/pixel/dirt-boulder.png',
    symbol: 'O',

    onPhysics: (grid, updateCords, soundList) => {
      if (
        boulderPhysics(
          grid,
          updateCords,
          TILES.FALLING_BOULDER,
          TILES.DIRT_BOULDER,
        )
      )
        soundList.stoneFalling = true
    },
  },

  BEDROCK_BOULDER: {
    name: 'BEDROCK_BOULDER',
    texture: '/textures/pixel/bedrock-boulder.png',
    symbol: 'o',

    onPhysics: (grid, updateCords, soundList) => {
      if (
        boulderPhysics(
          grid,
          updateCords,
          TILES.FALLING_BOULDER,
          TILES.BEDROCK_BOULDER,
        )
      )
        soundList.stoneFalling = true
    },
  },

  FALLING_BOULDER: {
    name: 'FALLING_BOULDER',
    texture: '/textures/pixel/bedrock-boulder.png',

    onPhysics: (grid, updateCords, soundList) => {
      if (grid.get(0, 1) === TILES.PLAYER) {
        explode(grid, updateCords, 0, 1)
        soundList.explosion = true
        return
      }

      if (
        boulderPhysics(
          grid,
          updateCords,
          TILES.FALLING_BOULDER,
          TILES.BEDROCK_BOULDER,
        )
      )
        soundList.stoneFalling = true
    },
  },
}

export default EXPORT
