import { useRef } from 'react'
import './ControlsInfo.css'

const controls = {
  Upp: ['W', '🠉'],
  Down: ['S', '🠋'],
  Left: ['A', '🠈'],
  Right: ['D', '🠊'],
}

function ControlsInfo() {
  const buttonRef = useRef<HTMLButtonElement>(null)
  const dialogRef = useRef<HTMLDialogElement>(null)

  return (
    <>
      <button
        ref={buttonRef}
        className="controls-info"
        onClick={() => {
          if (!dialogRef.current) return
          dialogRef.current.showModal()
          if (!buttonRef.current) return

          const rect = buttonRef.current.getBoundingClientRect()
          dialogRef.current.style.left = rect.x + 'px'
          dialogRef.current.style.top = `calc(${
            rect.y + rect.height
          }px + 0.25em)`
        }}
      >
        ?
      </button>

      <dialog
        ref={dialogRef}
        className="controls-info"
        onClick={(e) => {
          if (!dialogRef.current) return

          const rect = dialogRef.current.getBoundingClientRect()
          const clickedInDialog =
            rect.top <= e.clientY &&
            e.clientY <= rect.top + rect.height &&
            rect.left <= e.clientX &&
            e.clientX <= rect.left + rect.width

          if (!clickedInDialog) dialogRef.current.close()
        }}
      >
        <b>Controls: </b>
        <table>
          <tbody>
            {Object.entries(controls).map(([maping, keys], index) => (
              <tr key={index}>
                <td>{maping}:</td>
                {keys.map((key) => (
                  <td key={key}>
                    <b>{key}</b>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </dialog>
    </>
  )
}

export default ControlsInfo
