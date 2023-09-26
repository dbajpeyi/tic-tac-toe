import { useAppDispatch, useAppSelector } from "../../../app/hooks"
import { RootState } from "../../../app/store"
import styles from "../Game.module.css"
import { Mode, VSMode, Variation } from "../const"
import { currentPlayerState, playerTurnChosen } from "../slice"
import { getNextPlayer, isBoardEmpty } from "../utils"

interface TurnTabItemProps {
  playerName: PlayerName
  isUnderlined: boolean
}

interface TurnTabProps {
  currentPlayer: Player
}

function TurnTabItem({ playerName, isUnderlined }: TurnTabItemProps) {
  const { mode, variation, vsMode, currentPlayer, board } = useAppSelector(
    (state: RootState) => state.game,
  )

  const dispatch = useAppDispatch()
  const isClickable =
    vsMode === VSMode.Computer &&
    playerName !== currentPlayer.name &&
    isBoardEmpty(board)
  return (
    <div
      className={`${styles.turntabitem} ${isUnderlined && styles.underlined}`}
      onClick={
        isClickable
          ? () =>
              dispatch(
                playerTurnChosen(
                  getNextPlayer(
                    currentPlayer,
                    variation === Variation.Wild,
                    mode === Mode.Misere,
                    vsMode === VSMode.Computer,
                  ),
                ),
              )
          : undefined
      }
    >
      {playerName}
    </div>
  )
}

function TurnTab({ currentPlayer }: TurnTabProps) {
  const playerNames: PlayerName[] = ["Player 1", "Player 2"]
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
