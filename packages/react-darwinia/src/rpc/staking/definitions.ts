// Copyright 2017-2020 @polkadot/types authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

// order important in structs... :)
/* eslint-disable sort-keys */

export default {
  rpc: {
    powerOf: {
      alias: ['staking_powerOf'],
      description: 'staking_powerOf',
      params: [
        {
          name: 'accountId',
          type: 'AccountId'
        }
      ],
      type: 'PowerOf'
    }
  },
  types: {
    PowerOf: {
      power: 'Power'
    }
  }
};
