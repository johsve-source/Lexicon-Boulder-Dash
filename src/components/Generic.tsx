import './Block.css'
import IBlockProps from '../interfaces/IBlockProps'

function Block({ x, y, image }: IBlockProps) {
  return (
    <>
      <img
        src={image}
        alt="A block"
        className="Block"
        style={{ gridArea: `${y+1} / ${x+1}` }}
        data-x={x}
        data-y={y}
        draggable="false"
      />
    </>
  )
}

export default Block
