import { BOARD_SIZE, PlayerType, adjacentCellArrangement } from "./const"

export function isBoardEmpty(board: Board): boolean {
  return board.every((cell) => cell.symbol === null)
}

export function isBoardFull(board: Board): boolean {
  return board.every((cell) => cell.symbol !== null)
}

export function getDefaultFirstPlayer(
  isVsComputer: boolean,
  isMisere: boolean,
  isStandard: boolean,
): Player {
  const defaultPlayer: Player = {
    name: "Player 1",
    symbol: isStandard ? "X" : undefined,
    type: PlayerType.Human,
    isMaximizer: getIsMaximizer(isVsComputer, PlayerType.Human, isMisere),
  }
  return defaultPlayer
}

export function getIsMaximizer(
  isVsComputer: boolean,
  playerType: PlayerType,
  isMisere: boolean,
) {
  let isMaximizer = undefined
  if (isVsComputer) {
    if (playerType === PlayerType.Human) {
      isMaximizer = isMisere ? true : false
    } else {
      isMaximizer = isMisere ? false : true
    }
  }
  return isMaximizer
}

export function getNextPlayer(
  currentPlayer: Player,
  isWild: boolean,
  isMisere: boolean,
  isVsComputer: boolean,
): Player {
  const nextPlayerType = isVsComputer
    ? currentPlayer.type === PlayerType.Human
      ? PlayerType.AI
      : PlayerType.Human
    : PlayerType.Human
  const nextPlayer: Player = {
    name: currentPlayer.name === "Player 1" ? "Player 2" : "Player 1",
    symbol: isWild ? undefined : currentPlayer.symbol === "O" ? "X" : "O",
    type: nextPlayerType,
    isMaximizer: getIsMaximizer(isVsComputer, nextPlayerType, isMisere),
  }
  return nextPlayer
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

export function getEmptyBoard(): Board {
  const board: Board = []
  for (let i = 0; i < BOARD_SIZE * BOARD_SIZE; i++) {
    board.push({ symbol: null, id: i.toString() })
  }
  return board
}
