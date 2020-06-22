import React from 'react';
import S31 from '../P1/S31';
import Board from './Board';

import { Coordinate as Point } from '../GameTypes';

export default class MakeMove extends S31 {

  render() {
    const MakeMove = (point: Point) => this.Pos('onClick', ev => [point]);
    
    return <div>
      <h2>Make Move!</h2>
      <Board makeMove={MakeMove} />
    </div>
  }

}