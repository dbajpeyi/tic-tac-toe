import "./App.css"
import { Game } from "./features/game/components/Game"

function isTouchDevice() {
  return "ontouchstart" in window || navigator.maxTouchPoints > 0
}

function App() {
  return (
    <div className="App">
      <header className="App-header">
        {isTouchDevice() ? <>Touch devices not supported</> : <Game />}
        <span></span>
      </header>
    </div>
  )
}

export default App
