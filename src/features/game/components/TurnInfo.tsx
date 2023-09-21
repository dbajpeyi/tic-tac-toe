import { useAppSelector } from "../../../app/hooks"
import { Player, currentPlayerState } from "../slice"
import styles from "../Game.module.css"

interface TurnTabItemProps {
  playerName: string
  isUnderlined: boolean
}

function TurnTabItem({ playerName, isUnderlined }: TurnTabItemProps) {
  return (
    <div
      className={`${styles.turntabitem} ${isUnderlined && styles.underlined}`}
    >
      {playerName}
    </div>
  )
}

function TurnTab(currentPlayer: Player) {
  const playerNames = ["Player 1", "Player 2"]
  return (
    <div className={styles.turntab}>
      {playerNames.map((name) => (
        <TurnTabItem
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
      <p className={styles.turninfo}>
        <TurnTab {...currentPlayer} />
      </p>
    </>
  )
}
