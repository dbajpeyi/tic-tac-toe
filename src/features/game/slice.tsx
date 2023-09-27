import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import {
  Mode,
  RESULT_DISPLAY_SLEEP_DURATION_MS,
  VSMode,
  Variation,
} from "./const"
import { RootState } from "../../app/store"
import {
  getDefaultFirstPlayer,
  getEmptyBoard,
  getGameStatusWithAdjacentCells,
  getNextPlayer,
} from "./utils"
import aiWorkerUrl from "./ai/worker?worker&url"

export interface State {
  board: Board
  currentPlayer: Player
  gameStatus: GameStatus
  adjacentCells?: number[]
  mode: Mode
  variation: Variation
  vsMode: VSMode
  shouldShowResult: boolean
  isAiThinking?: boolean
}

export function getInitialState(): State {
  return {
    board: getEmptyBoard(),
    currentPlayer: getDefaultFirstPlayer(false, false, true),
    gameStatus: "in-progress",
    mode: Mode.Regular,
    variation: Variation.Standard,
    vsMode: VSMode.Human,
    shouldShowResult: false,
  }
}

const initialState: State = getInitialState()

const delay = (timeMs: number) =>
  new Promise((resolve) => {
    setTimeout(resolve, timeMs)
  })

export const endGame = createAsyncThunk("game/endGame", async () => {
  await delay(RESULT_DISPLAY_SLEEP_DURATION_MS)
})

export const playAiMove = createAsyncThunk<void, void, { state: RootState }>(
  "game/aiMovePlayed",
  async (_, { getState }) => {
    const { board, variation, mode, currentPlayer } = getState().game
    await delay(300).then(() =>
      window.aiWorker.postMessage({
        board,
        isWild: variation === Variation.Wild,
        isMisere: mode === Mode.Misere,
        currentPlayer,
      }),
    )
  },
)

export const initWorkerIfNeeded = createAsyncThunk(
  "game/initWorkerIfneeded",
  async (_, { dispatch }) => {
    window.aiWorker =
      window.aiWorker ?? new Worker(aiWorkerUrl, { type: "module" })
    window.aiWorker.onmessage = (e: MessageEvent<Move>) => {
      dispatch(moveFromAiReceived(e.data))
    }
    window.aiWorker.onerror = (e: ErrorEvent) => {
      throw new Error(`aiWorker threw an error ${e.message}`)
    }
  },
)

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
      const { gameStatus, adjacentCells } = getGameStatusWithAdjacentCells(
        state.board,
      )
      state.gameStatus = gameStatus
      state.adjacentCells = adjacentCells
      if (gameStatus === "in-progress") {
        state.currentPlayer = getNextPlayer(
          state.currentPlayer,
          state.variation === Variation.Wild,
          state.mode === Mode.Misere,
          state.vsMode === VSMode.AI,
        )
      }
    },
    newGameStarted: (state) => {
      state.board = getEmptyBoard()
      state.gameStatus = "in-progress"
      state.adjacentCells = undefined
      state.shouldShowResult = false
      state.currentPlayer = getDefaultFirstPlayer(
        state.vsMode === VSMode.AI,
        state.mode === Mode.Misere,
        state.variation === Variation.Standard,
      )
    },
    variationSelected: (state, action: PayloadAction<Variation>) => {
      state.variation = action.payload
    },
    modeSelected: (state, action: PayloadAction<Mode>) => {
      state.mode = action.payload
    },
    vsModeSelected: (state, action: PayloadAction<VSMode>) => {
      state.vsMode = action.payload
    },
    playerTurnChosen: (state, action: PayloadAction<Player>) => {
      state.currentPlayer = action.payload
    },
    moveFromAiReceived: (state, action: PayloadAction<Move>) => {
      const { position, symbol } = action.payload
      state.board[position] = {
        id: position.toString(),
        symbol: symbol,
      }
      const { gameStatus, adjacentCells } = getGameStatusWithAdjacentCells(
        state.board,
      )
      state.gameStatus = gameStatus
      state.adjacentCells = adjacentCells
      if (gameStatus === "in-progress") {
        state.currentPlayer = getNextPlayer(
          state.currentPlayer,
          state.variation === Variation.Wild,
          state.mode === Mode.Misere,
          state.vsMode === VSMode.AI,
        )
      }
      state.isAiThinking = false
    },
  },
  extraReducers: (builder) => {
    builder.addCase(endGame.fulfilled, (state) => {
      state.shouldShowResult = true
    })
    builder.addCase(playAiMove.pending, (state) => {
      state.isAiThinking = true
    })
  },
})

export const {
  movePlayed,
  newGameStarted,
  variationSelected,
  modeSelected,
  vsModeSelected,
  playerTurnChosen,
  moveFromAiReceived,
} = slice.actions

export const boardState = (state: RootState) => state.game.board
export const currentPlayerState = (state: RootState) => state.game.currentPlayer
export const gameStatusState = (state: RootState) => state.game.gameStatus
export const adjacentCellsState = (state: RootState) => state.game.adjacentCells
export const gameModeState = (state: RootState) => state.game.mode
export const variationState = (state: RootState) => state.game.variation
export const vsModeState = (state: RootState) => state.game.vsMode

export default slice.reducer
