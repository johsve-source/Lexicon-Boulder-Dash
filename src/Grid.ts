class Grid<T> {
  width: number
  height: number
  //data: T[][]
  data: T[]

  relativeX: number = 0
  relativeY: number = 0

  constructor(width: number, height: number) {
    this.width = width
    this.height = height
    this.data = new Array(width * height)
    /* this.data = new Array(width)
    for (let x = 0; x < width; x++) this.data[x] = new Array(height) */
  }

  get(x: number, y: number) {
    return this.data[x + y * this.width]
    /* if (x < 0 && x >= this.width) return undefined
    if (y < 0 && y >= this.height) return undefined

    return this.data[x][y] */
  }

  set(x: number, y: number, value: T) {
    return (this.data[x + y * this.width] = value)
    /* if (x < 0 && x >= this.width) return undefined
    if (y < 0 && y >= this.height) return undefined

    return (this.data[x][y] = value) */
  }

  setRelativeCenter(x: number, y: number) {
    this.relativeX = x
    this.relativeY = y

    return this
  }

  getRelativeCenter() {
    return [this.relativeX, this.relativeY]
  }

  getRelative(x: number, y: number) {
    return this.get(this.relativeX + x, this.relativeY + y)
  }

  setRelative(x: number, y: number, value: T) {
    return this.set(this.relativeX + x, this.relativeY + y, value)
  }

  toItterArray(): [T, number, number, Grid<T>][] {
    /* const acc: [T, number, number, Grid<T>][] = []

    for (let y = 0; y < this.height; y++)
      for (let x = 0; x < this.width; x++)
        acc.push([this.data[x][y], x, y, this]) */

    const acc: [T, number, number, Grid<T>][] = new Array(this.data.length)

    for (let y = 0; y < this.height; y++)
      for (let x = 0; x < this.width; x++)
        acc[x + y * this.width] = [this.data[x + y * this.width], x, y, this]

    return acc
  }

  clone(): Grid<T> {
    const clone = new Grid<T>(0, 0)
    clone.width = this.width
    clone.height = this.height
    /* clone.data = this.data.map((col) => [...col]) */
    clone.data = [...this.data]

    return clone
  }
}

export default Grid
