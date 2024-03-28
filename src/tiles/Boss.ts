import { getAnimation } from './LineEnemy'
import { TILES, TileList, onLoadParams, onPhysicsParams } from './Tiles'

/**A convinience function for moving the boss structure. */
function move(params: onLoadParams, moveX: number, moveY: number) {
  const { local } = params

  local.set(-1, -1, TILES.NOTHING)
  local.set(0, -1, TILES.NOTHING)
  local.set(-1, 0, TILES.NOTHING)
  local.set(0, 0, TILES.NOTHING)

  local.set(
    moveX - 1,
    moveY - 1,
    getAnimation(TILES.BOSS_TOP_LEFT, moveX, moveY),
  )
  local.set(
    moveX - 0,
    moveY - 1,
    getAnimation(TILES.BOSS_TOP_RIGHT, moveX, moveY),
  )
  local.set(
    moveX - 1,
    moveY - 0,
    getAnimation(TILES.BOSS_BOTTOM_LEFT, moveX, moveY),
  )
  local.set(
    moveX - 0,
    moveY - 0,
    getAnimation(TILES.BOSS_BOTTOM_RIGHT, moveX, moveY),
  )
}

/**Checks if the provided move is valid. */
function canMove(params: onPhysicsParams, moveX: number, moveY: number) {
  const { x, y, local, gameState } = params
  if (x + moveX < 2) return false
  if (y + moveY < 2) return false
  if (x + moveX + 2 > gameState.grid.width) return false
  if (y + moveY + 2 > gameState.grid.height) return false

  // Get destroyed tiles.
  const destroyedTiles = [
    local.get(moveX - 1, moveY - 1),
    local.get(moveX - 0, moveY - 1),
    local.get(moveX - 1, moveY - 0),
    local.get(moveX - 0, moveY - 0),
  ]

  if (destroyedTiles.includes(TILES.DIRT_DIAMOND)) return false
  if (destroyedTiles.includes(TILES.BEDROCK_DIAMOND)) return false
  if (destroyedTiles.includes(TILES.DIRT_FINISH)) return false
  if (destroyedTiles.includes(TILES.BEDROCK_FINISH)) return false

  return true
}

const EXPORT: TileList = {
  BOSS_TOP_LEFT: {
    name: 'BOSS',
    texture: '/textures/pixel/enemy_griffin_tl.gif',
    explosive: 2,
  },

  BOSS_TOP_RIGHT: {
    name: 'BOSS',
    texture: '/textures/pixel/enemy_griffin_tr.gif',
    explosive: 2,
  },

  BOSS_BOTTOM_LEFT: {
    name: 'BOSS',
    texture: '/textures/pixel/enemy_griffin_bl.gif',
    explosive: 2,
  },

  BOSS_BOTTOM_RIGHT: {
    name: 'BOSS',
    texture: '/textures/pixel/enemy_griffin_br.gif',
    symbol: 'B',
    explosive: 2,

    onLoad(params) {
      const { updateLocal } = params

      move(params, 0, 0)
      updateLocal(0, 0)
    },

    onPhysics(params) {
      const { x, y, local, updateLocal, gameState, soundList } = params

      // Move every third uppdate.
      if (!(gameState.updateCount % 3 === 0)) {
        move(params, 0, 0)
        updateLocal(0, 0)
        return
      }

      // Get relative player position.
      let deltaX = gameState.playerPos.x - (x - 0.5)
      let deltaY = gameState.playerPos.y - (y - 0.5)

      // Check which axis the enemy should focus moving on
      const xFirst = Math.abs(deltaX) >= Math.abs(deltaY)

      // Clamp relative player position for movment.
      deltaX = Math.min(Math.max(deltaX * 2, -1), 1)
      deltaY = Math.min(Math.max(deltaY * 2, -1), 1)

      // Check wich direction to move.
      if (xFirst) {
        if (canMove(params, deltaX, 0)) deltaY = 0
        else if (canMove(params, 0, deltaY)) deltaX = 0
        else {
          move(params, 0, 0)
          updateLocal(0, 0)
          return
        }
      } else {
        if (canMove(params, 0, deltaY)) deltaX = 0
        else if (canMove(params, deltaX, 0)) deltaY = 0
        else {
          move(params, 0, 0)
          updateLocal(0, 0)
          return
        }
      }

      // Get destroyed tiles.
      const destroyedTiles = [
        local.get(deltaX - 1, deltaY - 1),
        local.get(deltaX - 0, deltaY - 1),
        local.get(deltaX - 1, deltaY - 0),
        local.get(deltaX - 0, deltaY - 0),
      ]

      // Play audio.
      if (destroyedTiles.includes(TILES.DIRT)) soundList.diggingDirt = true
      if (destroyedTiles.includes(TILES.PLAYER)) soundList.explosion = true
      if (destroyedTiles.includes(TILES.BEDROCK)) soundList.stoneFalling = true
      if (
        destroyedTiles.includes(TILES.DIRT_BOULDER) ||
        destroyedTiles.includes(TILES.BEDROCK_BOULDER) ||
        destroyedTiles.includes(TILES.FALLING_BOULDER)
      )
        soundList.stoneFalling = true

      // Move.
      move(params, deltaX, deltaY)
      updateLocal(
        -2 + Math.min(deltaX, 0),
        -2 + Math.min(deltaY, 0),
        4 + Math.abs(deltaX),
        4 + Math.abs(deltaY),
      )
    },
  },
}

export default EXPORT
