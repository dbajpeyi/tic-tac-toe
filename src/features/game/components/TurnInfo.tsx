import { useAppSelector } from "../../../app/hooks"
import {
  GameStatus,
  Player,
  currentPlayerState,
  gameModeState,
  gameStatusState,
  variationState,
} from "../slice"
import styles from "../Game.module.css"
import { Mode, Variation } from "../const"

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
  const gameStatus = useAppSelector(gameStatusState)
  const mode = useAppSelector(gameModeState)
  const variation = useAppSelector(variationState)
  return (
    <>
      <p className={styles.turninfo}>
        <TurnTab {...currentPlayer} />
        {variation === Variation.Wild && (
          <p className={styles.extrainfomisere}>
            Use left click for "X", and right for "O"
          </p>
        )}
        {mode === Mode.Misere && (
          <p className={styles.extrainfowild}>Hint: try to loose ;) </p>
        )}
      </p>
    </>
  )
}
