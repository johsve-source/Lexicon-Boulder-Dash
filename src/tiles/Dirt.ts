import { TILES, TileList } from './Tiles'

const EXPORT: TileList = {
  DIRT: {
    name: 'DIRT',
    texture: [
      '/textures/pixel/dirt.png',
      '/textures/pixel/dirt.png',
      '/textures/pixel/dirt.png',
      '/textures/pixel/dirt.png',
      '/textures/pixel/dirt-3.png',
    ],
    symbol: '.',

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
