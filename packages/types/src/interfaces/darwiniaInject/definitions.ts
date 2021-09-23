// Copyright 2017-2020 @polkadot/types authors & contributors
// SPDX-License-Identifier: Apache-2.0

// order important in structs... :)
/* eslint-disable sort-keys */

import { Definitions } from '../../types';

export default {
  rpc: {},
  types: {
    Reasons: {
      _enum: ['Fee', 'Misc', 'All']
    },
    EthereumAddress: 'H160',
    H128: '[u8; 16; H128]',
    PalletId: 'LockIdentifier'
  }
} as Definitions;
