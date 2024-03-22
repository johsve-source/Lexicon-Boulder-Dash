import { TILES, TileList } from './Tiles'

const EXPORT: TileList = {
  LINE_ENEMY_RIGHT: {
    name: 'LINE_ENEMY',
    texture: '/textures/pixel/boom.gif',
    symbol: 'L',

    onLoad: ({ updateLocal }) => {
      updateLocal(0, 0)
    },

    onPhysics: ({ local, updateLocal }) => {
      if (local.get(1, 0) === TILES.NOTHING) {
        local.set(0, 0, TILES.NOTHING)
        local.set(1, 0, TILES.LINE_ENEMY_RIGHT)
        updateLocal(-1, -1, 4, 3)
      } else {
        local.set(0, 0, TILES.NOTHING)
        local.set(-1, 0, TILES.LINE_ENEMY_LEFT)
        updateLocal(-2, -1, 4, 3)
      }
    },
  },

  LINE_ENEMY_LEFT: {
    name: 'LINE_ENEMY',
    texture: '/textures/pixel/boom.gif',

    onLoad: ({ updateLocal }) => {
      updateLocal(0, 0)
    },

    onPhysics: ({ local, updateLocal }) => {
      if (local.get(-1, 0) === TILES.NOTHING) {
        local.set(0, 0, TILES.NOTHING)
        local.set(-1, 0, TILES.LINE_ENEMY_LEFT)
        updateLocal(-2, -1, 4, 3)
      } else {
        local.set(0, 0, TILES.NOTHING)
        local.set(1, 0, TILES.LINE_ENEMY_RIGHT)
        updateLocal(-1, -1, 4, 3)
      }
    },
  },
}

export default EXPORT
