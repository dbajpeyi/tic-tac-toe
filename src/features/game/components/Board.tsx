import { useAppSelector } from "../../../app/hooks"
import styles from "../Game.module.css"
import { Cell } from "./Cell"
import { RootState } from "../../../app/store"

export interface BoardProps {
  cellsToHighlight?: number[]
}

export function Board(props: BoardProps) {
  const { board, isAiThinking } = useAppSelector(
    (state: RootState) => state.game,
  )

  const isCellDisabled = (cell: Cell) => {
    return (
      cell.symbol != null || props.cellsToHighlight != null || isAiThinking!
    )
  }

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
              isDisabled: isCellDisabled(item),
            }}
            key={item.id}
          />
        )
      })}
    </div>
  )
}
