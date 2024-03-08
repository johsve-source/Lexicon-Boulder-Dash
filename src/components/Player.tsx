import { useContext } from "react";
import "./Player.css";
import { PlayerContext } from "../Game";

function Player() {
    const coordinate = useContext(PlayerContext);
    return (
        <>
            <img src="/player.png" alt="The Player" className="Player" style={{ gridArea: `${Math.max(1, (coordinate[0] % 10) + 1)} / ${Math.max((coordinate[1] % 10) + 1)}` }} />
        </>
    );
}

export default Player;
