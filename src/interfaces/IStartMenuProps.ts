interface IHighscores {
  username: string
  score: number
  id: number
}

export interface IStartMenuProps {
  onPlayClick: () => void
  handleEnterNameClick: () => void
  highscores: IHighscores[]
}


export interface nameInputInterface {
  setNameClickFalse: () => void
}

