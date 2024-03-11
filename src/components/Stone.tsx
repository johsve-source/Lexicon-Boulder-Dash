import { useContext } from "react";
import "./Block.css";
import { PlayerContext } from "../Game";

function Stone() {
    const coordinate = useContext(PlayerContext);
    return (
        <>
            <img src="/stone.png" alt="A stone, can be moved." className="Block" style={{ gridArea: `${coordinate[0]} / ${coordinate[1]}` }} />
        </>
    );
}

export default Stone;
