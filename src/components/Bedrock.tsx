import { useContext } from "react";
import "./Block.css";
import { PlayerContext } from "../Game";

function Bedrock() {
    const coordinate = useContext(PlayerContext);
    return (
        <>
            <img src="/bedrock.png" alt="The bedrock, cannot be mined." className="Block" style={{ gridArea: `${coordinate[0]} / ${coordinate[1]}` }} />
        </>
    );
}

export default Bedrock;
