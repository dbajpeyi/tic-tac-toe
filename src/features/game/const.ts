export const BOARD_SIZE = 3

export const adjacentCellArrangement = [
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

export const RESULT_DISPLAY_SLEEP_DURATION_MS = 600

export enum Variation {
  Standard = "Standard",
  Wild = "Wild",
}

export enum Mode {
  Regular = "Regular",
  Misere = "Misere",
}

export enum VSMode {
  Human = "2P",
  AI = "vs. Computer",
}

export enum PlayerType {
  AI = "ai",
  Human = "human",
}
