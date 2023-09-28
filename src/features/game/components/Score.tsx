import { useAppSelector } from "../../../app/hooks"
import { RootState } from "../../../app/store"
import styles from "../Game.module.css"

export function Score() {
  const { score } = useAppSelector((state: RootState) => state.game)
  return (
    <div className={styles.score}>
      <div>
        <span>Player 1</span> {score.player1}
      </div>
      <div>
        <span>Player 2</span>
        {score.player2}
      </div>
      <div>
        <span>Tie</span>
        {score.tie}
      </div>
    </div>
  )
}
