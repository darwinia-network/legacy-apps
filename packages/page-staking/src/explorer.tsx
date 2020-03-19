// Copyright 2017-2020 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DerivedHeartbeats, DerivedStakingOverview } from '@polkadot/api-derive/types';
import { AppProps as Props } from '@polkadot/react-components/types';
import { AccountId } from '@polkadot/types/interfaces';

import React, { useEffect, useMemo, useReducer, useState } from 'react';
import { Route, Switch } from 'react-router';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { HelpOverlay } from '@polkadot/react-components';
import Tabs from '@polkadot/react-components/Tabs';
import { useCall, useAccounts, useApi } from '@polkadot/react-hooks';
import { RowTitle } from '@polkadot/react-darwinia/components';
import Overview from './Overview';
import Summary from './Overview/Summary';
import { MAX_SESSIONS } from './constants';
import { useTranslation } from './translate';
import useSessionRewards from './useSessionRewards';

function reduceNominators(nominators: string[], additional: string[]): string[] {
  return nominators.concat(...additional.filter((nominator): boolean => !nominators.includes(nominator)));
}

function StakingApp ({ basePath, className }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const { hasAccounts } = useAccounts();
  const { pathname } = useLocation();
  const [next, setNext] = useState<string[]>([]);
  const allStashes = useCall<string[]>(api.derive.staking.stashes, [], {
    transform: (stashes: AccountId[]): string[] =>
      stashes.map((accountId): string => accountId.toString())
  });
  const recentlyOnline = useCall<DerivedHeartbeats>(api.derive.imOnline?.receivedHeartbeats, []);
  const stakingOverview = useCall<DerivedStakingOverview>(api.derive.staking.overview, []);
  const sessionRewards = useSessionRewards(MAX_SESSIONS);
  const hasQueries = hasAccounts && !!(api.query.imOnline?.authoredBlocks);
  const [nominators, dispatchNominators] = useReducer(reduceNominators, [] as string[]);

  useEffect((): void => {
    allStashes && stakingOverview && setNext(
      allStashes.filter((address): boolean => !stakingOverview.validators.includes(address as any))
    );
  }, [allStashes, stakingOverview]);

  return (
    <main className={`staking--App ${className}`}>
      <RowTitle title={t('Overview')} />
      <Summary
        isVisible={pathname === basePath}
        next={next}
        nominators={nominators}
        stakingOverview={stakingOverview}
      />
      
      <Overview
        hasQueries={hasQueries}
        isVisible={true}
        recentlyOnline={recentlyOnline}
        next={next}
        setNominators={dispatchNominators}
        stakingOverview={stakingOverview}
        className="staking--overview"
      />
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
    &>div:first-child {
      margin-right: 20px;
    }
  }

  @media(max-width: 1170px) {
    .staking--Overview {
      &>div:first-child {
        margin-right: 0px;
      }
    }
  }

  .staking--Actions {
    
  }
`;
