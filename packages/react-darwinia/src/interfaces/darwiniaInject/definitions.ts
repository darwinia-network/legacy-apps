/* eslint-disable @typescript-eslint/camelcase */

export default {
  types:   
  {
    // "__[frame.system]__": {},
    "Address": "AccountId",
    // "__[pallet.balances]__": {},
    "BalanceInfo": {},
    "BalanceLock": {
      "id": "LockIdentifier",
      "lock_for": "LockFor",
      "lock_reasons": "LockReasons",
      "amount": "Balance",
      "reasons": "Reasons"
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
    "LockReasons": {
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
      "free": "Balance",
      "reserved": "Balance",
      "free_kton": "Balance",
      "reserved_kton": "Balance",
      "misc_frozen": "Balance",
      "fee_frozen": "Balance"
    },
    // "__[pallet.staking]__": {},
    "RingBalance": "Balance",
    "KtonBalance": "Balance",
    "TsInMs": "u64",
    "Power": "u32",
    "DepositId": "U256",
    "StakingBalanceT": {
      "_enum": {
        "RingBalance": "Balance",
        "KtonBalance": "Balance"
      }
    },
    "StakingLedgerT": {
      "stash": "AccountId",
      "active_ring": "Compact<Balance>",
      "active_deposit_ring": "Compact<Balance>",
      "active_kton": "Compact<Balance>",
      "deposit_items": "Vec<TimeDepositItem>",
      "ring_staking_lock": "StakingLock",
      "kton_staking_lock": "StakingLock",
      "claimedRewards": "Vec<EraIndex>"
    },
    "TimeDepositItem": {
      "value": "Compact<Balance>",
      "start_time": "Compact<TsInMs>",
      "expire_time": "Compact<TsInMs>"
    },
    "RewardDestination": {
      "_enum": {
        "Staked": "Staked",
        "Stash": null,
        "Controller": null
      }
    },
    "Staked": {
      "promise_month": "u8"
    },
    "ExposureT": {
      "own_ring_balance": "Compact<Balance>",
      "own_kton_balance": "Compact<Balance>",
      "own_power": "Power",
      "total_power": "Power",
      "others": "Vec<IndividualExposure>",
      "total": "Compact<Balance>",
      "own": "Compact<Balance>"
    },
    "IndividualExposure": {
      "who": "AccountId",
      "ring_balance": "Compact<Balance>",
      "kton_balance": "Compact<Balance>",
      "power": "Power",
      "value": "Compact<Balance>"
    },
    "RKT": {
      "r": "Balance",
      "k": "Balance"
    },
    // "__[pallet.bridge.eth]__": {},
    "EthTransactionIndex": "(H256, u64)",
    "EthHeaderBrief": {
      "total_difficulty": "U256",
      "parent_hash": "H256",
      "number": "EthBlockNumber",
      "relayer": "AccountId"
    },
    "EthBlockNumber": "u64",
    "EthHeader": {
      "parent_hash": "H256",
      "timestamp": "u64",
      "number": "EthBlockNumber",
      "author": "EthAddress",
      "transactions_root": "H256",
      "uncles_hash": "H256",
      "extra_data": "Bytes",
      "state_root": "H256",
      "receipts_root": "H256",
      "log_bloom": "Bloom",
      "gas_used": "U256",
      "gas_limit": "U256",
      "difficulty": "U256",
      "seal": "Vec<Bytes>",
      "hash": "H256"
    },
    "EthAddress": "H160",
    "Bloom": "[u8; 256; Bloom]",
    "H128": "[u8; 16; H128]",
    "DoubleNodeWithMerkleProof": {
      "dag_nodes": "(H512, H512)",
      "proof": "Vec<H128>"
    },
    "ElectionResultT": {},
    "LogEntry": {},
    "TransactionOutcome": {},
    "Receipt": {
      "gas_used": "U256",
      "log_bloom": "Bloom",
      "logs": "Vec<LogEntry>",
      "outcome": "TransactionOutcome"
    },
    "EthNetworkType": {
      "_enum": {
        "Mainnet": null,
        "Ropsten": null
      }
    },
    "RedeemFor": {
      "_enum": {
        "Ring": "EthReceiptProof",
        "Kton": "EthReceiptProof",
        "Deposit": "EthReceiptProof"
      }
    },
    "EthReceiptProof": {
      "index": "u64",
      "proof": "Bytes",
      "header_hash": "H256"
    },
    // "__[pallet.claims]__": {},
    "OtherSignature": {
      "_enum": {
        "Eth": "EcdsaSignature",
        "Tron": "EcdsaSignature"
      }
    },
    "EcdsaSignature": "[u8; 65; EcdsaSignature]",
    "TronAddress": "EthereumAddress",
    "OtherAddress": {
      "_enum": {
        "Eth": "EthereumAddress",
        "Tron": "TronAddress"
      }
    },
    "AddressT": "[u8; 20; AddressT]",
    // "__[pallet.header-mmr]__": {},
    "MerkleMountainRangeRootLog": {
      "prefix": "[u8; 4; Prefix]",
      "mmr_root": "Hash"
    }
  }
};
