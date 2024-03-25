import { TILES, Tile, TileList, onPhysicsParams } from './Tiles'
import { explode } from './Explosion'

enum HEADING {
  NORTH = 0,
  NORTH_EAST = 1,
  EAST = 2,
  SOUTH_EAST = 3,
  SOUTH = 4,
  SOUTH_WEST = 5,
  WEST = 6,
  NORTH_WEST = 7,
}

/**Converts heading in to a relative **x** and **y** coordinate. */
function getHeadingCords(heading: HEADING): [number, number] {
  heading = (heading + 800) % 8

  switch (heading) {
    case HEADING.NORTH:
      return [0, -1]
    case HEADING.NORTH_EAST:
      return [1, -1]
    case HEADING.EAST:
      return [1, 0]
    case HEADING.SOUTH_EAST:
      return [1, 1]
    case HEADING.SOUTH:
      return [0, 1]
    case HEADING.SOUTH_WEST:
      return [-1, 1]
    case HEADING.WEST:
      return [-1, 0]
    case HEADING.NORTH_WEST:
      return [-1, -1]
    default:
      return [0, 0]
  }
}

/**Gets a relavive tile based on heading. */
function getHeading(params: onPhysicsParams, heading: HEADING) {
  return params.local.get(...getHeadingCords(heading))
}

/**Sets a relavive tile based on heading. */
function setHeading(params: onPhysicsParams, heading: HEADING, data: Tile) {
  return params.local.set(...getHeadingCords(heading), data)
}

/**Marks physics update based on heading */
function updateHeading(params: onPhysicsParams, heading: HEADING) {
  const [x, y] = getHeadingCords(heading)
  params.updateLocal(
    -1 + Math.min(x, 0),
    -1 + Math.min(y, 0),
    3 + Math.abs(x),
    3 + Math.abs(y),
  )
}

/**_wallEnemyLogic_ is a function that encapsulate the logic for the _WALL_ENEMY_ type. */
function wallEnemyLogic(
  params: onPhysicsParams,
  heading: HEADING,
  clockwise: boolean,
  rotationType: Tile,
  forwardType: Tile,
  counterRotationType: Tile,
  backwardType: Tile,
) {
  const { local, updateLocal } = params
  const rotation = clockwise ? 2 : -2
  const corner = clockwise ? 1 : -1

  console.log(
    typeof rotationType,
    typeof forwardType,
    typeof counterRotationType,
    typeof backwardType,
  )

  // Kill on outside corner.
  if (
    getHeading(params, heading - rotation) === TILES.PLAYER &&
    getHeading(params, heading - rotation - corner) !== TILES.NOTHING
  ) {
    local.set(0, 0, TILES.NOTHING)
    explode(params, ...getHeadingCords(heading - rotation))
    return
  }

  // Turn on outside corner.
  if (
    getHeading(params, heading - rotation) === TILES.NOTHING &&
    getHeading(params, heading - rotation - corner) !== TILES.NOTHING
  ) {
    local.set(0, 0, TILES.NOTHING)
    setHeading(params, heading - rotation, counterRotationType)
    updateHeading(params, heading - rotation)
    return
  }

  // Kill on forward.
  if (
    getHeading(params, heading) === TILES.PLAYER &&
    getHeading(params, heading - rotation) !== TILES.NOTHING
  ) {
    local.set(0, 0, TILES.NOTHING)
    explode(params, ...getHeadingCords(heading))
    return
  }

  // Move forward.
  if (
    getHeading(params, heading) === TILES.NOTHING &&
    getHeading(params, heading - rotation) !== TILES.NOTHING
  ) {
    local.set(0, 0, TILES.NOTHING)
    setHeading(params, heading, forwardType)
    updateHeading(params, heading)
    return
  }

  // Kill on inside corner.
  if (
    getHeading(params, heading + rotation) === TILES.PLAYER &&
    getHeading(params, heading) !== TILES.NOTHING
  ) {
    local.set(0, 0, TILES.NOTHING)
    explode(params, ...getHeadingCords(heading + rotation))
    return
  }

  // Turn on inside corner.
  if (
    getHeading(params, heading + rotation) === TILES.NOTHING &&
    getHeading(params, heading) !== TILES.NOTHING
  ) {
    local.set(0, 0, TILES.NOTHING)
    setHeading(params, heading + rotation, rotationType)
    updateHeading(params, heading + rotation)
    return
  }

  // Kill on dead end.
  if (
    getHeading(params, heading) !== TILES.NOTHING &&
    getHeading(params, heading + rotation) !== TILES.NOTHING &&
    getHeading(params, heading - rotation) !== TILES.NOTHING &&
    getHeading(params, heading + 4) === TILES.PLAYER
  ) {
    local.set(0, 0, TILES.NOTHING)
    explode(params, ...getHeadingCords(heading + 4))
    return
  }

  // Turn on dead end.
  if (
    getHeading(params, heading) !== TILES.NOTHING &&
    getHeading(params, heading + rotation) !== TILES.NOTHING &&
    getHeading(params, heading - rotation) !== TILES.NOTHING &&
    getHeading(params, heading + 4) === TILES.NOTHING
  ) {
    local.set(0, 0, TILES.NOTHING)
    setHeading(params, heading + 4, backwardType)
    updateHeading(params, heading + 4)
    return
  }

  // Trapped.
  if (getHeading(params, heading + 4) !== TILES.NOTHING) return
  if (
    getHeading(params, heading + 1) === TILES.NOTHING &&
    getHeading(params, heading + rotation + 1) === TILES.NOTHING &&
    getHeading(params, heading - rotation + 1) === TILES.NOTHING &&
    getHeading(params, heading + 4 + 1) === TILES.NOTHING
  ) {
    return
  }

  // Rotate
  local.set(0, 0, rotationType)
  updateLocal(0, 0)
}

