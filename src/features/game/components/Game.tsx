import { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "../../../app/hooks"
import styles from "../Game.module.css"
import { VSMode } from "../const"
import {
  endGame,
  initWorkerIfNeeded,
  newGameStarted,
  playAiMove,
} from "../slice"
import { isBoardEmpty } from "../utils"
import { Board } from "./Board"
import { Result } from "./Result"
import { Settings } from "./Settings"
import { TurnInfo } from "./TurnInfo"
import { Loader } from "./Loader"

export function Game() {
  const {
    adjacentCells,
    vsMode,
    currentPlayer,
    board,
    gameStatus,
    shouldShowResult,
    isAiThinking,
  } = useAppSelector((state) => state.game)
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(initWorkerIfNeeded())
  })

  useEffect(() => {
    if (
      currentPlayer.name === "Player 2" &&
      vsMode === VSMode.AI &&
      gameStatus === "in-progress" &&
      !isAiThinking!
    ) {
      dispatch(playAiMove())
    }
  })

  useEffect(() => {
    if (hasGameEnded && !shouldShowResult) {
      dispatch(endGame())
    }
  })
  const hasGameEnded = gameStatus === "win" || gameStatus === "draw"

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
          <>
            {isAiThinking! && <Loader />}
            <Board cellsToHighlight={adjacentCells} />
          </>
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
