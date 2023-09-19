import { useAppDispatch, useAppSelector } from "../../app/hooks"
import {
  GameStatus,
  Player,
  currentPlayerState,
  gameRestarted,
  gameStatusState,
  winningCellsState,
} from "./slice"
import styles from "./Game.module.css"
import { Board } from "./Board"

function getTurnInfoText(
  currentPlayer: Player,
  gameStatus: GameStatus,
): string {
  if (gameStatus === "in-progress") {
    return `${currentPlayer.name}'s turn!`
  } else if (gameStatus === "win") {
    return `${currentPlayer.name} won!`
  } else {
    return "It's a draw!"
  }
}

export function Game() {
  const currentPlayer = useAppSelector(currentPlayerState)
  const winningCells = useAppSelector(winningCellsState)
  const gameStatus = useAppSelector(gameStatusState)
  const dispatch = useAppDispatch()
  return (
    <>
      <div className={styles.row}>
        <p style={{ alignSelf: "center" }}>
          {getTurnInfoText(currentPlayer, gameStatus)}
        </p>
      </div>
      <div className={styles.row}>
        <Board cellsToHighlight={winningCells} />
      </div>
      <div className={styles.row}>
        <button
          className={styles.button}
          onClick={() => dispatch(gameRestarted())}
        >
          Restart game
        </button>
      </div>
    </>
  )
}
