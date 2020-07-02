import React from 'react';
import S13 from '../A/S13';

export default class ConfirmBuy extends S13 {

  render() {
    const ConfirmBuy = this.buy('onClick', ev => {
      return [];
    });

    return <div>
      <h3>Split Proposal Accepted!</h3>
      <div>
        <ConfirmBuy><button>Confirm to Seller</button></ConfirmBuy>
      </div>
    </div>;
  }

}