import './Game.css'
import { createContext, useState, useEffect, useReducer } from 'react'
import Block from './components/Generic'
import ControlsInfo from './components/ControlsInfo'
import Grid from './Grid'
import { useSoundManagerLogic } from './hooks/sound/useSoundManagerLogic'
import { gameReducer, ActionEnum } from './GameState'
import { StartMenu } from './components/StartMenu'
// remove import after highscore caching is finished
import { highscoreTestData } from './assets/highscoreData'

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
  const [isStartMenuVisible, setStartMenuVisible] = useState<boolean>(true)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isGameStarted, setIsGameStarted] = useState<boolean>(false)

  const soundManager = useSoundManagerLogic()
  const [gameState, gameDispatch] = useReducer(gameReducer, {
    grid: parseMap(`
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
    playerPos: { x: 1, y: 1 },
    time: 0,
    score: 0,
  })

  function handlePlayClick() {
    setStartMenuVisible(false)
    setIsGameStarted(true)
    // add "isGameStarted" state update, ie. start timer, score count etc.

    // Play ambiance when I press play
    soundManager.playInteraction('ambiance', {
      id: 5,
      volume: 0.2,
      loop: true,
    })
  }

  useEffect(() => {
    const keyPress = (e: KeyboardEvent) => {
      console.log(e.code)

      if (e.code === 'ArrowUp' || e.code === 'KeyW') {
        gameDispatch({ type: ActionEnum.MOVE_UP, soundManager })
      } else if (e.code === 'ArrowDown' || e.code === 'KeyS') {
        gameDispatch({ type: ActionEnum.MOVE_DOWN, soundManager })
      } else if (e.code === 'ArrowRight' || e.code === 'KeyD') {
        gameDispatch({ type: ActionEnum.MOVE_RIGHT, soundManager })
      } else if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
        gameDispatch({ type: ActionEnum.MOVE_LEFT, soundManager })
      }
    }
    window.addEventListener('keydown', keyPress)

    return () => {
      window.removeEventListener('keydown', keyPress)
    }
  }, [gameDispatch, soundManager])

  useEffect(() => {
    const gravityInterval = setInterval(() => {
      gameDispatch({ type: ActionEnum.TIME_STEP, soundManager })
    }, 100)

    return () => {
      clearInterval(gravityInterval)
      soundManager.clearSounds()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [/* gameGrid */ gameDispatch])

  function toImagePath(type: string | null) {
    if (type === 'b') {
      return '/textures/pixel/bedrock-2.png'
    } else if (type === 'd') {
      return '/textures/pixel/dirt.png'
    } else if (type === 's') {
      return '/textures/pixel/dirt-boulder.png'
    } else if (type === 'S') {
      return '/textures/pixel/bedrock-boulder.png'
    } else if (type === '!') {
      return '/textures/pixel/bedrock-boulder.png'
    } else if (type === '*') {
      return '/textures/pixel/boom.gif'
    } else if (type === 'i') {
      return '/textures/pixel/dirt-diamond.png'
    } else if (type === 'I') {
      return '/textures/pixel/bedrock-diamond.png'
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
    <>
      {isStartMenuVisible ? (
        <StartMenu
          onPlayClick={handlePlayClick}
          highscores={highscoreTestData}
        />
      ) : (
        <div className="Game">
          <ControlsInfo />

          {gameState.grid.toItterArray().map(([block, x, y, grid]) => (
            <Block
              key={x + y * grid.width}
              x={1 + y}
              y={1 + x}
              image={toImagePath(block)}
            />
          ))}
        </div>
      )}
    </>
  )
}

export default Game
