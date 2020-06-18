/* eslint-disable @typescript-eslint/camelcase */
// Copyright 2017-2020 @polkadot/api-derive authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AccountId, AccountIndex, Address, Balance, Index } from '@polkadot/types/interfaces';
import { ITuple } from '@polkadot/types/types';
import { DeriveBalancesAccount as DerivedBalancesAccount } from '../types';
import { AccountData, AccountInfo } from '@darwinia/typegen/interfaces';
import { combineLatest, of, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { ApiInterfaceRx } from '@polkadot/api/types';

import { memo } from '../util';

type Result = [Balance, Balance, Balance, Balance, Balance, Balance, Index];

function calcBalances (api: ApiInterfaceRx, [accountId, [free, freeKton, reserved, reservedKton, feeFrozen, miscFrozen, accountNonce]]: [AccountId, Result]): DerivedBalancesAccount {
  return {
    accountId,
    accountNonce,
    freeBalance: free,
    freeBalanceKton: freeKton,
    frozenFee: feeFrozen,
    frozenMisc: miscFrozen,
    reservedBalance: reserved,
    reservedBalanceKton: reservedKton,
    votingBalance: api.registry.createType('Balance', free.add(reserved)),
    votingBalanceKton: api.registry.createType('Balance', freeKton.add(reservedKton))
  };
}

// old
// function queryBalancesFree (api: ApiInterfaceRx, accountId: AccountId): Observable<Result> {
//   return api.queryMulti<[Balance, Balance, Index]>([
//     [api.query.balances.freeBalance, accountId],
//     [api.query.balances.reservedBalance, accountId],
//     [api.query.system.accountNonce, accountId]
//   ]).pipe(
//     map(([freeBalance, reservedBalance, accountNonce]): Result =>
//       [freeBalance, reservedBalance, createType(api.registry, 'Balance'), createType(api.registry, 'Balance'), accountNonce]
//     )
//   );
// }

// function queryBalancesAccount (api: ApiInterfaceRx, accountId: AccountId): Observable<Result> {
//   return api.queryMulti<[AccountData, Index]>([
//     [api.query.balances.account, accountId],
//     [api.query.system.accountNonce, accountId]
//   ]).pipe(
//     map(([{ free_ring, free_kton, reserved_ring, reserved_kton, misc_frozen, fee_frozen }, accountNonce]): Result =>
//       [free_ring, free_kton, reserved_ring, reserved_kton, fee_frozen, misc_frozen, accountNonce]
//     )
//   );
// }

function queryCurrent (api: ApiInterfaceRx, accountId: AccountId): Observable<Result> {
  // AccountInfo is current, support old, eg. Edgeware
  return api.query.system.account<AccountInfo | ITuple<[Index, AccountData]>>(accountId).pipe(
    map((infoOrTuple): Result => {
      const { feeFrozen, free, freeKton, miscFrozen, reserved, reservedKton } = (infoOrTuple as AccountInfo).nonce
        ? (infoOrTuple as AccountInfo).data
        : (infoOrTuple as [Index, AccountData])[1];
      const accountNonce = (infoOrTuple as AccountInfo).nonce || (infoOrTuple as [Index, AccountData])[0];

      return [free, freeKton, reserved, reservedKton, feeFrozen, miscFrozen, accountNonce];
    })
  );
}

/**
 * @name account
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
export function account (api: ApiInterfaceRx): (address: AccountIndex | AccountId | Address | string) => Observable<DerivedBalancesAccount> {
  return memo((address: AccountIndex | AccountId | Address | string): Observable<DerivedBalancesAccount> =>
    api.derive.accounts.info(address).pipe(
      switchMap(({ accountId }): Observable<[AccountId, Result]> =>
        (accountId
          ? combineLatest([
            of(accountId),
            queryCurrent(api, accountId)
          ])
          : of([api.registry.createType('AccountId'), [api.registry.createType('Balance'), api.registry.createType('Balance'), api.registry.createType('Balance'), api.registry.createType('Balance'), api.registry.createType('Balance'), api.registry.createType('Balance'), api.registry.createType('Index')]])
        )
      ),
      map((result): DerivedBalancesAccount => calcBalances(api, result))
    ));
}
