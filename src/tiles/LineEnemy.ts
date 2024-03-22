import { TILES, Tile, TileList } from './Tiles'
import { explode } from './Explosion'

const EXPORT: TileList = {
  LINE_ENEMY_RIGHT: {
    name: 'LINE_ENEMY',
    texture: '/textures/pixel/boom.gif',
    symbol: 'L',

    onLoad: ({ updateLocal }) => {
      updateLocal(0, 0)
    },

    onPhysics: (params) => {
      const { local, updateLocal } = params

      // If player in front then kill.
      if (local.get(1, 0) === TILES.PLAYER) {
        local.set(0, 0, TILES.NOTHING)
        explode(params, 1, 0)
        return
      }

      // If nothing in front then move forward.
      if (local.get(1, 0) === TILES.NOTHING) {
        local.set(0, 0, TILES.NOTHING)
        local.set(1, 0, TILES.LINE_ENEMY_RIGHT)
        updateLocal(-1, -1, 4, 3)
        return
      }

      // If nothing in behind then turn around.
      if (local.get(-1, 0) === TILES.NOTHING) {
        local.set(0, 0, TILES.NOTHING)
        local.set(-1, 0, TILES.LINE_ENEMY_LEFT)
        updateLocal(-2, -1, 4, 3)
        return
      }
    },
  },

  LINE_ENEMY_LEFT: {
    name: 'LINE_ENEMY',
    texture: '/textures/pixel/boom.gif',

    onLoad: ({ updateLocal }) => {
      updateLocal(0, 0)
    },

    onPhysics: (params) => {
      const { local, updateLocal } = params

      // If player in front then kill.
      if (local.get(-1, 0) === TILES.PLAYER) {
        local.set(0, 0, TILES.NOTHING)
        explode(params, -1, 0)
        return
      }

      // If nothing in front then move forward.
      if (local.get(-1, 0) === TILES.NOTHING) {
        local.set(0, 0, TILES.NOTHING)
        local.set(-1, 0, TILES.LINE_ENEMY_LEFT)
        updateLocal(-2, -1, 4, 3)
        return
      }

      // If nothing in behind then turn around.
      if (local.get(1, 0) === TILES.NOTHING) {
        local.set(0, 0, TILES.NOTHING)
        local.set(1, 0, TILES.LINE_ENEMY_RIGHT)
        updateLocal(-1, -1, 4, 3)
        return
      }
    },
  },

  LINE_ENEMY_UP: {
    name: 'LINE_ENEMY',
    texture: '/textures/pixel/boom.gif',
    symbol: 'l',

    onLoad: ({ updateLocal }) => {
      updateLocal(0, 0)
    },

    onPhysics: (params) => {
      const { local, updateLocal } = params

      // If player in front then kill.
      if (local.get(0, -1) === TILES.PLAYER) {
        local.set(0, 0, TILES.NOTHING)
        explode(params, 0, -1)
        return
      }

      // If nothing in front then move forward.
      if (local.get(0, -1) === TILES.NOTHING) {
        local.set(0, 0, TILES.NOTHING)
        local.set(0, -1, TILES.LINE_ENEMY_UP)
        updateLocal(-1, -2, 3, 4)
        return
      }

      // If nothing in behind then turn around.
      if (local.get(0, 1) === TILES.NOTHING) {
        local.set(0, 0, TILES.NOTHING)
        local.set(0, 1, TILES.LINE_ENEMY_DOWN)
        updateLocal(-1, -1, 4, 3)
        return
      }
    },
  },

  LINE_ENEMY_DOWN: {
    name: 'LINE_ENEMY',
    texture: '/textures/pixel/boom.gif',

    onLoad: ({ updateLocal }) => {
      updateLocal(0, 0)
    },

    onPhysics: (params) => {
      const { local, updateLocal } = params

      // If player in front then kill.
      if (local.get(0, 1) === TILES.PLAYER) {
        local.set(0, 0, TILES.NOTHING)
        explode(params, 0, 1)
        return
      }

      // If nothing in front then move forward.
      if (local.get(0, 1) === TILES.NOTHING) {
        local.set(0, 0, TILES.NOTHING)
        local.set(0, 1, TILES.LINE_ENEMY_DOWN)
        updateLocal(-1, -1, 3, 4)
        return
      }

      // If nothing in behind then turn around.
      if (local.get(0, -1) === TILES.NOTHING) {
        local.set(0, 0, TILES.NOTHING)
        local.set(0, -1, TILES.LINE_ENEMY_UP)
        updateLocal(-1, -2, 4, 3)
        return
      }
    },
  },
}

export default EXPORT

/**isLineEnemy is a function that checks if the given _tile_ is a type of _line enemy_. */
export function isLineEnemy(tile: Tile) {
  return Object.values(EXPORT).includes(tile)
}
