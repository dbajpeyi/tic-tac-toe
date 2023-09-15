import "./App.css"
import { Game } from "./features/game/Game"

function App() {
  return (
    <div className="App">
      <header className="App-header">
        {/* <Counter /> */}
        {<Game />}
        <span></span>
      </header>
    </div>
  )
}

export default App
