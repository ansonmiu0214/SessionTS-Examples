import React from 'react';
import './App.css';

import { GameState } from './GameState';
import Session from './P2/P2';
import MakeMove from './components/MakeMove';
import Endgame from './components/EndGame';
import WaitServer from './components/WaitServer';
import WaitOpponent from './components/WaitOpponent';

function App() {
  return (
    <div className="App">
      <header className="App-header">
      <GameState>
          <h1>Noughts and Crosses</h1>
          <hr />
          <Session
            endpoint='ws://localhost:8080'
            states={{
              S42: WaitOpponent,
              S43: Endgame,
              S44: MakeMove,
              S45: WaitServer,
            }}
            cancellation={(role, reason) => {
              return <p>{role} cancelled because {reason}</p>
            }}
            waiting={<p>Hello, Noughts: waiting for Crosses...</p>}
            connectFailed={<p>Cannot connect to game</p>}
          />

        </GameState>
      </header>
    </div>
  );
}

export default App;
