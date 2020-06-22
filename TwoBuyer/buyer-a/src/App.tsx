import React from 'react';
import logo from './logo.svg';
import './App.css';
import { AppState } from './AppState';
import Session from './A/A';

import SendTitle from './components/SendTitle';
import ProposeSplit from './components/ProposeSplit';
import ReceiveQuote from './components/ReceiveQuote';
import ReceiveDecision from './components/ReceiveDecision';
import ConfirmBuy from './components/ConfirmBuy';
import ConfirmCancel from './components/ConfirmCancel';
import TransactionComplete from './components/TransactionComplete';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <AppState>
          <h1>Buyer A</h1>
          <Session 
            endpoint='ws://localhost:8080'
            states={{
              S8: SendTitle,
              S10: ReceiveQuote,
              S11: ProposeSplit,
              S12: ReceiveDecision,
              S13: ConfirmBuy,
              S14: ConfirmCancel,
              S9: TransactionComplete,
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
