import { useAppDispatch, useAppSelector } from "../../app/hooks"
import {
  GameStatus,
  Player,
  PlayerSymbol,
  boardState,
  currentPlayerState,
  gameRestarted,
  gameStatusState,
  movePlayed,
  winningCellsState,
} from "./slice"
import styles from "./Game.module.css"
import { useEffect } from "react"

interface CellProps {
  symbol: PlayerSymbol
  isHighlighted: boolean
  isDisabled: boolean
  id: string
}

interface BoardProps {
  cellsToHighlight?: number[]
}

function Cell(props: CellProps) {
  const dispatch = useAppDispatch()
  const currentPlayer = useAppSelector(currentPlayerState)
  const onCellClicked = (id: string) => {
    dispatch(
      movePlayed({
        player: currentPlayer,
        symbol: currentPlayer.symbol!,
        position: parseInt(id),
      }),
    )
  }

  return (
    <div
      style={{ pointerEvents: props.isDisabled ? "none" : "auto" }}
      className={`${styles.cell} ${props.isHighlighted && styles.highlighted}`}
      onClick={() => onCellClicked(props.id)}
    >
      {props.symbol}
    </div>
  )
}

function Board(props: BoardProps) {
  const board = useAppSelector(boardState)
  return (
    <div className={styles.grid}>
      {board.map((item) => {
        console.log(item, props.cellsToHighlight)
        return (
          <Cell
            {...{
              ...item,
              isHighlighted: props.cellsToHighlight
                ? props.cellsToHighlight.includes(+item.id)
                : false,
              isDisabled: item.symbol != null || props.cellsToHighlight != null,
            }}
            key={item.id}
          />
        )
      })}
    </div>
  )
}

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
