import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import { BOARD_SIZE } from "./const"
import { RootState } from "../../app/store"

export type PlayerSymbol = "X" | "O" | null
export interface Cell {
  symbol: PlayerSymbol

  id: string
}

type Board = Array<Cell>

interface Player {
  symbol?: PlayerSymbol
  name: "P1" | "P2"
}

interface Move {
  player: Player
  symbol: PlayerSymbol
  position: number
}

type GameStatus = "in-progress" | "win" | "draw"

export interface State {
  board: Board
  currentPlayer: Player
  gameStatus: GameStatus
  winningCells?: number[]
}

function getInitialBoard(): Board {
  const board: Board = []
  for (let i = 0; i < BOARD_SIZE * BOARD_SIZE; i++) {
    board.push({ symbol: null, id: i.toString() })
  }
  return board
}

const allWinningCells = [
  // Row win
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],

  //Column win
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],

  // Diagonal
  // (left->right)
  [0, 4, 8],

  // (right->left)
  [2, 4, 6],
]

function getInitialState(): State {
  return {
    board: getInitialBoard(),
    currentPlayer: { name: "P1", symbol: "X" },
    gameStatus: "in-progress",
  }
}

function getGameStatusAndWinningCells(board: Board): {
  gameStatus: GameStatus
  winningCells?: number[]
} {
  const arrangement = allWinningCells
    .flatMap((cells: number[]) => {
      return {
        item: cells
          .map((index: number) => board[index].symbol)
          .join("")
          .toLowerCase(),
        cells,
      }
    })
    .find(({ item, cells }) => item === "xxx" || item === "ooo")
  if (arrangement !== undefined) {
    return { gameStatus: "win", winningCells: arrangement.cells }
  } else if (board.every((item) => item.symbol !== null)) {
    return { gameStatus: "draw" }
  } else {
    return { gameStatus: "in-progress" }
  }
}

const initialState: State = getInitialState()

const slice = createSlice({
  name: "game",
  initialState,
  reducers: {
    movePlayed: (state, action: PayloadAction<Move>) => {
      const position = action.payload.position
      /* 
        Since we're using RTK's Immer here, modifying state directly is ok
        Actually it doesn't really mutate the state, just syntactic sugar to reduce
        boilerplate.
      */
      state.board[position] = {
        symbol: action.payload.symbol,
        id: position.toString(),
      }
      const { gameStatus, winningCells } = getGameStatusAndWinningCells(
        state.board,
      )
      state.gameStatus = gameStatus
      state.winningCells = winningCells
      if (gameStatus === "in-progress") {
        const currentPlayerName = state.currentPlayer.name
        if (currentPlayerName === "P1") {
          state.currentPlayer = {
            name: "P2",
            symbol: "O",
          }
        } else {
          state.currentPlayer = {
            name: "P1",
            symbol: "X",
          }
        }
      }
    },
    gameRestarted: () => {
      return getInitialState()
    },
  },
})

export const { movePlayed, gameRestarted } = slice.actions

export const boardState = (state: RootState) => state.game.board
export const currentPlayerState = (state: RootState) => state.game.currentPlayer
export const gameStatusState = (state: RootState) => state.game.gameStatus
export const winningCellsState = (state: RootState) => state.game.winningCells

export default slice.reducer
