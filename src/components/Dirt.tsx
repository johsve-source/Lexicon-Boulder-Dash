import { useContext } from "react";
import "./Block.css";
import { PlayerContext } from "../Game";

function Dirt() {
    const coordinate = useContext(PlayerContext);
    return (
        <>
            <img src="/dirt.png" alt="A pile of dirt, or maybe mud?" className="Block" style={{ gridArea: `${coordinate[0]} / ${coordinate[1]}` }} />
        </>
    );
}

export default Dirt;
