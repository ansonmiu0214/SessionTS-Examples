import React from 'react';
import { Coordinate as Point } from './GameTypes';

export enum Cell { Empty, P1, P2 };
export enum Result { Win, Lose, Draw, Nothing };

type ContextProps = {
  board: Array<Array<Cell>>,
  winner: Result,
  updateMove: (role: Cell, point: Point) => void,
  setResult: (result: Result) => void,
};

const Context = React.createContext<ContextProps>({
  board: [[]],
  winner: Result.Nothing,
  updateMove: () => {},
  setResult: () => {}
});

export default Context;

export class GameState extends React.Component<{}, {
  board: Array<Array<Cell>>,
  winner: Result
}> {

  state = {
    board: [
      [Cell.Empty, Cell.Empty, Cell.Empty],
      [Cell.Empty, Cell.Empty, Cell.Empty],
      [Cell.Empty, Cell.Empty, Cell.Empty],
    ],
    winner: Result.Nothing,
  }

  render() {
    const updateMove = (role: Cell, point: Point) => {
      const board = this.state.board.map((row, x) => (
        row.map((cell, y) => (
          x === point.x && y === point.y ? role : cell
        ))
      ));
      this.setState({ board });
    }

    return <Context.Provider value={{
      board: this.state.board,
      winner: this.state.winner,
      updateMove,
      setResult: (winner) => this.setState({ winner }) 
    }}>
      {this.props.children}
    </Context.Provider>
  }
}