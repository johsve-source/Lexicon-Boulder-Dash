import { IGameInfoProps } from "../interfaces/IGameInfoProps"
import "./GameInfo.css"

export function GameInfo({ timeRemaining, score }: IGameInfoProps) {
  return (
    <>
        <div className="GameInfoContainer">
            <span>time remaining: {`${timeRemaining}`}</span>
            <span>score: {`${score}`}</span> 
        </div>
    </>
  ) 
}
