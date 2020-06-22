import React from 'react';
import S44 from '../P2/S44';
import Board from './Board';

import { Coordinate as Point } from '../GameTypes';

export default class MakeMove extends S44 {

  render() {
    const MakeMove = (point: Point) => this.Pos('onClick', ev => [point]);
    
    return <div>
      <h2>Make Move!</h2>
      <Board makeMove={MakeMove} />
    </div>
  }

}