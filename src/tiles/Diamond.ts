import { TILES, TileList } from './Tiles'
import { boulderPhysics } from './Boulder'

const EXPORT: TileList = {
  DIRT_DIAMOND: {
    name: 'DIRT_DIAMOND',
    texture: '/textures/pixel/dirt-diamond.png',
    symbol: 'D',

    onPhysics: ({ local, updateLocal, soundList }) => {
      if (local.get(0, 1) === TILES.PLAYER) {
        local.set(0, 0, TILES.NOTHING)
        soundList.diamondPickup = true
        return
      }

      if (
        boulderPhysics(
          local,
          updateLocal,
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

    onPhysics: ({ local, updateLocal, soundList }) => {
      if (local.get(0, 1) === TILES.PLAYER) {
        local.set(0, 0, TILES.NOTHING)
        soundList.diamondPickup = true
        return
      }

      if (
        boulderPhysics(
          local,
          updateLocal,
          TILES.BEDROCK_DIAMOND,
          TILES.BEDROCK_DIAMOND,
        )
      )
        soundList.diamondFalling = true
    },
  },
}

export default EXPORT
