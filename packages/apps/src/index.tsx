// Copyright 2017-2020 @polkadot/apps authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

// setup these right at front
import './initSettings';
import 'semantic-ui-css/semantic.min.css';
import '@polkadot/react-components/i18n';

import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import { HashRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { Api } from '@polkadot/react-api';
import Queue from '@polkadot/react-components/Status/Queue';
import { BlockAuthors, Events } from '@polkadot/react-query';
import settings from '@polkadot/ui-settings';
import store from 'store';
import Apps from './Apps';

const rootId = 'root';
const rootElement = document.getElementById(rootId);
const theme = { theme: settings.uiTheme };

// remove to react-darwinia
const DARWINIA_TYPES = {
  EpochDuration: 'u64',
  MomentT: 'u64',
  DepositId: 'u256',
  BalanceLock: {
    id: 'LockIdentifier',
    withdraw_lock: 'WithdrawLock',
    reasons: 'WithdrawReasons'
  },
  NormalLock: {
    amount: 'Balance',
    until: 'Moment'
  },
  StakingLock: {
    staking_amount: 'Balance',
    unbondings: 'Vec<NormalLock>'
  },
  WithdrawLock: {
    _enum: {
      Normal: 'NormalLock',
      WithStaking: 'StakingLock'
    }
  },
  EthReceiptProof: {
    index: 'u64',
    proof: 'Bytes',
    header_hash: 'H256'
  },
  BestBlock: {
    height: 'EthBlockNumber',
    hash: 'H256',
    total_difficulty: 'U256'
  },
  BlockDetails: {
    height: 'EthBlockNumber',
    hash: 'H256',
    total_difficulty: 'U256'
  },
  Bloom: {
    _struct: '[u8; 256]'
  },
  EthAddress: 'H160',
  EthBlockNumber: 'u64',
  EthHeader: {
    parent_hash: 'H256',
    timestamp: 'u64',
    number: 'EthBlockNumber',
    auth: 'EthAddress',
    transaction_root: 'H256',
    uncles_hash: 'H256',
    extra_data: 'Bytes',
    state_root: 'H256',
    receipts_root: 'H256',
    log_bloom: 'Bloom',
    gas_used: 'U256',
    gas_limit: 'U256',
    difficulty: 'U256',
    seal: 'Vec<Bytes>',
    hash: 'Option<H256>'
  },
  EthTransactionIndex: '(H256, u64)',
  H64: {
    _struct: '[u8; 8]'
  },
  LogEntry: {
    address: 'EthAddress',
    topics: 'Vec<H256>',
    data: 'Bytes'
  },
  Receipt: {
    gas_used: 'U256',
    log_bloom: 'Bloom',
    logs: 'Vec<LogEntry>',
    outcome: 'TransactionOutcome'
  },
  TransactionOutcome: {
    _enum: {
      Unknown: null,
      StateRoot: 'H256',
      StatusCode: 'u8'
    }
  },
  EraIndex: 'u32',
  Exposure: {
    total: 'Compact<Power>',
    own: 'Compact<Power>',
    others: 'Vec<IndividualExposure>'
  },
  IndividualExposure: {
    who: 'AccountId',
    value: 'Compact<Power>'
  },
  KtonBalance: 'Balance',
  NominatorReward: {
    who: 'AccountId',
    amount: 'Compact<Balance>'
  },
  Power: 'u128',
  RingBalance: 'Balance',
  SlashJournalEntry: {
    who: 'AccountId',
    amount: 'Compact<Power>',
    own_slash: 'Compact<Power>'
  },
  StakingBalances: {
    _enum: {
      Ring: 'Balance',
      Kton: 'Balance'
    }
  },
  StakingBalanceT: {
    _enum: {
      Ring: 'Balance',
      Kton: 'Balance'
    }
  },
  StakingLedger: {
    stash: 'AccountId',
    active_ring: 'Compact<Balance>',
    active_deposit_ring: 'Compact<Balance>',
    active_kton: 'Compact<Balance>',
    deposit_items: 'Vec<TimeDepositItem>',
    ring_staking_lock: 'StakingLock',
    kton_staking_lock: 'StakingLock'
  },
  StakingLedgerT: {
    stash: 'AccountId',
    active_ring: 'Compact<Balance>',
    active_deposit_ring: 'Compact<Balance>',
    active_kton: 'Compact<Balance>',
    deposit_items: 'Vec<TimeDepositItem>',
    ring_staking_lock: 'StakingLock',
    kton_staking_lock: 'StakingLock'
  },
  TimeDepositItem: {
    value: 'Compact<Balance>',
    start_time: 'Compact<Moment>',
    expire_time: 'Compact<Moment>'
  },
  ValidatorPrefs: {
    node_name: 'Bytes',
    validator_payment_ratio: 'Compact<u32>'
  },
  ValidatorReward: {
    who: 'AccountId',
    amount: 'Compact<Balance>',
    nominators_reward: 'Vec<NominatorReward>'
  }
};

if (!rootElement) {
  throw new Error(`Unable to find element with id '${rootId}'`);
}

try {
  store.set('types', DARWINIA_TYPES);
} catch (error) {
  console.error('Type registration failed', error);
}
ReactDOM.render(
  <Suspense fallback='...'>
    <ThemeProvider theme={theme}>
      <Queue>
        <Api url={settings.apiUrl}>
          <BlockAuthors>
            <Events>
              <HashRouter>
                <Apps />
              </HashRouter>
            </Events>
          </BlockAuthors>
        </Api>
      </Queue>
    </ThemeProvider>
  </Suspense>,
  rootElement
);
