import "./Block.css";
import IBlockProps from "../interfaces/IBlockProps";

function Bedrock({x, y}: IBlockProps) {
    return (
        <>
            <img src="/Bedrock.png" alt="Bedrock, unbreakable." className="Block" style={{ gridArea: `${x} / ${y}` }} />
        </>
    );
}

export default Bedrock;
