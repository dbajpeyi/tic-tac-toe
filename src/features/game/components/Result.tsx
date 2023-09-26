import { useAppSelector } from "../../../app/hooks"
import { RootState } from "../../../app/store"
import styles from "../Game.module.css"
import { Mode, VSMode, Variation } from "../const"
import { GameStatus, Player } from "../slice"
import { getNextPlayer } from "../utils"

interface ResultProps {
  isWin: boolean
}

export function Result({ isWin }: ResultProps) {
  const { mode, variation, currentPlayer, vsMode } = useAppSelector(
    (state: RootState) => state.game,
  )
  const nextPlayer = getNextPlayer(
    currentPlayer,
    variation === Variation.Wild,
    mode === Mode.Misere,
    vsMode === VSMode.Computer,
  )

  const winnerPlayer: Player | null = isWin
    ? mode === Mode.Misere
      ? nextPlayer
      : currentPlayer
    : null

  return (
    <div className={styles.result}>
      <span>{"Game over, "}</span>
      {winnerPlayer != null ? (
        <span>{winnerPlayer.name} won!</span>
      ) : (
        <span>it's a draw!</span>
      )}
    </div>
  )
}
