import { PlayerType } from "../const"
import { getEmptyBoard, getIsMaximizer } from "../utils"
import {
  getDefaultFirstPlayer,
  getGameStatusWithAdjacentCells,
  getNextPlayer,
  isBoardEmpty,
  isBoardFull,
} from "../utils"

function createRandomFullBoard(): Board {
  const initialBoard = getEmptyBoard()
  const randomMove = (): PlayerSymbol => {
    return Math.random() >= 0.5 ? "X" : "O"
  }
  const randomBoard = initialBoard.map((cell, index) => {
    return { id: cell.id, symbol: randomMove() }
  })
  return randomBoard
}

describe("utils", () => {
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

  describe("getIsMaximizer", () => {
    describe("vs. AI", () => {
      it("should return false for human and true for AI player in regular mode", () => {
        expect(getIsMaximizer(true, PlayerType.Human, false)).toBe(false)
        expect(getIsMaximizer(true, PlayerType.AI, false)).toBe(true)
      })
      it("should return true for human and false for AI in misere mode", () => {
        expect(getIsMaximizer(true, PlayerType.Human, true)).toBe(true)
        expect(getIsMaximizer(true, PlayerType.AI, true)).toBe(false)
      })
    })
    describe("2P", () => {
      it("should always be undefined", () => {
        expect(getIsMaximizer(false, PlayerType.Human, false)).toBeUndefined()
        expect(getIsMaximizer(false, PlayerType.AI, false)).toBeUndefined()
        expect(getIsMaximizer(false, PlayerType.Human, true)).toBeUndefined()
        expect(getIsMaximizer(false, PlayerType.AI, true)).toBeUndefined()
      })
    })
  })

  describe("isBoardEmpty", () => {
    it("should return true for empty board", () => {
      const emptyBoard = getEmptyBoard()
      expect(isBoardEmpty(emptyBoard)).toBe(true)
    })

    it("should return false for non-empty board", () => {
      const board = getEmptyBoard()
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
      const board = getEmptyBoard()
      board[0].symbol = "X"
      board[1].symbol = "O"
      expect(isBoardFull(board)).toBe(false)
    })
  })

  describe("getGameStatusWithadjacentCells", () => {
    it('should return "in-progress" status and no winning cells when board is in progress', () => {
      const board = getEmptyBoard()
      board[0].symbol = "X"
      const { gameStatus, adjacentCells } =
        getGameStatusWithAdjacentCells(board)
      expect(gameStatus).toBe("in-progress")
      expect(adjacentCells).toBeUndefined()
    })

    it('should return "win" status and winning cells when board is in winning state', () => {
      const board = getEmptyBoard()
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
