import { useAppSelector } from "../../app/hooks"
import { currentPlayerState, gameStatusState } from "./slice"
import { getTurnInfoText } from "./utils"
import styles from "./Game.module.css"

export function TurnInfo() {
  const currentPlayer = useAppSelector(currentPlayerState)
  const gameStatus = useAppSelector(gameStatusState)
  return (
    <p className={styles.turninfo}>
      {getTurnInfoText(currentPlayer, gameStatus)}
    </p>
  )
}
