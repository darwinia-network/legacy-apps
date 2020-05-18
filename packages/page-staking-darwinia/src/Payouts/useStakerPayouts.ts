// Copyright 2017-2020 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { EraIndex } from '@polkadot/types/interfaces';

import BN from 'bn.js';
import { useEffect, useState } from 'react';
import { useApi, useCall } from '@polkadot/react-hooks';

export default function useStakerPayouts (): BN {
  const { api } = useApi();
  const [stakerPayoutAfter, setState] = useState<BN>(
    api.tx.staking.payoutStakers
      ? new BN(0)
      : new BN(1_000_000_000)
  );

  return stakerPayoutAfter;
}
