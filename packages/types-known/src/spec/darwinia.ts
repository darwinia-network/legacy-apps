// Copyright 2017-2020 @polkadot/types-known authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { OverrideVersionedType } from '@polkadot/types/types';

const sharedTypes = {
  CompactAssignments: {
    votes1: 'Vec<(NominatorIndexCompact, ValidatorIndexCompact)>',
    votes2: 'Vec<(NominatorIndexCompact, CompactScoreCompact, ValidatorIndexCompact)>',
    votes3: 'Vec<(NominatorIndexCompact, [CompactScoreCompact; 2], ValidatorIndexCompact)>',
    votes4: 'Vec<(NominatorIndexCompact, [CompactScoreCompact; 3], ValidatorIndexCompact)>',
    votes5: 'Vec<(NominatorIndexCompact, [CompactScoreCompact; 4], ValidatorIndexCompact)>',
    votes6: 'Vec<(NominatorIndexCompact, [CompactScoreCompact; 5], ValidatorIndexCompact)>',
    votes7: 'Vec<(NominatorIndexCompact, [CompactScoreCompact; 6], ValidatorIndexCompact)>',
    votes8: 'Vec<(NominatorIndexCompact, [CompactScoreCompact; 7], ValidatorIndexCompact)>',
    votes9: 'Vec<(NominatorIndexCompact, [CompactScoreCompact; 8], ValidatorIndexCompact)>',
    votes10: 'Vec<(NominatorIndexCompact, [CompactScoreCompact; 9], ValidatorIndexCompact)>',
    votes11: 'Vec<(NominatorIndexCompact, [CompactScoreCompact; 10], ValidatorIndexCompact)>',
    votes12: 'Vec<(NominatorIndexCompact, [CompactScoreCompact; 11], ValidatorIndexCompact)>',
    votes13: 'Vec<(NominatorIndexCompact, [CompactScoreCompact; 12], ValidatorIndexCompact)>',
    votes14: 'Vec<(NominatorIndexCompact, [CompactScoreCompact; 13], ValidatorIndexCompact)>',
    votes15: 'Vec<(NominatorIndexCompact, [CompactScoreCompact; 14], ValidatorIndexCompact)>',
    votes16: 'Vec<(NominatorIndexCompact, [CompactScoreCompact; 15], ValidatorIndexCompact)>'
  },
  NominatorIndexCompact: 'Compact<NominatorIndex>',
  ValidatorIndexCompact: 'Compact<ValidatorIndex>',
  RewardDestination: {
    _enum: {
      Staked: 'Null',
      Stash: 'Null',
      Controller: 'Null',
      Account: 'AccountId'
    }
  },
  Judgement: 'IdentityJudgement'
};

const versioned: OverrideVersionedType[] = [
  {
    minmax: [0, 2],
    types: {
      ...sharedTypes,
      RefCount: 'RefCountTo259'
    }
  },
  {
    minmax: [3, undefined],
    types: {
      ...sharedTypes
    }
  }
];

export default versioned;
