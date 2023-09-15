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

export interface State {
  board: Board
  currentPlayer: Player
  status: "in-progress" | "XWin" | "OWin" | "draw"
}

function getInitialBoard(): Board {
  const board: Board = []
  for (let i = 0; i < BOARD_SIZE * BOARD_SIZE; i++) {
    board.push({ symbol: null, id: i.toString() })
  }
  return board
}

function getInitialState(): State {
  return {
    board: getInitialBoard(),
    currentPlayer: { symbol: "X", name: "P1" },
    status: "in-progress",
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
      state.currentPlayer.name = state.currentPlayer.name === "P1" ? "P2" : "P1"
    },
    gameRestarted: () => {
      return getInitialState()
    },
  },
})

export const { movePlayed, gameRestarted } = slice.actions

export const boardState = (state: RootState) => state.game.board
export const currentPlayerState = (state: RootState) => state.game.currentPlayer

export default slice.reducer
