import { TILES, TileList } from './Tiles'

const EXPORT: TileList = {
  PHOENIX: {
    name: 'PHOENIX',
    texture: '/textures/pixel/enemy_phoenix.gif',
    symbol: '1',

    onPlayerMove({ local, updateLocal, moveDirection, soundList }) {
      if (local.get(-moveDirection.x, -moveDirection.y) === TILES.PLAYER) {
        local.set(0, 0, TILES.EXPLOSION)
        updateLocal(-1, -1, 3, 3)
        soundList.explosion = true
      }
    },
  },
}

export default EXPORT
