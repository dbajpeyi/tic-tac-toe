/* eslint-disable no-restricted-globals */

import { Minimax } from "./ai"

interface MessageToWorker {
  board: Board
  currentPlayer: Player
  isWild: boolean
  isMisere: boolean
}

self.onmessage = (e: MessageEvent<MessageToWorker>) => {
  const { board, currentPlayer, isWild, isMisere } = e.data
  /* Creating new Minimax objects everytime is not the nicest, 
  but since we call this worker only when settings change, it's 
  alright for now.
  */
  const minimax = new Minimax(isWild, isMisere)
  const move = minimax.nextMove(board, currentPlayer)
  self.postMessage(move)
}
