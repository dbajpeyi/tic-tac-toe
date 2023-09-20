import gameReducer, {
  Board,
  PlayerSymbol,
  State,
  newGameStarted,
  getInitialBoard,
  getInitialState,
  movePlayed,
} from "./slice"

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

describe("game reducer", () => {
  const initialState: State = getInitialState()
  it("should handle initial state", () => {
    expect(gameReducer(undefined, { type: "unknown" })).toEqual(
      getInitialState(),
    )
  })

  it("should set game to initial state on restart after one move", () => {
    const movePosition = 1
    // When one move was played on an empty board
    const state1 = gameReducer(
      initialState,
      movePlayed({
        player: { name: "Player 1" },
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
        player: { name: "Player 1" },
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
        player: { name: "Player 1" },
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
        player: { name: "Player 1" },
        position: firstMovePosition,
        symbol: "X",
      }),
    )
    expect(state1.gameStatus).toBe("in-progress")
    const state2 = gameReducer(
      state1,
      movePlayed({
        player: { name: "Player 1" },
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
