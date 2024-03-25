import { GameState } from './GameState'

/**The _Grid_ class stores and handles data in a 2 dimentional space. */
export class Grid<T> {
  /**The _width_ of the grid. */
  width: number
  /**The _height_ of the grid. */
  height: number
  /**The data stored in the grid. */
  data: T[]

  /**Creates a new _Grid_. */
  constructor(width: number = 0, height: number = 0) {
    this.width = width
    this.height = height
    this.data = new Array(width * height)
  }

  /**Gets the grid data at **x** **y**. */
  get(x: number, y: number) {
    return this.data[x + y * this.width]
  }

  /**Sets the grid data at **x** **y**. */
  set(x: number, y: number, value: T) {
    return (this.data[x + y * this.width] = value)
  }

  /**Runs the _callback_ function on all entries of the _Grid_ with **element**, **x**, **y** and **Grid**.
   *
   * Similar to `array.forEach`.
   */
  forEach(
    callbackfn: (element: T, x: number, y: number, grid: Grid<T>) => void,
  ) {
    for (let y = 0; y < this.height; y++)
      for (let x = 0; x < this.width; x++)
        callbackfn(this.get(x, y), x, y, this)
  }

  /** Returns a array with all entries of the _Grid_ with **element**, **x**, **y** and **Grid**. */
  toItterArray(): [T, number, number, Grid<T>][] {
    const acc: [T, number, number, Grid<T>][] = new Array(this.data.length)

    this.forEach(
      (...params) => (acc[params[1] + params[2] * this.width] = params),
    )

    return acc
  }

  /**Creates a shallow clone of the grid. */
  clone(): Grid<T> {
    const clone = new Grid<T>()
    clone.width = this.width
    clone.height = this.height
    clone.data = [...this.data]

    return clone
  }

  /**Returns a _SubGrid_ of the grid. */
  subGrid(x: number, y: number, width: number = 1, height: number = 1) {
    return new SubGrid(this, x, y, width, height)
  }

  /**
   * Creates a subgrid and updates camera position to view it.
   * @param gameState The current gamestate
   * @returns A subgrid based on the gamestate
   */
  subGridViewFromGameState(gameState: GameState) {
    const width = Math.min(
      Math.ceil(window.innerWidth / 32) + 2,
      gameState.grid.width,
    )
    const height = Math.min(
      Math.ceil(window.innerHeight / 32) + 2,
      gameState.grid.height,
    )

    const x = Math.max(
      Math.min(
        Math.floor(gameState.playerPos.x - Math.ceil(width / 2)),
        gameState.grid.width - width,
      ),
      0,
    )
    const y = Math.max(
      Math.min(
        Math.floor(gameState.playerPos.y - Math.ceil(height / 2)),
        gameState.grid.height - height,
      ),
      0,
    )

    const cameraX = gameState.playerPos.x * 32 - window.innerWidth / 2
    const cameraY = gameState.playerPos.y * 32 - window.innerHeight / 2

    window.scrollTo({
      left: cameraX,
      top: cameraY,
      behavior: 'instant',
      //behavior: 'smooth',
    })

    return this.subGrid(x, y, width, height)
  }
}

/**The _SubGrid_ class provides a more convenient way of access a subregion of a _Grid_. */
export class SubGrid<T> {
  /**The parent grid. */
  parent: Grid<T>

  /**The _SubGrid_ **x** coordinates in the parent grid. */
  x: number
  /**The _SubGrid_ **y** coordinates in the parent grid. */
  y: number

  /**The width of the _SubGrid_. */
  width: number
  /**The height of the _SubGrid_. */
  height: number

  /**Creates a new _SubGrid_. */
  constructor(
    parent: Grid<T>,
    x: number,
    y: number,
    width: number = 1,
    height: number = 1,
  ) {
    this.parent = parent
    this.x = x
    this.y = y
    this.width = width
    this.height = height
  }

  /**Gets the subgrid data at **x** **y**. */
  get(x: number, y: number) {
    return this.parent.get(this.x + x, this.y + y)
  }

  /**Sets the subgrid data at **x** **y**. */
  set(x: number, y: number, value: T) {
    return this.parent.set(this.x + x, this.y + y, value)
  }

  /**Runs the _callback_ function on all entries of the _SubGrid_ with **element**, **x**, **y** and **SubGrid**.
   *
   * Similar to `array.forEach`.
   */
  forEach(
    callbackfn: (element: T, x: number, y: number, grid: SubGrid<T>) => void,
  ) {
    for (let y = 0; y < this.height; y++)
      for (let x = 0; x < this.width; x++)
        callbackfn(this.get(x, y), x, y, this)
  }

  /** Returns a array with all entries of the _SubGrid_ with **element**, **x**, **y** and **SubGrid**. */
  toItterArray(): [T, number, number, SubGrid<T>][] {
    const acc: [T, number, number, SubGrid<T>][] = new Array(
      this.width * this.height,
    )

    this.forEach(
      (...params) => (acc[params[1] + params[2] * this.width] = params),
    )

    return acc
  }

  /**Returns a new _SubGrid_ of the subgrid. */
  subGrid(x: number, y: number, width: number = 1, height: number = 1) {
    return new SubGrid(this.parent, this.x + x, this.y + y, width, height)
  }
}

export default Grid
