import { Board, GameStatus, Player } from "./slice"

export function isBoardEmpty(board: Board) {
  return board.every((cell) => cell.symbol === null)
}

export function isBoardFull(board: Board) {
  return board.every((cell) => cell.symbol !== null)
}

export function getTurnInfoText(
  currentPlayer: Player,
  gameStatus: GameStatus,
): string {
  if (gameStatus === "in-progress") {
    return `${currentPlayer.name}'s turn!`
  } else if (gameStatus === "win") {
    return `${currentPlayer.name} won!`
  } else {
    return "It's a draw!"
  }
}
