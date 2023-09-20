import { useAppDispatch, useAppSelector } from "../../app/hooks"
import {
  PlayerSymbol,
  currentPlayerState,
  movePlayed,
  variationState,
} from "./slice"
import styles from "./Game.module.css"
import { Variation } from "./const"

interface CellProps {
  symbol: PlayerSymbol
  isHighlighted: boolean
  isDisabled: boolean
  id: string
}

export function Cell(props: CellProps) {
  const dispatch = useAppDispatch()
  const currentPlayer = useAppSelector(currentPlayerState)
  const variation = useAppSelector(variationState)

  const onCellClicked = (id: string, symbolPlayed: PlayerSymbol) => {
    dispatch(
      movePlayed({
        player: currentPlayer,
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
          throw Error(`Unhan`)
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
