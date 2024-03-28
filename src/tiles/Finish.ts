import { TILES, TileList } from './Tiles'

const EXPORT: TileList = {
  DIRT_FINISH: {
    name: 'DIRT_FINISH',
    texture: '/textures/pixel/dirt-finish.gif',
    symbol: 'F',

    onLoad({ local, tile, x, y, gameState }) {
      gameState.finish = { x, y, tile }
      local.set(0, 0, TILES.DIRT)
    },

    onPlayerMove({ local, moveDirection, gameState, action }) {
      if (gameState.diamondsRemaining <= 0)
        if (local.get(-moveDirection.x, -moveDirection.y) === TILES.PLAYER)
          if (
            typeof action.loadLevelCallback !== 'undefined' &&
            typeof gameState.curentLevel !== 'undefined'
          )
            action.loadLevelCallback(gameState.curentLevel.nextLevel)
    },
  },

  BEDROCK_FINISH: {
    name: 'BEDROCK_FINISH',
    texture: '/textures/pixel/bedrock-finish.gif',
    symbol: 'f',

    onLoad({ local, tile, x, y, gameState }) {
      gameState.finish = { x, y, tile }
      local.set(0, 0, TILES.NOTHING)
    },

    onPlayerMove({ local, moveDirection, gameState, action }) {
      if (gameState.diamondsRemaining <= 0)
        if (local.get(-moveDirection.x, -moveDirection.y) === TILES.PLAYER)
          if (
            typeof action.loadLevelCallback !== 'undefined' &&
            typeof gameState.curentLevel !== 'undefined'
          )
            action.loadLevelCallback(gameState.curentLevel.nextLevel)
    },
  },
}

export default EXPORT
