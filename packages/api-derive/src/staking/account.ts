// Copyright 2017-2020 @polkadot/api-derive authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ApiInterfaceRx } from '@polkadot/api/types';
import { Balance, BlockNumber } from '@polkadot/types/interfaces';
import { StakingLedgerT as StakingLedger, Unbonding } from '@darwinia/typegen/interfaces';
import { DeriveSessionInfo, DeriveStakingAccount, DeriveStakingQuery, DeriveUnlocking } from '../types';

import BN from 'bn.js';
import { Observable, combineLatest } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { currencyType } from '@polkadot/react-darwinia/types';

import { isUndefined } from '@polkadot/util';

import { memo } from '../util';

// calculate the remaining blocks in a specific unlock era
function remainingBlocks (api: ApiInterfaceRx, blocks: BN, sessionInfo: DeriveSessionInfo): BlockNumber {
  const era = blocks.div(sessionInfo.eraLength);
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

function calculateUnlocking (api: ApiInterfaceRx, stakingLedger: StakingLedger | undefined, best: BlockNumber, currencyType: currencyType): [DeriveUnlocking[] | undefined, Balance] {
  if (isUndefined(stakingLedger)) {
    return [undefined, api.registry.createType('Balance', 0)];
  }

  const unlockingChunks = stakingLedger[`${currencyType}StakingLock`].unbondings.filter(({ moment }): boolean => {
    return moment.gtn(best);
  });

  if (!unlockingChunks.length) {
    return [undefined, api.registry.createType('Balance', 0)];
  }

  const total = Object.entries(unlockingChunks).reduce((all, [, unbond]) => (all.add(unbond.amount)), new BN(0));

  return [undefined, api.registry.createType('Balance', total)];
}

function redeemableSum (api: ApiInterfaceRx, stakingLedger: StakingLedger | undefined, best: BlockNumber): Balance {
  if (isUndefined(stakingLedger)) {
    return api.registry.createType('Balance');
  }

  return api.registry.createType('Balance', stakingLedger.ringStakingLock.unbondings.reduce((total, { amount, moment }): BN => {
    return moment.gte(best)
      ? total.add(amount)
      : total;
  }, new BN(0)));
}

function parseResult (api: ApiInterfaceRx, best: BlockNumber, query: DeriveStakingQuery): DeriveStakingAccount {
  const calcUnlocking = calculateUnlocking(api, query.stakingLedger, best, 'ring');
  const calcUnlockingKton = calculateUnlocking(api, query.stakingLedger, best, 'kton');

  return {
    ...query,
    redeemable: redeemableSum(api, query.stakingLedger, best),
    unlocking: calcUnlocking[0],
    unlockingTotalValue: calcUnlocking[1],
    unlockingKton: calcUnlockingKton[0],
    unlockingKtonTotalValue: calcUnlockingKton[1]
  };
}

export function _account (api: ApiInterfaceRx): (best: BlockNumber, accountId: Uint8Array | string) => Observable<DeriveStakingAccount> {
  return memo((best: BlockNumber, accountId: Uint8Array | string): Observable<DeriveStakingAccount> =>
    api.derive.staking.query(accountId).pipe(
      map((query) => parseResult(api, best, query))
    ));
}

/**
 * @description From a stash, retrieve the controllerId and fill in all the relevant staking details
 */
export function account (api: ApiInterfaceRx): (accountId: Uint8Array | string) => Observable<DeriveStakingAccount> {
  return memo((accountId: Uint8Array | string): Observable<DeriveStakingAccount> =>
    api.derive.chain.bestNumber().pipe(
      switchMap((best) => api.derive.staking._account(best, accountId))
    ));
}

/**
 * @description From a list of stashes, fill in all the relevant staking details
 */
export function accounts (api: ApiInterfaceRx): (accountIds: (Uint8Array | string)[]) => Observable<DeriveStakingAccount[]> {
  return memo((accountIds: (Uint8Array | string)[]): Observable<DeriveStakingAccount[]> =>
    api.derive.chain.bestNumber().pipe(
      switchMap((best) =>
        combineLatest(accountIds.map((accountId) => api.derive.staking._account(best, accountId)))
      )
    ));
}
