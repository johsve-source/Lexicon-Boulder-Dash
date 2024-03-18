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
  const loadLevelCallback = (path: string) => {
    loadLevel(gameDispatch, path)
  }
  useEffect(() => {
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

  const storedGrid = useRef(gameState.grid)

  useEffect(() => {
    async function gravity() {
      setTimeout(() => {
        if (storedGrid.current !== gameState.grid) {
          gameDispatch({ type: ActionEnum.TIME_STEP, soundManager })
          storedGrid.current = gameState.grid
        }
      }, 200)
    }
    gravity()
  }, [gameDispatch, gameState, soundManager])


  const mouseMoving = useRef(false)
  const mouseMovement = useRef({x: 0, y: 0})
  useEffect(() => {
    const handler = () => {
      if (!mouseMoving.current) return;
      if (mouseMovement.current.y > 0 && Math.abs(mouseMovement.current.y) > Math.abs(mouseMovement.current.x)) {
        gameDispatch({
          type: ActionEnum.MOVE_UP,
          soundManager,
          loadLevelCallback,
        })
      } else if (mouseMovement.current.y < 0 && Math.abs(mouseMovement.current.y) > Math.abs(mouseMovement.current.x)) {
        gameDispatch({
          type: ActionEnum.MOVE_DOWN,
          soundManager,
          loadLevelCallback,
        })
      } else if (mouseMovement.current.x > 0 && Math.abs(mouseMovement.current.x) > Math.abs(mouseMovement.current.y)) {
        gameDispatch({
          type: ActionEnum.MOVE_RIGHT,
          soundManager,
          loadLevelCallback,
        })
      } else if (mouseMovement.current.x < 0 && Math.abs(mouseMovement.current.x) > Math.abs(mouseMovement.current.y)) {
        gameDispatch({
          type: ActionEnum.MOVE_LEFT,
          soundManager,
          loadLevelCallback,
        })
      }
      setTimeout(() => {
        handler()
      }, 200)
    }

    const mouseMove = (e: MouseEvent) => {
      mouseMovement.current = {x: e.movementX, y: e.movementY}
    }
    const mouseDown = () => {
      console.log("down")
      mouseMoving.current = true
      window.addEventListener("mousemove", mouseMove)
      handler()
    }
    const mouseUp = () => {
      console.log("up")
      mouseMoving.current = false
      window.removeEventListener("mousemove", mouseMove)
    }

    if (mouseMoving.current) {
      window.addEventListener("mousemove", mouseMove)
    }
    window.addEventListener("mousedown", mouseDown)
    window.addEventListener("mouseup", mouseUp)

    return () => {
      window.removeEventListener("mousedown", mouseDown)
      window.removeEventListener("mouseup", mouseUp)
      window.removeEventListener("mousemove", mouseMove)
    }
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
