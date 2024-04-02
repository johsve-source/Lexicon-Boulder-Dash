import { TILES, TileList } from './Tiles'

const EXPORT: TileList = {
  LAVA: {
    name: 'LAVA',
    texture: [
      '/textures/pixel/lava.gif',
      '/textures/pixel/lava.gif',
      '/textures/pixel/lava.gif',
      '/textures/pixel/lava.gif',
      '/textures/pixel/lava.gif',
    ],
    symbol: ';',

    
    onPlayerMove({ local, updateLocal, moveDirection, soundList }) {
      if (local.get(-moveDirection.x, -moveDirection.y) === TILES.PLAYER ) {
        local.set(-moveDirection.x, -moveDirection.y, TILES.LAVA)
        updateLocal(-1, -1, 3, 3)
        soundList.explosion = true
      }
    },
  },
}

export default EXPORT
