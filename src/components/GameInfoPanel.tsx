import { IGameInfoPanelProps } from "../interfaces/IGameInfoPanelProps"
import "./GameInfoPanel.css"

export function GameInfoPanel({ timeRemaining, score }: IGameInfoPanelProps) {
  return (
    <>
        <div className="gameInfoPanelContainer">
            <span>time remaining: {`${timeRemaining}`}</span>
            <span>score: {`${score}`}</span> 
        </div>
    </>
  ) 
}
