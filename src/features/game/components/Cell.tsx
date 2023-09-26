import { useAppDispatch, useAppSelector } from "../../../app/hooks"
import { movePlayed } from "../slice"
import styles from "../Game.module.css"
import { Variation } from "../const"
import { RootState } from "../../../app/store"

interface CellProps {
  symbol: PlayerSymbol
  isHighlighted: boolean
  isDisabled: boolean
  id: string
}

export function Cell(props: CellProps) {
  const { currentPlayer, variation } = useAppSelector(
    (state: RootState) => state.game,
  )
  const dispatch = useAppDispatch()

  const onCellClicked = (id: string, symbolPlayed: PlayerSymbol) => {
    dispatch(
      movePlayed({
        symbol: symbolPlayed,
        position: parseInt(id),
      }),
    )
  }

  return (
    <div
      style={{ pointerEvents: props.isDisabled ? "none" : "auto" }}
      className={`${styles.cell} ${props.isHighlighted && styles.highlighted}`}
      onClick={(e) => {
        if (variation === Variation.Standard) {
          return onCellClicked(props.id, currentPlayer.symbol!)
        } else if (variation === Variation.Wild) {
          return onCellClicked(props.id, "X")
        } else {
          throw Error(`Unhandled variation: ${variation}`)
        }
      }}
      onContextMenu={(e) => {
        e.preventDefault()
        if (variation === Variation.Wild) {
          return onCellClicked(props.id, "O")
        }
      }}
    >
      {props.symbol}
    </div>
  )
}
