import { IStartMenuProps } from '../interfaces/IStartMenuProps'
import './StartMenu.css'

export function StartMenu({
  handleEnterNameClick,
  onPlayClick,
  highscores,
}: IStartMenuProps) {
  function calculateDotAmount(
    username: string,
    score: number,
    maxLength: number,
    index: number,
  ): string {
    const dotCount = Math.max(
      0,
      maxLength - (index.toString().length - username.length + score.toString().length),
    )
    return '.'.repeat(dotCount)
  }

  return (
    <div className="startMenu">
      <section className="inner">
        <h1>
          <img src="/menu/logo.png" alt="Griffin Dash" className="menu-img" />
        </h1>
        <div className="buttons">
          <button type="button" onClick={onPlayClick}>
            PLAY
          </button>
          <button type="button" onClick={handleEnterNameClick}>
            ENTER NAME
          </button>
        </div>

        <div className="wrap">
          <h2>High scores</h2>
          {highscores.length < 1 ? (
            <p>No high scores registered yet.</p>
          ) : (
            <div className="list">
              {highscores.map((highscore, index) => {
                const dots = calculateDotAmount(
                  highscore.username,
                  highscore.score,
                  20,
                  index + 1,
                )
                return (
                  <div className="list-item" key={highscore.id}>
                    <span>{`${index + 1}. ${highscore.username}${dots}${highscore.score}`}</span>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
