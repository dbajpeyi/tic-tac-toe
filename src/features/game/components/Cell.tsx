import { useAppDispatch, useAppSelector } from "../../../app/hooks"
import { movePlayed } from "../slice"
import styles from "../Game.module.css"
import { Variation } from "../const"
import { RootState } from "../../../app/store"
import XSymbol from "../assets/svg/x.svg?react"
import OSymbol from "../assets/svg/o.svg?react"

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

  const getSymbolSVG = (symbol: PlayerSymbol): JSX.Element | null => {
    switch (symbol) {
      case "X":
        return <XSymbol />
      case "O":
        return <OSymbol />
      default:
        return null
    }
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
      {getSymbolSVG(props.symbol)}
    </div>
  )
}
