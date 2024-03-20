import { IStartMenuProps } from '../interfaces/IStartMenuProps'
import './StartMenu.css'

export function StartMenu({ onPlayClick, highscores }: IStartMenuProps) {
  function calculateDotAmount(
    username: string,
    score: number,
    maxLength: number,
  ): string {
    const dotCount = Math.max(
      0,
      maxLength - (username.length + score.toString().length),
    )
    return '.'.repeat(dotCount)
  }

  return (
    <div className="startMenu">
      <h1>Boulder Dash!</h1>

      <button onClick={onPlayClick}>Play</button>

      <h2>High scores</h2>

      <h2>High scores</h2>

      {highscores.length < 1 ? (
        <p>No high scores registered yet.</p>
      ) : (
        <ol>
          {highscores.map((score, index) => (
            <li key={index}>
              {/* Assuming your high score object has a username property */}
              <span>{`${score.username}${calculateDotAmount(
                score.username,
                score.score,
                30,
              )}${score.score}`}</span>
            </li>
          ))}
        </ol>
      )}
    </div>
  )
}
