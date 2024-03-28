import './Game.css'
import { createContext, useState, useEffect, useRef } from 'react'
import Block from './components/Generic'
import ControlsInfo from './components/ControlsInfo'
import { useSoundManagerLogic } from './hooks/sound/useSoundManagerLogic'
import { GetGameReducer, ActionEnum, loadLevel } from './GameState'
import { StartMenu } from './components/StartMenu'
// remove import after highscore caching is finished
import { highscoreTestData } from './assets/highscoreData'
import { useNavigate } from 'react-router-dom'
import { GameInfo } from './components/GameInfo'

export const PlayerContext = createContext<number[]>([])

export function Game() {
  const navigate = useNavigate()
  const [gameState, gameDispatch] = GetGameReducer()
  const [isStartMenuVisible, setStartMenuVisible] = useState<boolean>(true)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isGameStarted, setIsGameStarted] = useState<boolean>(false)

  const soundManager = useSoundManagerLogic()

  function handleEnterNameClick() {
    navigate("/name")
  }

  // triggers 'start timer' useEffect
  function handlePlayClick() {
    setStartMenuVisible(false)
    setIsGameStarted(true)

    // Play ambiance when I press play
    // soundManager.playInteraction('ambiance', {
    //   id: 7,
    //   volume: 0.2,
    //   loop: true,
    //   trailing: true,
    // })
  }

  useEffect(() => {
    if (!isStartMenuVisible && isGameStarted) {
      gameDispatch({ type: ActionEnum.TIMER_START })

      const timerInterval = setInterval(() => {
        setTimeLeft(prevTimeLeft => {
          const updatedTime = prevTimeLeft - 1
          if (updatedTime <= 0) {
            console.log("timeout, interval stopped.")
            clearInterval(timerInterval)
            return 0
          } else {
            //console.log("new time: ", updatedTime)
            return updatedTime
          }
        })
      }, 1000)
  
      return () => {
        console.log("component unmounted, interval stopped.")
        clearInterval(timerInterval)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isStartMenuVisible, isGameStarted]);

  const loadLevelCallback = (path: string) => {
    loadLevel(gameDispatch, path)
  }

  useEffect(() => {
    const keyPress = (e: KeyboardEvent) => {
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
      // console.log(x, y, gameState.playerPos.x, gameState.playerPos.y)
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

  return (
    <>
      {isStartMenuVisible ? (
        <StartMenu
          onPlayClick={handlePlayClick}
          highscores={highscoreTestData}
          handleEnterNameClick={handleEnterNameClick}
        />
      )  : (
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

          {gameState.grid
            .subGridViewFromGameState(gameState)
            .toItterArray()
            .map(([tile, x, y, grid]) => (
              <Block
                key={`${x}, ${y}`}
                x={grid.y + y}
                y={grid.x + x}
                image={tile.texture}
                animation={tile.animation || 'none'}
                frame={tile.frame || 0}
              />
            ))}
        </div>
      ) }
    </>
  )
}

export default Game
