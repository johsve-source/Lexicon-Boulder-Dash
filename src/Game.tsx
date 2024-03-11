import './Game.css';
import { createContext, useEffect, useState } from 'react';
import Block from './components/Generic';

export const PlayerContext = createContext<number[]>([]);

export function Game() {
  // starting player coordinates
  const [coordinate, setCoordinate] = useState([1, 1]);

  // updates player coordinates on keypress, eventListener is added and removed on render
  useEffect(() => {
    const calculateCoordinate = (x: number, y: number) => {
      if (x) {
        x = Math.min(Math.max(coordinate[1] + x, 1), 10);
      } else {
        x = coordinate[1];
      }
      if (y) {
        y = Math.min(Math.max(coordinate[0] + y, 1), 10);
      } else {
        y = coordinate[0];
      }
      console.log(x, y);
      return [y, x];
    };
    const keyPress = (e: KeyboardEvent) => {
      console.log(e.code);
      if (e.code === 'ArrowUp' || e.code === 'KeyW') {
        setCoordinate(calculateCoordinate(0, -1));
      } else if (e.code === 'ArrowDown' || e.code === 'KeyS') {
        setCoordinate(calculateCoordinate(0, 1));
      } else if (e.code === 'ArrowRight' || e.code === 'KeyD') {
        setCoordinate(calculateCoordinate(1, 0));
      } else if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
        setCoordinate(calculateCoordinate(-1, 0));
      }
    };
    window.addEventListener('keydown', keyPress);

    return () => {
      window.removeEventListener('keydown', keyPress);
    };
  }, [coordinate]);

  const blocks = [
    'b',
    'b',
    'b',
    'b',
    'b',
    'b',
    'b',
    'b',
    'b',
    'b',
    'b',
    'd',
    'd',
    'd',
    'd',
    'd',
    'd',
    'd',
    'd',
    'b',
    'b',
    'd',
    'd',
    'd',
    'd',
    'd',
    'd',
    'd',
    'd',
    'b',
    'b',
    'd',
    'd',
    's',
    's',
    's',
    'd',
    'i',
    'd',
    'b',
    'b',
    'd',
    'i',
    'd',
    'd',
    'd',
    'd',
    'd',
    'd',
    'b',
    'b',
    'd',
    'd',
    'd',
    'd',
    'd',
    'i',
    'd',
    'd',
    'b',
    'b',
    'd',
    'd',
    'd',
    'd',
    'd',
    'd',
    'd',
    'd',
    'b',
    'b',
    's',
    's',
    's',
    'd',
    'd',
    'd',
    'd',
    'd',
    'b',
    'b',
    'd',
    'd',
    'd',
    'd',
    'd',
    'd',
    'd',
    'd',
    'b',
    'b',
    'b',
    'b',
    'b',
    'b',
    'b',
    'b',
    'b',
    'b',
    'b',
  ];

  function toImagePath(type: string) {
    if (type === 'b') {
      return '/bedrock.png';
    } else if (type === 'd') {
      return '/dirt.png';
    } else if (type === 's') {
      return '/stone.png';
    } else if (type === 'i') {
      return '/diamond.png';
    } else if (type === 'p') {
      return '/player.png';
    } else {
      return '/player.png';
    }
  }

  return (
    <PlayerContext.Provider value={coordinate}>
      <div className="Game">
        <Block image={toImagePath('p')} x={coordinate[0]} y={coordinate[1]} />
        {blocks.map((key, index) => (
          <Block
            key={index}
            x={(index + 1) % 10}
            y={(index + 1) / 10}
            image={toImagePath(key)}
          />
        ))}
      </div>
    </PlayerContext.Provider>
  );
}

export default Game;
