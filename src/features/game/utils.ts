import { Variation, winningCellArrangement } from "./const"
import { Board, GameStatus, Player } from "./slice"

export function isBoardEmpty(board: Board) {
  return board.every((cell) => cell.symbol === null)
}

export function isBoardFull(board: Board) {
  return board.every((cell) => cell.symbol !== null)
}

export function getNextPlayer(
  currentPlayerName: "Player 1" | "Player 2",
  variation: Variation,
): Player {
  const isWild = variation === Variation.Wild
  if (currentPlayerName === "Player 1") {
    return {
      name: "Player 2",
      symbol: isWild ? null : "O",
    }
  } else {
    return {
      name: "Player 1",
      symbol: isWild ? null : "X",
    }
  }
}

export function getGameStatusWithWinningCells(board: Board): {
  gameStatus: GameStatus
  winningCells?: number[]
} {
  const arrangement = winningCellArrangement
    .flatMap((cells: number[]) => {
      return {
        item: cells.map((index: number) => board[index].symbol).join(""),
        cells,
      }
    })
    .find(({ item, cells }) => item === "XXX" || item === "OOO")
  if (arrangement !== undefined) {
    return { gameStatus: "win", winningCells: arrangement.cells }
  } else if (isBoardFull(board)) {
    return { gameStatus: "draw" }
  } else {
    return { gameStatus: "in-progress" }
  }
}
