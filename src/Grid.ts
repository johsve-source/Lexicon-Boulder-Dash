export class Grid<T> {
  width: number
  height: number
  data: T[]

  constructor(width: number = 0, height: number = 0) {
    this.width = width
    this.height = height
    this.data = new Array(width * height)
  }

  get(x: number, y: number) {
    return this.data[x + y * this.width]
  }

  set(x: number, y: number, value: T) {
    return (this.data[x + y * this.width] = value)
  }

  forEach(
    callbackfn: (element: T, x: number, y: number, grid: Grid<T>) => void,
  ) {
    for (let y = 0; y < this.height; y++)
      for (let x = 0; x < this.width; x++)
        callbackfn(this.get(x, y), x, y, this)
  }

  toItterArray(): [T, number, number, Grid<T>][] {
    const acc: [T, number, number, Grid<T>][] = new Array(this.data.length)

    this.forEach(
      (...params) => (acc[params[1] + params[2] * this.width] = params),
    )

    return acc
  }

  clone(): Grid<T> {
    const clone = new Grid<T>()
    clone.width = this.width
    clone.height = this.height
    clone.data = [...this.data]

    return clone
  }

  subGrid(x: number, y: number, width: number = 1, height: number = 1) {
    return new SubGrid(this, x, y, width, height)
  }
}

export class SubGrid<T> {
  parent: Grid<T>
  x: number
  y: number
  width: number
  height: number

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

  get(x: number, y: number) {
    return this.parent.get(this.x + x, this.y + y)
  }

  set(x: number, y: number, value: T) {
    return this.parent.set(this.x + x, this.y + y, value)
  }

  forEach(
    callbackfn: (element: T, x: number, y: number, grid: SubGrid<T>) => void,
  ) {
    for (let y = 0; y < this.height; y++)
      for (let x = 0; x < this.width; x++)
        callbackfn(this.get(x, y), x, y, this)
  }

  toItterArray(): [T, number, number, SubGrid<T>][] {
    const acc: [T, number, number, SubGrid<T>][] = new Array(
      this.width * this.height,
    )

    this.forEach(
      (...params) => (acc[params[1] + params[2] * this.width] = params),
    )

    return acc
  }

  subGrid(x: number, y: number, width: number = 1, height: number = 1) {
    return new SubGrid(this.parent, this.x + x, this.y + y, width, height)
  }
}

export default Grid
