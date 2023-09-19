import { useAppDispatch, useAppSelector } from "../../app/hooks"
import { PlayerSymbol, currentPlayerState, movePlayed } from "./slice"
import styles from "./Game.module.css"

interface CellProps {
  symbol: PlayerSymbol
  isHighlighted: boolean
  isDisabled: boolean
  id: string
}

export function Cell(props: CellProps) {
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
