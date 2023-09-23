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
import { Mode, PlayerType, Variation } from "../const"
import { nextMove } from "../ai/ai"

export function Game() {
  const adjacentCells = useAppSelector(adjacentCellsState)
  const board = useAppSelector(boardState)
  const currentPlayer = useAppSelector(currentPlayerState)
  const vsMode = useAppSelector(vsModeState)
  const mode = useAppSelector(gameModeState)
  const variation = useAppSelector(variationState)

  const dispatch = useAppDispatch()
  // useEffect(() => {
  //   console.log("Dispatching")
  //   if (currentPlayer.name === "Player 2") {
  //     const move = nextMove(
  //       board,
  //       variation === Variation.Wild,
  //       mode === Mode.Misere,
  //     )
  //     console.log(move)
  //     if (move === null) {
  //       throw new Error("move cannot be null")
  //     } else {
  //       dispatch(movePlayed(move))
  //     }
  //   }
  // }, [currentPlayer, vsMode])

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
