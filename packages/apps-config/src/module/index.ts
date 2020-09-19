// Copyright 2017-2020 @polkadot/apps-config authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ExternalDef } from './types';

import darwinia from './darwinia';

const modulesDisabled: Record<string, ExternalDef> = {
  Darwinia: darwinia
};

export default modulesDisabled;
