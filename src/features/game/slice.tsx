import {
  Draft,
  PayloadAction,
  createAsyncThunk,
  createSlice,
} from "@reduxjs/toolkit"
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

interface Score {
  player: Record<PlayerName, number>
  tie: number
}

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
  score: Score
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
    score: { player: { "Player 1": 0, "Player 2": 0 }, tie: 0 },
  }
}

function updateStateOnMove(state: Draft<State>, move: Move) {
  const { position, symbol } = move
  state.board[position] = {
    symbol: symbol,
    id: position.toString(),
  }
  const { gameStatus, adjacentCells } = getGameStatusWithAdjacentCells(
    state.board,
  )
  state.gameStatus = gameStatus
  state.adjacentCells = adjacentCells
  const nextPlayer = getNextPlayer(
    state.currentPlayer,
    state.variation === Variation.Wild,
    state.mode === Mode.Misere,
    state.vsMode === VSMode.AI,
  )
  if (gameStatus === "in-progress") {
    state.currentPlayer = nextPlayer
  } else if (gameStatus === "win") {
    const winner = state.mode === Mode.Misere ? nextPlayer : state.currentPlayer
    state.score["player"][winner.name] += 1
  } else {
    state.score["tie"] += 1
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
      /* 
        Since we're using RTK's Immer here, modifying state directly is ok
        Actually it doesn't really mutate the state, just syntactic sugar to reduce
        boilerplate.
      */
      updateStateOnMove(state, action.payload)
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
      updateStateOnMove(state, action.payload)
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

export default slice.reducer
