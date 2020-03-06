// Copyright 2017-2020 @polkadot/apps-routing authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Routes } from './types';

import Node from '@polkadot/app-staking/node';

export default ([
  {
    Component: Node,
    display: {
      needsApi: [
        [
          'tx.staking.bond' // current bonding API
          // 'tx.staking.stake' // previous staking API
        ]
      ]
    },
    i18n: {
      defaultValue: 'Node'
    },
    icon: 'hubspot',
    name: 'node'
  }
] as Routes);
