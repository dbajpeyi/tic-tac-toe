import { Board, Cell, Move, Player, PlayerSymbol } from "../slice"
import { getGameStatusWithAdjacentCells, isBoardFull } from "../utils"

const MAX_EVALUATION = 10
const MIN_EVALUATION = -10
const DRAW_EVALUATION = 0

function getNewBoardAfterMove(board: Board, move: Move): Board {
  return board.map((cell: Cell) =>
    cell.id === move.position.toString()
      ? { ...cell, symbol: move.symbol }
      : cell,
  )
}

function getAllPossibleMoves(
  board: Board,
  canPlayAnySymbol: boolean,
  symbolToPlay?: PlayerSymbol,
): Move[] {
  const emptyCells: Cell[] = board.filter((cell) => cell.symbol === null)
  return emptyCells.flatMap((emptyCell: Cell) => {
    return canPlayAnySymbol
      ? (["X", "O"] as PlayerSymbol[]).map((symbol) => {
          return { symbol: symbol, position: parseInt(emptyCell.id) }
        })
      : { symbol: symbolToPlay!, position: parseInt(emptyCell.id) }
  })
}

type Status = "win" | "draw" | "in-progress"

function evaluate(status: Status, isMaximizer: boolean): number {
  if (status === "win") {
    return isMaximizer ? MAX_EVALUATION : MIN_EVALUATION
  } else if (status === "draw") {
    return DRAW_EVALUATION
  } else {
    throw new Error(`Unhandled game status ${status}, shouldn't be passed in`)
  }
}

function minimax(
  board: Board,
  isMaximizerTurn: boolean,
  canPlayAnySymbol: boolean,
  depth: number,
  symbolToPlay?: PlayerSymbol,
): number {
  const { gameStatus, adjacentCells } = getGameStatusWithAdjacentCells(board)
  if (gameStatus === "win" || gameStatus === "draw") {
    return evaluate(gameStatus, isMaximizerTurn)
  } else {
    const moves = getAllPossibleMoves(board, canPlayAnySymbol, symbolToPlay)
    let bestEvaluation = isMaximizerTurn ? -Infinity : Infinity
    for (const move of moves) {
      const newBoard = getNewBoardAfterMove(board, move)
      const evaluation = minimax(
        newBoard,
        !isMaximizerTurn,
        canPlayAnySymbol,
        depth + 1,
      )
      bestEvaluation = isMaximizerTurn
        ? Math.max(evaluation, bestEvaluation)
        : Math.min(evaluation, bestEvaluation)
    }
    return bestEvaluation
  }
}

export function nextMove(
  board: Board,
  canPlayAnySymbol: boolean,
  isMaximizer: boolean,
  symbolToPlay?: PlayerSymbol,
): Move | null {
  let nextMove = null
  let bestEvaluation = isMaximizer ? -Infinity : Infinity
  const moves = getAllPossibleMoves(board, canPlayAnySymbol, symbolToPlay)
  for (const move of moves) {
    const newBoard = getNewBoardAfterMove(board, move)
    const evaluation = minimax(
      newBoard,
      !isMaximizer,
      canPlayAnySymbol,
      0,
      symbolToPlay,
    )
    bestEvaluation = isMaximizer
      ? Math.max(bestEvaluation, evaluation)
      : Math.min(bestEvaluation, evaluation)
    nextMove = bestEvaluation === evaluation ? move : nextMove
  }
  return nextMove
}
