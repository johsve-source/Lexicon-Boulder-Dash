import './Game.css'
import { createContext, useState, useEffect, useRef } from 'react'
import Block from './components/Generic'
import ControlsInfo from './components/ControlsInfo'
import { useSoundManagerLogic } from './hooks/sound/useSoundManagerLogic'
import { GetGameReducer, ActionEnum, loadLevel } from './GameState'
import { StartMenu } from './components/StartMenu'
// remove import after highscore caching is finished
import { highscoreTestData } from './assets/highscoreData'

export const PlayerContext = createContext<number[]>([])

export function Game() {
  const [isStartMenuVisible, setStartMenuVisible] = useState<boolean>(true)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [, setIsGameStarted] = useState<boolean>(false)

  const soundManager = useSoundManagerLogic()
  const [gameState, gameDispatch] = GetGameReducer()

  function handlePlayClick() {
    setStartMenuVisible(false)
    setIsGameStarted(true)
    // add "isGameStarted" state update, ie. start timer, score count etc.

    // Play ambiance when I press play
    soundManager.playInteraction('ambiance', {
      id: 7,
      volume: 0.2,
      loop: true,
      trailing: true,
    })
  }

  useEffect(() => {
    const loadLevelCallback = (path: string) => {
      loadLevel(gameDispatch, path)
    }
    const keyPress = (e: KeyboardEvent) => {
      console.log(e.code)
      if (e.code === 'ArrowUp' || e.code === 'KeyW') {
        e.preventDefault()
        gameDispatch({
          type: ActionEnum.MOVE_UP,
          soundManager,
          loadLevelCallback,
        })
      } else if (e.code === 'ArrowDown' || e.code === 'KeyS') {
        e.preventDefault()
        gameDispatch({
          type: ActionEnum.MOVE_DOWN,
          soundManager,
          loadLevelCallback,
        })
      } else if (e.code === 'ArrowRight' || e.code === 'KeyD') {
        e.preventDefault()
        gameDispatch({
          type: ActionEnum.MOVE_RIGHT,
          soundManager,
          loadLevelCallback,
        })
      } else if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
        e.preventDefault()
        gameDispatch({
          type: ActionEnum.MOVE_LEFT,
          soundManager,
          loadLevelCallback,
        })
      }
    }
    /* if (gameState.playerPos.y > gameState.grid.height / 2) {
      window.scrollTo({
        top:
          gameState.playerPos.y +
          (32 / gameState.grid.height) * window.innerHeight,
        left:
          (gameState.playerPos.x / gameState.grid.width) * window.innerWidth,
        behavior: 'auto',
      })
    } else {
      window.scrollTo({
        top:
          gameState.playerPos.y -
          (32 / gameState.grid.height) * window.innerHeight,
        left:
          (gameState.playerPos.x / gameState.grid.width) * window.innerWidth,
        behavior: 'auto',
      })
    } */

    window.addEventListener('keydown', keyPress)

    return () => {
      window.removeEventListener('keydown', keyPress)
    }
  })

  const storedGrid = useRef(gameState.grid)
  const gravityQueued = useRef(false)

  useEffect(() => {
    async function gravity() {
      if (!gravityQueued.current) {
        gravityQueued.current = true
        setTimeout(() => {
          gravityQueued.current = false
          if (storedGrid.current !== gameState.grid) {
            gameDispatch({ type: ActionEnum.TIME_STEP, soundManager })
            storedGrid.current = gameState.grid
          }
        }, 200)
      }
    }
    gravity()
  })

  const [renderGrid, setRenderGrid] = useState(gameState.grid.subGrid(0, 0))

  useEffect(() => {
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

    setRenderGrid(gameState.grid.subGrid(x, y, width, height))

    const cameraX = gameState.playerPos.x * 32 - window.innerWidth / 2
    const cameraY = gameState.playerPos.y * 32 - window.innerHeight / 2

    window.scrollTo({
      left: cameraX,
      top: cameraY,
      behavior: 'instant',
      //behavior: 'smooth',
    })
  }, [
    gameState.grid,
    gameState.playerPos.x,
    gameState.playerPos.y,
    setRenderGrid,
  ])

  return (
    <>
      {isStartMenuVisible ? (
        <StartMenu
          onPlayClick={handlePlayClick}
          highscores={highscoreTestData}
         
        />
      ) : (
        <div
          className="Game"
          style={{
            width: `${gameState.grid.width * 32}px`,
            height: `${gameState.grid.height * 32}px`,
            gridTemplateColumns: `repeat(${gameState.grid.width},1fr)`,
            gridTemplateRows: `repeat(${gameState.grid.height},1fr)`,
          }}
        >
          <ControlsInfo />

          {renderGrid.toItterArray().map(([tile, x, y, grid]) => (
            <Block
              key={grid.x + x + (grid.y + y) * grid.width}
              x={1 + grid.y + y}
              y={1 + grid.x + x}
              image={tile.texture}
            />
          ))}
        </div>
      )}
    </>
  )
}

export default Game
