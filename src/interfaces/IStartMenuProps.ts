interface IHighscores {
  username: string;
  score: number;
  id: number;
}

export interface IStartMenuProps {
  onPlayClick: () => void;
  highscores: IHighscores[];
}
