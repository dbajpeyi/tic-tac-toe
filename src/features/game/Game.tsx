import { useAppSelector } from "../../app/hooks"
import { RootState } from "../../app/store"
import { boardState } from "./slice"

function Cell() {}

function Board() {
  const board = useAppSelector(boardState)
  console.log("BOARD", board)
  return board.map((cell) => <div key={cell.id}>{cell.symbol}</div>)
}

export function Game() {
  return <Board />
}
