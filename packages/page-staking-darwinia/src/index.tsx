/* eslint-disable @typescript-eslint/no-empty-function */
// Copyright 2017-2020 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DeriveHeartbeats, DeriveStakingOverview } from '@polkadot/api-derive/types';
import { AppProps as Props } from '@polkadot/react-components/types';
import { AccountId, ElectionStatus } from '@polkadot/types/interfaces';

import React, { useEffect, useMemo, useReducer, useState } from 'react';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { useCall, useAccounts, useApi, useAccountChecked, useOwnEraRewards } from '@polkadot/react-hooks-darwinia';
import AccountStatus from '@polkadot/app-account/AccountStatus';

import Actions from './Actions';
import { MAX_SESSIONS } from './constants';
import { useTranslation } from './translate';
import useSessionRewards from './useSessionRewards';

const STORE_CHECKED = 'accounts:checked';

function reduceNominators (nominators: string[], additional: string[]): string[] {
  return nominators.concat(...additional.filter((nominator): boolean => !nominators.includes(nominator)));
}

function StakingApp ({ basePath, className }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const { allAccounts, hasAccounts } = useAccounts();
  const { pathname } = useLocation();
  // const { allRewards, rewardCount } = useOwnEraRewards();

  const [next, setNext] = useState<string[]>([]);
  const allStashes = useCall<string[]>(api.derive.staking.stashes, [], {
    transform: (stashes: AccountId[]): string[] =>
      stashes.map((accountId): string => accountId.toString())
  });
  const recentlyOnline = useCall<DeriveHeartbeats>(api.derive.imOnline?.receivedHeartbeats, []);
  const stakingOverview = useCall<DeriveStakingOverview>(api.derive.staking.overview, []);
  const sessionRewards = useSessionRewards(MAX_SESSIONS);
  const hasQueries = hasAccounts && !!(api.query.imOnline?.authoredBlocks);
  const [nominators, dispatchNominators] = useReducer(reduceNominators, [] as string[]);
  const [accountChecked, toggleAccountChecked] = useAccountChecked(STORE_CHECKED);

  const onStatusChange = () => {};

  const _accountChecked = accountChecked[0];
  const isInElection = useCall<boolean>(api.query.staking?.eraElectionStatus, [], {
    transform: (status: ElectionStatus) => status.isOpen
  });

  useEffect((): void => {
    allStashes && stakingOverview && setNext(
      allStashes.filter((address): boolean => !stakingOverview.validators.includes(address as any))
    );
  }, [allStashes, stakingOverview]);

  return (
    <main className={`staking--App ${className}`}>
      {hasAccounts ? <>
        <AccountStatus
          accountChecked={_accountChecked}
          onStatusChange={onStatusChange}
          onToggleAccountChecked={toggleAccountChecked}
        />
        <Actions
          // allRewards={allRewards}
          accountChecked={_accountChecked}
          allStashes={allStashes}
          isInElection={isInElection}
          isVisible={pathname === `${basePath}`}
          next={next}
          recentlyOnline={recentlyOnline}
          stakingOverview={stakingOverview}
        />
      </> : null}
    </main>
  );
}

export default styled(StakingApp)`
  .staking--hidden {
    display: none;
  }

  .staking--queryInput {
    margin-bottom: 1.5rem;
  }

  .staking--Chart h1 {
    margin-bottom: 0.5rem;
  }

  .staking--Chart+.staking--Chart {
    margin-top: 1.5rem;
  }

  .staking--Overview {
    display: flex;
    flex-wrap: wrap;
    &>div {
      flex: 1;
      flex-basis: 430px;
    }
  }

  .staking--Actions {

  }
`;
