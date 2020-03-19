/* eslint-disable @typescript-eslint/camelcase */
// Copyright 2017-2020 @polkadot/api-derive authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AccountId, AccountIndex, Address, Balance, BalanceLock, BalanceLockTo212, BlockNumber, VestingInfo, VestingSchedule } from '@polkadot/types/interfaces';
import { DerivedBalancesAccount, DerivedBalancesAll, DerivedBalanceLock } from '../types';

import BN from 'bn.js';
import { combineLatest, of, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { ApiInterfaceRx } from '@polkadot/api/types';
import { Option, Vec } from '@polkadot/types';
import { bnMax } from '@polkadot/util';

import { memo } from '../util';

type ResultBalance = [VestingInfo | null, (BalanceLock | BalanceLockTo212)[], (BalanceLock | BalanceLockTo212)[]];
type Result = [DerivedBalancesAccount, BlockNumber, ResultBalance];

function calcLocks (api: ApiInterfaceRx, locks: (BalanceLock | BalanceLockTo212)[], bestNumber: BlockNumber): [Balance, (DerivedBalanceLock | BalanceLockTo212)[]] {
  let lockedBn = new BN(0);
  let lockedBalance = api.registry.createType('Balance');
  let lockedBreakdown: (DerivedBalanceLock | BalanceLockTo212)[] = [];
  lockedBn = locks.reduce((total, { lock_for }) => {
    if (lock_for.isStaking) {
      total = total.add(lock_for.asStaking?.staking_amount);
      const _lockedBreakdown = lock_for.asStaking?.unbondings.filter(({ moment }): boolean => !moment || (bestNumber && moment.gt(bestNumber)));
      lockedBreakdown = lockedBreakdown.concat(_lockedBreakdown.map(({ amount, moment }): DerivedBalanceLock => ({
        id: lock_for.id,
        amount,
        until: moment,
        reasons: lock_for.asStaking?.lock_reasons
      })));
      _lockedBreakdown.reduce((total, { amount }) => (total.add(amount)), total);
    }
    return total;
  }, new BN(0));
  lockedBalance = api.registry.createType('Balance', lockedBn);
  return [lockedBalance, lockedBreakdown];
}

function calcBalances (api: ApiInterfaceRx, [{ accountId, accountNonce, freeBalance, freeBalanceKton, frozenFee, frozenMisc, reservedBalance, reservedBalanceKton, votingBalance, votingBalanceKton }, bestNumber, [vesting, locks, locksKton]]: Result): DerivedBalancesAll {
  let lockedBalance = api.registry.createType('Balance');
  let lockedBalanceKton = api.registry.createType('Balance');
  let lockedBreakdown: (DerivedBalanceLock | BalanceLockTo212)[] = [];
  let lockedBreakdownKton: (DerivedBalanceLock | BalanceLockTo212)[] = [];
  if (Array.isArray(locks)) {
    [lockedBalance, lockedBreakdown] = calcLocks(api, locks, bestNumber);
  }

  if (Array.isArray(locksKton)) {
    // only get the locks that are valid until passed the current block
    [lockedBalanceKton, lockedBreakdownKton] = calcLocks(api, locksKton, bestNumber);
  }

  // Calculate the vesting balances,
  //  - offset = balance locked at startingBlock
  //  - perBlock is the unlock amount
  const { locked: vestingTotal, perBlock, startingBlock } = vesting || api.registry.createType('VestingInfo');
  const isStarted = bestNumber.gt(startingBlock);
  const vestedBalance = api.registry.createType('Balance', isStarted ? perBlock.mul(bestNumber.sub(startingBlock)) : 0);
  const isVesting = isStarted && vestedBalance.lt(vestingTotal);

  // The available balance & vested has an interplay here
  // "
  // vesting is a guarantee that the account's balance will never go below a certain amount. so it functions in the opposite way, a bit like a lock that is monotonically decreasing rather than a liquid amount that is monotonically increasing.
  // locks function as the same guarantee - that a balance will not be lower than a particular amount.
  // because of this you can see that if there is a "vesting lock" that guarantees the balance cannot go below 200, and a "staking lock" that guarantees the balance cannot drop below 300, then we just have two guarantees of which the first is irrelevant.
  // i.e. (balance >= 200 && balance >= 300) == (balance >= 300)
  // ""
  const floating = freeBalance.sub(lockedBalance);
  const extraReceived = isVesting ? freeBalance.sub(vestingTotal) : new BN(0);
  const availableBalance = api.registry.createType('Balance', bnMax(new BN(0), isVesting && floating.gt(vestedBalance) ? vestedBalance.add(extraReceived) : floating));

  // kton has no vesting module
  const floatingKton = freeBalanceKton.sub(lockedBalanceKton);
  const availableBalanceKton = api.registry.createType('Balance', bnMax(new BN(0), floatingKton));

  return {
    accountId,
    accountNonce,
    availableBalance,
    availableBalanceKton,
    freeBalance,
    freeBalanceKton,
    frozenFee,
    frozenMisc,
    isVesting,
    lockedBalance,
    lockedBalanceKton,
    lockedBreakdown,
    lockedBreakdownKton,
    reservedBalance,
    reservedBalanceKton,
    vestedBalance,
    vestingTotal,
    votingBalance,
    votingBalanceKton
  };
}

// old
// function queryOld (api: ApiInterfaceRx, accountId: AccountId): Observable<ResultBalance> {
//   return api.queryMulti<[Vec<BalanceLock>, Option<VestingSchedule>]>([
//     [api.query.balances.locks, accountId],
//     [api.query.balances.vesting, accountId]
//   ]).pipe(
//     map(([locks, optVesting]): ResultBalance => {
//       let vestingNew = null;

//       if (optVesting.isSome) {
//         const { offset: locked, perBlock, startingBlock } = optVesting.unwrap();

//         vestingNew = createType(api.registry, 'VestingInfo', { locked, perBlock, startingBlock });
//       }

//       return [vestingNew, locks];
//     })
//   );
// }

// current (balances  vesting)
function queryCurrent (api: ApiInterfaceRx, accountId: AccountId): Observable<ResultBalance> {
  return (
    api.queryMulti<[Vec<BalanceLock>, Vec<BalanceLock>, Option<VestingInfo>]>([
      [api.query.balances.locks, accountId],
      [api.query.kton.locks, accountId],
      [api.query.vesting.vesting, accountId]
    ])
  ).pipe(
    map(([locks, locksKton, optVesting]): ResultBalance =>
      [optVesting.unwrapOr(null), locks, locksKton]
    )
  );
}

/**
 * @name all
 * @param {( AccountIndex | AccountId | Address | string )} address - An accounts Id in different formats.
 * @returns An object containing the results of various balance queries
 * @example
 * <BR>
 *
 * ```javascript
 * const ALICE = 'F7Hs';
 *
 * api.derive.balances.all(ALICE, ({ accountId, lockedBalance }) => {
 *   console.log(`The account ${accountId} has a locked balance ${lockedBalance} units.`);
 * });
 * ```
 */
export function all (api: ApiInterfaceRx): (address: AccountIndex | AccountId | Address | string) => Observable<DerivedBalancesAll> {
  return memo((address: AccountIndex | AccountId | Address | string): Observable<DerivedBalancesAll> =>
    api.derive.balances.account(address).pipe(
      switchMap((account): Observable<Result> =>
        (!account.accountId.isEmpty
          ? combineLatest([
            of(account),
            api.derive.chain.bestNumber(),
            queryCurrent(api, account.accountId)
          ])
          : of([account, api.registry.createType('BlockNumber'), [null, api.registry.createType('Vec<BalanceLock>'), api.registry.createType('Vec<BalanceLock>')]])
        )
      ),
      map((result): DerivedBalancesAll => calcBalances(api, result))
    ));
}
