import React from 'react';
import S42 from '../P2/S42';
import Context, { Cell, Result } from '../GameState';

import { Coordinate as Point } from '../GameTypes';
import Board from './Board';

export default class WaitOpponent extends S42 {

  static contextType = Context;
  declare context: React.ContextType<typeof Context>;

  Lose(point: Point) {
    this.context.updateMove(Cell.P1, point);
    this.context.setResult(Result.Lose);
  }

  Draw(point: Point) {
    this.context.updateMove(Cell.P1, point);
    this.context.setResult(Result.Draw);
  }

  Update(point: Point) {
    this.context.updateMove(Cell.P1, point);
  }

  render() {
    return <div>
      <h2>Waiting for Opponent!</h2>
      <Board />
    </div>
  }
}