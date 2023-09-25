import { useAppSelector } from "../../../app/hooks"
import { RootState } from "../../../app/store"
import styles from "../Game.module.css"
import { Mode, VSMode, Variation } from "../const"
import { GameStatus } from "../slice"
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

  return (
    <div className={styles.result}>
      Game over,{" "}
      {isWin
        ? mode === Mode.Misere
          ? `${nextPlayer.name} won!`
          : `${currentPlayer.name} won!`
        : "it's a draw"}
    </div>
  )
}
