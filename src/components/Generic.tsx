import './Block.css'
import IBlockProps from '../interfaces/IBlockProps'

function Block({ x, y, image, animation, frame }: IBlockProps) {
  if (image) {
    return (
      <>
        <img
          src={image}
          alt="A block"
          className="Block"
          style={{
            gridArea: `${x + 1} / ${y + 1}`,
            animation: `0.2s linear forwards running ${animation || 'none'}`,
            objectPosition: `${-32 * frame}px`,
          }}
          data-x={y} // ???
          data-y={x} // ???
          draggable="false"
        />
      </>
    )
  } else {
    return (
      <div>
        <div
          className="Block"
          style={{
            gridArea: `${x + 1} / ${y + 1}`,
            animation: `0.2s linear forwards running ${animation || 'none'}`,
            objectPosition: `${-32 * frame}px`,
          }}
          data-x={y} // ???
          data-y={x} // ???
          draggable="false"
        />
      </div>
    )
  }

}

export default Block
