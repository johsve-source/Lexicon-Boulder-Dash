import { TILES, Tile, TileList, onPhysicsParams } from './Tiles'
import { explode } from './Explosion'

/**Returns a animated tile based on move direction. */
export function getAnimation(tile: Tile, xDir: number, yDir: number) {
  if (yDir < 0) {
    return {
      ...tile,
      animation: 'move-up',
      //frame = 1
    }
  } else if (yDir > 0) {
    return {
      ...tile,
      animation: 'move-down',
      //frame = 0
    }
  } else if (xDir < 0) {
    return {
      ...tile,
      animation: 'move-left',
      //frame = 2
    }
  } else if (xDir > 0) {
    return {
      ...tile,
      animation: 'move-right',
      //frame = 3
    }
  }

  return tile
}

/**_lineEnemyLogic_ is a function that encapsulate the logic for the _LINE_ENEMY_ type. */
function lineEnemyLogic(
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
  LINE_ENEMY_RIGHT: {
    name: 'LINE_ENEMY',
    texture: '/textures/pixel/enemy_centaur.gif',
    symbol: 'L',
    explosive: 1,

    onLoad: ({ updateLocal }) => {
      updateLocal(0, 0)
    },

    onPhysics: (params) => {
      lineEnemyLogic(
        params,
        1,
        0,
        TILES.LINE_ENEMY_RIGHT,
        TILES.LINE_ENEMY_LEFT,
      )
    },
  },

  LINE_ENEMY_LEFT: {
    name: 'LINE_ENEMY',
    texture: '/textures/pixel/enemy_centaur.gif',
    explosive: 1,

    onLoad: ({ updateLocal }) => {
      updateLocal(0, 0)
    },

    onPhysics: (params) => {
      lineEnemyLogic(
        params,
        -1,
        0,
        TILES.LINE_ENEMY_LEFT,
        TILES.LINE_ENEMY_RIGHT,
      )
    },
  },

  LINE_ENEMY_UP: {
    name: 'LINE_ENEMY',
    texture: '/textures/pixel/enemy_unicorn.gif',
    symbol: 'l',
    explosive: 1,

    onLoad: ({ updateLocal }) => {
      updateLocal(0, 0)
    },

    onPhysics: (params) => {
      lineEnemyLogic(params, 0, -1, TILES.LINE_ENEMY_UP, TILES.LINE_ENEMY_DOWN)
    },
  },

  LINE_ENEMY_DOWN: {
    name: 'LINE_ENEMY',
    texture: '/textures/pixel/enemy_unicorn.gif',
    explosive: 1,

    onLoad: ({ updateLocal }) => {
      updateLocal(0, 0)
    },

    onPhysics: (params) => {
      lineEnemyLogic(params, 0, 1, TILES.LINE_ENEMY_DOWN, TILES.LINE_ENEMY_UP)
    },
  },
}

export default EXPORT
