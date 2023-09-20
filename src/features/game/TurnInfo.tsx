import { useAppSelector } from "../../app/hooks"
import {
  GameStatus,
  Player,
  currentPlayerState,
  gameModeState,
  gameStatusState,
} from "./slice"
import styles from "./Game.module.css"
import { Mode } from "./const"
import { getNextPlayer } from "./utils"

export function getTurnInfoText(
  currentPlayer: Player,
  gameStatus: GameStatus,
  mode: Mode,
): string {
  if (gameStatus === "in-progress") {
    return `${currentPlayer.name}'s turn!`
  } else if (gameStatus === "win") {
    const winner =
      mode === Mode.Regular ? currentPlayer : getNextPlayer(currentPlayer.name)
    return `${winner.name} won!`
  } else {
    return "It's a draw!"
  }
}

export function TurnInfo() {
  const currentPlayer = useAppSelector(currentPlayerState)
  const gameStatus = useAppSelector(gameStatusState)
  const mode = useAppSelector(gameModeState)
  return (
    <p className={styles.turninfo}>
      {getTurnInfoText(currentPlayer, gameStatus, mode)}
    </p>
  )
}
