import { useContext } from "react";
import "./Player.css";
import { PlayerContext } from "../Game";

function Player() {
    const coordinate = useContext(PlayerContext);
    return (
        <>
            <img src="/player.png" alt="The Player" className="Player" style={{ gridArea: `${coordinate[0]} / ${coordinate[1]}` }} />
        </>
    );
}

export default Player;
