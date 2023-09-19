import { useAppDispatch, useAppSelector } from "../../app/hooks"
import { boardState, gameRestarted, winningCellsState } from "./slice"
import styles from "./Game.module.css"
import { Board } from "./Board"
import { isBoardEmpty } from "./utils"
import { Settings } from "./Settings"
import { TurnInfo } from "./TurnInfo"

interface DropDownProps {
  name: string
  optionValues: string[]
  isDisabled: boolean
  onSelected: (value: string) => void
}

export function DropDown({
  name,
  optionValues,
  isDisabled,
  onSelected,
}: DropDownProps) {
  return (
    <>
      <select
        name={name}
        onChange={(e) => onSelected(e.target.value)}
        disabled={isDisabled}
      >
        {optionValues.map((value) => (
          <option>{value}</option>
        ))}
      </select>
    </>
  )
}

export function Game() {
  const winningCells = useAppSelector(winningCellsState)
  const board = useAppSelector(boardState)

  const dispatch = useAppDispatch()

  return (
    <>
      <div className={styles.row}>
        <Settings />
      </div>
      <div className={styles.row}>
        <TurnInfo />
      </div>
      <div className={styles.row}>
        <Board cellsToHighlight={winningCells} />
      </div>
      <div className={styles.row}>
        <button
          className={styles.button}
          onClick={() => dispatch(gameRestarted())}
          disabled={isBoardEmpty(board)}
        >
          New game
        </button>
      </div>
    </>
  )
}
