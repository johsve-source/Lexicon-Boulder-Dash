import { useContext } from "react";
import "./Block.css";
import { PlayerContext } from "../Game";

function Player() {
    const coordinate = useContext(PlayerContext);
    return (
        <>
            <img src="/player.png" alt="The Player" className="Block" style={{ gridArea: `${coordinate[0]} / ${coordinate[1]}` }} />
        </>
    );
}

export default Player;
