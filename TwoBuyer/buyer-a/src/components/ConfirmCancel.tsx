import React from 'react';
import S14 from '../A/S14';

export default class ConfirmCancel extends S14 {

  render() {
    const ConfirmCancel = this.cancel('onClick', ev => {
      return [];
    });

    return <div>
      <h3>Split Proposal Rejected...</h3>
      <ConfirmCancel><button>Close Transaction</button></ConfirmCancel>
    </div>;
  }

}