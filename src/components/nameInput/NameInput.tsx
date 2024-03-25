import { useState, useEffect, useRef, FC } from 'react'
import './nameInput.css'
import { nameInputInterface } from '../../interfaces/IStartMenuProps'

const NameInput: FC<nameInputInterface> = ({ setNameClickFalse }) => {
  const [userName, setUserName] = useState('')

  //Array with letter for input name. If active true, the arrow will point on that one.
  const [letters, setLetters] = useState([
    { id: 1, letter: 'A', active: true },
    { id: 2, letter: 'B', active: false },
    { id: 3, letter: 'C', active: false },
    { id: 4, letter: 'D', active: false },
    { id: 5, letter: 'E', active: false },
    { id: 6, letter: 'F', active: false },
    { id: 7, letter: 'G', active: false },
    { id: 8, letter: 'H', active: false },
    { id: 9, letter: 'I', active: false },
    { id: 10, letter: 'J', active: false },
    { id: 11, letter: 'K', active: false },
    { id: 12, letter: 'L', active: false },
    { id: 13, letter: 'M', active: false },
    { id: 14, letter: 'N', active: false },
    { id: 15, letter: 'O', active: false },
    { id: 16, letter: 'P', active: false },
    { id: 17, letter: 'Q', active: false },
    { id: 18, letter: 'R', active: false },
    { id: 19, letter: 'S', active: false },
    { id: 20, letter: 'T', active: false },
    { id: 21, letter: 'U', active: false },
    { id: 22, letter: 'V', active: false },
    { id: 23, letter: 'X', active: false },
    { id: 24, letter: 'Y', active: false },
    { id: 25, letter: 'Z', active: false },
    { id: 26, letter: '1', active: false },
    { id: 27, letter: '2', active: false },
    { id: 28, letter: '3', active: false },
    { id: 29, letter: '4', active: false },
    { id: 30, letter: '5', active: false },
    { id: 31, letter: '6', active: false },
    { id: 32, letter: '7', active: false },
    { id: 33, letter: '8', active: false },
    { id: 34, letter: '9', active: false },
    { id: 35, letter: 'Del', active: false },
    { id: 36, letter: 'End', active: false },
  ])

  const letterBoxRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Focus on the letter box when the component mounts
    if (letterBoxRef.current) {
      letterBoxRef.current.focus()
    }
  }, [])

  // Updates the page when userName changes
  useEffect(() => {}, [userName])

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    //If user press right arrow, the cursor moves one to the right, so if "A" is active, it moves to "B"

    if (event.key === 'ArrowRight') {
      const activeLetter = letters.find((item) => item.active === true)
      if (activeLetter && activeLetter.id !== 36) {
        const activeIndex = letters.indexOf(activeLetter)

        //Finds what letter is active now and make it not active
        setLetters((prevLetters) =>
          prevLetters.map((item, index) =>
            index === activeIndex ? { ...item, active: false } : item,
          ),
        )

        //Makes the cursor focus on the letter one step forward
        setLetters((prevLetters) =>
          prevLetters.map((item, index) =>
            index === activeIndex + 1 ? { ...item, active: true } : item,
          ),
        )
      } else {
        //You can't go one step to the right if you are on the last element (id: 36)
        return
      }
    } else if (event.key === 'ArrowLeft') {
      const activeLetter = letters.find((item) => item.active === true)
      if (activeLetter && activeLetter.id !== 1) {
        // Find the index of the active letter in the array
        const activeIndex = letters.indexOf(activeLetter)
        // Set active to false for the currently active letter
        setLetters((prevLetters) =>
          prevLetters.map((item, index) =>
            index === activeIndex ? { ...item, active: false } : item,
          ),
        )

        //Makes the cursor focus on the letter one step back
        setLetters((prevLetters) =>
          prevLetters.map((item, index) =>
            index === activeIndex - 1 ? { ...item, active: true } : item,
          ),
        )
      } else {
        //You can't go one step back if you are on letter with id 1
        return
      }
    } else if (event.key === 'ArrowDown') {
      const activeLetter = letters.find((item) => item.active === true)
      if (
        activeLetter &&
        activeLetter.id < 31 &&
        activeLetter.id !== 29 &&
        activeLetter.id !== 30
      ) {
        const activeIndex = letters.indexOf(activeLetter)
        // Set active to false for the currently active letter
        setLetters((prevLetters) =>
          prevLetters.map((item, index) =>
            index === activeIndex ? { ...item, active: false } : item,
          ),
        )

        //The letter 8 steps forward gets active. It's the letter direct under the current
        setLetters((prevLetters) =>
          prevLetters.map((item, index) =>
            index === activeIndex + 8 ? { ...item, active: true } : item,
          ),
        )
      }
    } else if (event.key === 'ArrowUp') {
      const activeLetter = letters.find((item) => item.active === true)
      if (
        activeLetter &&
        activeLetter.id !== 1 &&
        activeLetter.id !== 2 &&
        activeLetter.id !== 3 &&
        activeLetter.id !== 4 &&
        activeLetter.id !== 5 &&
        activeLetter.id !== 5 &&
        activeLetter.id !== 6 &&
        activeLetter.id !== 7 &&
        activeLetter.id !== 8
      ) {
        // Find the index of the active letter in the array
        const activeIndex = letters.indexOf(activeLetter)
        // Set active to false for the currently active letter
        setLetters((prevLetters) =>
          prevLetters.map((item, index) =>
            index === activeIndex ? { ...item, active: false } : item,
          ),
        )

        //The letter 8 steps back from the current will activate
        setLetters((prevLetters) =>
          prevLetters.map((item, index) =>
            index === activeIndex - 8 ? { ...item, active: true } : item,
          ),
        )
      } else {
        return
      }
    } else if (event.key === 'Enter') {
      //If user presses enter and Del is active, it will slice the last letter
      //from the userName. If End is active, you will stop showing this component
      //otherwise the letter will be added to the userName
      const activeLetter = letters.find((item) => item.active === true)

      if (activeLetter) {
        if (activeLetter.letter === 'Del') {
          if (userName.length === 0) return
          setUserName((prevName) => {
            return prevName.slice(0, -1)
          })

          return
        } else if (activeLetter.letter === 'End') {
          setNameClickFalse()
          return
        } else {
          const letter = activeLetter.letter
          setUserName((prevName) => {
            return (prevName += letter)
          })
        }
      }
    } else {
      return
    }
  }

  return (
    <div className="name-input">
      <div className="display">{userName}</div>

      <div className="frame">
        <p className="heading">Enter your name</p>
        <div
          className="letter-box"
          ref={letterBoxRef}
          tabIndex={0}
          onKeyDown={handleKeyDown}
        >
          {letters.map((item, i) => {
            return (
              <div
                key={i}
                className="letter-frame"
                onKeyDown={(e) => handleKeyDown(e)}
                tabIndex={0}
              >
                <p className="letter">{item.letter}</p>
                <div className={item.active ? 'show' : 'hidden'}>
                  <i className="material-icons arrow">play_arrow</i>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default NameInput
