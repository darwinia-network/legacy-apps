// Copyright 2017-2020 @polkadot/apps-config authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import BN from 'bn.js';

export default {
  chains: {
    Darwinia: 'darwinia',
    'Darwinia Crab': 'crab',
    'Darwinia CC1': 'darwinia',
    'Darwinia Devnet': 'darwinia'
  },
  create: (chain: string, path: string, data: BN | number | string): string =>
    `https://${chain}.subscan.io/${path}/${data.toString()}`,
  createDomain: (chain: string): string =>
    `https://${chain}.subscan.io`,
  isActive: true,
  paths: {
    address: 'account',
    block: 'block',
    council: 'council',
    extrinsic: 'extrinsic',
    proposal: 'democracy_proposal',
    referendum: 'referenda',
    techcomm: 'tech',
    treasury: 'treasury',
    transaction: 'tx'
  },
  url: 'https://subscan.io/'
};
