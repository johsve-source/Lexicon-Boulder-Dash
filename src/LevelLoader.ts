import { Tile, TILES, symbolToTile } from './tiles/Tiles'
import Grid from './Grid'

interface LevelFileData {
  name: string
  nextLevel: string
  layout: string[]
}

export interface LevelData {
  grid: Grid<Tile>
  playerPos: { x: number; y: number }
  nextLevel: string
}

export async function loadLevelData(path: string): Promise<LevelData> {
  const data: LevelFileData = await fetch(path).then(
    async (data) => await data.json(),
  )

  const levelData = data.layout.map((row) =>
    [...row].map((f) => symbolToTile[f]),
  )

  const grid = new Grid<Tile>()
  grid.height = levelData.length
  grid.width = levelData[0].length
  grid.data = levelData.reduce((acc, row) => [...acc, ...row], [])

  let playerPos = { x: 1, y: 1 }
  const playerIndex = grid.data.indexOf(TILES.PLAYER)
  if (playerIndex >= 0)
    playerPos = {
      x: playerIndex % grid.width,
      y: Math.floor(playerIndex / grid.width),
    }

  return {
    grid,
    playerPos,
    nextLevel: data.nextLevel,
  }
}
