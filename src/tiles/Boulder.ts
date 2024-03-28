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
      if (boulderPush(params, TILES.BEDROCK_BOULDER))
        params.soundList.stoneFalling = true
    },

    onPhysics(params) {
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
      if (boulderPush(params, TILES.BEDROCK_BOULDER))
        params.soundList.stoneFalling = true
    },

    onPhysics(params) {
      const { soundList } = params

      if (boulderPhysics(params, TILES.FALLING_BOULDER, TILES.BEDROCK_BOULDER))
        soundList.stoneFalling = true
    },
  },

  FALLING_BOULDER: {
    name: 'FALLING_BOULDER',
    texture: '/textures/pixel/bedrock-boulder.png',

    onPhysics(params) {
      const { local, soundList } = params

      // If something explosive bellow then detonate.
      const below = local.get(0, 1)
      if (below.explosive) {
        explode(params, 0, 1, below.explosive)
        return
      }

      if (boulderPhysics(params, TILES.FALLING_BOULDER, TILES.BEDROCK_BOULDER))
        soundList.stoneFalling = true
    },
  },
}

export default EXPORT

/**A helper function for pushing.
 *
 * When pushed the tile is converted to the _pushVariant_.
 */
export function boulderPush(
  { local, moveDirection }: onPlayerMoveParams,
  pushVariant: Tile,
) {
  if (
    local.get(-moveDirection.x, 0) === TILES.PLAYER &&
    local.get(moveDirection.x, 0) === TILES.NOTHING
  ) {
    local.set(0, 0, TILES.NOTHING)
    local.set(moveDirection.x, 0, {
      ...pushVariant,
      animation: moveDirection.x > 0 ? 'move-right-b' : 'move-left-b',
    })
    return true
  }

  return false
}

/**A helper function for boulder fall physics.
 *
 * When falling the tile is converted to the _fallVariant_.
 *
 * Otherwise the tile is converted to the _restVariant_.
 */
export function boulderPhysics(
  { local, updateLocal }: onPhysicsParams,
  fallVariant: Tile,
  restVariant: Tile,
) {
  // Falling down
  if (local.get(0, 1) === TILES.NOTHING) {
    fallVariant = { ...fallVariant, animation: 'move-down' }

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
    fallVariant = { ...fallVariant, animation: 'move-left-b' }

    local.set(0, 0, TILES.NOTHING)
    local.set(-1, 0, fallVariant)
    updateLocal(-2, -1, 4, 3)

    return true
  }

  // Falling right
  if (local.get(1, 0) === TILES.NOTHING && local.get(1, 1) === TILES.NOTHING) {
    fallVariant = { ...fallVariant, animation: 'move-right-b' }

    local.set(0, 0, TILES.NOTHING)
    local.set(1, 0, fallVariant)
    updateLocal(-1, -1, 4, 3)

    return true
  }

  // Reset
  local.set(0, 0, restVariant)
  return false
}
