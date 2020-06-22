import React from 'react';
import Context, { Cell } from '../GameState';
import { Constructor } from '../P2/Types';
import { Coordinate as Point } from '../GameTypes';

export default class Board extends React.Component<{
  makeMove?: (point: Point) => Constructor<React.Component>
}> {

  static contextType = Context;
  declare context: React.ContextType<typeof Context>;

  render() {
    return (
      <table className='Board'>
        <tbody>
          {this.context.board.map((row, x) => (
            <tr key={x}>
              {row.map((marker, y) => {
                const key = (x + 1) * y;
                const className = (marker === Cell.Empty && this.props.makeMove) 
                  ? 'empty' : marker === Cell.P1 
                  ? 'P1' : 'P2';
                const GridCell = (
                  <td key={key} className={`grid ${className}`}>
                    {marker === Cell.Empty ? ' ' : marker === Cell.P1 ? 'X' : 'O'}
                  </td>
                );
                if (marker === Cell.Empty && this.props.makeMove) {
                  const MakeMove = this.props.makeMove({ x, y });
                  return <MakeMove key={key}>{GridCell}</MakeMove>;
                } else {
                  return GridCell;
                }
              })}
            </tr>
          ))}
        </tbody>
      </table>
    )
  }

}