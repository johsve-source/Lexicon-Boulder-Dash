import { TILES, TileList, onPhysicsParams } from './Tiles'

/**A helper function for explotion. */
export function explode(
  params: onPhysicsParams,
  x: number = 0,
  y: number = 0,
  radius: number = 1,
) {
  const { local, gameState, soundList } = params
  soundList.explosion = true

  // Calculate the boundaries of the explotion in global space.
  const startX = Math.max(local.x + x - radius, 1)
  const endX = Math.min(local.x + x + radius, gameState.grid.width - 2)
  const startY = Math.max(local.y + y - radius, 1)
  const endY = Math.min(local.y + y + radius, gameState.grid.height - 2)

  for (let iy = startY; iy <= endY; iy++)
    for (let ix = startX; ix <= endX; ix++) {
      const tile = gameState.get(ix, iy)

      // Dig out the dirt diamond.
      if (tile === TILES.BEDROCK_DIAMOND) {
        gameState.set(ix, iy, TILES.DIRT_DIAMOND)
        gameState.updateArea(ix + x, iy + y)
        return
      }

      // Do not explode if indestructible.
      if (tile.indestructible) continue

      gameState.set(ix, iy, TILES.EXPLOSION)
      gameState.updateArea(ix + x, iy + y)

      // Check if chain explotion.
      if (tile.explosive)
        explode(params, ix - local.x, iy - local.y, tile.explosive)
    }
}

const EXPORT: TileList = {
  EXPLOSION: {
    name: 'EXPLOSION',
    texture: '/textures/pixel/boom.gif',

    onPhysics({ local, updateLocal }) {
      local.set(0, 0, TILES.NOTHING)
      updateLocal(-1, -1, 3, 3)
    },
  },
}

export default EXPORT
