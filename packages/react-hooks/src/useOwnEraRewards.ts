// Copyright 2017-2020 @polkadot/react-hooks authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DeriveStakerReward } from '@polkadot/api-derive/types';
import type { EraIndex } from '@polkadot/types/interfaces';
import { useEffect, useState } from 'react';

import useApi from './useApi';
import useCall from './useCall';
import useIsMountedRef from './useIsMountedRef';
import { useOwnStashIds } from './useOwnStashes';

interface OwnRewards {
  allRewards?: Record<string, DeriveStakerReward[]> | null;
  isLoadingRewards: boolean;
  rewardCount: number;
}

interface Filtered {
  filteredEras: EraIndex[];
}

function getRewards ([[stashIds], available]: [[string[]], DeriveStakerReward[][]]): OwnRewards {
  const allRewards: Record<string, DeriveStakerReward[]> = {};

  stashIds.forEach((stashId, index): void => {
    allRewards[stashId] = available[index]?.filter(({ eraReward }) => !eraReward.isZero()) || [];
  });

  return {
    allRewards,
    isLoadingRewards: false,
    rewardCount: Object.values(allRewards).filter((rewards) => rewards && rewards.length !== 0).length
  };
}

export default function useOwnEraRewards (_stashIds?: string[], maxEras?: number): OwnRewards {
  const { api } = useApi();
  const mountedRef = useIsMountedRef();
  const stashIds = useOwnStashIds();
  const [{ filteredEras }, setFiltered] = useState<Filtered>({ filteredEras: [] });
  const allEras = useCall<EraIndex[]>(api.derive.staking?.erasHistoric);
  const available = useCall<[[string[]], DeriveStakerReward[][]]>((_stashIds || stashIds) && api.derive.staking?.stakerRewardsMultiEras, [_stashIds || stashIds, filteredEras], { withParams: true });
  const [state, setState] = useState<OwnRewards>({ rewardCount: 0, isLoadingRewards: true });

  useEffect((): void => {
    setState({ allRewards: null, isLoadingRewards: true, rewardCount: 0 });
  }, [maxEras]);

  useEffect((): void => {
    if (allEras && maxEras) {
      const filteredEras = allEras.slice(-1 * maxEras);

      setFiltered({ filteredEras });
    }
  }, [allEras, maxEras]);

  useEffect((): void => {
    mountedRef.current && available && setState(
      getRewards(available)
    );
  }, [available, mountedRef]);

  return state;
}
