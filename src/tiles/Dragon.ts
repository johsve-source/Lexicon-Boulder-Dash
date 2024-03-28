import { TILES, TileList } from './Tiles'

const EXPORT: TileList = {
    DRAGON: {
    name: 'DRAGON',
    texture: '/textures/pixel/enemy_dragon.gif',
    symbol: '3',

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
