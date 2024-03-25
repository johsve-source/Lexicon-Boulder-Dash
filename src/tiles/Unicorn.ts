import { TILES, TileList } from './Tiles'

const EXPORT: TileList = {
    UNICORN: {
    name: 'UNICORN',
    texture: '/textures/pixel/enemy_unicorn.gif',
    symbol: '2',

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
