import { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "../../../app/hooks"
import styles from "../Game.module.css"
import { Minimax } from "../ai/ai"
import { Mode, VSMode, Variation } from "../const"
import { gameEnded, movePlayed, newGameStarted } from "../slice"
import { isBoardEmpty } from "../utils"
import { Board } from "./Board"
import { Result } from "./Result"
import { Settings } from "./Settings"
import { TurnInfo } from "./TurnInfo"

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
      vsMode === VSMode.AI &&
      gameStatus === "in-progress"
    ) {
      ;(window as any).minimax = new Minimax(
        variation === Variation.Wild,
        mode === Mode.Misere,
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
