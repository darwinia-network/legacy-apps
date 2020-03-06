// Copyright 2017-2020 @polkadot/react-hooks authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { useState } from 'react';

import useCacheKey from './useCacheKey';

// hook for accountChecked with local storage
export default function useAccountChecked (storageKeyBase: string): [string[], (address: string) => void] {
  const [getCache, setCache] = useCacheKey<string[]>(storageKeyBase);
  const [accountChecked, setAccountChecked] = useState<string[]>(getCache() || []);

  const _toggleAccountChecked = (address: string): void =>
    setAccountChecked(
      setCache(
        [address]
      )
    );

  return [accountChecked, _toggleAccountChecked];
}
