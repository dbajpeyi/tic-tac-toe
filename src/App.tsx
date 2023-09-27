import "./App.css"
import { Game } from "./features/game/components/Game"

function App() {
  return (
    <div className="App">
      <header className="App-header">
        {<Game />}
        <span></span>
      </header>
    </div>
  )
}

export default App
