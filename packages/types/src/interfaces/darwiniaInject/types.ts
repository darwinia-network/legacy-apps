/* eslint-disable */

import type { Bytes, Compact, Enum, Struct, u128, U256, u32, u64, U8aFixed, Vec } from '@polkadot/types';
import type { AccountId, Balance, BlockNumber, H256, Hash, LockIdentifier } from '@polkadot/types/interfaces/runtime';
import { EraIndex } from '@polkadot/types/interfaces/staking';
import type { ITuple } from '@polkadot/types/types';

/** @name AddressT */
export interface AddressT extends U8aFixed {}

/** @name BalanceInfo */
export interface BalanceInfo extends Struct {}

/** @name Bloom */
export interface Bloom extends U8aFixed {}

/** @name Common */
export interface Common extends Struct {
  readonly amount: Balance;
}

/** @name DepositId */
export interface DepositId extends U256 {}

/** @name EthereumBlockNumber */
export interface EthereumBlockNumber extends u64 {}

/** @name EthereumNetwork */
export interface EthereumNetwork extends Enum {
  readonly isMainnet: boolean;
  readonly isRopsten: boolean;
}

/** @name EthereumReceipt */
export interface EthereumReceipt extends Struct {
  readonly Legacy: LegacyReceipt;
  readonly AccessList: LegacyReceipt;
  readonly EIP1559Transaction: LegacyReceipt;
}

/** @name EthereumReceiptProof */
export interface EthereumReceiptProof extends Struct {
  readonly index: u64;
  readonly proof: Bytes;
  readonly headerHash: H256;
}

/** @name EthereumTransactionIndex */
export interface EthereumTransactionIndex extends ITuple<[H256, u64]> {}

/** @name KtonBalance */
export interface KtonBalance extends Balance {}

/** @name LegacyReceipt */
export interface LegacyReceipt extends Struct {
  readonly gasUsed: U256;
  readonly logBloom: Bloom;
  readonly logs: Vec<LogEntry>;
  readonly outcome: TransactionOutcome;
}

/** @name LockFor */
export interface LockFor extends Enum {
  readonly isCommon: boolean;
  readonly asCommon: Common;
  readonly isStaking: boolean;
  readonly asStaking: StakingLock;
}

/** @name LogEntry */
export interface LogEntry extends Struct {}

/** @name MappedRing */
export interface MappedRing extends u128 {}

/** @name MerkleMountainRangeRootLog */
export interface MerkleMountainRangeRootLog extends Struct {
  readonly prefix: U8aFixed;
  readonly ParentMmrRoot: Hash;
}

/** @name MMRProof */
export interface MMRProof extends Struct {
  readonly memberLeafIndex: u64;
  readonly lastLeafIndex: u64;
  readonly proof: Vec<H256>;
}

/** @name MMRRoot */
export interface MMRRoot extends Hash {}

/** @name OpCode */
export interface OpCode extends U8aFixed {}

/** @name PalletId */
export interface PalletId extends LockIdentifier {}

/** @name Power */
export interface Power extends u32 {}

/** @name RedeemFor */
export interface RedeemFor extends Enum {
  readonly isToken: boolean;
  readonly isDeposit: boolean;
}

/** @name RingBalance */
export interface RingBalance extends Balance {}

/** @name RKT */
export interface RKT extends Struct {
  readonly r: Balance;
  readonly k: Balance;
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
  readonly active: Compact<Balance>;
  readonly activeDepositRing: Compact<Balance>;
  readonly activeKton: Compact<Balance>;
  readonly depositItems: Vec<TimeDepositItem>;
  readonly ringStakingLock: StakingLock;
  readonly ktonStakingLock: StakingLock;
  readonly claimedRewards: Vec<EraIndex>;
}

/** @name StakingLock */
export interface StakingLock extends Struct {
  readonly stakingAmount: Balance;
  readonly unbondings: Vec<Unbonding>;
}

/** @name Term */
export interface Term extends BlockNumber {}

/** @name TimeDepositItem */
export interface TimeDepositItem extends Struct {
  readonly value: Compact<Balance>;
  readonly startTime: Compact<TsInMs>;
  readonly expireTime: Compact<TsInMs>;
}

/** @name TransactionOutcome */
export interface TransactionOutcome extends Struct {}

/** @name TsInMs */
export interface TsInMs extends u64 {}

/** @name Unbonding */
export interface Unbonding extends Struct {
  readonly amount: Balance;
  readonly until: BlockNumber;
}

export type PHANTOM_DARWINIAINJECT = 'darwiniaInject';
