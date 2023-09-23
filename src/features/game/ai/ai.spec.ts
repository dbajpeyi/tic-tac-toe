import { Variation } from "../const"
import { Board, PlayerSymbol, getInitialBoard } from "../slice"

function createRandomFullBoard(): Board {
  const initialBoard = getInitialBoard()
  const randomMove = (): PlayerSymbol => {
    return Math.random() >= 0.5 ? "X" : "O"
  }
  const randomBoard = initialBoard.map((cell, index) => {
    return { id: cell.id, symbol: randomMove() }
  })
  return randomBoard
}

describe("ai tests", () => {
  describe("getAllPossibleMoves", () => {
    it("should return correct number of moves in standard variation", () => {
      const board = [
        { id: "0", symbol: "X" },
        { id: "1", symbol: "O" },
        { id: "2", symbol: "X" },
        { id: "3", symbol: "O" },
        { id: "4", symbol: "X" },
        { id: "5", symbol: "X" },
        { id: "6", symbol: "O" },
        { id: "7", symbol: "X" },
        { id: "8", symbol: "X" },
      ]
    })
  })
})
