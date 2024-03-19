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
        const player = gameState.grid.get(
          gameState.playerPos.x,
          gameState.playerPos.y,
        )
        player.animation = 'move-up'
        player.texture = '/textures/pixel/player_b.gif'
      } else if (e.code === 'ArrowDown' || e.code === 'KeyS') {
        e.preventDefault()
        gameDispatch({
          type: ActionEnum.MOVE_DOWN,
          soundManager,
          loadLevelCallback,
        })
        const player = gameState.grid.get(
          gameState.playerPos.x,
          gameState.playerPos.y,
        )
        player.animation = 'move-down'
        player.texture = '/textures/pixel/player.gif'
      } else if (e.code === 'ArrowRight' || e.code === 'KeyD') {
        e.preventDefault()
        gameDispatch({
          type: ActionEnum.MOVE_RIGHT,
          soundManager,
          loadLevelCallback,
        })
        const player = gameState.grid.get(
          gameState.playerPos.x,
          gameState.playerPos.y,
        )
        player.animation = 'move-right'
        player.texture = '/textures/pixel/player_r.gif'
      } else if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
        e.preventDefault()
        gameDispatch({
          type: ActionEnum.MOVE_LEFT,
          soundManager,
          loadLevelCallback,
        })
        const player = gameState.grid.get(
          gameState.playerPos.x,
          gameState.playerPos.y,
        )
        player.animation = 'move-left'
        player.texture = '/textures/pixel/player_l.gif'
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

  const mouseRepeat = useRef(false)
  const mouseDirection = useRef({ x: 0, y: 0 })
  const timeoutId = useRef(0)
  useEffect(() => {
    const handler = (
      x: number | undefined = mouseDirection.current.x,
      y: number | undefined = mouseDirection.current.y,
    ) => {
      console.log(x, y, gameState.playerPos.x, gameState.playerPos.y)
      if (x === undefined || y === undefined) return
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
        timeoutId.current = setTimeout(handler, 200)
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
      clearTimeout(timeoutId.current)
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

          {gameState.grid.toItterArray().map(([block, x, y, grid]) => (
            <Block
              key={x + y * grid.width}
              x={1 + y}
              y={1 + x}
              image={block.texture}
              animation={block.animation}
            />
          ))}
        </div>
      )}
    </>
  )
}

export default Game
