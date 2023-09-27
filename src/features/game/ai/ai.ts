import { getGameStatusWithAdjacentCells, getNextPlayer } from "../utils"

const MAX_EVALUATION_SCORE = 10
const MIN_EVALUATION_SCORE = -10
const DRAW_EVALUATION_SCORE = 0

export class Minimax {
  #isWild: boolean
  #isMisere: boolean

  constructor(isWild: boolean, isMisere: boolean) {
    this.#isMisere = isMisere
    this.#isWild = isWild
  }

  #getNewBoardAfterMove(board: Board, move: Move): Board {
    return board.map((cell: Cell) =>
      cell.id === move.position.toString()
        ? { ...cell, symbol: move.symbol }
        : cell,
    )
  }

  #getAllPossibleMoves(board: Board, symbol: PlayerSymbol): Move[] {
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

  #evaluate(gameStatus: GameStatus, player: Player, depth: number): number {
    if (gameStatus === "win") {
      return player.isMaximizer!
        ? MAX_EVALUATION_SCORE - depth
        : MIN_EVALUATION_SCORE + depth
    } else {
      return DRAW_EVALUATION_SCORE
    }
  }

  #minimax(
    board: Board,
    depth: number,
    player: Player,
    alpha: number,
    beta: number,
  ): number {
    const gameStatus = getGameStatusWithAdjacentCells(board).gameStatus
    if (gameStatus === "win" || gameStatus === "draw") {
      return this.#evaluate(
        gameStatus,
        this.#getOpponentPlayer(player), // evaluate for opponent player as the move was already played
        depth,
      )
    }

    const moves = this.#getAllPossibleMoves(board, player.symbol ?? null)
    if (player.isMaximizer!) {
      let finalEvaluation = -Infinity
      for (const move of moves) {
        const newBoard = this.#getNewBoardAfterMove(board, move)
        const evaluation = this.#minimax(
          newBoard,
          depth + 1,
          this.#getOpponentPlayer(player),
          alpha,
          beta,
        )
        finalEvaluation = Math.max(evaluation, finalEvaluation)
        alpha = Math.max(alpha, finalEvaluation)
        if (beta <= alpha) {
          break
        }
      }
      return finalEvaluation
    } else {
      let finalEvaluation = Infinity
      for (const move of moves) {
        const newBoard = this.#getNewBoardAfterMove(board, move)
        const evaluation = this.#minimax(
          newBoard,
          depth + 1,
          this.#getOpponentPlayer(player),
          alpha,
          beta,
        )
        finalEvaluation = Math.min(evaluation, finalEvaluation)
        beta = Math.min(beta, finalEvaluation)
        if (beta <= alpha) {
          break
        }
      }
      return finalEvaluation
    }
  }

  #getOpponentPlayer(player: Player): Player {
    return getNextPlayer(player, this.#isWild, this.#isMisere, true)
  }

  public nextMove(board: Board, aiPlayer: Player): Move | null {
    if (!this.#isWild && aiPlayer.symbol == null) {
      throw new Error(
        "Cannot play next move without a symbol when game is in standard variation",
      )
    } else {
      let bestMove = null
      let finalEvaluation = -Infinity
      const moves = this.#getAllPossibleMoves(board, aiPlayer.symbol ?? null)
      for (const move of moves) {
        const newBoard = this.#getNewBoardAfterMove(board, move)
        let evaluation = this.#minimax(
          newBoard,
          0,
          this.#getOpponentPlayer(aiPlayer),
          -Infinity,
          Infinity,
        )
        if (evaluation > finalEvaluation) {
          finalEvaluation = evaluation
          bestMove = move
        }
      }
      return bestMove
    }
  }
}
