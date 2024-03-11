import "./Block.css";
import IBlockProps from "../interfaces/IBlockProps";

function Stone({x, y}: IBlockProps) {
    return (
        <>
            <img src="/stone.png" alt="A stone, can be moved." className="Block" style={{ gridArea: `${x} / ${y}` }} />
        </>
    );
}

export default Stone;
