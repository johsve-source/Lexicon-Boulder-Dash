import { TILES, Tile, TileList, onPhysicsParams } from './Tiles'
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
  FOLLOW_ENEMY: {
    name: 'FOLLOW_ENEMY',
    texture: '/textures/pixel/boom.gif',
    symbol: 'f',
    explosive: 1,

    onLoad: ({ updateLocal }) => {
      updateLocal(0, 0)
    },

    onPhysics: ({ x, y, gameState }) => {
      let deltaX = gameState.playerPos.x - x
      let deltaY = gameState.playerPos.y - y

      if (Math.abs(deltaX) >= Math.abs(deltaY)) {
        deltaX = Math.min(Math.max(deltaX, -1), 1)
        deltaY = Math.min(Math.max(deltaX, -1), 1)
      } else {
        deltaX = Math.min(Math.max(deltaX, -1), 1)
        deltaY = Math.min(Math.max(deltaX, -1), 1)
      }
    },
  },
}

export default EXPORT
