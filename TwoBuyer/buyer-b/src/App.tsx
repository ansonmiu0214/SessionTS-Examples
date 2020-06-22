import React from 'react';
import logo from './logo.svg';
import './App.css';

import { AppState } from './AppState';
import Session from './B/B';
import ReceiveQuote from './components/ReceiveQuote';
import Terminal from './components/Terminal';
import ReceiveSplit from './components/ReceiveSplit';
import Decide from './components/Decide';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <AppState>
          <h1>Buyer B</h1>
          <Session 
            endpoint='ws://localhost:8080'
            states={{
              S21: ReceiveQuote,
              S22: Terminal,
              S23: ReceiveSplit,
              S24: Decide,              
            }}
            cancellation={(role, reason) => (
              <p>{role} cancelled because of {reason}</p>
            )}
            waiting={<p>Waiting for connection</p>}
            connectFailed={<p>Connection failed</p>}
          />
        </AppState>
      </header>
    </div>
  );
}

export default App;
