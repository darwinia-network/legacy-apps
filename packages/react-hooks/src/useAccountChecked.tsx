// Copyright 2017-2020 @polkadot/react-hooks authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { useState } from 'react';

import useCacheKey from './useCacheKey';
import useAccounts from './useAccounts';

// hook for accountChecked with local storage
export default function useAccountChecked(storageKeyBase: string): [string[], (address: string) => void] {
  const [getCache, setCache] = useCacheKey<string[]>(storageKeyBase);
  const { allAccounts, hasAccounts } = useAccounts();
  const [accountChecked, setAccountChecked] = useState<string[]>(getCache() || (hasAccounts ? [allAccounts[0]] : []));

  const _toggleAccountChecked = (address: string): void =>
    setAccountChecked(
      setCache(
        [address]
      )
    );
  if (accountChecked.length == 0 && hasAccounts) {
    _toggleAccountChecked(allAccounts[0])
  }
  return [accountChecked, _toggleAccountChecked];
}
