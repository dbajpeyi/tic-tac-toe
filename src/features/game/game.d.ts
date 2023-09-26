type PlayerSymbol = "X" | "O" | null
interface Cell {
  symbol: PlayerSymbol
  id: string
}

type Board = Cell[]
type PlayerName = "Player 1" | "Player 2"

interface Player {
  name: PlayerName
  symbol?: PlayerSymbol
  type: PlayerType
  isMaximizer?: boolean
}

interface Move {
  symbol: PlayerSymbol
  position: number
}

type GameStatus = "in-progress" | "win" | "draw"
