import { useAppDispatch, useAppSelector } from "../../app/hooks"
import {
  boardState,
  gameModeState,
  modeSelected,
  variationSelected,
  variationState,
  vsModeSelected,
  vsModeState,
} from "./slice"
import { Mode, VSMode, Variation } from "./const"
import { isBoardEmpty } from "./utils"

interface DropDownProps {
  name: string
  optionValues: string[]
  defaultValue: string
  isDisabled: boolean
  onSelected: (value: string) => void
}

export function DropDown({
  name,
  optionValues,
  isDisabled,
  defaultValue,
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
          <option selected={value === defaultValue}>{value}</option>
        ))}
      </select>
    </>
  )
}

export function Settings() {
  const board = useAppSelector(boardState)
  const variation = useAppSelector(variationState)
  const mode = useAppSelector(gameModeState)
  const vsMode = useAppSelector(vsModeState)
  const dispatch = useAppDispatch()

  const onVariationSelected = (value: string) => {
    switch (value) {
      case "Standard":
        return dispatch(variationSelected(Variation.Standard))
      case "Wild":
        return dispatch(variationSelected(Variation.Wild))
      default:
        throw new Error(`${value} is not a valid variation!`)
    }
  }

  const onModeSelected = (value: string) => {
    switch (value) {
      case "Regular":
        return dispatch(modeSelected(Mode.Regular))
      case "Misere":
        return dispatch(modeSelected(Mode.Misere))
      default:
        throw new Error(`${value} is not a valid mode!`)
    }
  }
  const onVsModeSelected = (value: string) => {
    switch (value) {
      case "2P":
        return dispatch(vsModeSelected(VSMode.Human))
      case "AI":
        return dispatch(vsModeSelected(VSMode.Computer))
      default:
        throw new Error(`${value} is not a valid versus mode!`)
    }
  }
  return (
    <>
      <DropDown
        name={"Variation"}
        optionValues={[Variation.Standard, Variation.Wild]}
        defaultValue={variation}
        isDisabled={!isBoardEmpty(board)}
        onSelected={onVariationSelected}
      />
      <DropDown
        name={"Mode"}
        optionValues={[Mode.Regular, Mode.Misere]}
        defaultValue={mode}
        isDisabled={!isBoardEmpty(board)}
        onSelected={onModeSelected}
      />
      <DropDown
        name={"VS. mode"}
        optionValues={[VSMode.Human, VSMode.Computer]}
        defaultValue={vsMode}
        isDisabled={!isBoardEmpty(board)}
        onSelected={onVsModeSelected}
      />
    </>
  )
}
