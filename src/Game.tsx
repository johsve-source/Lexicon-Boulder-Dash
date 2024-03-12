import './Game.css'
import { createContext, useEffect, useRef, useState } from 'react'
import Block from './components/Generic'

export const PlayerContext = createContext<number[]>([])

export function Game() {
  // prettier-ignore
  const [blocks, setBlocks] = useState([
        "b", "b", "b", "b", "b", "b", "b", "b", "b", "b",
        "b", "p", "d", "d", "d", "d", "d", "d", "d", "b",
        "b", "d", "d", "d", "d", "d", "d", "d", "d", "b",
        "b", "d", "d", "s", "s", "s", "d", "i", "d", "b",
        "b", "d", "i", "d", "d", "d", "d", "d", "d", "b",
        "b", "d", "d", "d", "d", "d", "i", "d", "d", "b",
        "b", "d", "d", "d", "d", "d", "d", "d", "d", "b",
        "b", "s", "s", "s", "d", "d", "d", "d", "d", "b",
        "b", "d", "d", "d", "d", "d", "d", "d", "f", "b",
        "b", "b", "b", "b", "b", "b", "b", "b", "b", "b",
    ]);

  // starting player coordinates
  const position = useRef(11)

  // updates player coordinates on keypress, eventListener is added and removed on render
  useEffect(() => {
    const keyPress = (e: KeyboardEvent) => {
      console.log(e.code)
      function handleMove(delta: number) {
        const newBlocks = [...blocks]
        const copy = newBlocks[position.current + delta]
        if (copy === 'b') {
          return
        } else if (copy === 'd' || copy === 'n') {
          newBlocks[position.current + delta] = newBlocks[position.current]
          newBlocks[position.current] = 'n'
          position.current += delta
          setBlocks(newBlocks)
        } else if (copy === 'f') {
          alert('WE HAVE A WINNER!')
        }
      }
      if (e.code === 'ArrowUp' || e.code === 'KeyW') {
        handleMove(-10)
      } else if (e.code === 'ArrowDown' || e.code === 'KeyS') {
        handleMove(10)
      } else if (e.code === 'ArrowRight' || e.code === 'KeyD') {
        handleMove(1)
      } else if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
        handleMove(-1)
      }
    }
    window.addEventListener('keydown', keyPress)

    return () => {
      window.removeEventListener('keydown', keyPress)
    }
  }, [blocks])

  function toImagePath(type: string) {
    if (type === 'b') {
      return '/bedrock.png'
    } else if (type === 'd') {
      return '/dirt.png'
    } else if (type === 's') {
      return '/stone.png'
    } else if (type === 'i') {
      return '/diamond.png'
    } else if (type === 'p') {
      return '/player.png'
    } else if (type === 'n') {
      return '/none.png'
    } else if (type === 'f') {
      return '/finish.png'
    } else {
      return '/player.png'
    }
  }

  return (
    <div className="Game">
      {blocks.map((key, index) => (
        <Block
          key={index}
          x={(index + 1) % 10}
          y={(index + 1) / 10}
          image={toImagePath(key)}
        />
      ))}
    </div>
  )
}

export default Game
