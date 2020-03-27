/* eslint-disable @typescript-eslint/no-empty-function */
// Copyright 2017-2020 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DerivedHeartbeats, DerivedStakingOverview } from '@polkadot/api-derive/types';
import { AccountId, StakingLedger } from '@polkadot/types/interfaces';

import React, { useEffect, useState } from 'react';
import { Button, AddressSmall } from '@polkadot/react-components';
import { useCall, useApi, useAccounts } from '@polkadot/react-hooks';
import { Option } from '@polkadot/types';
import styled from 'styled-components';

import Account from './Account';
import StartStaking from './NewStake';
import { useTranslation } from '../translate';
import { RowTitle, Box, ActionNote } from '@polkadot/react-darwinia/components';
import PowerManage from './Account/PowerManage';

interface Props {
  allStashes: string[];
  className?: string;
  isVisible: boolean;
  recentlyOnline?: DerivedHeartbeats;
  next: string[];
  stakingOverview?: DerivedStakingOverview;
  accountChecked: string;
}

function getStashes (allAccounts: string[], stashTypes: Record<string, number>, queryBonded?: Option<AccountId>[], queryLedger?: Option<StakingLedger>): [string, boolean][] | null {
  let result: [string, boolean][] = [];

  if (!queryBonded || !queryLedger) {
    return null;
  }

  queryBonded.forEach((value, index): void => {
    value.isSome && (result = [[value.unwrap().toString(), true]]);
  });

  if (queryLedger.isSome) {
    const stashId = queryLedger.unwrap().stash.toString();

    !result.some(([accountId]): boolean => accountId === stashId) && (result = [[stashId, false]]);
  }

  return result.sort((a, b): number =>
    (stashTypes[a[0]] || 99) - (stashTypes[b[0]] || 99)
  );
}

function checkAccountType (allAccounts: string[], assumedControllerId: string, queryBonded?: Option<AccountId>[], queryLedger?: Option<StakingLedger>): string {
  let _assumedControllerId = assumedControllerId;
  if (queryBonded && queryLedger) {
    queryBonded.forEach((value, index): void => {
      value.isSome && (_assumedControllerId = value.unwrap().toString());
    });

    // if (queryLedger.isSome) {
    //   const stashId = queryLedger.unwrap().stash.toString();
    //   _assumedControllerId === stashId;
    // }
  }
  return _assumedControllerId;
}

function Actions ({ allStashes, className, isVisible, next, recentlyOnline, stakingOverview, accountChecked }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const { allAccounts } = useAccounts();
  const [assumedControllerId, setassumedControllerId] = useState<string>(accountChecked);
  const queryAssumedBonded = useCall<Option<AccountId>[]>(api.query.staking.bonded.multi as any, [[accountChecked]]);
  const queryAssumedLedger = useCall<Option<StakingLedger>>(api.query.staking.ledger as any, [accountChecked]);

  const queryBonded = useCall<Option<AccountId>[]>(api.query.staking.bonded.multi as any, [[assumedControllerId]]);
  const queryLedger = useCall<Option<StakingLedger>>(api.query.staking.ledger as any, [assumedControllerId]);

  const [isNewStakeOpen, setIsNewStateOpen] = useState(false);
  const [foundStashes, setFoundStashes] = useState<[string, boolean][] | null>(null);
  const [stashTypes, setStashTypes] = useState<Record<string, number>>({});

  useEffect((): void => {
    setFoundStashes(getStashes(allAccounts, stashTypes, queryBonded, queryLedger));
  }, [allAccounts, queryBonded, queryLedger, stashTypes]);

  useEffect((): void => {
    const _assumedControllerId: string = checkAccountType(allAccounts, accountChecked, queryAssumedBonded, queryAssumedLedger);
    setassumedControllerId(_assumedControllerId);
  }, [allAccounts, queryAssumedBonded, queryAssumedLedger]);

  const _toggleNewStake = (): void => setIsNewStateOpen(!isNewStakeOpen);
  const _onUpdateType = (stashId: string, type: 'validator' | 'nominator' | 'started' | 'other'): void =>
    setStashTypes({
      ...stashTypes,
      [stashId]: type === 'validator'
        ? 1
        : type === 'nominator'
          ? 5
          : 9
    });

  return (
    <div className={`staking--Actions ${className} ${!isVisible && 'staking--hidden'}`}>
      {isNewStakeOpen && (
        <StartStaking onClose={_toggleNewStake} accountId={accountChecked} />
      )}

      {foundStashes?.length
        ? (
          <>
            {foundStashes.map(([stashId, isOwnStash]): React.ReactNode => (
              <>
                <Account
                  allStashes={allStashes}
                  isOwnStash={isOwnStash}
                  key={stashId}
                  next={next}
                  onUpdateType={_onUpdateType}
                  recentlyOnline={recentlyOnline}
                  stakingOverview={stakingOverview}
                  stashId={stashId}
                />
              </>
            ))}
          </>
        )
        : <div>
              <RowTitle title={t('Account')} />
              <Box className="Actions--Nomination">
                <AddressSmall value={accountChecked} />
              </Box>
              <RowTitle title={t('Power Manager')} />
              <Box>
                <PowerManage
                  checkedAccount={accountChecked}
                />
              </Box>
              <RowTitle title={t('Start')} />
              <ActionNote onStart={_toggleNewStake} type="nominate" />
          </div>
      }
    </div>
  );
}

export default styled(Actions)`
  .Actions--Nomination {
    .ui--Box{
      display: flex;
      justify-content: space-between;
      padding: 1.25rem 0.625rem;
    }
  }
`;
