import React from 'react';
import S33 from '../P1/S33';
import Context, { Cell, Result } from '../GameState';

import { Coordinate as Point } from '../GameTypes';
import Board from './Board';

export default class WaitServer extends S33 {

  static contextType = Context;
  declare context: React.ContextType<typeof Context>;

  Win(point: Point) {
    this.context.updateMove(Cell.P1, point);
    this.context.setResult(Result.Win);
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
      <h2>Waiting for server!</h2>
      <Board />
    </div>
  }
}