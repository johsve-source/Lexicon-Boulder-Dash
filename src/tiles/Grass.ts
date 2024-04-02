import { TILES, TileList } from './Tiles'

const EXPORT: TileList = {
  GRASS: {
    name: 'GRASS',
    texture: [
      '/textures/pixel/grass.png',
      '/textures/pixel/grass.png',
      '/textures/pixel/grass.png',
      '/textures/pixel/grass.png',
      '/textures/pixel/grass.png',
    ],
    symbol: 'g',

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
