import './Block.css'
import IBlockProps from '../interfaces/IBlockProps'

function Block({ x, y, image, animation }: IBlockProps) {
  return (
    <>
      <img
        src={image}
        alt="A block"
        className="Block"
        style={{
          gridArea: `${x} / ${y}`,
          animation: `0.2s linear forwards running ${animation || 'none'}`,
        }}
      />
    </>
  )
}

export default Block
