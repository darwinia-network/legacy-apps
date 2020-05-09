// Auto-generated via `yarn polkadot-types-from-defs`, do not edit
/* eslint-disable */

import { ITuple } from '@polkadot/types/types';
import { Compact, Enum, Option, Struct, U8aFixed, Vec } from '@polkadot/types/codec';
import { Bytes, U256, u32, u64, u8 } from '@polkadot/types/primitive';
import { Reasons } from '@polkadot/types/interfaces/balances';
import { EthereumAddress } from '@polkadot/types/interfaces/claims';
import { AccountId, Balance, BlockNumber, H160, H256, H512, Hash, LockIdentifier } from '@polkadot/types/interfaces/runtime';
import { EraIndex, UnlockChunk } from '@polkadot/types/interfaces/staking';

/** @name AccountData */
export interface AccountData extends Struct {
  readonly free: Balance;
  readonly reserved: Balance;
  readonly free_kton: Balance;
  readonly reserved_kton: Balance;
  readonly misc_frozen: Balance;
  readonly fee_frozen: Balance;
}

/** @name Address */
export interface Address extends AccountId {}

/** @name AddressT */
export interface AddressT extends U8aFixed {}

/** @name BalanceInfo */
export interface BalanceInfo extends Struct {}

/** @name BalanceLock */
export interface BalanceLock extends Struct {
  readonly id: LockIdentifier;
  readonly lock_for: LockFor;
  readonly lock_reasons: LockReasons;
}

/** @name Bloom */
export interface Bloom extends U8aFixed {}

/** @name Common */
export interface Common extends Struct {
  readonly amount: Balance;
}

/** @name DepositId */
export interface DepositId extends U256 {}

/** @name DoubleNodeWithMerkleProof */
export interface DoubleNodeWithMerkleProof extends Struct {
  readonly dag_nodes: ITuple<[H512, H512]>;
  readonly proof: Vec<H128>;
}

/** @name EcdsaSignature */
export interface EcdsaSignature extends U8aFixed {}

/** @name ElectionResultT */
export interface ElectionResultT extends Struct {}

/** @name EthAddress */
export interface EthAddress extends H160 {}

/** @name EthBlockNumber */
export interface EthBlockNumber extends u64 {}

/** @name EthHeader */
export interface EthHeader extends Struct {
  readonly parent_hash: H256;
  readonly timestamp: u64;
  readonly number: EthBlockNumber;
  readonly author: EthAddress;
  readonly transactions_root: H256;
  readonly uncles_hash: H256;
  readonly extra_data: Bytes;
  readonly state_root: H256;
  readonly receipts_root: H256;
  readonly log_bloom: Bloom;
  readonly gas_used: U256;
  readonly gas_limit: U256;
  readonly difficulty: U256;
  readonly seal: Vec<Bytes>;
  readonly hash: H256;
}

/** @name EthHeaderBrief */
export interface EthHeaderBrief extends Struct {
  readonly total_difficulty: U256;
  readonly parent_hash: H256;
  readonly number: EthBlockNumber;
  readonly relayer: AccountId;
}

/** @name EthNetworkType */
export interface EthNetworkType extends Enum {
  readonly isMainnet: boolean;
  readonly isRopsten: boolean;
}

/** @name EthReceiptProof */
export interface EthReceiptProof extends Struct {
  readonly index: u64;
  readonly proof: Bytes;
  readonly header_hash: H256;
}

/** @name EthTransactionIndex */
export interface EthTransactionIndex extends ITuple<[H256, u64]> {}

/** @name ExposureT */
export interface ExposureT extends Struct {
  readonly own_ring_balance: Compact<Balance>;
  readonly own_kton_balance: Compact<Balance>;
  readonly own_power: Power;
  readonly total_power: Power;
  readonly others: Vec<IndividualExposure>;
}

/** @name StakingLedger */
export interface Exposure extends ExposureT {}

/** @name H128 */
export interface H128 extends U8aFixed {}

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

/** @name LogEntry */
export interface LogEntry extends Struct {}

/** @name MerkleMountainRangeRootLog */
export interface MerkleMountainRangeRootLog extends Struct {
  readonly prefix: U8aFixed;
  readonly mmr_root: Hash;
}

/** @name OtherAddress */
export interface OtherAddress extends Enum {
  readonly isEth: boolean;
  readonly asEth: EthereumAddress;
  readonly isTron: boolean;
  readonly asTron: TronAddress;
}

/** @name OtherSignature */
export interface OtherSignature extends Enum {
  readonly isEth: boolean;
  readonly asEth: EcdsaSignature;
  readonly isTron: boolean;
  readonly asTron: EcdsaSignature;
}

/** @name Power */
export interface Power extends u32 {}

/** @name Receipt */
export interface Receipt extends Struct {
  readonly gas_used: U256;
  readonly log_bloom: Bloom;
  readonly logs: Vec<LogEntry>;
  readonly outcome: TransactionOutcome;
}

/** @name RedeemFor */
export interface RedeemFor extends Enum {
  readonly isRing: boolean;
  readonly asRing: EthReceiptProof;
  readonly isKton: boolean;
  readonly asKton: EthReceiptProof;
  readonly isDeposit: boolean;
  readonly asDeposit: EthReceiptProof;
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

/** @name RKT */
export interface RKT extends Struct {
  readonly r: Balance;
  readonly k: Balance;
}

/** @name Staked */
export interface Staked extends Struct {
  readonly promise_month: u8;
}

/** @name StakingBalanceT */
export interface StakingBalanceT extends Enum {
  readonly isRingBalance: boolean;
  readonly asRingBalance: Balance;
  readonly isKtonBalance: boolean;
  readonly asKtonBalance: Balance;
}

/** @name StakingLedgerT */
export interface StakingLedgerT extends Struct {
  readonly stash: AccountId;
  readonly active_ring: Compact<Balance>;
  readonly active_deposit_ring: Compact<Balance>;
  readonly active_kton: Compact<Balance>;
  readonly deposit_items: Vec<TimeDepositItem>;
  readonly ring_staking_lock: StakingLock;
  readonly kton_staking_lock: StakingLock;
  readonly claimedRewards: Vec<EraIndex>;
}

/** @name StakingLedger */
export interface StakingLedger extends StakingLedgerT {}

/** @name StakingLock */
export interface StakingLock extends Struct {
  readonly staking_amount: Balance;
  readonly unbondings: Vec<Unbonding>;
}

/** @name TimeDepositItem */
export interface TimeDepositItem extends Struct {
  readonly value: Compact<Balance>;
  readonly start_time: Compact<TsInMs>;
  readonly expire_time: Compact<TsInMs>;
}

/** @name TransactionOutcome */
export interface TransactionOutcome extends Struct {}

/** @name TronAddress */
export interface TronAddress extends EthereumAddress {}

/** @name TsInMs */
export interface TsInMs extends u64 {}

/** @name Unbonding */
export interface Unbonding extends Struct {
  readonly amount: Balance;
  readonly moment: BlockNumber;
}

export type PHANTOM_DARWINIAINJECT = 'darwiniaInject';
