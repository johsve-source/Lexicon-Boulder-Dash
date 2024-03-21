import './Game.css'
import { createContext, useState, useEffect, useRef } from 'react'
import Block from './components/Generic'
import ControlsInfo from './components/ControlsInfo'
import { useSoundManagerLogic } from './hooks/sound/useSoundManagerLogic'
import { GetGameReducer, ActionEnum, loadLevel } from './GameState'
import { StartMenu } from './components/StartMenu'
// remove import after highscore caching is finished
import { highscoreTestData } from './assets/highscoreData'
import NameInput from './components/nameInput/NameInput'
import { GameInfo } from './components/GameInfo'

export const PlayerContext = createContext<number[]>([])

export function Game() {
  const [gameState, gameDispatch] = GetGameReducer()
  const [isStartMenuVisible, setStartMenuVisible] = useState<boolean>(true)
  const [isEnterNameVisible, setEnterNameVisible] = useState<boolean>(false)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isGameStarted, setIsGameStarted] = useState<boolean>(false)
  const [timeLeft, setTimeLeft] = useState<number>(gameState.time)

  const soundManager = useSoundManagerLogic()

  function handleEnterNameClick() {
    setEnterNameVisible(true)
  }

  function setNameClickFalse() {
    setEnterNameVisible(false)
  }

  // triggers 'start timer' useEffect
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
    if (!isStartMenuVisible && isGameStarted) {
      gameDispatch({ type: ActionEnum.START_TIMER })

      const timerInterval = setInterval(() => {
        setTimeLeft(prevTimeLeft => {
          const updatedTime = prevTimeLeft - 1
          if (updatedTime <= 0) {
            console.log("updatedTime <= 0, stopped.")
            clearInterval(timerInterval)
            return 0
          } else {
            console.log("new time: ", updatedTime)
            return updatedTime
          }
        })
      }, 1000)
  
      return () => {
        console.log("component unmounted, stopped.");
        clearInterval(timerInterval);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isStartMenuVisible, isGameStarted]);

  const loadLevelCallback = (path: string) => {
    loadLevel(gameDispatch, path)
  }

  useEffect(() => {
    const keyPress = (e: KeyboardEvent) => {
      // console.log(e.code)

      if (e.code === 'ArrowUp' || e.code === 'KeyW') {
        e.preventDefault() // prevents scrolling
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
      // removes event listener to prevent multiple event listeners from being added on rerender
      window.removeEventListener('keydown', keyPress)
    }
  })

  const storedGrid = useRef(gameState.grid)
  const gravityQueued = useRef(false) // prevents gravity from being queed when gamestate updates quickly

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

  const mouseRepeat = useRef(false)
  const mouseDirection = useRef({ x: 0, y: 0 })
  const timeoutId = useRef(0) // prevent id from expiring on rerender
  useEffect(() => {
    const handler = (
      x: number | undefined = mouseDirection.current.x,
      y: number | undefined = mouseDirection.current.y,
    ) => {
      console.log(x, y, gameState.playerPos.x, gameState.playerPos.y)
      if (x === undefined || y === undefined) return // when not clicking on tile
      if (y < gameState.playerPos.y) {
        gameDispatch({
          type: ActionEnum.MOVE_UP,
          soundManager,
          loadLevelCallback,
        })
      } else if (x > gameState.playerPos.x) {
        gameDispatch({
          type: ActionEnum.MOVE_RIGHT,
          soundManager,
          loadLevelCallback,
        })
      } else if (y > gameState.playerPos.y) {
        gameDispatch({
          type: ActionEnum.MOVE_DOWN,
          soundManager,
          loadLevelCallback,
        })
      } else if (x < gameState.playerPos.x) {
        gameDispatch({
          type: ActionEnum.MOVE_LEFT,
          soundManager,
          loadLevelCallback,
        })
      }
      if (mouseRepeat.current) {
        timeoutId.current = setTimeout(handler, 200) // repeat when mouse down
      }
    }
    const handleHandler = (e: MouseEvent) => {
      if (e.target instanceof HTMLElement) {
        mouseDirection.current = {
          x: Number(e.target.dataset.x),
          y: Number(e.target.dataset.y),
        }
        handler(
          e.target.dataset.x as number | undefined,
          e.target.dataset.y as number | undefined,
        )
      }
    }
    function mousedown(e: MouseEvent) {
      mouseRepeat.current = true
      handleHandler(e)
    }
    function mouseup() {
      mouseRepeat.current = false
      clearTimeout(timeoutId.current) // prevent movement after mouse up
    }
    window.addEventListener('mousedown', mousedown)
    window.addEventListener('mouseup', mouseup)

    return () => {
      window.removeEventListener('mousedown', mousedown)
      window.removeEventListener('mouseup', mouseup)
    }
  })
  const [renderGrid, setRenderGrid] = useState(gameState.grid.subGrid(0, 0))

  // calculates and renders only visible game area
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
      {isStartMenuVisible && isEnterNameVisible === false ? (
        <StartMenu
          onPlayClick={handlePlayClick}
          highscores={highscoreTestData}
          handleEnterNameClick={handleEnterNameClick}
        />
      ) : isEnterNameVisible ? (
        <NameInput setNameClickFalse={setNameClickFalse} />
      ) : (
        <>
          <GameInfo timeRemaining={timeLeft} score={0} />
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
                key={x + y * grid.width}
                x={grid.y + y}
                y={grid.x + x}
                image={tile.texture}
                animation={tile.animation || 'none'}
                frame={tile.frame || 0}
              />
            ))}
          </div>
        </>
      )}
    </>
  )
}

export default Game
