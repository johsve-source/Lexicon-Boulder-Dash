import { SubGrid } from '../Grid'
import { TILES, Tile, TileList } from './Tiles'

export function explode(
  grid: SubGrid<Tile>,
  updateCords: (x: number, y: number, width?: number, height?: number) => void,
  x: number = 0,
  y: number = 0,
) {
  for (let iy = y - 1; iy <= y + 1; iy++)
    for (let ix = x - 1; ix <= x + 1; ix++)
      if (grid.get(ix, iy) !== TILES.BEDROCK) {
        grid.set(ix, iy, TILES.EXPLOSION)
        updateCords(ix + x, iy + y)
      }
}

const EXPORT: TileList = {
  EXPLOSION: {
    name: 'EXPLOSION',
    texture: '/textures/pixel/boom.gif',

    onPhysics: ({ local, updateLocal /* , soundList */ }) => {
      local.set(0, 0, TILES.NOTHING)
      updateLocal(-1, -1, 3, 3)
      //soundList.explosion = true
    },
  },
}

export default EXPORT
