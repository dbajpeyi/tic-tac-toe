import { useAppDispatch, useAppSelector } from "../../app/hooks"
import { boardState, newGameStarted, winningCellsState } from "./slice"
import styles from "./Game.module.css"
import { Board } from "./Board"
import { isBoardEmpty } from "./utils"
import { Settings } from "./Settings"
import { TurnInfo } from "./TurnInfo"

export function Game() {
  const winningCells = useAppSelector(winningCellsState)
  const board = useAppSelector(boardState)

  const dispatch = useAppDispatch()

  return (
    <>
      <div className={styles.row}>
        <Settings />
      </div>
      <div className={styles.row}>
        <TurnInfo />
      </div>
      <div className={styles.row}>
        <Board cellsToHighlight={winningCells} />
      </div>
      <div className={styles.row}>
        <button
          className={styles.button}
          onClick={() => dispatch(newGameStarted())}
          disabled={isBoardEmpty(board)}
        >
          New game
        </button>
      </div>
    </>
  )
}
