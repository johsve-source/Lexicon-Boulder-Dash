import './Game.css';
import Player from './components/Player';
import { createContext, useEffect, useState } from 'react';
import Stone from './components/Stone';
import Bedrock from './components/Bedrock';

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
    'p',
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
    'd',
    'd',
    'd',
    'd',
    'd',
    'd',
    'd',
    'd',
    'b',
  ];

  return (
    <PlayerContext.Provider value={coordinate}>
      <div className="Game"></div>
    </PlayerContext.Provider>
  );
}

export default Game;
