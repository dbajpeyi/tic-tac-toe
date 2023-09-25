import { Mode, Variation } from "../const"
import {
  Board,
  Cell,
  GameStatus,
  Move,
  Player,
  PlayerSymbol,
  getNextPlayer,
} from "../slice"
import { getGameStatusWithAdjacentCells } from "../utils"

const MAX_EVALUATION_SCORE = 10
const MIN_EVALUATION_SCORE = -10
const DRAW_EVALUATION_SCORE = 0

export class Minimax {
  #mode: Mode
  #variation: Variation

  constructor(mode: Mode, variation: Variation) {
    this.#mode = mode
    this.#variation = variation
  }

  getNewBoardAfterMove(board: Board, move: Move): Board {
    return board.map((cell: Cell) =>
      cell.id === move.position.toString()
        ? { ...cell, symbol: move.symbol }
        : cell,
    )
  }

  getAllPossibleMoves(board: Board, symbol: PlayerSymbol): Move[] {
    return board
      .filter((cell) => cell.symbol === null)
      .flatMap((emptyCell: Cell) => {
        return symbol === null
          ? (["X", "O"] as PlayerSymbol[]).map((symbol) => {
              return { symbol: symbol, position: parseInt(emptyCell.id) }
            })
          : {
              symbol: symbol,
              position: parseInt(emptyCell.id),
            }
      })
  }

  evaluate(gameStatus: GameStatus, player: Player, depth: number): number {
    if (gameStatus === "win") {
      return player.isMaximizer!
        ? MAX_EVALUATION_SCORE - depth
        : MIN_EVALUATION_SCORE + depth
    } else {
      return DRAW_EVALUATION_SCORE
    }
  }

  minimax(board: Board, depth: number, player: Player): number {
    const { gameStatus, adjacentCells } = getGameStatusWithAdjacentCells(board)
    if (gameStatus === "win" || gameStatus === "draw") {
      return this.evaluate(
        gameStatus,
        this.getOpponentPlayer(player), // evaluate for opponent player as the move was already played
        depth,
      )
    }

    let finalEvaluation = player.isMaximizer! ? -Infinity : Infinity
    const moves = this.getAllPossibleMoves(board, player.symbol ?? null)
    for (const move of moves) {
      const newBoard = this.getNewBoardAfterMove(board, move)
      const evaluation = this.minimax(
        newBoard,
        depth + 1,
        this.getOpponentPlayer(player),
      )
      finalEvaluation = player.isMaximizer!
        ? Math.max(evaluation, finalEvaluation)
        : Math.min(evaluation, finalEvaluation)
    }
    return finalEvaluation
  }

  getOpponentPlayer(player: Player) {
    return getNextPlayer(
      player,
      this.#variation === Variation.Wild,
      this.#mode === Mode.Misere,
      true,
    )
  }

  nextMove(board: Board, aiPlayer: Player): Move | null {
    let bestMove: Move | null = null
    let finalEvaluation = -Infinity
    for (const move of this.getAllPossibleMoves(
      board,
      aiPlayer.symbol ?? null,
    )) {
      const newBoard = this.getNewBoardAfterMove(board, move)
      let evaluation = this.minimax(
        newBoard,
        0,
        this.getOpponentPlayer(aiPlayer),
      )
      if (evaluation > finalEvaluation) {
        finalEvaluation = evaluation
        bestMove = move
      }
    }
    return bestMove
  }
}
