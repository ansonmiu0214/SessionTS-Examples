import React from 'react';
import Context from '../AppState';
import S10 from '../A/S10';

export default class ReceiveQuote extends S10 {

  static contextType = Context
  declare context: React.ContextType<typeof Context>;

  quote(serverQuote: number) {
    this.context.setServerQuote(serverQuote);
  }

  render() {
    return <p>Waiting for Server Quote</p>;
  }
  
}