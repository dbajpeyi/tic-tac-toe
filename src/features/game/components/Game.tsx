import { useAppDispatch, useAppSelector } from "../../../app/hooks"
import {
  boardState,
  newGameStarted,
  adjacentCellsState,
  currentPlayerState,
  vsModeState,
  movePlayed,
  variationState,
  gameModeState,
} from "../slice"
import styles from "../Game.module.css"
import { Board } from "./Board"
import { isBoardEmpty } from "../utils"
import { Settings } from "./Settings"
import { TurnInfo } from "./TurnInfo"
import { useEffect } from "react"
import { VSMode } from "../const"
import { Minimax } from "../ai/ai"

export function Game() {
  const adjacentCells = useAppSelector(adjacentCellsState)
  const board = useAppSelector(boardState)
  const currentPlayer = useAppSelector(currentPlayerState)
  const vsMode = useAppSelector(vsModeState)
  const mode = useAppSelector(gameModeState)
  const variation = useAppSelector(variationState)

  const dispatch = useAppDispatch()
  useEffect(() => {
    if (currentPlayer.name === "Player 2" && vsMode === VSMode.Computer) {
      ;(window as any).minimax =
        (window as any).minimax != null
          ? (window as any).minimax
          : new Minimax(currentPlayer, mode, variation)
      const move = (window as any).minimax.nextMove(board)
      if (move === null) {
        throw new Error("move cannot be null")
      } else {
        dispatch(movePlayed(move))
      }
    }
  }, [currentPlayer])

  return (
    <>
      <div className={styles.row}>
        <Settings />
      </div>
      <div className={styles.row}>
        <TurnInfo />
      </div>
      <div className={styles.row}>
        <Board cellsToHighlight={adjacentCells} />
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
