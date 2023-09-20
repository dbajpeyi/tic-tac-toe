import { useAppSelector } from "../../app/hooks"
import {
  GameStatus,
  Player,
  currentPlayerState,
  gameModeState,
  gameStatusState,
  variationState,
} from "./slice"
import styles from "./Game.module.css"
import { Mode, Variation } from "./const"
import { getNextPlayer } from "./utils"

export function getTurnInfoText(
  currentPlayer: Player,
  gameStatus: GameStatus,
  mode: Mode,
  variation: Variation,
): string {
  if (gameStatus === "in-progress") {
    return `${currentPlayer.name}'s turn!`
  } else if (gameStatus === "win") {
    const winner =
      mode === Mode.Regular
        ? currentPlayer
        : getNextPlayer(currentPlayer.name, variation)
    return `${winner.name} won!`
  } else {
    return "It's a draw!"
  }
}

export function TurnInfo() {
  const currentPlayer = useAppSelector(currentPlayerState)
  const gameStatus = useAppSelector(gameStatusState)
  const mode = useAppSelector(gameModeState)
  const variation = useAppSelector(variationState)
  return (
    <>
      <p className={styles.turninfo}>
        {getTurnInfoText(currentPlayer, gameStatus, mode, variation)}
        {variation === Variation.Wild && (
          <p className={styles.extrainfomisere}>
            Use left click for "X", and right for "O"
          </p>
        )}
        {mode === Mode.Misere && (
          <p className={styles.extrainfowild}>Hint: try to loose ;) </p>
        )}
      </p>
    </>
  )
}
