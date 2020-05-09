// Copyright 2017-2020 @polkadot/api-derive authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ApiInterfaceRx } from '@polkadot/api/types';
import { Balance, StakingLedger, UnlockChunk } from '@polkadot/types/interfaces';
import { DeriveSessionInfo, DeriveStakingAccount, DeriveStakingQuery, DeriveUnlocking } from '../types';

import BN from 'bn.js';
import { Observable, combineLatest } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { currencyType } from '@polkadot/react-darwinia/types';

import { isUndefined } from '@polkadot/util';

import { memo } from '../util';

// groups the supplied chunks by era, i.e. { [era]: BN(total of values) }
function groupByEra(list: UnlockChunk[], sessionInfo: DeriveSessionInfo): Record<string, BN> {
  return list.reduce((map: Record<string, BN>, { moment, amount }): Record<string, BN> => {
    const era = moment.div(sessionInfo.eraLength);
    const key = era.toString();

    map[key] = !map[key]
      ? amount
      : map[key].add(amount);

    return map;
  }, {});
}

// calculate the remaining blocks in a specific unlock era
function remainingBlocks(api: ApiInterfaceRx, blocks: BN, sessionInfo: DeriveSessionInfo): BlockNumber {
  const era = blocks.div(sessionInfo.eraLength)
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

function calculateUnlocking(api: ApiInterfaceRx, stakingLedger: StakingLedger | undefined, sessionInfo: DeriveSessionInfo, currencyType: currencyType): [DeriveUnlocking[] | undefined, Balance] {
  if (isUndefined(stakingLedger)) {
    return [undefined, api.registry.createType('Balance', 0)];
  }

  const unlockingChunks = stakingLedger[`${currencyType}_staking_lock`].unbondings.filter(({ moment }): boolean => {
      const era = moment.div(sessionInfo.eraLength);
      return era.sub(sessionInfo.activeEra).gtn(0);
    }
  );

  if (!unlockingChunks.length) {
    return [undefined, api.registry.createType('Balance', 0)];
  }

  // group the unlock chunks that have the same era and sum their values
  const groupedResult = groupByEra(unlockingChunks, sessionInfo);
  const results = Object.entries(groupedResult).map(([eraString, amount]): DeriveUnlocking => ({
    remainingEras: new BN(eraString).sub(sessionInfo.activeEra),
    // remainingBlocks: remainingBlocks(api, new BN(eraString), sessionInfo),
    value: api.registry.createType('Balance', amount)
  }));

  const total = Object.entries(groupedResult).reduce((all, [, amount]) => (all.add(amount)), new BN(0));

  return [results.length ? results : undefined, api.registry.createType('Balance', total)];
}

function redeemableSum(api: ApiInterfaceRx, stakingLedger: StakingLedger | undefined, sessionInfo: DeriveSessionInfo): Balance {
  if (isUndefined(stakingLedger)) {
    return api.registry.createType('Balance');
  }

  return api.registry.createType('Balance', stakingLedger.ring_staking_lock.unbondings.reduce((total, { moment, amount }): BN => {
    const era = moment.div(sessionInfo.eraLength);
    return era.sub(sessionInfo.activeEra).eqn(0)
      ? total.add(amount)
      : total;
  }, new BN(0)));
}

function parseResult(api: ApiInterfaceRx, sessionInfo: DeriveSessionInfo, query: DeriveStakingQuery): DeriveStakingAccount {
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

export function _account(api: ApiInterfaceRx): (sessionInfo: DeriveSessionInfo, accountId: Uint8Array | string) => Observable<DeriveStakingAccount> {
  return memo((sessionInfo: DeriveSessionInfo, accountId: Uint8Array | string): Observable<DeriveStakingAccount> =>
    api.derive.staking.query(accountId).pipe(
      map((query) => parseResult(api, sessionInfo, query))
    ));
}

/**
 * @description From a stash, retrieve the controllerId and fill in all the relevant staking details
 */
export function account(api: ApiInterfaceRx): (accountId: Uint8Array | string) => Observable<DeriveStakingAccount> {
  return memo((accountId: Uint8Array | string): Observable<DeriveStakingAccount> =>
    api.derive.session.info().pipe(
      switchMap((sessionInfo) => api.derive.staking._account(sessionInfo, accountId))
    ));
}

/**
 * @description From a list of stashes, fill in all the relevant staking details
 */
export function accounts(api: ApiInterfaceRx): (accountIds: (Uint8Array | string)[]) => Observable<DeriveStakingAccount[]> {
  return memo((accountIds: (Uint8Array | string)[]): Observable<DeriveStakingAccount[]> =>
    api.derive.session.info().pipe(
      switchMap((sessionInfo) =>
        combineLatest(accountIds.map((accountId) => api.derive.staking._account(sessionInfo, accountId)))
      )
    ));
}