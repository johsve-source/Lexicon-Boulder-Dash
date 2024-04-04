import { TILES, TileList } from './Tiles'
import { boulderPhysics, boulderPush } from './Boulder'
import { explode } from './Explosion'

const EXPORT: TileList = {
  DIRT_EXPLOSIVE_BARREL: {
    name: 'DIRT_EXPLOSIVE_BARREL',
    texture: [
      '/textures/pixel/dirt-explosive-barrel.png',
      '/textures/pixel/dirt-explosive-barrel.png',
      '/textures/pixel/dirt-explosive-barrel.png',
      '/textures/pixel/dirt-explosive-barrel.png',
      '/textures/pixel/dirt-explosive-barrel.png',
    ],
    symbol: 'E',
    explosive: 1,

    onPlayerMove(params) {
      if (boulderPush(params, TILES.BEDROCK_EXPLOSIVE_BARREL))
        params.soundList.stoneFalling = true
    },

    onLoad({ updateLocal }) {
      updateLocal(0, 0)
    },

    onPhysics(params) {
      const { soundList } = params

      if (
        boulderPhysics(
          params,
          TILES.FALLING_EXPLOSIVE_BARREL,
          TILES.DIRT_EXPLOSIVE_BARREL,
        )
      )
        soundList.stoneFalling = true
    },
  },

  BEDROCK_EXPLOSIVE_BARREL: {
    name: 'BEDROCK_EXPLOSIVE_BARREL',
    texture: [
      '/textures/pixel/dirt-explosive-barrel.png',
      '/textures/pixel/dirt-explosive-barrel.png',
      '/textures/pixel/dirt-explosive-barrel.png',
      '/textures/pixel/dirt-explosive-barrel.png',
      '/textures/pixel/dirt-explosive-barrel.png',
    ],
    symbol: 'e',
    explosive: 1,

    onPlayerMove(params) {
      if (boulderPush(params, TILES.BEDROCK_EXPLOSIVE_BARREL))
        params.soundList.stoneFalling = true
    },

    onLoad({ updateLocal }) {
      updateLocal(0, 0)
    },

    onPhysics(params) {
      const { soundList } = params

      if (
        boulderPhysics(
          params,
          TILES.FALLING_EXPLOSIVE_BARREL,
          TILES.BEDROCK_EXPLOSIVE_BARREL,
        )
      )
        soundList.stoneFalling = true
    },
  },

  FALLING_EXPLOSIVE_BARREL: {
    name: 'FALLING_EXPLOSIVE_BARREL',
    texture: [
      '/textures/pixel/dirt-explosive-barrel.png',
      '/textures/pixel/dirt-explosive-barrel.png',
      '/textures/pixel/dirt-explosive-barrel.png',
      '/textures/pixel/dirt-explosive-barrel.png',
      '/textures/pixel/dirt-explosive-barrel.png',
    ],
    explosive: 1,

    onPhysics(params) {
      const { local, updateLocal, soundList } = params

      const below = local.get(0, 1)
      // If nothing bellow then become critical.
      if (below === TILES.NOTHING) {
        local.set(0, 0, TILES.NOTHING)
        local.set(0, 1, {
          ...TILES.CRITICAL_EXPLOSIVE_BARREL,
          animation: 'move-down',
        })
        updateLocal(-1, -1, 3, 4)
        soundList.stoneFalling = true
        return
      }

      // If something explosive bellow then detonate.
      if (below.explosive) {
        explode(params, 0, 1, below.explosive)
        return
      }

      if (
        boulderPhysics(
          params,
          TILES.FALLING_EXPLOSIVE_BARREL,
          TILES.BEDROCK_EXPLOSIVE_BARREL,
        )
      )
        soundList.stoneFalling = true
    },
  },

  CRITICAL_EXPLOSIVE_BARREL: {
    name: 'CRITICAL_EXPLOSIVE_BARREL',
    texture: [
      '/textures/pixel/dirt-explosive-barrel.png',
      '/textures/pixel/dirt-explosive-barrel.png',
      '/textures/pixel/dirt-explosive-barrel.png',
      '/textures/pixel/dirt-explosive-barrel.png',
      '/textures/pixel/dirt-explosive-barrel.png',
    ],
    explosive: 1,

    onPhysics(params) {
      const { local, updateLocal, soundList } = params

      if (local.get(0, 1) === TILES.NOTHING) {
        local.set(0, 0, TILES.NOTHING)
        local.set(0, 1, {
          ...TILES.CRITICAL_EXPLOSIVE_BARREL,
          animation: 'move-down',
        })
        updateLocal(-1, -1, 3, 4)
        soundList.stoneFalling = true
        return
      }

      explode(params, 0, 0, 1)
    },
  },
}

export default EXPORT
