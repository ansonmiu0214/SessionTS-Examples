import React from 'react';
import S8 from '../A/S8';

type State = { title: string };

export default class SendTitle extends S8<State> {
  state = { title: '' };
  
  render() {
    const SendTitle = this.title('onClick', ev => {
      return [this.state.title];		
    });
    
    return <div>
      <input
        type='text'
        value={this.state.title}
        onChange={ev => this.setState({
          title: ev.target.value
        })}
        placeholder='Enter title'
      />
      <div>
        <SendTitle><button>Propose</button></SendTitle>	
      </div>
    </div>;	
  }
}