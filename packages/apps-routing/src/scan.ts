// Copyright 2017-2020 @polkadot/apps-routing authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Route } from './types';

import Scan from '@polkadot/app-staking-darwinia/explorer';

export default function create (t: (key: string, text: string, options: { ns: string }) => string): Route {
  return {
    Component: Scan,
    display: {
      needsApi: [
        ['tx.staking.bond']
      ]
    },
    icon: 'bullseye',
    name: 'scan',
    text: t('nav.scan', 'Staking Scan', { ns: 'apps-routing' })
  };
}
