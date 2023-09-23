import { VSMode, Variation, adjacentCellArrangement } from "./const"
import { Board, GameStatus, Player } from "./slice"

export function isBoardEmpty(board: Board): boolean {
  return board.every((cell) => cell.symbol === null)
}

export function isBoardFull(board: Board): boolean {
  return board.every((cell) => cell.symbol !== null)
}

export function getGameStatusWithAdjacentCells(board: Board): {
  gameStatus: GameStatus
  adjacentCells?: number[]
} {
  const arrangement = adjacentCellArrangement
    .flatMap((cells: number[]) => {
      return {
        item: cells.map((index: number) => board[index].symbol).join(""),
        cells,
      }
    })
    .find(({ item, cells }) => item === "XXX" || item === "OOO")
  if (arrangement !== undefined) {
    return { gameStatus: "win", adjacentCells: arrangement.cells }
  } else if (isBoardFull(board)) {
    return { gameStatus: "draw" }
  } else {
    return { gameStatus: "in-progress" }
  }
}
