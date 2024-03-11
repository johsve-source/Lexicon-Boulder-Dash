import "./Block.css";
import IBlockProps from "../interfaces/IBlockProps";

function Dirt({x, y}: IBlockProps) {
    return (
        <>
            <img src="/dirt.png" alt="Dirty dirt." className="Block" style={{ gridArea: `${x} / ${y}` }} />
        </>
    );
}

export default Dirt;
