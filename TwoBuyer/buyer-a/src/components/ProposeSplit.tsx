import React from 'react';
import Context from '../AppState';
import S11 from '../A/S11';

type State = { split: number };

export default class ProposeSplit extends S11<State> {

  static contextType = Context;
  declare context: React.ContextType<typeof Context>;

  state = { split: 0 };
  
  render() {
    const SendSplit = this.split('onClick', ev => {
      return [this.state.split];		
    });
    
    return <div>
      <h5>Server quote: ${this.context.serverQuote}</h5>
      <input
        type='number'
        value={this.state.split}
        onChange={ev => this.setState({
          split: Number(ev.target.value)
        })}
        placeholder='Enter split'
      />
      <div>
        <SendSplit><button>Propose</button></SendSplit>	
      </div>
    </div>;	
  }
}