import { useAppSelector } from "../../app/hooks"
import { currentPlayerState, gameStatusState } from "./slice"
import { getTurnInfoText } from "./utils"

export function TurnInfo() {
  const currentPlayer = useAppSelector(currentPlayerState)
  const gameStatus = useAppSelector(gameStatusState)
  return (
    <p style={{ alignSelf: "center" }}>
      {getTurnInfoText(currentPlayer, gameStatus)}
    </p>
  )
}
