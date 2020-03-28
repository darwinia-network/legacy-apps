// Copyright 2017-2020 @polkadot/ui-settings authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Option } from '../types';

export const PREFIX_DEFAULT = -1;

export const PREFIXES: Option[] = [
  {
    info: 'default',
    text: 'Default for the connected node',
    value: -1,
    withI18n: true,
  },
  // {
  //   info: 'substrate',
  //   text: 'Substrate (development)',
  //   value: 42,
  //   withI18n: true,
  // },
  {
    info: 'crab',
    text: 'Crab Network (canary)',
    value: 42,
    withI18n: true,
  },
  {
    info: 'darwinia',
    text: 'Darwinia Network (live)',
    value: 18,
    withI18n: true,
  }
];
