import React from 'react';
import S23 from '../B/S23';
import LogicContext from '../AppState';

export default class ReceiveSplit extends S23 {

  static contextType = LogicContext;
  declare context: React.ContextType<typeof LogicContext>;

  split(split: number) {
    this.context.setSplit(split);
  }

  render() {
    return <h3>Pending</h3>;
  }

}