const EXPORT: TileList = {
  WALL_ENEMY_CLOCKWISE_UP: {
    name: 'WALL_ENEMY',
    texture: '/textures/pixel/boom.gif',
    symbol: 'w',
    explosive: 1,

    onLoad: ({ updateLocal }) => {
      updateLocal(0, 0)
    },

    onPhysics: (params) => {
      wallEnemyLogic(
        params,
        HEADING.NORTH,
        true,
        TILES.WALL_ENEMY_CLOCKWISE_RIGHT,
        TILES.WALL_ENEMY_CLOCKWISE_UP,
        TILES.WALL_ENEMY_CLOCKWISE_LEFT,
        TILES.WALL_ENEMY_CLOCKWISE_DOWN,
      )
    },
  },

  WALL_ENEMY_CLOCKWISE_RIGHT: {
    name: 'WALL_ENEMY',
    texture: '/textures/pixel/boom.gif',
    explosive: 1,

    onLoad: ({ updateLocal }) => {
      updateLocal(0, 0)
    },

    onPhysics: (params) => {
      wallEnemyLogic(
        params,
        HEADING.EAST,
        true,
        TILES.WALL_ENEMY_CLOCKWISE_DOWN,
        TILES.WALL_ENEMY_CLOCKWISE_RIGHT,
        TILES.WALL_ENEMY_CLOCKWISE_UP,
        TILES.WALL_ENEMY_CLOCKWISE_LEFT,
      )
    },
  },

  WALL_ENEMY_CLOCKWISE_DOWN: {
    name: 'WALL_ENEMY',
    texture: '/textures/pixel/boom.gif',
    explosive: 1,

    onLoad: ({ updateLocal }) => {
      updateLocal(0, 0)
    },

    onPhysics: (params) => {
      wallEnemyLogic(
        params,
        HEADING.SOUTH,
        true,
        TILES.WALL_ENEMY_CLOCKWISE_LEFT,
        TILES.WALL_ENEMY_CLOCKWISE_DOWN,
        TILES.WALL_ENEMY_CLOCKWISE_RIGHT,
        TILES.WALL_ENEMY_CLOCKWISE_UP,
      )
    },
  },

  WALL_ENEMY_CLOCKWISE_LEFT: {
    name: 'WALL_ENEMY',
    texture: '/textures/pixel/boom.gif',
    explosive: 1,

    onLoad: ({ updateLocal }) => {
      updateLocal(0, 0)
    },

    onPhysics: (params) => {
      wallEnemyLogic(
        params,
        HEADING.WEST,
        true,
        TILES.WALL_ENEMY_CLOCKWISE_UP,
        TILES.WALL_ENEMY_CLOCKWISE_LEFT,
        TILES.WALL_ENEMY_CLOCKWISE_DOWN,
        TILES.WALL_ENEMY_CLOCKWISE_RIGHT,
      )
    },
  },

  WALL_ENEMY_COUNTERCLOCKWISE_UP: {
    name: 'WALL_ENEMY',
    texture: '/textures/pixel/boom.gif',
    symbol: 'W',
    explosive: 1,

    onLoad: ({ updateLocal }) => {
      updateLocal(0, 0)
    },

    onPhysics: (params) => {
      wallEnemyLogic(
        params,
        HEADING.NORTH,
        false,
        TILES.WALL_ENEMY_COUNTERCLOCKWISE_LEFT,
        TILES.WALL_ENEMY_COUNTERCLOCKWISE_UP,
        TILES.WALL_ENEMY_COUNTERCLOCKWISE_RIGHT,
        TILES.WALL_ENEMY_COUNTERCLOCKWISE_DOWN,
      )
    },
  },

  WALL_ENEMY_COUNTERCLOCKWISE_RIGHT: {
    name: 'WALL_ENEMY',
    texture: '/textures/pixel/boom.gif',
    explosive: 1,

    onLoad: ({ updateLocal }) => {
      updateLocal(0, 0)
    },

    onPhysics: (params) => {
      wallEnemyLogic(
        params,
        HEADING.EAST,
        false,
        TILES.WALL_ENEMY_COUNTERCLOCKWISE_UP,
        TILES.WALL_ENEMY_COUNTERCLOCKWISE_RIGHT,
        TILES.WALL_ENEMY_COUNTERCLOCKWISE_DOWN,
        TILES.WALL_ENEMY_COUNTERCLOCKWISE_LEFT,
      )
    },
  },

  WALL_ENEMY_COUNTERCLOCKWISE_DOWN: {
    name: 'WALL_ENEMY',
    texture: '/textures/pixel/boom.gif',
    explosive: 1,

    onLoad: ({ updateLocal }) => {
      updateLocal(0, 0)
    },

    onPhysics: (params) => {
      wallEnemyLogic(
        params,
        HEADING.SOUTH,
        false,
        TILES.WALL_ENEMY_COUNTERCLOCKWISE_RIGHT,
        TILES.WALL_ENEMY_COUNTERCLOCKWISE_DOWN,
        TILES.WALL_ENEMY_COUNTERCLOCKWISE_LEFT,
        TILES.WALL_ENEMY_COUNTERCLOCKWISE_UP,
      )
    },
  },

  WALL_ENEMY_COUNTERCLOCKWISE_LEFT: {
    name: 'WALL_ENEMY',
    texture: '/textures/pixel/boom.gif',
    explosive: 1,

    onLoad: ({ updateLocal }) => {
      updateLocal(0, 0)
    },

    onPhysics: (params) => {
      wallEnemyLogic(
        params,
        HEADING.WEST,
        false,
        TILES.WALL_ENEMY_COUNTERCLOCKWISE_DOWN,
        TILES.WALL_ENEMY_COUNTERCLOCKWISE_LEFT,
        TILES.WALL_ENEMY_COUNTERCLOCKWISE_UP,
        TILES.WALL_ENEMY_COUNTERCLOCKWISE_RIGHT,
      )
    },
  },
}

export default EXPORT
