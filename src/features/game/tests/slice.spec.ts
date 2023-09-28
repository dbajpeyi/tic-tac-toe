import { Mode, PlayerType, VSMode, Variation } from "../const"
import gameReducer, {
  State,
  newGameStarted,
  getInitialState,
  movePlayed,
  variationSelected,
  modeSelected,
  vsModeSelected,
} from "../slice"
import { getDefaultFirstPlayer } from "../utils"

describe("game reducer", () => {
  describe("standard variation and regular mode", () => {
    const initialState: State = getInitialState()
    it("should handle initial state", () => {
      expect(gameReducer(undefined, { type: "unknown" })).toEqual(
        getInitialState(),
      )
    })

    it("should set game to initial state when new game is started after one move", () => {
      const movePosition = 1
      const state1 = gameReducer(
        initialState,
        movePlayed({
          position: movePosition,
          symbol: "X",
        }),
      )
      expect(state1.board[movePosition].symbol).toBe("X")
      const state2 = gameReducer(state1, newGameStarted())
      expect(state2).toEqual(initialState)
    })

    it("should update board state on movePlayed action", () => {
      const movePosition = 4
      const actual = gameReducer(
        initialState,
        movePlayed({
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
          position: firstMovePosition,
          symbol: "X",
        }),
      )
      expect(state1.gameStatus).toBe("in-progress")
      const state2 = gameReducer(
        state1,
        movePlayed({
          position: firstMovePosition + 1,
          symbol: "X",
        }),
      )
      expect(state2.gameStatus).toBe("in-progress")
      const state3 = gameReducer(
        state2,
        movePlayed({
          position: firstMovePosition + 2,
          symbol: "X",
        }),
      )
      expect(state3.gameStatus).toBe("win")
    })
  })

  describe("wild variation and misere mode", () => {
    it("should retain the mode and variation when new game is started after one move", () => {
      const initialState: State = {
        ...getInitialState(),
        currentPlayer: { name: "Player 1", type: PlayerType.Human },
        variation: Variation.Wild,
        mode: Mode.Misere,
      }
      // When a move is played
      const movePosition = 4
      const state1 = gameReducer(
        initialState,
        movePlayed({
          position: movePosition,
          symbol: "O",
        }),
      )
      expect(state1.board[movePosition].symbol).toBe("O")
      const state2 = gameReducer(state1, newGameStarted())

      expect(state2).toEqual(initialState)
    })
  })

  describe("settings", () => {
    it("changing variation updates the state correctly", () => {
      const initialState: State = getInitialState()
      const state1 = gameReducer(
        initialState,
        variationSelected(Variation.Wild),
      )
      expect(state1.variation).toBe(Variation.Wild)

      const state2 = gameReducer(state1, variationSelected(Variation.Standard))

      expect(state2.variation).toBe(Variation.Standard)
      expect(state2.currentPlayer.symbol).toBe(
        getDefaultFirstPlayer(false, false, true).symbol,
      )
    })
  })

  describe("mode", () => {
    it("changing mode updates the state correctly", () => {
      const initialState: State = getInitialState()
      const state1 = gameReducer(initialState, modeSelected(Mode.Misere))
      expect(state1.mode).toBe(Mode.Misere)
    })

    it("changing vs. mode updates the state correctly", () => {
      const initialState: State = getInitialState()
      const state1 = gameReducer(initialState, vsModeSelected(VSMode.AI))
      expect(state1.vsMode).toBe(VSMode.AI)
    })
  })
})
