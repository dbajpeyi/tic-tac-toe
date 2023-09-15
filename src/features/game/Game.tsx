import { useAppDispatch, useAppSelector } from "../../app/hooks"
import {
  PlayerSymbol,
  boardState,
  currentPlayerState,
  gameRestarted,
  movePlayed,
} from "./slice"
import styles from "./Game.module.css"

interface CellProps {
  symbol: PlayerSymbol
  id: string
}

const Cell = (props: CellProps) => {
  const dispatch = useAppDispatch()
  const onCellClicked = (id: string) => {
    dispatch(
      movePlayed({
        player: {
          name: "P1",
        },
        symbol: Math.round(1 + Math.random()) === 1 ? "O" : "X",
        position: parseInt(id),
      }),
    )
  }

  return (
    <div
      style={{ pointerEvents: props.symbol === null ? "auto" : "none" }}
      className={styles.cell}
      onClick={() => onCellClicked(props.id)}
    >
      {props.symbol}
    </div>
  )
}

function Board() {
  const board = useAppSelector(boardState)
  return (
    <div className={styles.grid}>
      {board.map((item) => (
        <Cell {...item} key={item.id} />
      ))}
    </div>
  )
}

export function Game() {
  const currentPlayer = useAppSelector(currentPlayerState)
  const dispatch = useAppDispatch()
  return (
    <>
      <div className={styles.row}>
        {currentPlayer.name}
        <Board />
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
