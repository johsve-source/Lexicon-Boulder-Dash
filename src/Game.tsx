import './Game.css'
import { createContext, useState, useEffect, useRef } from 'react'
import Block from './components/Generic'
import ControlsInfo from './components/ControlsInfo'
import { useSoundManagerLogic } from './hooks/sound/useSoundManagerLogic'
import { GetGameReducer, ActionEnum, loadLevel } from './GameState'
import { StartMenu } from './components/StartMenu'
import { useHighscoreCounter } from './hooks/highscore/useHighscoreCounter'
import {
  DEFAULT_KEY_NAME,
  loadHighscoresFromLocal,
} from './hooks/highscore/modules/highscore'

export const PlayerContext = createContext<number[]>([])

export function Game() {
  const { highscores, updateHighscores, resetHighscores, loadPlayerHighscore } =
    useHighscoreCounter()
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

  useEffect(() => {
    // Load highscores from local storage on component mount
    const storedHighscores = localStorage.getItem(DEFAULT_KEY_NAME)
    if (storedHighscores) {
      try {
        const decryptedHighscores = loadHighscoresFromLocal(storedHighscores)
        updateHighscores(decryptedHighscores.map((entry) => entry.score))
      } catch (error) {
        console.error('Error loading highscores:', error.message)
      }
    }
  }, [updateHighscores])

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
              image={block.texture}
            />
          ))}
        </div>
      )}
    </>
  )
}

export default Game
