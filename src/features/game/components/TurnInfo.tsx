import { useAppDispatch, useAppSelector } from "../../../app/hooks"
import { RootState } from "../../../app/store"
import styles from "../Game.module.css"
import { Mode, VSMode, Variation } from "../const"
import { playerTurnChosen } from "../slice"
import { getNextPlayer, isBoardEmpty } from "../utils"

interface TurnTabItemProps {
  playerName: PlayerName
  isHighlighted: boolean
}

interface TurnTabProps {
  currentPlayer: Player
}

function TurnTabItem({ playerName, isHighlighted }: TurnTabItemProps) {
  const { mode, variation, vsMode, currentPlayer, board } = useAppSelector(
    (state: RootState) => state.game,
  )

  const dispatch = useAppDispatch()
  const isClickable =
    vsMode === VSMode.AI &&
    playerName !== currentPlayer.name &&
    isBoardEmpty(board)
  return (
    <div
      className={`${styles.turntabitem} ${isHighlighted && styles.highlighted}`}
      onClick={
        isClickable
          ? () =>
              dispatch(
                playerTurnChosen(
                  getNextPlayer(
                    currentPlayer,
                    variation === Variation.Wild,
                    mode === Mode.Misere,
                    vsMode === VSMode.AI,
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
          isHighlighted={currentPlayer.name === name}
        />
      ))}
    </div>
  )
}

export function TurnInfo() {
  const { currentPlayer } = useAppSelector((state: RootState) => state.game)
  return (
    <>
      <div className={styles.turninfo}>
        <TurnTab currentPlayer={currentPlayer} />
      </div>
    </>
  )
}
