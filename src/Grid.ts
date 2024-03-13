class Grid<T> {
  width: number
  height: number
  data: T[][]

  relativeX: number = 0
  relativeY: number = 0

  constructor(width: number, height: number) {
    this.width = width
    this.height = height
    this.data = Array(width).map(() => Array(height))
  }

  get(x: number, y: number, outsideVal: T | null = null) {
    if (x < 0 && x >= this.width) return outsideVal
    if (y < 0 && y >= this.height) return outsideVal

    return this.data[x][y]
  }

  set(x: number, y: number, value: T, outsideVal: T | null = null) {
    if (x < 0 && x >= this.width) return outsideVal
    if (y < 0 && y >= this.height) return outsideVal

    return (this.data[x][y] = value)
  }

  setRelativeCenter(x: number, y: number) {
    this.relativeX = x
    this.relativeY = y

    return this
  }

  getRelativeCenter() {
    return [this.relativeX, this.relativeY]
  }

  getRelative(x: number, y: number, outsideVal: T | null = null) {
    return this.get(this.relativeX + x, this.relativeY + y, outsideVal)
  }

  setRelative(x: number, y: number, value: T, outsideVal: T | null = null) {
    return this.set(this.relativeX + x, this.relativeY + y, value, outsideVal)
  }

  toItterArray(): [T, number, number, Grid<T>][] {
    const acc: [T, number, number, Grid<T>][] = []

    this.data.forEach((coll, x) =>
      coll.forEach((e, y) => acc.push([e, x, y, this])),
    )

    return acc
  }
}

export default Grid
