import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import { BOARD_SIZE, Mode, VSMode, Variation } from "./const"
import { RootState } from "../../app/store"
import { getGameStatusWithWinningCells, getNextPlayer } from "./utils"

export type PlayerSymbol = "X" | "O" | null
export interface Cell {
  symbol: PlayerSymbol
  id: string
}

export type Board = Array<Cell>

export interface Player {
  symbol?: PlayerSymbol
  name: "Player 1" | "Player 2"
}

interface Move {
  player: Player
  symbol: PlayerSymbol
  position: number
}

export type GameStatus = "in-progress" | "win" | "draw"

export interface State {
  board: Board
  currentPlayer: Player
  gameStatus: GameStatus
  winningCells?: number[]
  mode: Mode
  variation: Variation
  vsMode: VSMode
}

export function getInitialBoard(): Board {
  const board: Board = []
  for (let i = 0; i < BOARD_SIZE * BOARD_SIZE; i++) {
    board.push({ symbol: null, id: i.toString() })
  }
  return board
}

export function getDefaultFirstPlayer(): Player {
  return { name: "Player 1", symbol: "X" }
}

export function getInitialState(): State {
  return {
    board: getInitialBoard(),
    currentPlayer: getDefaultFirstPlayer(),
    gameStatus: "in-progress",
    mode: Mode.Regular,
    variation: Variation.Standard,
    vsMode: VSMode.Human,
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
      const { gameStatus, winningCells } = getGameStatusWithWinningCells(
        state.board,
      )
      state.gameStatus = gameStatus
      state.winningCells = winningCells
      if (gameStatus === "in-progress") {
        state.currentPlayer = getNextPlayer(
          state.currentPlayer.name,
          state.variation,
        )
      }
    },
    newGameStarted: (state) => {
      state.board = getInitialBoard()
      state.gameStatus = "in-progress"
      state.winningCells = undefined
      state.currentPlayer =
        state.variation === Variation.Standard
          ? getDefaultFirstPlayer()
          : { name: "Player 1" }
    },
    variationSelected: (state, action: PayloadAction<Variation>) => {
      state.variation = action.payload
      state.currentPlayer =
        state.variation === Variation.Wild
          ? { name: "Player 1" }
          : getDefaultFirstPlayer()
    },
    modeSelected: (state, action: PayloadAction<Mode>) => {
      state.mode = action.payload
    },
    vsModeSelected: (state, action: PayloadAction<VSMode>) => {
      state.vsMode = action.payload
    },
  },
})

export const {
  movePlayed,
  newGameStarted: newGameStarted,
  variationSelected,
  modeSelected,
  vsModeSelected,
} = slice.actions

export const boardState = (state: RootState) => state.game.board
export const currentPlayerState = (state: RootState) => state.game.currentPlayer
export const gameStatusState = (state: RootState) => state.game.gameStatus
export const winningCellsState = (state: RootState) => state.game.winningCells
export const gameModeState = (state: RootState) => state.game.mode
export const variationState = (state: RootState) => state.game.variation
export const vsModeState = (state: RootState) => state.game.vsMode

export default slice.reducer
