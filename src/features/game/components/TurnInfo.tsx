import { useAppDispatch, useAppSelector } from "../../../app/hooks"
import { Player, currentPlayerState, vsModeState } from "../slice"
import styles from "../Game.module.css"
import { VSMode } from "../const"

interface TurnTabItemProps {
  playerName: string
  isUnderlined: boolean
}

interface TurnTabProps {
  currentPlayer: Player
}

function TurnTabItem({ playerName, isUnderlined }: TurnTabItemProps) {
  const vsMode = useAppSelector(vsModeState)
  const dispatch = useAppDispatch()
  const isClickable = vsMode === VSMode.Computer
  const handleClick = () => {}
  return (
    <div
      className={`${styles.turntabitem} ${isUnderlined && styles.underlined}`}
      onClick={isClickable ? () => handleClick() : undefined}
    >
      {playerName}
    </div>
  )
}

function TurnTab({ currentPlayer }: TurnTabProps) {
  const playerNames = ["Player 1", "Player 2"]
  return (
    <div className={styles.turntab}>
      {playerNames.map((name) => (
        <TurnTabItem
          key={name.replace(" ", "-")}
          playerName={name}
          isUnderlined={currentPlayer.name === name}
        />
      ))}
    </div>
  )
}

export function TurnInfo() {
  const currentPlayer = useAppSelector(currentPlayerState)
  return (
    <>
      <div className={styles.turninfo}>
        <TurnTab currentPlayer={currentPlayer} />
      </div>
    </>
  )
}
