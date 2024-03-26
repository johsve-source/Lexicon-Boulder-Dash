import { getAnimation } from './LineEnemy'
import { TILES, TileList, onLoadParams, onPhysicsParams } from './Tiles'

function drawBody(
  { local }: onLoadParams,
  x: number,
  y: number,
  xDir: number,
  yDir: number,
) {
  local.set(x + 0, y + 0, getAnimation(TILES.BOSS_TOP_LEFT, xDir, yDir))
  local.set(x + 1, y + 0, getAnimation(TILES.BOSS_TOP_RIGHT, xDir, yDir))
  local.set(x + 0, y + 1, getAnimation(TILES.BOSS_BOTTOM_LEFT, xDir, yDir))
  local.set(x + 1, y + 1, getAnimation(TILES.BOSS_BOTTOM_RIGHT, xDir, yDir))
}

function move(params: onPhysicsParams, moveX: number, moveY: number) {
  const { local } = params

  local.set(0, 0, TILES.NOTHING)
  local.set(1, 0, TILES.NOTHING)
  local.set(0, 1, TILES.NOTHING)
  local.set(1, 1, TILES.NOTHING)

  drawBody(params, moveX, moveY, moveX, moveY)
}

function canMove(params: onPhysicsParams, moveX: number, moveY: number) {
  const { x, y, local, gameState } = params
  if (x + moveX < 1) return false
  if (y + moveY < 1) return false
  if (x + moveX + 3 > gameState.grid.width) return false
  if (y + moveY + 3 > gameState.grid.height) return false

  if (
    local.get(x + moveX, y + moveY) === TILES.FINISH ||
    local.get(x + moveX + 1, y + moveY) === TILES.FINISH ||
    local.get(x + moveX, y + moveY + 1) === TILES.FINISH ||
    local.get(x + moveX + 1, y + moveY + 1) === TILES.FINISH
  )
    return false

  return true
}

const EXPORT: TileList = {
  BOSS_TOP_LEFT: {
    name: 'BOSS',
    texture: '/textures/metal/metal.png',
    symbol: 'B',
    explosive: 1,

    onLoad: (params) => {
      const { updateLocal } = params

      drawBody(params, 0, 0, 0, 0)
      updateLocal(0, 0)
    },

    onPhysics: (params) => {
      const { x, y, updateLocal, gameState } = params

      // Move every second uppdate.
      if (gameState.updateCount % 2 === 0) {
        updateLocal(0, 0)
        return
      }

      // Get relative player position.
      let deltaX = gameState.playerPos.x - x + 0.5
      let deltaY = gameState.playerPos.y - y + 0.5

      // Check which axis the enemy should focus moving on
      const xFirst = Math.abs(deltaX) >= Math.abs(deltaY)

      // Clamp relative player position for movment.
      deltaX = Math.min(Math.max(deltaX, -1), 1)
      deltaY = Math.min(Math.max(deltaY, -1), 1)

      if (xFirst) deltaY = 0
      else deltaX = 0

      if (canMove(params, deltaX, deltaY)) {
        move(params, deltaX, deltaY)
        updateLocal(deltaX - 1, deltaY - 1, 4, 4)
      } else {
        updateLocal(0, 0)
      }
      /* move(params, 1, 0)
      updateLocal(1, 0) */
    },
  },

  BOSS_TOP_RIGHT: {
    name: 'BOSS',
    texture: '/textures/metal/metal.png',
    explosive: 1,
  },

  BOSS_BOTTOM_LEFT: {
    name: 'BOSS',
    texture: '/textures/metal/metal.png',
    explosive: 1,
  },

  BOSS_BOTTOM_RIGHT: {
    name: 'BOSS',
    texture: '/textures/metal/metal.png',
    explosive: 1,
  },
}

export default EXPORT
