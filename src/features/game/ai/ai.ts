import { Mode, VSMode, Variation } from "../const"
import { Board, Cell, GameStatus, Move, Player, getNextPlayer } from "../slice"
import { getGameStatusWithAdjacentCells } from "../utils"

export class Minimax {
  #currentPlayer: Player
  #mode: Mode
  #variation: Variation

  constructor(currentPlayer: Player, mode: Mode, variation: Variation) {
    this.#currentPlayer = currentPlayer
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

  getAllPossibleMoves(board: Board, symbol: "X" | "O"): Move[] {
    return board
      .filter((cell) => cell.symbol === null)
      .flatMap((emptyCell: Cell) => {
        return {
          symbol: symbol,
          position: parseInt(emptyCell.id),
        }
      })
  }

  evaluate(
    board: Board,
    gameStatus: GameStatus,
    adjacentCells: number[],
    player: Player,
  ) {
    if (gameStatus === "win") {
      if (
        player.symbol! === board[adjacentCells[0]].symbol &&
        player.isMaximizer
      ) {
        return 10
      } else {
        return -10
      }
    } else {
      return 0
    }
  }

  minimax(board: Board, depth: number, player: Player) {
    const { gameStatus, adjacentCells } = getGameStatusWithAdjacentCells(board)
    if (gameStatus === "win" || gameStatus === "draw") {
      return this.evaluate(
        board,
        gameStatus,
        adjacentCells!,
        this.getOpponentPlayer(player), // evaluate for opponent player as the move was already played
      )
    }

    if (player.isMaximizer!) {
      let finalEvaluation = -Infinity
      const moves = this.getAllPossibleMoves(board, player.symbol!)
      for (const move of moves) {
        const newBoard = this.getNewBoardAfterMove(board, move)
        const evaluation = this.minimax(
          newBoard,
          depth + 1,
          this.getOpponentPlayer(player),
        )
        finalEvaluation = Math.max(evaluation, finalEvaluation)
      }
      return finalEvaluation
    } else {
      let finalEvaluation = Infinity
      const moves = this.getAllPossibleMoves(board, player.symbol!)
      for (const move of moves) {
        const newBoard = this.getNewBoardAfterMove(board, move)
        const evaluation = this.minimax(
          newBoard,
          depth + 1,
          this.getOpponentPlayer(player),
        )
        finalEvaluation = Math.min(evaluation, finalEvaluation)
      }
      return finalEvaluation
    }
  }

  getOpponentPlayer(player: Player) {
    return getNextPlayer(
      player,
      this.#variation === Variation.Wild,
      this.#mode === Mode.Misere,
      true,
    )
  }

  nextMove(board: Board): Move | null {
    let nextMove: Move | null = null
    let finalEvaluation = -Infinity
    for (const move of this.getAllPossibleMoves(
      board,
      this.#currentPlayer.symbol!,
    )) {
      const newBoard = this.getNewBoardAfterMove(board, move)
      let evaluation = this.minimax(
        newBoard,
        0,
        this.getOpponentPlayer(this.#currentPlayer),
      )
      if (evaluation > finalEvaluation) {
        finalEvaluation = evaluation
        nextMove = move
      }
    }
    return nextMove
  }
}
