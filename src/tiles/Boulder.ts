import {
  TILES,
  Tile,
  TileList,
  onPlayerMoveParams,
  onPhysicsParams,
} from './Tiles'
import { explode } from './Explosion'

const EXPORT: TileList = {
  DIRT_BOULDER: {
    name: 'DIRT_BOULDER',
    texture: '/textures/pixel/dirt-boulder.png',
    symbol: 'O',

    onPlayerMove(params) {
      boulderPush(params, TILES.BEDROCK_BOULDER)
    },

    onPhysics: (params) => {
      const { soundList } = params

      if (boulderPhysics(params, TILES.FALLING_BOULDER, TILES.DIRT_BOULDER))
        soundList.stoneFalling = true
    },
  },

  BEDROCK_BOULDER: {
    name: 'BEDROCK_BOULDER',
    texture: '/textures/pixel/bedrock-boulder.png',
    symbol: 'o',

    onPlayerMove(params) {
      boulderPush(params, TILES.BEDROCK_BOULDER)
    },

    onPhysics: (params) => {
      const { soundList } = params

      if (boulderPhysics(params, TILES.FALLING_BOULDER, TILES.BEDROCK_BOULDER))
        soundList.stoneFalling = true
    },
  },

  FALLING_BOULDER: {
    name: 'FALLING_BOULDER',
    texture: '/textures/pixel/bedrock-boulder.png',

    onPhysics: (params) => {
      const { local, soundList } = params

      if (local.get(0, 1) === TILES.PLAYER) {
        explode(params, 0, 1)
        soundList.explosion = true
        return
      }

      if (boulderPhysics(params, TILES.FALLING_BOULDER, TILES.BEDROCK_BOULDER))
        soundList.stoneFalling = true
    },
  },
}

export default EXPORT

export function boulderPush(
  { local, moveDirection }: onPlayerMoveParams,
  pushVariant: Tile,
) {
  if (
    local.get(-moveDirection.x, 0) === TILES.PLAYER &&
    local.get(moveDirection.x, 0) === TILES.NOTHING
  ) {
    local.set(0, 0, TILES.NOTHING)
    local.set(moveDirection.x, 0, pushVariant)
    return true
  }

  return false
}

export function boulderPhysics(
  { local, updateLocal }: onPhysicsParams,
  fallVariant: Tile,
  restVariant: Tile,
) {
  // Falling down
  if (local.get(0, 1) === TILES.NOTHING) {
    local.set(0, 0, TILES.NOTHING)
    local.set(0, 1, fallVariant)
    updateLocal(-1, -1, 3, 4)
    return true
  }

  // Falling left
  if (
    local.get(-1, 0) === TILES.NOTHING &&
    local.get(-1, 1) === TILES.NOTHING
  ) {
    local.set(0, 0, TILES.NOTHING)
    local.set(-1, 0, fallVariant)
    updateLocal(-2, -1, 4, 3)
    return true
  }

  // Falling right
  if (local.get(1, 0) === TILES.NOTHING && local.get(1, 1) === TILES.NOTHING) {
    local.set(0, 0, TILES.NOTHING)
    local.set(1, 0, fallVariant)
    updateLocal(-1, -1, 4, 3)
    return true
  }

  // Reset
  local.set(0, 0, restVariant)
  return false
}
