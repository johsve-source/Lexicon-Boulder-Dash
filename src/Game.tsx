import './Game.css'
import { createContext, useState, useEffect, useReducer, useRef } from 'react'
import Block from './components/Generic'
import ControlsInfo from './components/ControlsInfo'
import Grid from './Grid'
import { Tile, symbolToTile } from './Tiles'
import { useSoundManagerLogic } from './hooks/sound/useSoundManagerLogic'
import { gameReducer, ActionEnum } from './GameState'
import { StartMenu } from './components/StartMenu'
// remove import after highscore caching is finished
import { highscoreTestData } from './assets/highscoreData'
import { GameInfo } from './components/GameInfo'

export const PlayerContext = createContext<number[]>([])

function parseMap(data: string) {
  const gridData = data
    .split('\n')
    .filter((e) => e.length > 0)
    .map((e) => [...e].map((f) => symbolToTile[f]))

  const height = gridData.length
  const width = gridData.reduce((acc, row) => Math.max(acc, row.length), 0)

  const grid = new Grid<Tile>(width, height)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  grid.toItterArray().forEach(([_, x, y]) => grid.set(x, y, gridData[y][x]))

  return grid
}

export function Game() {
  const soundManager = useSoundManagerLogic()
  const [isStartMenuVisible, setStartMenuVisible] = useState<boolean>(true)
  const [gameState, gameDispatch] = useReducer(gameReducer, {
    grid: parseMap(`
bbbbbbbbbbbbbbbbbbbbbbbbbb
bpsnddddddsnddddddsndddddb
bdddddssssdddddddddddddddb
bddddddddddddddddddddddddb
bddddddsdddddddddddddddddb
bdddddsssddddddddddddddddb
bbbbbbbbbbbbbbbbbddddddddb
bddddddddddddddddddddddddb
bddddddsdddddddddddddddddb
bdddddsssddddddddddddddddb
bddddddddddddddddddddddddb
bdddddiiiidddddddddddddddb
bddddddddddsssddddddddfddb
bbbbbbbbbbbbbbbbbbbbbbbbbb
`),
    playerPos: { x: 1, y: 1 },
    isGameOver: true,
    time: 10,
    score: 0,
  })

  function startGame() {
    gameState.isGameOver = false
    setStartMenuVisible(false)
  }

  // start game
  useEffect(() => {
    if (!isStartMenuVisible) {
      
      console.log("New game, time interval started.")
        setInterval(() => {
        gameDispatch({ type: ActionEnum.TIME_STEP })
      }, 1000)

      // Play ambiance when I press play
    soundManager.playInteraction('ambiance', {
      id: 7,
      volume: 0.2,
      loop: true,
    })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isStartMenuVisible])

  useEffect(() => {
    const keyPress = (e: KeyboardEvent) => {
      // console.log(e.code)

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
  

  const storedGrid = useRef(gameState.grid);

  useEffect(() => {
    async function gravity() {
      setTimeout(() => {
        if (storedGrid.current !== gameState.grid) {
          gameDispatch({ type: ActionEnum.TIME_STEP, soundManager })
          storedGrid.current = gameState.grid
        }
      }, 200);
    }
    gravity()
  }, [gameState, soundManager])

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
      )}
    </>
  )
}

export default Game
