import { useContext } from "react";
import "./Block.css";
import { PlayerContext } from "../Game";

function Diamond() {
    const coordinate = useContext(PlayerContext);
    return (
        <>
            <img src="/diamond.png" alt="A diamond" className="Block" style={{ gridArea: `${coordinate[0]} / ${coordinate[1]}` }} />
        </>
    );
}

export default Diamond;
