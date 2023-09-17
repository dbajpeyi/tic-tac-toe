import { useAppDispatch, useAppSelector } from "../../app/hooks"
import {
  PlayerSymbol,
  boardState,
  currentPlayerState,
  gameRestarted,
  movePlayed,
  winningCellsState,
} from "./slice"
import styles from "./Game.module.css"
import { useEffect } from "react"

interface CellProps {
  symbol: PlayerSymbol
  isHighlighted: boolean
  id: string
}

interface BoardProps {
  cellsToHighlight?: number[]
}

const Cell = (props: CellProps) => {
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
      style={{ pointerEvents: props.symbol === null ? "auto" : "none" }}
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
            }}
            key={item.id}
          />
        )
      })}
    </div>
  )
}

export function Game() {
  const currentPlayer = useAppSelector(currentPlayerState)
  const winningCells = useAppSelector(winningCellsState)
  console.log(winningCells)
  const dispatch = useAppDispatch()
  return (
    <>
      <div className={styles.row}>
        {currentPlayer.name}
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
