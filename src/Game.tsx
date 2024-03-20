import './Game.css'
import { createContext, useState, useEffect, useRef } from 'react'
import Block from './components/Generic'
import ControlsInfo from './components/ControlsInfo'
import { useSoundManagerLogic } from './hooks/sound/useSoundManagerLogic'
import { GetGameReducer, ActionEnum, loadLevel } from './GameState'
import { StartMenu } from './components/StartMenu'
// remove import after highscore caching is finished
import { highscoreTestData } from './assets/highscoreData'
import { GameInfo } from './components/GameInfo'

export const PlayerContext = createContext<number[]>([])

export function Game() {
  const soundManager = useSoundManagerLogic()
  const [gameState, gameDispatch] = GetGameReducer()
  const [isStartMenuVisible, setStartMenuVisible] = useState<boolean>(true)
  const [isGameStarted, setIsGameStarted] = useState<boolean>(false)
  const [startTime, setStartTime] = useState<number>(0)

  // triggers 'start timer' useEffect
  function startGame() {
    setStartMenuVisible(false)
    setIsGameStarted(true)
    setStartTime(Date.now())
  }

  // start timer
  useEffect(() => {
    if (!isStartMenuVisible && isGameStarted) {
      
    }
  }, [])

  useEffect(() => {
    const loadLevelCallback = (path: string) => {
      loadLevel(gameDispatch, path)
    }
    if (gameState.isGameOver) {
      return;
    }

    const keyPress = (e: KeyboardEvent) => {
      // console.log(e.code)

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
    if (gameState.playerPos.y > gameState.grid.height / 2) {
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
    }

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
            gameDispatch({ type: ActionEnum.PHYSICS_TICK, soundManager })
            storedGrid.current = gameState.grid
          }
        }, 200)
      }
    }
    gravity()
  })

  return (
    <>
      {isStartMenuVisible ? (
        <StartMenu onPlayClick={startGame} highscores={highscoreTestData} />
      ) : (
        <>
          <GameInfo timeRemaining={gameState.time} score={0} />
          <div className="Game">
            <ControlsInfo />

            {gameState.grid.toItterArray().map(([block, x, y, grid]) => (
              <Block
                key={x + y * grid.width}
                x={1 + y}
                y={1 + x}
                image={block.texture}
              />
            ))}
          </div>
        </>
      )}
    </>
  )
}

export default Game
