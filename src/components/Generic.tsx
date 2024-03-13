import './Block.css'
import IBlockProps from '../interfaces/IBlockProps'

function Block({ x, y, image }: IBlockProps) {
  return (
    <>
      <img
        src={image}
        alt="A block"
        className="Block"
        style={{ gridArea: `${x} / ${y}` }}
      />
    </>
  )
}

export default Block
