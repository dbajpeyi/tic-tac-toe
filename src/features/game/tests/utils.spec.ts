import { Mode, VSMode, Variation } from "../const"
import {
  Board,
  PlayerSymbol,
  getDefaultFirstPlayer,
  getInitialBoard,
  getNextPlayer,
} from "../slice"
import {
  getGameStatusWithAdjacentCells,
  isBoardEmpty,
  isBoardFull,
} from "../utils"

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

describe("utils tests", () => {
  describe("getNextPlayer", () => {
    it("should return the next player with symbol in standard variation", () => {
      const nextPlayer = getNextPlayer(
        getDefaultFirstPlayer(false, false, true),
        false,
        false,
        false,
      )
      expect(nextPlayer).toContain({ name: "Player 2", symbol: "O" })
    })

    it("return the next player without symbol in wild variation", () => {
      const nextPlayer = getNextPlayer(
        getDefaultFirstPlayer(false, false, false),
        true,
        false,
        false,
      )
      expect(nextPlayer).toContain({ name: "Player 2" })
      expect(nextPlayer.symbol).toBeUndefined()
    })
  })

  describe("isBoardEmpty", () => {
    it("should return true for empty board", () => {
      const emptyBoard = getInitialBoard()
      expect(isBoardEmpty(emptyBoard)).toBe(true)
    })

    it("should return false for non-empty board", () => {
      const board = getInitialBoard()
      board[0].symbol = "O"
      expect(isBoardEmpty(board)).toBe(false)
    })
  })

  describe("isBoardFull", () => {
    it("should return true for full board", () => {
      const fullBoard = createRandomFullBoard()
      expect(isBoardFull(fullBoard)).toBe(true)
    })

    it("should return false for non-empty board", () => {
      const board = getInitialBoard()
      board[0].symbol = "X"
      board[1].symbol = "O"
      expect(isBoardFull(board)).toBe(false)
    })
  })

  describe("getGameStatusWithadjacentCells", () => {
    it('should return "in-progress" status and no winning cells when board is in progress', () => {
      const board = getInitialBoard()
      board[0].symbol = "X"
      const { gameStatus, adjacentCells } =
        getGameStatusWithAdjacentCells(board)
      expect(gameStatus).toBe("in-progress")
      expect(adjacentCells).toBeUndefined()
    })

    it('should return "win" status and winning cells when board is in winning state', () => {
      const board = getInitialBoard()
      const cellsPlayed = [0, 1, 2]
      cellsPlayed.forEach((cell) => (board[cell].symbol = "X"))
      const { gameStatus, adjacentCells } =
        getGameStatusWithAdjacentCells(board)
      expect(gameStatus).toBe("win")
      expect(adjacentCells).toEqual(cellsPlayed)
    })

    it('should return "draw" status and no winning cells when the board is in draw state', () => {
      const board: Board = [
        { id: "0", symbol: "X" },
        { id: "1", symbol: "O" },
        { id: "2", symbol: "X" },
        { id: "3", symbol: "X" },
        { id: "4", symbol: "O" },
        { id: "5", symbol: "O" },
        { id: "6", symbol: "O" },
        { id: "7", symbol: "X" },
        { id: "8", symbol: "X" },
      ]
      const { gameStatus, adjacentCells } =
        getGameStatusWithAdjacentCells(board)
      expect(gameStatus).toBe("draw")
      expect(adjacentCells).toBeUndefined()
    })
  })
})
