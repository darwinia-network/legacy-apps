// Copyright 2017-2020 @polkadot/api-derive authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AccountId, Balance, Voter } from '@polkadot/types/interfaces';
import { ITuple } from '@polkadot/types/types';
import { ApiInterfaceRx, QueryableModuleStorage } from '@polkadot/api/types';
import { DeriveCouncilVote, DeriveCouncilVotes } from '../types';

import { Observable, combineLatest, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Vec } from '@polkadot/types';

import { memo } from '../util';

type VoteEntry = Voter | ITuple<[Balance, Vec<AccountId>]>;

function isVoter (value: VoteEntry): value is Voter {
  return !Array.isArray(value);
}

function retrieveStakeOf (elections: QueryableModuleStorage<'rxjs'>): Observable<[AccountId, Balance][]> {
  return elections.stakeOf.entries<Balance, [AccountId]>().pipe(
    map((entries) =>
      entries.map(([{ args: [accountId] }, stake]) => [accountId, stake])
    )
  );
}

function retrieveVoteOf (elections: QueryableModuleStorage<'rxjs'>): Observable<[AccountId, AccountId[]][]> {
  return elections.votesOf.entries<Vec<AccountId>, [AccountId]>().pipe(
    map((entries) =>
      entries.map(([{ args: [accountId] }, votes]) => [accountId, votes])
    )
  );
}

function retrievePrev (api: ApiInterfaceRx, elections: QueryableModuleStorage<'rxjs'>): Observable<DeriveCouncilVotes> {
  return combineLatest([retrieveStakeOf(elections), retrieveVoteOf(elections)]).pipe(
    map(
      ([stakes, votes]): DeriveCouncilVotes => {
        const result: DeriveCouncilVotes = [];

        votes.forEach(([voter, votes]): void => {
          result.push([voter, { stake: api.registry.createType('Balance'), votes }]);
        });

        stakes.forEach(([staker, stake]): void => {
          const entry = result.find(([voter]) => voter.eq(staker));

          if (entry) {
            entry[1].stake = stake;
          } else {
            result.push([staker, { stake, votes: [] }]);
          }
        });

        return result;
      }
    )
  );
}

function retrieveCurrent (elections: QueryableModuleStorage<'rxjs'>): Observable<DeriveCouncilVotes> {
  return elections.voting.entries<VoteEntry, [AccountId]>().pipe(
    map(
      (entries): DeriveCouncilVotes =>
        entries.map(([{ args: [accountId] }, value]): [AccountId, DeriveCouncilVote] => [
          accountId,
          isVoter(value) ? { stake: value.stake, votes: value.votes } : { stake: value[0], votes: value[1] }
        ])
    )
  );
}

export function votes (api: ApiInterfaceRx): () => Observable<DeriveCouncilVotes> {
  return memo(
    (): Observable<DeriveCouncilVotes> => {
      const elections = (api.query.phragmenElection || api.query.electionsPhragmen || api.query.elections).stakeOf;

      return elections ? elections.stakeOf ? retrievePrev(api, elections) : retrieveCurrent(elections) : of([]);
    }
  );
}
