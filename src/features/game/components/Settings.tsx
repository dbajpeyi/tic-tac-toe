import { useAppDispatch, useAppSelector } from "../../../app/hooks"
import { RootState } from "../../../app/store"
import styles from "../Game.module.css"
import { Mode, VSMode, Variation } from "../const"
import { modeSelected, variationSelected, vsModeSelected } from "../slice"
import { isBoardEmpty } from "../utils"

interface DropDownProps {
  name: string
  optionValues: string[]
  defaultValue: string
  isDisabled: boolean
  onSelected: (value: string) => void
}

interface HintProps {
  shouldShowVariationHint: boolean
  shouldShowModeHint: boolean
  shouldShowAiHint: boolean
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
          <option key={value} selected={value === defaultValue}>
            {value}
          </option>
        ))}
      </select>
    </>
  )
}

function Hint({
  shouldShowModeHint,
  shouldShowVariationHint,
  shouldShowAiHint,
}: HintProps) {
  return (
    <div>
      {shouldShowVariationHint && (
        <p className={styles.wildhint}>
          Use left click for "X", and right for "O"
        </p>
      )}
      {shouldShowModeHint && (
        <p className={styles.miserehint}>Hint: try to loose ;) </p>
      )}
      {shouldShowAiHint && (
        <p className={styles.miserehint}>
          Start game or choose player (Player 1 always goes first){" "}
        </p>
      )}
    </div>
  )
}

export function Settings() {
  const { board, variation, mode, vsMode } = useAppSelector(
    (state: RootState) => state.game,
  )
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
        return dispatch(vsModeSelected(VSMode.AI))
      default:
        throw new Error(`${value} is not a valid versus mode!`)
    }
  }
  return (
    <div>
      <div className={styles.row}>
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
          optionValues={[VSMode.Human, VSMode.AI]}
          defaultValue={vsMode}
          isDisabled={!isBoardEmpty(board)}
          onSelected={onVsModeSelected}
        />
      </div>
      <div className={`${styles.row} ${styles.hint}`}>
        <Hint
          shouldShowModeHint={mode === Mode.Misere}
          shouldShowVariationHint={variation === Variation.Wild}
          shouldShowAiHint={vsMode === VSMode.AI}
        />
      </div>
    </div>
  )
}
