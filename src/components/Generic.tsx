import './Block.css'
import IBlockProps from '../interfaces/IBlockProps'

function Block({ x, y, image, animation, frame }: IBlockProps) {
  return (
    <>
      <img
        src={image}
        alt="A block"
        className="Block"
        style={{
          gridArea: `${x} / ${y}`,
          animation: `0.2s linear forwards running ${animation || 'none'}`,
          objectPosition: `${-32 * frame}px`
        }}
      />
    </>
  )
}

export default Block
