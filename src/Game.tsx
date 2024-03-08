import "./Game.css";
import Player from "./components/Player";
import { createContext, useEffect, useState } from "react";

export const PlayerContext = createContext<number[]>([]);

export function Game() {
    const [coordinate, setCoordinate] = useState([1, 1]);

    useEffect(() => {
        const keyPress = (e: KeyboardEvent) => {
            console.log(e.code);
            if (e.code === "ArrowUp" || e.code === "KeyW") {
                setCoordinate([coordinate[0] - 1, coordinate[1]]);
            } else if (e.code === "ArrowDown" || e.code === "KeyS") {
                setCoordinate([coordinate[0] + 1, coordinate[1]]);
            } else if (e.code === "ArrowRight" || e.code === "KeyD") {
                setCoordinate([coordinate[0], coordinate[1] + 1]);
            } else if (e.code === "ArrowLeft" || e.code === "KeyA") {
                setCoordinate([coordinate[0], coordinate[1] - 1]);
            }
        };
        window.addEventListener("keyup", keyPress);

        return () => {
            window.removeEventListener("keyup", keyPress);
        };
    }, [coordinate]);

    return (
        <PlayerContext.Provider value={coordinate}>
            <div className="Game">
                <Player />
            </div>
        </PlayerContext.Provider>
    );
}

export default Game;
