import './Game.css'
import { createContext, useEffect, useRef, useState } from 'react'
import Block from './components/Generic'
import ControlsInfo from './components/ControlsInfo'
import Grid from './Grid'

export const PlayerContext = createContext<number[]>([])

function parseMap(data: string) {
  const gridData = data
    .split('\n')
    .filter((e) => e.length > 0)
    .map((e) => [...e])

  const height = gridData.length
  const width = gridData.reduce((acc, row) => Math.max(acc, row.length), 0)

  const grid = new Grid<string>(width, height)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  grid.toItterArray().forEach(([_, x, y]) => grid.set(x, y, gridData[y][x]))

  return grid
}

export function Game() {
  // Init empty Game Grid Board (10 x 10)
  //const [gameGrid, setGameGrid] = useState(new Grid<string>(10, 10));
  const position = useRef([1, 1])
  const [gameGrid, setGameGrid] = useState(new Grid<string>(0, 0))

  useEffect(() => {
    setGameGrid(
      parseMap(`
      bbbbbbbbbb
      bpsndddddb
      bddddddddb
      bddsssdidb
      bdiddddddb
      bdddddiddb
      bddddddddb
      bsssdddddb
      bdddddddfb
      bbbbbbbbbb
`),
    )
  }, [])

  /* blocks.forEach((e, i) => {
    gameGrid.set(i % gameGrid.width, Math.floor(i / gameGrid.width)), e
  }) */

  // updates player coordinates on keypress, eventListener is added and removed on render
  useEffect(() => {
    const keyPress = (e: KeyboardEvent) => {
      console.log(e.code)

      function handleMove(
        x: number,
        y: number,
        directionX: number,
        directionY: number,
      ) {
        const gameGridClone = gameGrid.clone()
        gameGridClone.setRelativeCenter(x, y)
        const centerTile = gameGridClone.getRelative(0, 0) ?? 'default'
        const directinTile =
          gameGridClone.getRelative(directionX, directionY) ?? 'default'

        if (directinTile === 'b') {
          return
        } else if (directinTile === 'd' || directinTile === 'n') {
          gameGridClone.setRelative(directionX, directionY, centerTile)
          gameGridClone.setRelative(0, 0, 'n')
          position.current = [
            position.current[0] + directionX,
            position.current[1] + directionY,
          ]
        } else if (directinTile === 'i') {
          gameGridClone.setRelative(directionX, directionY, centerTile)
          gameGridClone.setRelative(0, 0, 'n')
          position.current = [
            position.current[0] + directionX,
            position.current[1] + directionY,
          ]
        } else if (directinTile === 'f') {
          alert('WE HAVE A WINNER!')
        } else if (
          directinTile === 's' &&
          directionX === 1 &&
          gameGridClone.getRelative(2, 0) === 'n'
        ) {
          // right
          gameGridClone.setRelative(directionX, directionY, centerTile)
          gameGridClone.setRelative(directionX + 1, directionY, 's')
          gameGridClone.setRelative(0, 0, 'n')
          position.current = [
            position.current[0] + directionX,
            position.current[1] + directionY,
          ]
        } else if (
          directinTile === 's' &&
          directionX === -1 &&
          gameGridClone.getRelative(-2, 0) === 'n'
        ) {
          // left
          gameGridClone.setRelative(directionX, directionY, centerTile)
          gameGridClone.setRelative(directionX - 1, directionY, 's')
          gameGridClone.setRelative(0, 0, 'n')
          position.current = [
            position.current[0] + directionX,
            position.current[1] + directionY,
          ]
        }

        setGameGrid(gameGridClone)
      }

      if (e.code === 'ArrowUp' || e.code === 'KeyW') {
        handleMove(position.current[0], position.current[1], 0, -1)
      } else if (e.code === 'ArrowDown' || e.code === 'KeyS') {
        handleMove(position.current[0], position.current[1], 0, 1)
      } else if (e.code === 'ArrowRight' || e.code === 'KeyD') {
        handleMove(position.current[0], position.current[1], 1, 0)
      } else if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
        handleMove(position.current[0], position.current[1], -1, 0)
      }
    }
    window.addEventListener('keydown', keyPress)

    return () => {
      window.removeEventListener('keydown', keyPress)
    }
  }, [gameGrid])

  useEffect(() => {
    function gravity() {
      const gameGrid2 = gameGrid.clone()

      gameGrid2
        .toItterArray()
        .reverse()
        .filter(([block, , y]) => block === 's' && y < gameGrid2.height - 1)
        .filter(([, x, y]) => gameGrid2.get(x, y + 1) === 'n')
        .forEach(([, x, y]) => {
          gameGrid2.setRelativeCenter(x, y)
          gameGrid2.setRelative(0, 0, 'n')
          gameGrid2.setRelative(0, 1, 's')
        })

      setGameGrid(gameGrid2)
    }

    const gravityInterval = setInterval(() => {
      gravity()
    }, 50)

    return () => {
      clearInterval(gravityInterval)
    }
  }, [gameGrid])

  function toImagePath(type: string | null) {
    if (type === 'b') {
      return '/textures/bedrock/bedrock.png'
    } else if (type === 'd') {
      return '/textures/dirt/dirt.png'
    } else if (type === 's') {
      return '/textures/boulders/boulder.png'
    } else if (type === 'i') {
      return '/sprites/gems/sapphire.png'
    } else if (type === 'p') {
      return '/sprites/player/player.png'
    } else if (type === 'n') {
      return '/textures/bedrock/bedrock-2.png'
    } else if (type === 'f') {
      return '/finish.png'
    } else {
      return '/default.png'
    }
  }

  return (
    <div className="Game">
      <ControlsInfo />
      {gameGrid.toItterArray().map(([block, x, y]) => (
        <Block
          key={x + y * gameGrid.width}
          x={1 + y}
          y={1 + x}
          image={toImagePath(block)}
        />
      ))}
    </div>
  )
}

export default Game
