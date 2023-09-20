import { Mode, VSMode, Variation } from "../const"
import gameReducer, {
  Board,
  PlayerSymbol,
  State,
  newGameStarted,
  getInitialBoard,
  getInitialState,
  movePlayed,
  getDefaultFirstPlayer,
  variationSelected,
  modeSelected,
  vsModeSelected,
} from "../slice"

function createRandomPenultimateBoard(skipCell: number): Board {
  const initialBoard = getInitialBoard()
  const randomMove = (): PlayerSymbol => {
    return Math.random() >= 0.5 ? "X" : "O"
  }
  const randomBoard = initialBoard.map((cell, index) => {
    return { id: cell.id, symbol: skipCell !== index ? randomMove() : null }
  })
  return randomBoard
}

describe("game reducer standard variation and regular mode", () => {
  describe("standard variation and regular mode", () => {
    const initialState: State = getInitialState()
    it("should handle initial state", () => {
      expect(gameReducer(undefined, { type: "unknown" })).toEqual(
        getInitialState(),
      )
    })

    it("should set game to initial state when new game is started after one move", () => {
      const movePosition = 1
      // When one move was played on an empty board
      const state1 = gameReducer(
        initialState,
        movePlayed({
          player: getDefaultFirstPlayer(),
          position: movePosition,
          symbol: "X",
        }),
      )
      expect(state1.board[movePosition].symbol).toBe("X")
      // And game was restarted with that state
      const state2 = gameReducer(state1, newGameStarted())
      // Then game state was re-initialized
      expect(state2).toEqual(initialState)
    })
    it("should update board state on movePlayed action", () => {
      const movePosition = 4
      const actual = gameReducer(
        initialState,
        movePlayed({
          player: getDefaultFirstPlayer(),
          position: movePosition,
          symbol: "X",
        }),
      )
      expect(actual.board[movePosition].symbol).toBe("X")
    })
    it("should update currentPlayer state on movePlayed action", () => {
      const movePosition = 4
      const actual = gameReducer(
        initialState,
        movePlayed({
          player: getDefaultFirstPlayer(),
          position: movePosition,
          symbol: "X",
        }),
      )
      expect(actual.currentPlayer.name).toBe("Player 2")
    })
    it("should update gameStatus state on movePlayed action", () => {
      const firstMovePosition = 0
      const state1 = gameReducer(
        initialState,
        movePlayed({
          player: getDefaultFirstPlayer(),
          position: firstMovePosition,
          symbol: "X",
        }),
      )
      expect(state1.gameStatus).toBe("in-progress")
      const state2 = gameReducer(
        state1,
        movePlayed({
          player: getDefaultFirstPlayer(),
          position: firstMovePosition + 1,
          symbol: "X",
        }),
      )
      expect(state2.gameStatus).toBe("in-progress")
      const state3 = gameReducer(
        state2,
        movePlayed({
          player: { name: "Player 1" },
          position: firstMovePosition + 2,
          symbol: "X",
        }),
      )
      expect(state3.gameStatus).toBe("win")
    })
  })
  describe("wild variation and misere mode", () => {
    // Given an initial state with wild variation and misere mode
    const initialState: State = {
      ...getInitialState(),
      currentPlayer: { name: "Player 1" },
      variation: Variation.Wild,
      mode: Mode.Misere,
    }
    // When a move is played
    it("should retain the mode and variation when new game is started after one move", () => {
      const movePosition = 4
      const state1 = gameReducer(
        initialState,
        movePlayed({
          player: { name: "Player 1" },
          position: movePosition,
          symbol: "X",
        }),
      )
      expect(state1.board[movePosition].symbol === "X")
      // And a new game is started
      const state2 = gameReducer(state1, newGameStarted())

      // The final state (variation and mode) match the initial one
      expect(state2).toEqual(initialState)
    })
  })
  describe("settings", () => {
    it("changing variation updates the state correctly", () => {
      // Given default initial state
      const initialState: State = getInitialState()
      // When variation is selected
      const state1 = gameReducer(
        initialState,
        variationSelected(Variation.Wild),
      )
      // Then variation and current player are correctly set in the state
      expect(state1.variation).toBe(Variation.Wild)
      expect(state1.currentPlayer.symbol).toBe(undefined)

      //When variation is selected
      const state2 = gameReducer(state1, variationSelected(Variation.Standard))

      // Then variation and current player are correctly set in the state
      expect(state2.variation).toBe(Variation.Standard)
      expect(state2.currentPlayer.symbol).toBe(getDefaultFirstPlayer().symbol)
    })
  })
  it("changing mode updates the state correctly", () => {
    // Given default initial state
    const initialState: State = getInitialState()
    // When mode is selected
    const state1 = gameReducer(initialState, modeSelected(Mode.Misere))
    // Then the mode is correctly set in the state
    expect(state1.mode).toBe(Mode.Misere)
  })
  it("changing vs. mode updates the state correctly", () => {
    // Given default initial state
    const initialState: State = getInitialState()
    // When vsMode is selected
    const state1 = gameReducer(initialState, vsModeSelected(VSMode.Computer))
    // Then the vsMode is correctly set in the state
    expect(state1.vsMode).toBe(VSMode.Computer)
  })
})
