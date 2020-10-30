// Copyright 2017-2020 @polkadot/apps-config authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import BN from 'bn.js';

export default {
  create: (domain: string, path: string, data: BN | number | string): string =>
    `https://${domain}/${path}/${data.toString()}`,
  isActive: true,
  paths: {
    tx: 'tx',
    account: 'account'
  },
  url: 'https://etherscan.io/',
  key: 'etherscan.io'
};
