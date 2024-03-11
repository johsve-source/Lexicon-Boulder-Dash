import "./Block.css";
import IBlockProps from "../interfaces/IBlockProps";

function Diamond({x, y}: IBlockProps) {
    return (
        <>
            <img src="/diamond.png" alt="Wow, a diamond." className="Block" style={{ gridArea: `${x} / ${y}` }} />
        </>
    );
}

export default Diamond;
