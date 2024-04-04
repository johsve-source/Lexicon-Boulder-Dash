import { useEffect, useState } from 'react'
import '../styles/levelClear.css'

const LevelClear = () => {
  const [score, setScore] = useState(1234)

  useEffect(() => {
    const finalScore = score
    let currentScore = 0
    const increment = Math.ceil(finalScore / 100)

    /*  This interval function executes the callback function every 15 milliseconds.
   It will execute it indefinitely until it is cleared. In this case when current score
   is equal or greater than finalScore. The function increment the score and it will show 
   as a count up on the screen. */

    const interval = setInterval(() => {
      currentScore += increment
      if (currentScore >= finalScore) {
        setScore(finalScore)
        clearInterval(interval)
      } else {
        setScore(currentScore)
      }
    }, 15)
  }, [])

  return (
    <div className="level-clear">
      <h1>Level Clear !</h1>
      <div className="score-box">
        <p className="score">
          Score: <span className="result">{score}</span>
        </p>
        <p className="score">
          Time: <span className="result">00:58</span>
        </p>
      </div>
      <button className='next-btn'>Next level</button>
    </div>
  )
}

export default LevelClear
