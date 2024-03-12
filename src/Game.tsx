
import "./Game.css";
import { createContext, useEffect, useRef, useState } from "react";
import Block from "./components/Generic";
import ControlsInfo from "./components/ControlsInfo";

export const PlayerContext = createContext<number[]>([]);

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
        "b", "d", "d", "d", "d", "d", "d", "d", "d", "b",
        "b", "b", "b", "b", "b", "b", "b", "b", "b", "b",
    ]);

  // starting player coordinates
  const position = useRef(11);

  // updates player coordinates on keypress, eventListener is added and removed on render
  useEffect(() => {
    const keyPress = (e: KeyboardEvent) => {
      console.log(e.code);
      if (e.code === 'ArrowUp' || e.code === 'KeyW') {
        const newBlocks = [...blocks];
        const copy = newBlocks[position.current - 10];
        newBlocks[position.current - 10] = newBlocks[position.current];
        newBlocks[position.current] = copy;
        position.current -= 10;
        setBlocks(newBlocks);
      } else if (e.code === 'ArrowDown' || e.code === 'KeyS') {
        const newBlocks = [...blocks];
        const copy = newBlocks[position.current + 10];
        newBlocks[position.current + 10] = newBlocks[position.current];
        newBlocks[position.current] = copy;
        position.current += 10;
        setBlocks(newBlocks);
      } else if (e.code === 'ArrowRight' || e.code === 'KeyD') {
        const newBlocks = [...blocks];
        const copy = newBlocks[position.current + 1];
        newBlocks[position.current + 1] = newBlocks[position.current];
        newBlocks[position.current] = copy;
        position.current += 1;
        setBlocks(newBlocks);
      } else if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
        const newBlocks = [...blocks];
        const copy = newBlocks[position.current - 1];
        newBlocks[position.current - 1] = newBlocks[position.current];
        newBlocks[position.current] = copy;
        position.current -= 1;
        setBlocks(newBlocks);
      }
    };
    window.addEventListener('keydown', keyPress);

    return () => {
      window.removeEventListener('keydown', keyPress);
    };
  }, [blocks]);

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
        <div className="Game">
			<ControlsInfo />
			<ControlsInfo />
            {blocks.map((key, index) => (
                <Block key={index} x={(index + 1) % 10} y={(index + 1) / 10} image={toImagePath(key)} />
            ))}
        </div>
    );

}

export default Game;
