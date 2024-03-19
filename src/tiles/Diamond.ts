import { TILES, TileList } from './Tiles'
import { boulderPhysics } from './Boulder'

const EXPORT: TileList = {
  DIRT_DIAMOND: {
    name: 'DIRT_DIAMOND',
    texture: '/textures/pixel/dirt-diamond.png',
    symbol: 'D',

    onPhysics: (grid, updateCords, soundList) => {
      if (grid.get(0, 1) === TILES.PLAYER) {
        grid.set(0, 0, TILES.NOTHING)
        soundList.diamondPickup = true
        return
      }

      if (
        boulderPhysics(
          grid,
          updateCords,
          TILES.BEDROCK_DIAMOND,
          TILES.DIRT_DIAMOND,
        )
      )
        soundList.diamondFalling = true
    },
  },

  BEDROCK_DIAMOND: {
    name: 'BEDROCK_DIAMOND',
    texture: '/textures/pixel/bedrock-diamond.png',
    symbol: 'd',

    onPhysics: (grid, updateCords, soundList) => {
      if (grid.get(0, 1) === TILES.PLAYER) {
        grid.set(0, 0, TILES.NOTHING)
        soundList.diamondPickup = true
        return
      }

      if (
        boulderPhysics(
          grid,
          updateCords,
          TILES.BEDROCK_DIAMOND,
          TILES.BEDROCK_DIAMOND,
        )
      )
        soundList.diamondFalling = true
    },
  },
}

export default EXPORT
