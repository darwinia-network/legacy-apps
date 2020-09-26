// Copyright 2017-2020 @polkadot/types-known authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { OverrideVersionedType } from '@polkadot/types/types';

const sharedTypes = {
  RewardDestination: {
    _enum: {
      Staked: 'Null',
      Stash: 'Null',
      Controller: 'Null',
      Account: 'AccountId'
    }
  }
};

const versioned: OverrideVersionedType[] = [
  {
    minmax: [0, 12],
    types: {
    }
  },
  {
    minmax: [16, undefined],
    types: {
      ...sharedTypes
    }
  }
];

export default versioned;
