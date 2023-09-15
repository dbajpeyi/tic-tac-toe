import { useAppSelector } from "../../app/hooks"
import { RootState } from "../../app/store"
import { PlayerSymbol, boardState } from "./slice"
import styles from "./Game.module.css"

interface CellProps {
  symbol: PlayerSymbol
  id: string
}

const Cell = (props: CellProps) => {
  const onCellClicked = (id: string) => {
    console.log(`Cell ${id} was clicked`)
  }

  return (
    <div className={styles.cell} onClick={() => onCellClicked(props.id)}>
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
  return <Board />
}
