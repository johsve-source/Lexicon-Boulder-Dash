import "./StartMenu.css";

interface Highscores {
  username: string;
  score: number;
  id: number;
}

interface StartMenuProps {
  onPlayClick: () => void;
  highscores: Highscores[];
}

export function StartMenu({ onPlayClick, highscores }: StartMenuProps) {
  function calculateDotAmount(
    username: string,
    score: number,
    maxLength: number
  ): string {
    const dotCount = Math.max(
      0,
      maxLength - (username.length + score.toString().length)
    );
    return ".".repeat(dotCount);
  }

  return (
    <div className="startMenu">
      <h1>Boulder Dash!</h1>

      <button onClick={onPlayClick}>Play</button>

      <h2>High scores</h2>

      <ul>
        {highscores.map((highscore) => {
          const dots = calculateDotAmount(
            highscore.username,
            highscore.score,
            30
          );
          return (
            <li key={highscore.id}>
              <span>{`${highscore.username}${dots}${highscore.score}`}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
