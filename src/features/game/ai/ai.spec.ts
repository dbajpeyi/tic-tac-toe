import { PlayerType } from "../const"
import { getEmptyBoard } from "../utils"
import { Minimax } from "./ai"

describe("Minimax ai", () => {
  let minimax = null
  describe("in standard variation and regular mode", () => {
    beforeAll(() => {
      minimax = new Minimax(false, false)
    })
    it("should play a blocking next move when consecutive opponent moves", () => {
      // Given a standard, regular game

      // And a board with consecutive opponent moves
      const board: Board = getEmptyBoard()
      board[0].symbol = "X"
      board[1].symbol = "X"
      board[3].symbol = "O"

      // When AI calls 'nextMove'
      const nextMove = minimax!.nextMove(board, {
        name: "Player 2",
        symbol: "X",
        type: PlayerType.AI,
        isMaximizer: true,
      })
      // Then the move is winning
      expect(nextMove).toContain({ symbol: "X", position: 2 })
    })

    it("should play a winning move when two consecutive moves", () => {
      // Given a standard, regular game

      // And a board with consecutive opponent moves
      const board: Board = getEmptyBoard()
      board[0].symbol = "O"
      board[1].symbol = "X"
      board[2].symbol = "X"
      board[3].symbol = "O"

      // When AI calls 'nextMove'
      const nextMove = minimax!.nextMove(board, {
        name: "Player 2",
        symbol: "O",
        type: PlayerType.AI,
        isMaximizer: true,
      })
      // Then the move is winning
      expect(nextMove).toContain({ symbol: "O", position: 6 })
    })
  })
  describe("in standard variation and misere mode", () => {
    beforeAll(() => {
      minimax = new Minimax(false, true)
    })
    it("should play a non blocking next move when consecutive opponent moves", () => {
      // Given a standard, misere game
      const board: Board = getEmptyBoard()
      board[0].symbol = "X"
      board[1].symbol = "X"
      board[3].symbol = "O"

      // When AI calls 'nextMove'
      const nextMove = minimax!.nextMove(board, {
        name: "Player 2",
        symbol: "X",
        type: PlayerType.AI,
        isMaximizer: false,
      })
      // Then the move is non-winning
      expect(nextMove?.position).not.toBe(2)
    })
    it("should force a losing move on the opponent", () => {
      // Given a standard, misere game
      const board: Board = getEmptyBoard()
      board[0].symbol = "X"
      board[1].symbol = "O"
      board[2].symbol = "X"
      board[3].symbol = "O"
      board[4].symbol = "X"
      board[5].symbol = "X"
      board[8].symbol = "O"

      // When AI calls 'nextMove'
      const nextMove = minimax!.nextMove(board, {
        name: "Player 2",
        symbol: "O",
        type: PlayerType.AI,
        isMaximizer: false,
      })
      // Then the move forces human player to lose
      expect(nextMove).toContain({ symbol: "O", position: 7 })
    })
  })
  describe("in wild variation and regular mode", () => {
    beforeAll(() => {
      minimax = new Minimax(true, false)
    })
    it("should play a winning move with the same symbol", () => {
      // Given a wild, regular game
      const board: Board = getEmptyBoard()
      board[0].symbol = "X"
      board[1].symbol = "X"

      // When AI calls 'nextMove'
      const nextMove = minimax!.nextMove(board, {
        name: "Player 2",
        type: PlayerType.AI,
        isMaximizer: true,
      })
      // Then the contains the same symbol as previous move
      expect(nextMove).toContain({ symbol: "X", position: 2 })
    })
    it("should prevent a winning move with the opposite symbol", () => {
      // Given a wild, regular game
      const board: Board = getEmptyBoard()
      board[0].symbol = "X"

      // When AI calls 'nextMove'
      const nextMove = minimax!.nextMove(board, {
        name: "Player 2",
        type: PlayerType.AI,
        isMaximizer: true,
      })
      // Then the move forces human player to lose
      expect(nextMove).toContain({ symbol: "O", position: 1 })
    })
  })
  describe("in wild variation and misere mode", () => {
    beforeAll(() => {
      minimax = new Minimax(true, true)
    })
    it("should play non winning move when necessary", () => {
      // Given a wild, misere game
      const board: Board = getEmptyBoard()
      board[0].symbol = "X"
      board[1].symbol = "X"
      board[3].symbol = "O"
      board[4].symbol = "X"
      board[5].symbol = "O"
      // When AI calls 'nextMove'
      const nextMove = minimax!.nextMove(board, {
        name: "Player 2",
        type: PlayerType.AI,
        isMaximizer: false,
      })
      // Then the move is played in a non winning position
      expect(nextMove).toContain({ symbol: "O", position: 2 })
    })
  })
})
