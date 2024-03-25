import { TILES, TileList } from './Tiles'

const EXPORT: TileList = {
  PLAYER: {
    name: 'PLAYER',
    texture: '/textures/pixel/player.gif',
    symbol: 'p',
    frame: 0,

    explosive: 1,

    onPlayerMove({ tile, local, updateLocal, moveDirection, gameState }) {
      if (local.get(moveDirection.x, moveDirection.y) === TILES.NOTHING) {
        if (moveDirection.y < 0) {
          tile.animation = 'move-up'
          tile.frame = 1
        } else if (moveDirection.y > 0) {
          tile.animation = 'move-down'
          tile.frame = 0
        } else if (moveDirection.x < 0) {
          tile.animation = 'move-left'
          tile.frame = 2
        } else if (moveDirection.x > 0) {
          tile.animation = 'move-right'
          tile.frame = 3
        }

        local.set(0, 0, TILES.NOTHING)
        local.set(moveDirection.x, moveDirection.y, tile)

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
