// Copyright 2017-2020 @polkadot/apps-config authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ExternalDef } from './types';

import Subscan from './subscan';
import Etherscan from './etherscan';

const externals: Record<string, ExternalDef> = {
  Subscan,
  Etherscan
};

export default externals;
