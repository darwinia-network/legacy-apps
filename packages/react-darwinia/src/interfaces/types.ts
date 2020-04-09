// Auto-generated via `yarn polkadot-types-from-defs`, do not edit
/* eslint-disable @typescript-eslint/no-empty-interface */

import { ITuple, EraIndex } from '@polkadot/types/types';
import { Compact, Enum, Option, Struct, U8aFixed, Vec } from '@polkadot/types/codec';
import { Bytes, U256, u32, u64 } from '@polkadot/types/primitive';
import { AccountId, Balance, BlockNumber, H160, H256, LockIdentifier, Moment } from '@polkadot/types/interfaces/runtime';
import { UnlockChunk } from '@polkadot/types/interfaces/staking';

/** @name AccountData */
export interface AccountData extends Struct {
  readonly free_kton: Balance;
  readonly reserved_kton: Balance;
  readonly free: Balance;
  readonly reserved: Balance;
  readonly misc_frozen: Balance;
  readonly fee_frozen: Balance;
}

/** @name AddressT */
export interface AddressT extends U8aFixed {}

/** @name BalanceLock */
export interface BalanceLock extends Struct {
  readonly id: LockIdentifier;
  readonly lock_for: LockFor;
  readonly lock_reasons: LockReasons;
}

/** @name Bloom */
export interface Bloom extends Struct {
  readonly _struct: U8aFixed;
}

/** @name Common */
export interface Common extends Struct {
  readonly amount: Balance;
}

/** @name DepositId */
export interface DepositId extends U256 {}

/** @name EthAddress */
export interface EthAddress extends H160 {}

/** @name EthBlockNumber */
export interface EthBlockNumber extends u64 {}

/** @name EthHeader */
export interface EthHeader extends Struct {
  readonly parent_hash: H256;
  readonly timestamp: u64;
  readonly number: EthBlockNumber;
  readonly auth: EthAddress;
  readonly transaction_root: H256;
  readonly uncles_hash: H256;
  readonly extra_data: Bytes;
  readonly state_root: H256;
  readonly receipts_root: H256;
  readonly log_bloom: Bloom;
  readonly gas_used: U256;
  readonly gas_limit: U256;
  readonly difficulty: U256;
  readonly seal: Vec<Bytes>;
  readonly hash: Option<H256>;
}

/** @name EthReceiptProof */
export interface EthReceiptProof extends Struct {
  readonly index: u64;
  readonly proof: Bytes;
  readonly header_hash: H256;
}

/** @name EthTransactionIndex */
export interface EthTransactionIndex extends ITuple<[H256, u64]> {}

/** @name Exposure */
export interface Exposure extends Struct {
  readonly own_ring_balance: Compact<Balance>;
  readonly own_kton_balance: Compact<Balance>;
  readonly own_power: Power;
  readonly total_power: Power;
  readonly others: Vec<IndividualExposure>;
}

/** @name HeaderInfo */
export interface HeaderInfo extends Struct {
  readonly total_difficulty: U256;
  readonly parent_hash: H256;
  readonly number: EthBlockNumber;
}

/** @name IndividualExposure */
export interface IndividualExposure extends Struct {
  readonly who: AccountId;
  readonly ring_balance: Compact<Balance>;
  readonly kton_balance: Compact<Balance>;
  readonly power: Power;
}

/** @name KtonBalance */
export interface KtonBalance extends Balance {}

/** @name LockFor */
export interface LockFor extends Enum {
  readonly isCommon: boolean;
  readonly asCommon: Common;
  readonly isStaking: boolean;
  readonly asStaking: StakingLock;
}

/** @name LockReasons */
export interface LockReasons extends Enum {
  readonly isFee: boolean;
  readonly isMisc: boolean;
  readonly isAll: boolean;
}

/** @name MomentT */
export interface MomentT extends Moment {}

/** @name NominatorReward */
export interface NominatorReward extends Struct {
  readonly who: AccountId;
  readonly amount: Compact<Balance>;
}

/** @name Power */
export interface Power extends u32 {}

/** @name Receipt */
export interface Receipt extends Struct {
  readonly gas_used: U256;
  readonly log_bloom: Bloom;
  // readonly logs: Vec<LogEntry>;
  // readonly outcome: TransactionOutcome;
}

/** @name RewardDestination */
export interface RewardDestination extends Enum {
  readonly isStaked: boolean;
  readonly asStaked: Staked;
  readonly isStash: boolean;
  readonly isController: boolean;
}

/** @name RingBalance */
export interface RingBalance extends Balance {}

/** @name RK */
export interface RK extends Struct {
  readonly r: Balance;
  readonly k: Balance;
}

/** @name RKT */
export interface RKT extends RK {}

/** @name Staked */
export interface Staked extends Struct {
  readonly promise_month: Moment;
}

/** @name StakingBalance */
export interface StakingBalance extends Enum {
  readonly isAll: boolean;
  readonly isRingBalance: boolean;
  readonly asRingBalance: Balance;
  readonly isKtonBalance: boolean;
  readonly asKtonBalance: Balance;
}

/** @name StakingBalanceT */
export interface StakingBalanceT extends StakingBalance {}

/** @name StakingLedger */
export interface StakingLedger extends Struct {
  readonly stash: AccountId;
  readonly active_ring: Compact<Balance>;
  readonly active_deposit_ring: Compact<Balance>;
  readonly active_kton: Compact<Balance>;
  readonly deposit_items: Vec<TimeDepositItem>;
  readonly ring_staking_lock: StakingLock;
  readonly kton_staking_lock: StakingLock;
  readonly total: Compact<Balance>;
  readonly active: Compact<Balance>;
  readonly unlocking: Vec<UnlockChunk>;
  readonly lastReward: Option<EraIndex>;
}

/** @name StakingLedgerT */
export interface StakingLedgerT extends StakingLedger {}

/** @name StakingLock */
export interface StakingLock extends Struct {
  readonly staking_amount: Balance;
  readonly unbondings: Vec<Unbonding>;
}

/** @name TimeDepositItem */
export interface TimeDepositItem extends Struct {
  readonly value: Compact<Balance>;
  readonly start_time: Compact<Moment>;
  readonly expire_time: Compact<Moment>;
}

/** @name TronAddress */
export interface TronAddress extends Struct {
  readonly _struct: AddressT;
}

/** @name Unbonding */
export interface Unbonding extends Struct {
  readonly amount: Balance;
  readonly moment: BlockNumber;
}

/** @name ValidatorReward */
export interface ValidatorReward extends Struct {
  readonly who: AccountId;
  readonly amount: Compact<Balance>;
  readonly nominators_reward: Vec<NominatorReward>;
}
