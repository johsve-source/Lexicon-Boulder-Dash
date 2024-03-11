import "./Block.css";
import IBlockProps from "../interfaces/IBlockProps";

function Player({x, y}: IBlockProps) {
    return (
        <>
            <img src="/player.png" alt="The player, you." className="Block" style={{ gridArea: `${x} / ${y}` }} />
        </>
    );
}

export default Player;
