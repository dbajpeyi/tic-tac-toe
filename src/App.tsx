import "./App.css"
import { Game } from "./features/game/components/Game"

function isTouchDevice(): boolean {
  return "ontouchstart" in window || navigator.maxTouchPoints > 0
}

function isSupportedScreen() {
  const queryString = window.location.search
  const urlParams = new URLSearchParams(queryString)
  return !isTouchDevice() || urlParams.has("force-touch-device")
}

function App() {
  return (
    <div className="App">
      <header className="App-header">
        {isSupportedScreen() ? <Game /> : <>Touch devices not supported</>}
        <span></span>
      </header>
    </div>
  )
}

export default App
