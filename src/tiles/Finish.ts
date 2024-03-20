import { TILES, TileList } from './Tiles'

const EXPORT: TileList = {
  FINISH: {
    name: 'FINISH',
    texture: '/textures/pixel/finish.gif',
    symbol: 'f',

    onPlayerMove({ local, moveDirection, gameState, action }) {
      if (local.get(-moveDirection.x, -moveDirection.y) === TILES.PLAYER) {
        if (
          typeof action.loadLevelCallback !== 'undefined' &&
          typeof gameState.nextLevel !== 'undefined'
        )
          action.loadLevelCallback(gameState.nextLevel)
      }
    },
  },
}

export default EXPORT
