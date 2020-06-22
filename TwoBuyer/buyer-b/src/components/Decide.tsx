import React from 'react';
import S24 from '../B/S24';
import LogicContext from '../AppState';

export default class Decide extends S24 { 
  static contextType = LogicContext;
  declare context: React.ContextType<typeof LogicContext>;

  render() {

    const Accept = this.accept('onClick', ev => []);
    const Reject = this.reject('onClick', ev => []);
    
    return <div>
      <h3>Decision Required</h3>
      <p>Server quote: ${this.context.serverQuote}</p>
      <p>Client wishes to pay: ${this.context.split}</p>
      <p><strong>You pay: ${this.context.serverQuote - this.context.split}</strong></p>
      <hr />
      <Accept><button>OK</button></Accept>
      <Reject><button>Nope</button></Reject>
    </div>;
  }
}