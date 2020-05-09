// Copyright 2017-2020 @polkadot/apps-config authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Option } from './types';

export default [
  {
    info: 'Crab Network',
    text: 'Crab Network (hosted by Darwinia)',
    value: 'wss://crab.darwinia.network'
  },
  {
    info: 'Darwinia Network',
    text: 'Darwinia Network (hosted by Darwinia)',
    value: 'wss://crab.darwinia.network'
  },
  {
    info: 'Local',
    text: 'Local Node (Own, 127.0.0.1:9944)',
    value: 'ws://127.0.0.1:9944/'
  }
].map((option): Option => ({ ...option, withI18n: true }));
