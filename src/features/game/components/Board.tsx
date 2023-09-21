import { useAppSelector } from "../../../app/hooks"
import { boardState } from "../slice"
import styles from "../Game.module.css"
import { Cell } from "./Cell"

export interface BoardProps {
  cellsToHighlight?: number[]
}

export function Board(props: BoardProps) {
  const board = useAppSelector(boardState)
  return (
    <div className={styles.grid}>
      {board.map((item) => {
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
