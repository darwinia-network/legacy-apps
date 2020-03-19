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
	"RingBalance": "Balance",
	"KtonBalance": "Balance",
	"MomentT": "Moment",
	"Power": "u32",
	"DepositId": "U256",

	"StakingBalanceT": "StakingBalance",
	"StakingBalance": {
		"_enum": {
			"All": null,
			"RingBalance": "Balance",
			"KtonBalance": "Balance"
		}
	},

	"StakingLedgerT": "StakingLedger",
	"StakingLedger": {
		"stash": "AccountId",
		"active_ring": "Compact<Balance>",
		"active_deposit_ring": "Compact<Balance>",
		"active_kton": "Compact<Balance>",
		"deposit_items": "Vec<TimeDepositItem>",
		"ring_staking_lock": "StakingLock",
		"kton_staking_lock": "StakingLock",
		"total": "Compact<Balance>",
		"active": "Compact<Balance>",
		"unlocking": "Vec<UnlockChunk>"
	},

	"TimeDepositItem": {
		"value": "Compact<Balance>",
		"start_time": "Compact<Moment>",
		"expire_time": "Compact<Moment>"
	},

	"RewardDestination": {
		"_enum": {
			"Staked": "Staked",
			"Stash": null,
			"Controller": null
		}
	},

	"Staked": {
		"promise_month": "Moment"
	},

	"Exposure": {
		"own_ring_balance": "Compact<Balance>",
		"own_kton_balance": "Compact<Balance>",
		"own_power": "Power",
		"total_power": "Power",
		"others": "Vec<IndividualExposure>"
	},

	"IndividualExposure": {
		"who": "AccountId",
		"ring_balance": "Compact<Balance>",
		"kton_balance": "Compact<Balance>",
		"power": "Power"
	},

	"ValidatorReward": {
		"who": "AccountId",
		"amount": "Compact<Balance>",
		"nominators_reward": "Vec<NominatorReward>"
	},

	"NominatorReward": {
		"who": "AccountId",
		"amount": "Compact<Balance>"
	},

	"RKT": "RK",
	"RK": {
		"r": "Balance",
		"k": "Balance"
	},

	"BalanceLock": {
		"id": "LockIdentifier",
		"lock_for": "LockFor",
		"lock_reasons": "LockReasons"
	},

	"LockFor": {
		"_enum": {
			"Common": "Common",
			"Staking": "StakingLock"
		}
	},

	"Common": {
		"amount": "Balance"
	},

	"StakingLock": {
		"staking_amount": "Balance",
		"unbondings": "Vec<Unbonding>"
	},

	"LockReasons":{
		"_enum": {
			"Fee": null,
			"Misc": null,
			"All": null
		}
	},

	"Unbonding": {
		"amount": "Balance",
		"moment": "BlockNumber"
	},

	"AccountData": {
		"free_ring": "Balance",
		"free_kton": "Balance",
		"reserved_ring": "Balance",
		"reserved_kton": "Balance",
		"free": "Balance",
		"reserved": "Balance",
		"misc_frozen": "Balance",
		"fee_frozen": "Balance"
	},

	"EthBlockNumber": "u64",
	"EthAddress": "H160",

	"EthTransactionIndex": "(H256, u64)",

	"HeaderInfo": {
		"total_difficulty": "U256",
		"parent_hash": "H256",
		"number": "EthBlockNumber"
	},

	"EthHeader": {
		"parent_hash": "H256",
		"timestamp": "u64",
		"number": "EthBlockNumber",
		"auth": "EthAddress",
		"transaction_root": "H256",
		"uncles_hash": "H256",
		"extra_data": "Bytes",
		"state_root": "H256",
		"receipts_root": "H256",
		"log_bloom": "Bloom",
		"gas_used": "U256",
		"gas_limit": "U256",
		"difficulty": "U256",
		"seal": "Vec<Bytes>",
		"hash": "Option<H256>"
	},

	"Bloom": {
		"_struct": "[u8; 256]"
	},

	"Receipt": {
		"gas_used": "U256",
		"log_bloom": "Bloom",
		"logs": "Vec<LogEntry>",
		"outcome": "TransactionOutcome"
	},

	"EthReceiptProof": {
		"index": "u64",
		"proof": "Bytes",
		"header_hash": "H256"
	},

	"RedeemFor": {
		"_enum": {
			"Ring": "EthReceiptProof",
			"Kton": "EthReceiptProof",
			"Deposit": "EthReceiptProof"
		}
	},

	"AddressT": "[u8; 20]",

	"EthereumAddress": {
		"_struct": "AddressT"
	},
	"TronAddress": {
		"_struct": "AddressT"
	},

	"OtherSignature": {
		"_enum": {
			"Dot": "EcdsaSignature",
			"Eth": "EcdsaSignature",
			"Tron": "EcdsaSignature"
		}
	},

	"OtherAddress": {
		"_enum": {
			"Dot": "EthereumAddress",
			"Eth": "EthereumAddress",
			"Tron": "EthereumAddress"
		}
	},

	"EcdsaSignature": {
		"_struct": "[u8; 65]"
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
