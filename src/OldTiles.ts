export interface Tile {
  name: string
  texture: string
  symbol?: string
  animation?: string
  frame?: number
}

export const TILES: { [name: string]: Tile } = {
  NOTHING: {
    name: 'NOTHING',
    texture: '/textures/pixel/bedrock.png',
    symbol: ' ',
  },

  BEDROCK: {
    name: 'BEDROCK',
    texture: '/textures/pixel/bedrock-2.png',
    symbol: '#',
  },

  DIRT: {
    name: 'DIRT',
    texture: '/textures/pixel/dirt.png',
    symbol: '.',
  },

  DIRT_BOULDER: {
    name: 'DIRT_BOULDER',
    texture: '/textures/pixel/dirt-boulder.png',
    symbol: 'O',
  },

  BEDROCK_BOULDER: {
    name: 'BEDROCK_BOULDER',
    texture: '/textures/pixel/bedrock-boulder.png',
    symbol: 'o',
  },

  FALLING_BOULDER: {
    name: 'FALLING_BOULDER',
    texture: '/textures/pixel/bedrock-boulder.png',
  },

  EXPLOSION: {
    name: 'EXPLOSION',
    texture: '/textures/pixel/boom.gif',
  },

  DIRT_DIAMOND: {
    name: 'DIRT_DIAMOND',
    texture: '/textures/pixel/dirt-diamond.png',
    symbol: 'D',
  },

  BEDROCK_DIAMOND: {
    name: 'BEDROCK_DIAMOND',
    texture: '/textures/pixel/bedrock-diamond.png',
    symbol: 'd',
  },

  PLAYER: {
    name: 'PLAYER',
    texture: '/textures/pixel/player.gif',
    symbol: 'p',
    frame: 0
  },

  FINISH: {
    name: 'FINISH',
    texture: '/textures/pixel/finish.gif',
    symbol: 'f',
  },
}
export default TILES
Object.freeze(TILES)

export const symbolToTile: { [symbol: string]: Tile } = Object.values(
  TILES,
).reduce<{ [symbol: string]: Tile }>((symbolList, tileData) => {
  if (typeof tileData.symbol === 'undefined') return symbolList
  if (tileData.symbol in symbolList) {
    const conflictedData = symbolList[tileData.symbol]
    console.error(
      `ERROR: Tile '${tileData.name}' with symbol '${tileData.symbol}' collides with '${conflictedData.name}'!`,
    )
    return symbolList
  }

  symbolList[tileData.symbol] = tileData
  return symbolList
}, {})
Object.freeze(symbolToTile)
