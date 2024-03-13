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
  grid.toItterArray().forEach(([_, x, y]) => grid.set(x, y, gridData[y][x]))

  return grid
}

export function Game() {
  // prettier-ignore
  const [blocks, setBlocks] = useState([
        "b", "b", "b", "b", "b", "b", "b", "b", "b", "b",
        "b", "p", "s", "n", "d", "d", "d", "d", "d", "b",
        "b", "d", "d", "d", "d", "d", "d", "d", "d", "b",
        "b", "d", "d", "s", "s", "s", "d", "i", "d", "b",
        "b", "d", "i", "d", "d", "d", "d", "d", "d", "b",
        "b", "d", "d", "d", "d", "d", "i", "d", "d", "b",
        "b", "d", "d", "d", "d", "d", "d", "d", "d", "b",
        "b", "s", "s", "s", "d", "d", "d", "d", "d", "b",
        "b", "d", "d", "d", "d", "d", "d", "d", "f", "b",
        "b", "b", "b", "b", "b", "b", "b", "b", "b", "b",
    ]);

  // Init empty Game Grid Board (10 x 10)
  //const [gameGrid, setGameGrid] = useState(new Grid<string>(10, 10));
  const position2 = useRef([1, 1])
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

  // starting player coordinates
  const position = useRef(11)

  function gravity() {
    setBlocks((prevBlocks: string[]) => {
      const newBlocks = [...prevBlocks]

      for (let i = newBlocks.length - 1; i >= 0; i--) {
        if (
          newBlocks[i] === 's' &&
          i + 10 < newBlocks.length &&
          newBlocks[i + 10] === 'n'
        ) {
          newBlocks[i + 10] = 's'
          newBlocks[i] = 'n'
        }
      }

      return newBlocks
    })
  }

  // updates player coordinates on keypress, eventListener is added and removed on render
  useEffect(() => {
    const keyPress = (e: KeyboardEvent) => {
      console.log(e.code)

      function handleMove2(
        x: number,
        y: number,
        directionX: number,
        directionY: number,
      ) {
        const gameGrid2 = gameGrid.clone()
        gameGrid2.setRelativeCenter(x, y)
        const centerTile = gameGrid2.getRelative(0, 0)
        const directinTile = gameGrid2.getRelative(directionX, directionY)

        if (directinTile === 'b') {
          return
        } else if (directinTile === 'd' || directinTile === 'n') {
          gameGrid2.setRelative(directionX, directionY, centerTile)
          gameGrid2.setRelative(0, 0, 'n')
          position2.current = [
            position2.current[0] + directionX,
            position2.current[1] + directionY,
          ]
        } else if (directinTile === 'i') {
          gameGrid2.setRelative(directionX, directionY, centerTile)
          gameGrid2.setRelative(0, 0, 'n')
          position2.current = [
            position2.current[0] + directionX,
            position2.current[1] + directionY,
          ]
        } else if (directinTile === 'f') {
          alert('WE HAVE A WINNER!')
        } else if (
          directinTile === 's' &&
          directionX === 1 &&
          gameGrid2.getRelative(2, 0) === 'n'
        ) {
          // right
          gameGrid2.setRelative(directionX, directionY, centerTile)
          gameGrid2.setRelative(directionX + 1, directionY, 's')
          gameGrid2.setRelative(0, 0, 'n')
          position2.current = [
            position2.current[0] + directionX,
            position2.current[1] + directionY,
          ]
        } else if (
          directinTile === 's' &&
          directionX === -1 &&
          gameGrid2.getRelative(-2, 0) === 'n'
        ) {
          // left
          gameGrid2.setRelative(directionX, directionY, centerTile)
          gameGrid2.setRelative(directionX - 1, directionY, 's')
          gameGrid2.setRelative(0, 0, 'n')
          position2.current = [
            position2.current[0] + directionX,
            position2.current[1] + directionY,
          ]
        }

        setGameGrid(gameGrid2)
      }

      function handleMove(delta: number, direction: number) {
        const newBlocks = [...blocks]
        const copy = newBlocks[position.current + delta]

        if (copy === 'b') {
          return
        } else if (copy === 'd' || copy === 'n') {
          newBlocks[position.current + delta] = newBlocks[position.current]
          newBlocks[position.current] = 'n'
          position.current += delta
        } else if (copy === 'i') {
          newBlocks[position.current + delta] = newBlocks[position.current]
          newBlocks[position.current] = 'n'
          position.current += delta
        } else if (copy === 'f') {
          alert('WE HAVE A WINNER!')
        } else if (
          copy === 's' &&
          direction === 1 &&
          newBlocks[position.current + delta + 1] === 'n'
        ) {
          // right
          newBlocks[position.current + delta] = newBlocks[position.current]
          newBlocks[position.current + delta + 1] = 's'
          newBlocks[position.current] = 'n'
          position.current += delta
        } else if (
          copy === 's' &&
          direction === 2 &&
          newBlocks[position.current + delta - 1] === 'n'
        ) {
          // left
          newBlocks[position.current + delta] = newBlocks[position.current]
          newBlocks[position.current + delta - 1] = 's'
          newBlocks[position.current] = 'n'
          position.current += delta
        }
        setBlocks(newBlocks)
      }
      /* if (e.code === 'ArrowUp' || e.code === 'KeyW') {
        handleMove(-10, 0)
      } else if (e.code === 'ArrowDown' || e.code === 'KeyS') {
        handleMove(10, 0)
      } else if (e.code === 'ArrowRight' || e.code === 'KeyD') {
        handleMove(1, 1)
      } else if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
        handleMove(-1, 2)
      } */

      if (e.code === 'ArrowUp' || e.code === 'KeyW') {
        handleMove2(position2.current[0], position2.current[1], 0, -1, 0)
      } else if (e.code === 'ArrowDown' || e.code === 'KeyS') {
        handleMove2(position2.current[0], position2.current[1], 0, 1, 0)
      } else if (e.code === 'ArrowRight' || e.code === 'KeyD') {
        handleMove2(position2.current[0], position2.current[1], 1, 0, 1)
      } else if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
        handleMove2(position2.current[0], position2.current[1], -1, 0, 2)
      }
    }
    window.addEventListener('keydown', keyPress)

    return () => {
      window.removeEventListener('keydown', keyPress)
    }
  }, [blocks, gameGrid])

  useEffect(() => {
    function gravity2() {
      const gameGrid2 = gameGrid.clone()

      gameGrid2
        .toItterArray()
        .reverse()
        .filter(([block, _, y]) => block === 's' && y < gameGrid2.height - 1)
        .filter(([_, x, y]) => gameGrid2.get(x, y + 1) === 'n')
        .forEach(([block, x, y]) => {
          gameGrid2.setRelativeCenter(x, y)
          gameGrid2.setRelative(0, 0, 'n')
          gameGrid2.setRelative(0, 1, 's')
        })

      setGameGrid(gameGrid2)
    }

    const gravityInterval = setInterval(() => {
      //gravity()
      gravity2()
    }, 50)

    return () => {
      clearInterval(gravityInterval)
    }
  }, [blocks, gameGrid])

  function toImagePath(type: string) {
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
      return '/player.png'
    }
  }

  return (
    <div className="Game">
      <ControlsInfo />
      {/*
      {blocks.map((key: string, index: number) => (
        <Block
          key={index}
          x={(index + 1) % 10}
          y={(index + 1) / 10}
          image={toImagePath(key)}
        />
      ))}
      */}
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
