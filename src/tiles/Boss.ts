import { TILES, TileList, onLoadParams } from './Tiles'

function drawBody({ local }: onLoadParams, x: number = 0, y: number = 0) {
  local.set(x + 0, y + 0, TILES.BOSS_TOP_LEFT)
  local.set(x + 1, y + 0, TILES.BOSS_TOP_RIGHT)
  local.set(x + 0, y + 1, TILES.BOSS_BOTTOM_LEFT)
  local.set(x + 1, y + 1, TILES.BOSS_BOTTOM_RIGHT)
}

function move(params: onLoadParams, x: number, y: number) {
  const { local } = params

  local.set(0, 0, TILES.NOTHING)
  local.set(1, 0, TILES.NOTHING)
  local.set(0, 1, TILES.NOTHING)
  local.set(1, 1, TILES.NOTHING)

  drawBody(params, x, y)
}

const EXPORT: TileList = {
  BOSS_TOP_LEFT: {
    name: 'BOSS',
    texture: '/textures/metal/metal.png',
    symbol: 'A',
    explosive: 1,

    onLoad: (params) => {
      const { updateLocal } = params

      drawBody(params)
      updateLocal(0, 0)
    },

    onPhysics: (params) => {
      const { updateLocal } = params

      move(params, 1, 0)
      updateLocal(1, 0)
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
