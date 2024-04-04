import { TILES, Tile, TileList, onPhysicsParams } from './Tiles'
import { explode } from './Explosion'

/**Returns a animated tile based on move direction. */
export function getAnimation(tile: Tile, xDir: number, yDir: number) {
  if (yDir < 0)
    return {
      ...tile,
      animation: 'move-up',
      //frame = 1
    }

  if (yDir > 0)
    return {
      ...tile,
      animation: 'move-down',
      //frame = 0
    }

  if (xDir < 0)
    return {
      ...tile,
      animation: 'move-left',
      //frame = 2
    }

  if (xDir > 0)
    return {
      ...tile,
      animation: 'move-right',
      //frame = 3
    }

  return tile
}

/**_CENTAUREnemyLogic_ is a function that encapsulate the logic for the _CENTAUR_ENEMY_ type. */
function centaurEnemyLogic(
  params: onPhysicsParams,
  xDir: number,
  yDir: number,
  forwardType: Tile,
  turnAroundType: Tile,
) {
  const { local, updateLocal } = params

  // If player in front then kill.
  if (local.get(xDir, yDir) === TILES.PLAYER) {
    local.set(0, 0, TILES.NOTHING)
    explode(params, xDir, yDir)
    return
  }

  // If nothing in front then move forward.
  if (local.get(xDir, yDir) === TILES.NOTHING) {
    local.set(0, 0, TILES.NOTHING)
    local.set(xDir, yDir, getAnimation(forwardType, xDir, yDir))
    updateLocal(
      -1 + Math.min(xDir, 0),
      -1 + Math.min(yDir, 0),
      3 + Math.abs(xDir),
      3 + Math.abs(yDir),
    )
    return
  }

  // If player in behind then kill.
  if (local.get(-xDir, -yDir) === TILES.PLAYER) {
    local.set(0, 0, TILES.NOTHING)
    explode(params, -xDir, -yDir)
    return
  }

  // If nothing in behind then turn around.
  if (local.get(-xDir, -yDir) === TILES.NOTHING) {
    local.set(0, 0, TILES.NOTHING)
    local.set(-xDir, -yDir, getAnimation(turnAroundType, -xDir, -yDir))
    updateLocal(
      -1 + Math.min(xDir, 0),
      -1 + Math.min(yDir, 0),
      3 + Math.abs(xDir),
      3 + Math.abs(yDir),
    )
    return
  }
}

const EXPORT: TileList = {
  CENTAUR_ENEMY_RIGHT: {
    name: 'CENTAUR_ENEMY',
    texture: [
      '/textures/pixel/enemy_centaur_r.gif',
      '/textures/pixel/enemy_centaur_r.gif',
      '/textures/pixel/enemy_centaur_r.gif',
      '/textures/pixel/enemy_centaur_r.gif',
      '/textures/pixel/enemy_centaur_r.gif',
    ],
    symbol: ']',
    explosive: 1,

    onLoad({ updateLocal }) {
      updateLocal(0, 0)
    },

    onPhysics(params) {
      centaurEnemyLogic(
        params,
        0,
        1,
        TILES.CENTAUR_ENEMY_RIGHT,
        TILES.CENTAUR_ENEMY_LEFT,
      )
    },
  },

  CENTAUR_ENEMY_LEFT: {
    name: 'CENTAUR_ENEMY',
    texture: [
      '/textures/pixel/enemy_centaur.gif',
      '/textures/pixel/enemy_centaur.gif',
      '/textures/pixel/enemy_centaur.gif',
      '/textures/pixel/enemy_centaur.gif',
      '/textures/pixel/enemy_centaur.gif',
    ],
    explosive: 1,

    onLoad({ updateLocal }) {
      updateLocal(0, 0)
    },

    onPhysics(params) {
      centaurEnemyLogic(
        params,
        0,
        -1,
        TILES.CENTAUR_ENEMY_LEFT,
        TILES.CENTAUR_ENEMY_RIGHT,
      )
    },
  },

  CENTAUR_ENEMY_UP: {
    name: 'CENTAUR_ENEMY',
    texture: [
      '/textures/pixel/enemy_centaur.gif',
      '/textures/pixel/enemy_centaur.gif',
      '/textures/pixel/enemy_centaur.gif',
      '/textures/pixel/enemy_centaur.gif',
      '/textures/pixel/enemy_centaur.gif',
    ],
    symbol: '[',
    explosive: 1,

    onLoad({ updateLocal }) {
      updateLocal(0, 0)
    },

    onPhysics(params) {
      centaurEnemyLogic(
        params,
        -1,
        0,
        TILES.CENTAUR_ENEMY_UP,
        TILES.CENTAUR_ENEMY_DOWN,
      )
    },
  },

  CENTAUR_ENEMY_DOWN: {
    name: 'CENTAUR_ENEMY',
    texture: [
        '/textures/pixel/enemy_centaur_r.gif',
        '/textures/pixel/enemy_centaur_r.gif',
        '/textures/pixel/enemy_centaur_r.gif',
        '/textures/pixel/enemy_centaur_r.gif',
        '/textures/pixel/enemy_centaur_r.gif',
    ],
    explosive: 1,

    onLoad({ updateLocal }) {
      updateLocal(0, 0)
    },

    onPhysics(params) {
      centaurEnemyLogic(
        params,
        1,
        0,
        TILES.CENTAUR_ENEMY_DOWN,
        TILES.CENTAUR_ENEMY_UP,
      )
    },
  },
}

export default EXPORT
