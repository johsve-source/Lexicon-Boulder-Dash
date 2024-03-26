import { TILES, Tile, TileList } from './Tiles'
import { explode } from './Explosion'

/**Returns a animated tile based on move direction. */
function getAnimation(tile: Tile, xDir: number, yDir: number) {
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

const EXPORT: TileList = {
  STALKER_ENEMY: {
    name: 'STALKER_ENEMY',
    texture: '/textures/pixel/boom.gif',
    symbol: 's',
    explosive: 1,

    onLoad: ({ updateLocal }) => {
      updateLocal(0, 0)
    },

    onPhysics: (params) => {
      const { x, y, local, updateLocal, gameState } = params

      // Get relative player position.
      let deltaX = gameState.playerPos.x - x
      let deltaY = gameState.playerPos.y - y

      // Check which axis the enemy should focus moving on
      const xFirst = Math.abs(deltaX) >= Math.abs(deltaY)

      // Clamp relative player position for movment.
      deltaX = Math.min(Math.max(deltaX, -1), 1)
      deltaY = Math.min(Math.max(deltaY, -1), 1)

      // Get axis tiles.
      const xTile = local.get(deltaX, 0)
      const yTile = local.get(0, deltaY)

      // Check if the player is beside an kill.
      if (xTile === TILES.PLAYER) {
        local.set(0, 0, TILES.NOTHING)
        explode(params, deltaX, 0)
        return
      } else if (yTile === TILES.PLAYER) {
        local.set(0, 0, TILES.NOTHING)
        explode(params, 0, deltaY)
        return
      }

      if (xFirst) {
        if (xTile === TILES.NOTHING) deltaY = 0
        else if (yTile === TILES.NOTHING) deltaX = 0
        else {
          updateLocal(0, 0)
          return
        }
      } else {
        if (yTile === TILES.NOTHING) deltaX = 0
        else if (xTile === TILES.NOTHING) deltaY = 0
        else {
          updateLocal(0, 0)
          return
        }
      }

      // Move.
      local.set(0, 0, TILES.NOTHING)
      local.set(
        deltaX,
        deltaY,
        getAnimation(TILES.STALKER_ENEMY, deltaX, deltaY),
      )
      updateLocal(
        -1 + Math.min(deltaX, 0),
        -1 + Math.min(deltaY, 0),
        3 + Math.abs(deltaX),
        3 + Math.abs(deltaY),
      )
    },
  },
}

export default EXPORT
