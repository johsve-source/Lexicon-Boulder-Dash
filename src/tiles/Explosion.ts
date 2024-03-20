import { TILES, TileList, onPhysicsParams } from './Tiles'

export function explode(
  { local, updateLocal }: onPhysicsParams,
  x: number = 0,
  y: number = 0,
  radius: number = 1,
) {
  for (let iy = y - radius; iy <= y + radius; iy++)
    for (let ix = x - radius; ix <= x + radius; ix++)
      if (local.get(ix, iy) !== TILES.BEDROCK) {
        local.set(ix, iy, TILES.EXPLOSION)
        updateLocal(ix + x, iy + y)
      }
}

const EXPORT: TileList = {
  EXPLOSION: {
    name: 'EXPLOSION',
    texture: '/textures/pixel/boom.gif',

    onPhysics: ({ local, updateLocal }) => {
      local.set(0, 0, TILES.NOTHING)
      updateLocal(-1, -1, 3, 3)
    },
  },
}

export default EXPORT
