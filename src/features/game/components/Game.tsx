import { useAppDispatch, useAppSelector } from "../../../app/hooks"
import {
  newGameStarted,
  movePlayed,
  State,
  gameStatusState,
  gameEnded,
} from "../slice"
import styles from "../Game.module.css"
import { Board } from "./Board"
import { isBoardEmpty, isBoardFull } from "../utils"
import { Settings } from "./Settings"
import { TurnInfo } from "./TurnInfo"
import { useEffect } from "react"
import { Mode, VSMode, Variation } from "../const"
import { Minimax } from "../ai/ai"
import { Result } from "./Result"

export function Game() {
  const {
    adjacentCells,
    mode,
    variation,
    vsMode,
    currentPlayer,
    board,
    gameStatus,
    shouldShowResult,
  } = useAppSelector((state) => state.game)
  const dispatch = useAppDispatch()
  useEffect(() => {
    if (
      currentPlayer.name === "Player 2" &&
      vsMode === VSMode.Computer &&
      gameStatus === "in-progress"
    ) {
      ;(window as any).minimax = new Minimax(
        mode === Mode.Misere,
        variation === Variation.Wild,
      )
      const move = (window as any).minimax.nextMove(board, currentPlayer)
      if (move === null) {
        throw new Error("move cannot be null")
      } else {
        dispatch(movePlayed(move))
      }
    }
  })

  const hasGameEnded = gameStatus === "win" || gameStatus === "draw"

  useEffect(() => {
    if (hasGameEnded && !shouldShowResult) {
      dispatch(gameEnded())
    }
  })

  return (
    <>
      <div className={styles.row}>
        <Settings />
      </div>
      <div className={styles.row}>
        <TurnInfo />
      </div>
      <div className={styles.row}>
        {shouldShowResult ? (
          <Result isWin={gameStatus === "win"} />
        ) : (
          <Board cellsToHighlight={adjacentCells} />
        )}
      </div>
      <div className={styles.row}>
        {shouldShowResult && (
          <button
            className={styles.button}
            onClick={() => dispatch(newGameStarted())}
            disabled={isBoardEmpty(board)}
          >
            New game
          </button>
        )}
      </div>
    </>
  )
}
