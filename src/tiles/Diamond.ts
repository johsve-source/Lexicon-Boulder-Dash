import { TILES, TileList } from './Tiles'
import { boulderPhysics } from './Boulder'

const EXPORT: TileList = {
  DIRT_DIAMOND: {
    name: 'DIRT_DIAMOND',
    texture: '/textures/pixel/dirt-diamond.png',
    symbol: 'D',

    onPlayerMove({ local, updateLocal, moveDirection, soundList }) {
      if (local.get(-moveDirection.x, -moveDirection.y) === TILES.PLAYER) {
        local.set(0, 0, TILES.NOTHING)
        updateLocal(-1, -1, 3, 3)
        soundList.diamondPickup = true
      }
    },

    onPhysics: (params) => {
      const { local, updateLocal, soundList } = params

      if (local.get(0, 1) === TILES.PLAYER) {
        local.set(0, 0, TILES.NOTHING)
        updateLocal(-1, -1, 3, 3)
        soundList.diamondPickup = true
        return
      }

      if (boulderPhysics(params, TILES.BEDROCK_DIAMOND, TILES.DIRT_DIAMOND))
        soundList.diamondFalling = true
    },
  },

  BEDROCK_DIAMOND: {
    name: 'BEDROCK_DIAMOND',
    texture: '/textures/pixel/bedrock-diamond.png',
    symbol: 'd',

    onPlayerMove({ local, updateLocal, moveDirection, soundList }) {
      if (local.get(-moveDirection.x, -moveDirection.y) === TILES.PLAYER) {
        local.set(0, 0, TILES.NOTHING)
        updateLocal(-1, -1, 3, 3)
        soundList.diamondPickup = true
      }
    },

    onPhysics: (params) => {
      const { local, updateLocal, soundList } = params

      if (local.get(0, 1) === TILES.PLAYER) {
        local.set(0, 0, TILES.NOTHING)
        updateLocal(-1, -1, 3, 3)
        soundList.diamondPickup = true
        return
      }

      if (boulderPhysics(params, TILES.BEDROCK_DIAMOND, TILES.BEDROCK_DIAMOND))
        soundList.diamondFalling = true
    },
  },
}

export default EXPORT
