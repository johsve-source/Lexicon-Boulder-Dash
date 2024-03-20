import { TILES, TileList } from './Tiles'

const EXPORT: TileList = {
  PLAYER: {
    name: 'PLAYER',
    texture: '/textures/pixel/player.gif',
    symbol: 'p',

    onPlayerMove({ local, updateLocal, moveDirection, gameState }) {
      if (local.get(moveDirection.x, moveDirection.y) === TILES.NOTHING) {
        local.set(0, 0, TILES.NOTHING)
        local.set(moveDirection.x, moveDirection.y, TILES.PLAYER)

        updateLocal(
          -1 + Math.min(moveDirection.x, 0),
          -1 + Math.min(moveDirection.y, 0),
          3 + Math.abs(moveDirection.x),
          3 + Math.abs(moveDirection.y),
        )

        gameState.playerPos.x += moveDirection.x
        gameState.playerPos.y += moveDirection.y
      }
    },
  },
}

export default EXPORT
