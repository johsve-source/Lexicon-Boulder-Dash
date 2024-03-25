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

function getHeading(params: onPhysicsParams, heading: HEADING) {
  return params.local.get(...getHeadingCords(heading))
}

function setHeading(params: onPhysicsParams, heading: HEADING, data: Tile) {
  return params.local.set(...getHeadingCords(heading), data)
}

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
  const { local } = params
  const rotation = clockwise ? 2 : -2

  if (getHeading(params, heading + rotation) === TILES.PLAYER) {
    local.set(0, 0, TILES.NOTHING)
    explode(params, ...getHeadingCords(heading + rotation))
    return
  }

  if (getHeading(params, heading + rotation) === TILES.NOTHING) {
    local.set(0, 0, TILES.NOTHING)
    setHeading(params, heading + rotation, rotationType)
    updateHeading(params, heading + rotation)
    return
  }

  if (getHeading(params, heading) === TILES.PLAYER) {
    local.set(0, 0, TILES.NOTHING)
    explode(params, ...getHeadingCords(heading))
    return
  }

  if (getHeading(params, heading) === TILES.NOTHING) {
    local.set(0, 0, TILES.NOTHING)
    setHeading(params, heading, forwardType)
    updateHeading(params, heading)
    return
  }

  if (getHeading(params, heading - rotation) === TILES.PLAYER) {
    local.set(0, 0, TILES.NOTHING)
    explode(params, ...getHeadingCords(heading - rotation))
    return
  }

  if (getHeading(params, heading - rotation) === TILES.NOTHING) {
    local.set(0, 0, TILES.NOTHING)
    setHeading(params, heading - rotation, counterRotationType)
    updateHeading(params, heading - rotation)
    return
  }

  if (getHeading(params, heading + 4) === TILES.PLAYER) {
    local.set(0, 0, TILES.NOTHING)
    explode(params, ...getHeadingCords(heading + 4))
    return
  }

  if (getHeading(params, heading + 4) === TILES.NOTHING) {
    local.set(0, 0, TILES.NOTHING)
    setHeading(params, heading + 4, backwardType)
    updateHeading(params, heading + 4)
    return
  }
}

const EXPORT: TileList = {
  WALL_ENEMY_CLOCKWISE_UPP: {
    name: 'WALL_ENEMY',
    texture: '/textures/pixel/boom.gif',
    symbol: 'w',

    onLoad: ({ updateLocal }) => {
      updateLocal(0, 0)
    },

    onPhysics: (params) => {
      /* wallEnemyLogic(
        params,
        -1,
        0,
        TILES.LINE_ENEMY_LEFT,
        TILES.LINE_ENEMY_RIGHT,
      ) */
    },
  },
}

export default EXPORT
