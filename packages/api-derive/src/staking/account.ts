// Copyright 2017-2020 @polkadot/api-derive authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ApiInterfaceRx } from '@polkadot/api/types';
import { Balance, BlockNumber, StakingLedger, UnlockChunk, Unbonding } from '@polkadot/types/interfaces';
import { DerivedSessionInfo, DerivedStakingAccount, DerivedStakingQuery, DerivedUnlocking } from '../types';

import BN from 'bn.js';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { isUndefined } from '@polkadot/util';

import { memo } from '../util';

// groups the supplied chunks by era, i.e. { [era]: BN(total of values) }
function groupByEra (list: Unbonding[]): Record<string, BN> {
  return list.reduce((map: Record<string, BN>, { moment, amount }): Record<string, BN> => {
    const key = moment.toString();

    map[key] = !map[key]
      ? amount
      : map[key].add(amount);

    return map;
  }, {});
}

// calculate the remaining blocks in a specific unlock era
function remainingBlocks (api: ApiInterfaceRx, era: BN, sessionInfo: DerivedSessionInfo): BlockNumber {
  const remaining = era.sub(sessionInfo.currentEra);

  // on the Rust side the current-era >= era-for-unlock (removal done on >)
  return api.registry.createType('BlockNumber', remaining.gtn(0)
    ? remaining
      .subn(1)
      .mul(sessionInfo.eraLength)
      .add(sessionInfo.eraLength.sub(sessionInfo.eraProgress))
    : 0
  );
}

function calculateUnlocking (api: ApiInterfaceRx, stakingLedger: StakingLedger | undefined, sessionInfo: DerivedSessionInfo, currencyType: currencyType): [DerivedUnlocking[] | undefined, Balance] {
  if (isUndefined(stakingLedger)) {
    return [undefined, api.registry.createType('Balance', 0)];
  }

  const unlockingChunks = stakingLedger[`${currencyType}_staking_lock`].unbondings.filter(({ moment }): boolean =>
    remainingBlocks(api, moment.toBn(), sessionInfo).gtn(0)
  );

  if (!unlockingChunks.length) {
    return [undefined, api.registry.createType('Balance', 0)];
  }

  // group the unlock chunks that have the same era and sum their values
  const groupedResult = groupByEra(unlockingChunks);
  const results = Object.entries(groupedResult).map(([eraString, value]): DerivedUnlocking => ({
    value: api.registry.createType('Balance', value),
    remainingBlocks: remainingBlocks(api, new BN(eraString), sessionInfo)
  }));

  const total = Object.entries(groupedResult).reduce((all, [, amount]) => (all.add(amount)), new BN(0));

  return [results.length ? results : undefined, api.registry.createType('Balance', total)];
}

function redeemableSum (api: ApiInterfaceRx, stakingLedger: StakingLedger | undefined, sessionInfo: DerivedSessionInfo): Balance {
  if (isUndefined(stakingLedger)) {
    return api.registry.createType('Balance');
  }

  return api.registry.createType('Balance', stakingLedger.ring_staking_lock.unbondings.reduce((total, { moment, amount }): BN => {
    return remainingBlocks(api, moment.toBn(), sessionInfo).eqn(0)
      ? total.add(amount)
      : total;
  }, new BN(0)));
}

function parseResult (api: ApiInterfaceRx, sessionInfo: DerivedSessionInfo, query: DerivedStakingQuery): DerivedStakingAccount {
  const calcUnlocking = calculateUnlocking(api, query.stakingLedger, sessionInfo, 'ring');
  const calcUnlockingKton = calculateUnlocking(api, query.stakingLedger, sessionInfo, 'kton');
  return {
    ...query,
    redeemable: redeemableSum(api, query.stakingLedger, sessionInfo),
    unlocking: calcUnlocking[0],
    unlockingTotalValue: calcUnlocking[1],
    unlockingKton: calcUnlockingKton[0],
    unlockingKtonTotalValue: calcUnlockingKton[1]
  };
}

/**
 * @description From a stash, retrieve the controllerId and fill in all the relevant staking details
 */
export function account (api: ApiInterfaceRx): (accountId: Uint8Array | string) => Observable<DerivedStakingAccount> {
  return memo((accountId: Uint8Array | string): Observable<DerivedStakingAccount> =>
    combineLatest([
      api.derive.session.info(),
      api.derive.staking.query(accountId)
    ]).pipe(
      map(([sessionInfo, query]: [DerivedSessionInfo, DerivedStakingQuery]) =>
        parseResult(api, sessionInfo, query))
    ));
}
