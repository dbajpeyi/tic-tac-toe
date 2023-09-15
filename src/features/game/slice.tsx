import { createSlice } from "@reduxjs/toolkit"
import { BOARD_SIZE } from "./const"
import { RootState } from "../../app/store"

type PlayerSymbol = "X" | "O" | null
interface Cell {
  symbol: PlayerSymbol
  id: string
}

type Board = Array<Cell>

export interface State {
  board: Board
}

function getInitialBoard(): Board {
  const board: Board = []
  for (let i = 0; i < BOARD_SIZE * BOARD_SIZE; i++) {
    board.push({ symbol: "X", id: i.toString() })
  }
  return board
}

const initialState: State = {
  board: getInitialBoard(),
}

const slice = createSlice({
  name: "game",
  initialState,
  reducers: {},
})

export const boardState = (state: RootState) => state.game.board

export default slice.reducer
