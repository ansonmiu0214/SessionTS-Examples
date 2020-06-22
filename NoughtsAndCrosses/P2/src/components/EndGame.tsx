import React from 'react';
import S43 from '../P2/S43';
import Context, { Result } from '../GameState';

import Board from './Board';

export default class Endgame extends S43 {

  static contextType = Context;
  declare context: React.ContextType<typeof Context>;

  render() {
    return (
      <div>
        {this.context.winner === Result.Win && <h2>You won!</h2>}
        {this.context.winner === Result.Draw && <h2>Draw!</h2>}
        {this.context.winner === Result.Lose && <h2>You lose!</h2>}
        <Board />
      </div>
    )
  }
}