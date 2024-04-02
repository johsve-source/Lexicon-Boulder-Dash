import { TILES, TileList } from './Tiles'

const EXPORT: TileList = {
  WOOD: {
    name: 'WOOD',
    texture: [
      '/textures/pixel/wood.png',
      '/textures/pixel/wood.png',
      '/textures/pixel/wood.png',
      '/textures/pixel/dark-bricks.png',
      '/textures/pixel/wood.png',
    ],
    symbol: '$',

    onPlayerMove({ local, updateLocal, moveDirection, soundList }) {
      if (local.get(-moveDirection.x, -moveDirection.y) === TILES.PLAYER) {
        local.set(0, 0, TILES.NOTHING)
        updateLocal(-1, -1, 3, 3)
        soundList.diggingDirt = true
      }
    },
  },
}

export default EXPORT
