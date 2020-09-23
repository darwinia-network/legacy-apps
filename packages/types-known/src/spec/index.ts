// Copyright 2017-2020 @polkadot/types-known authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { OverrideVersionedType } from '@polkadot/types/types';

import darwiniaCrab from './darwinia-crab';
import darwinia from './darwinia';

// Type overrides for specific spec types & versions as given in runtimeVersion
const typesSpec: Record<string, OverrideVersionedType[]> = {
  Crab: darwiniaCrab,
  Darwinia: darwinia
};

export default typesSpec;
