![main build](https://github.com/dbajpeyi/tic-tac-toe/actions/workflows/firebase-hosting-merge.yml/badge.svg)

# tic-tac-toe web app

A frontend webapp for tic-tac-toe game. It support a combination of various modes and variations and can be played with an AI player.

# Some technical notes

- The application uses immer, which means that state update in reducers can look strange, e,g

```
    state.value += 1
```

If you see something like this in the reducer, don't freak out. It's not actually mutating the state, just hides the immutability underneath.

- The game is deployed [here](https://tic-tac-toe-5da1e.web.app/)
- Touch devices are disabled, but you can force it with `force-touch-device` in the query string

## Scripts for development and building

- `dev`/`start` - start dev server and open browser
- `build` - build for production
- `preview` - locally preview production build
- `test` - launch test runner
