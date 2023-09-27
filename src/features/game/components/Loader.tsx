import styles from "../Game.module.css"
import { BOARD_SIZE } from "../const"

export function Loader() {
  const fakeBoard = Array.from(Array(BOARD_SIZE * BOARD_SIZE).keys())
  return (
    <>
      <div className={styles.overlay}>
        {fakeBoard.map((fakeCell) => (
          <div key={fakeCell}></div>
        ))}
      </div>
      <div className={styles.loader}>
        <div className={styles.spinner}></div>
      </div>
    </>
  )
}
