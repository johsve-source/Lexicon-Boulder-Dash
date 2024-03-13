import './Game.css'
import { createContext, useEffect, useRef, useState } from 'react'
import Block from './components/Generic'
import ControlsInfo from './components/ControlsInfo'
import Grid from './Grid'
import { useSoundManagerLogic } from './hooks/sound/useSoundManagerLogic'

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
  const soundManager = useSoundManagerLogic()
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
          if (directinTile === 'd') {
            soundManager.playInteraction('digging-dirt', {
              loop: false,
              id: 1,
              volume: 0.5,
            })
          }
        } else if (directinTile === 'i') {
          soundManager.playInteraction('collecting-diamond', {
            loop: false,
            id: 2,
            volume: 0.5,
          })
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
  }, [gameGrid, soundManager])

  useEffect(() => {
    function gravity() {
      const gameGridClone = gameGrid.clone()

      gameGridClone
        .toItterArray()
        .reverse()
        .filter(([block, , y]) => block === 's' && y < gameGridClone.height - 1)
        .filter(([, x, y]) => gameGridClone.get(x, y + 1) === 'n')
        .forEach(([, x, y]) => {
          gameGridClone.setRelativeCenter(x, y)
          gameGridClone.setRelative(0, 0, 'n')
          gameGridClone.setRelative(0, 1, 's')
        })

      setGameGrid(gameGridClone)
    }

    const gravityInterval = setInterval(() => {
      gravity()
    }, 50)

    return () => {
      clearInterval(gravityInterval)
      soundManager.clearSounds()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameGrid])

  function toImagePath(type: string | null) {
    if (type === 'b') {
      return '/textures/pixel/bedrock-2.png'
    } else if (type === 'd') {
      return '/textures/pixel/dirt.png'
    } else if (type === 's') {
      return '/textures/pixel/bedrock-boulder.png'
    } else if (type === 'i') {
      return '/textures/pixel/dirt-diamond.png'
    } else if (type === 'p') {
      return '/textures/pixel/player.gif'
    } else if (type === 'n') {
      return '/textures/pixel/bedrock.png'
    } else if (type === 'f') {
      return '/textures/pixel/finish.gif'
    } else {
      return '/textures/pixel/player.gif'
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
