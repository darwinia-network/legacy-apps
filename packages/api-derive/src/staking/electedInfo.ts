// Copyright 2017-2020 @polkadot/api-derive authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ApiInterfaceRx } from '@polkadot/api/types';
import { AccountId, ValidatorPrefs } from '@polkadot/types/interfaces';
import { DeriveStakingQuery, DeriveStakingElected } from '../types';

import { Observable, combineLatest, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { memo } from '../util';

export function electedInfo (api: ApiInterfaceRx): () => Observable<DeriveStakingElected> {
  return memo((): Observable<DeriveStakingElected> =>
    combineLatest([
      api.derive.staking.validators(),
      api.query.staking.currentEra()
    ]).pipe(
      switchMap(( [{nextElected}, currentEra] ): Observable<[AccountId[], DeriveStakingQuery[]], ValidatorPrefs[]> =>
        combineLatest([
          of(nextElected),
          combineLatest(
            nextElected.map((accountId) => {
              return api.derive.staking.query(accountId);
            })
          ),
          combineLatest(
            nextElected.map((accountId) => {
              return api.query.staking.erasValidatorPrefs(currentEra.unwrap(), accountId.toString());
            })
          )
        ])
      ),
      map(([nextElected, info, activeComminssions]): DeriveStakingElected => ({
        info,
        nextElected,
        activeComminssions
      }))
    )
  );
}
