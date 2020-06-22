import React from 'react';
import S21 from '../B/S21';
import LogicContext from '../AppState';

export default class ReceiveQuote extends S21 {

  static contextType = LogicContext;
  declare context: React.ContextType<typeof LogicContext>;

  quote(quote: number) {
    this.context.setServerQuote(quote);
  }

  render() {
    return <h3>Pending</h3>;
  }

}