// Auto-generated via `yarn polkadot-types-from-chain`, do not edit
/* eslint-disable */

import { Bytes, u32, u64, u8 } from '@polkadot/types/primitive';
import { Balance, BalanceOf, BlockNumber, LockIdentifier, ModuleId, Moment, Percent, Permill, RuntimeDbWeight, Weight } from '@polkadot/types/interfaces/runtime';
import { SessionIndex } from '@polkadot/types/interfaces/session';
import { EraIndex } from '@polkadot/types/interfaces/staking';
import { EthNetworkType, KtonBalance, Power, RingBalance } from '@polkadot/react-darwinia/interfaces/darwiniaInject';

declare module '@polkadot/metadata/Decorated/consts/types' {
  export interface Constants {
    babe: {

      /**
       * The number of **slots** that an epoch takes. We couple sessions to
       * epochs, i.e. we start a new session once the new epoch begins.
       **/
      epochDuration: AugmentedConst<u64>;
      /**
       * The expected average block time at which BABE should be creating
       * blocks. Since BABE is probabilistic it is not trivial to figure out
       * what the expected average block time should be based on the slot
       * duration and the security parameter `c` (where `1 - c` represents
       * the probability of a slot being empty).
       **/
      expectedBlockTime: AugmentedConst<Moment>;
    };
    balances: {

      /**
       * The minimum amount required to keep an account open.
       **/
      existentialDeposit: AugmentedConst<Balance>;
    };
    claims: {

      /**
       * The Prefix that is used in signed Ethereum messages for this network
       **/
      prefix: AugmentedConst<Bytes>;
    };
    electionsPhragmen: {

      candidacyBond: AugmentedConst<BalanceOf>;
      desiredMembers: AugmentedConst<u32>;
      desiredRunnersUp: AugmentedConst<u32>;
      moduleId: AugmentedConst<LockIdentifier>;
      termDuration: AugmentedConst<BlockNumber>;
      votingBond: AugmentedConst<BalanceOf>;
    };
    ethBacking: {

      /**
       * The treasury's module id, used for deriving its sovereign account ID.
       **/
      moduleId: AugmentedConst<ModuleId>;
      subKeyPrefix: AugmentedConst<u8>;
    };
    ethOffchain: {

      fetchInterval: AugmentedConst<BlockNumber>;
    };
    ethRelay: {

      ethNetwork: AugmentedConst<EthNetworkType>;
    };
    finalityTracker: {

      /**
       * The delay after which point things become suspicious. Default is 1000.
       **/
      reportLatency: AugmentedConst<BlockNumber>;
      /**
       * The number of recent samples to keep from this chain. Default is 101.
       **/
      windowSize: AugmentedConst<BlockNumber>;
    };
    identity: {

      /**
       * The amount held on deposit for a registered identity.
       **/
      basicDeposit: AugmentedConst<BalanceOf>;
      /**
       * The amount held on deposit per additional field for a registered identity.
       **/
      fieldDeposit: AugmentedConst<BalanceOf>;
      /**
       * Maximum number of additional fields that may be stored in an ID. Needed to bound the I/O
       * required to access an identity, but can be pretty high.
       **/
      maxAdditionalFields: AugmentedConst<u32>;
      /**
       * Maxmimum number of registrars allowed in the system. Needed to bound the complexity
       * of, e.g., updating judgements.
       **/
      maxRegistrars: AugmentedConst<u32>;
      /**
       * The maximum number of sub-accounts allowed per identified account.
       **/
      maxSubAccounts: AugmentedConst<u32>;
      /**
       * The amount held on deposit for a registered subaccount. This should account for the fact
       * that one storage item's value will increase by the size of an account ID, and there will be
       * another trie item whose value is the size of an account ID plus 32 bytes.
       **/
      subAccountDeposit: AugmentedConst<BalanceOf>;
    };
    kton: {

      /**
       * The minimum amount required to keep an account open.
       **/
      existentialDeposit: AugmentedConst<Balance>;
    };
    society: {

      /**
       * The minimum amount of a deposit required for a bid to be made.
       **/
      candidateDeposit: AugmentedConst<BalanceOf>;
      /**
       * The number of blocks between membership challenges.
       **/
      challengePeriod: AugmentedConst<BlockNumber>;
      /**
       * The number of times a member may vote the wrong way (or not at all, when they are a skeptic)
       * before they become suspended.
       **/
      maxStrikes: AugmentedConst<u32>;
      /**
       * The societies's module id
       **/
      moduleId: AugmentedConst<ModuleId>;
      /**
       * The amount of incentive paid within each period. Doesn't include VoterTip.
       **/
      periodSpend: AugmentedConst<BalanceOf>;
      /**
       * The number of blocks between candidate/membership rotation periods.
       **/
      rotationPeriod: AugmentedConst<BlockNumber>;
      /**
       * The amount of the unpaid reward that gets deducted in the case that either a skeptic
       * doesn't vote or someone votes in the wrong way.
       **/
      wrongSideDeduction: AugmentedConst<BalanceOf>;
    };
    staking: {

      /**
       * Number of BlockNumbers that staked funds must remain bonded for.
       **/
      bondingDurationInBlockNumber: AugmentedConst<BlockNumber>;
      /**
       * Number of eras that staked funds must remain bonded for.
       **/
      bondingDurationInEra: AugmentedConst<EraIndex>;
      cap: AugmentedConst<RingBalance>;
      /**
       * Number of sessions per era.
       **/
      sessionsPerEra: AugmentedConst<SessionIndex>;
      totalPower: AugmentedConst<Power>;
    };
    system: {

      /**
       * The base weight of executing a block, independent of the transactions in the block.
       **/
      blockExecutionWeight: AugmentedConst<Weight>;
      /**
       * The weight of runtime database operations the runtime can invoke.
       **/
      dbWeight: AugmentedConst<RuntimeDbWeight>;
      /**
       * The base weight of an Extrinsic in the block, independent of the of extrinsic being executed.
       **/
      extrinsicBaseWeight: AugmentedConst<Weight>;
      /**
       * The maximum length of a block (in bytes).
       **/
      maximumBlockLength: AugmentedConst<u32>;
      /**
       * The maximum weight of a block.
       **/
      maximumBlockWeight: AugmentedConst<Weight>;
    };
    timestamp: {

      /**
       * The minimum period between blocks. Beware that this is different to the *expected* period
       * that the block production apparatus provides. Your chosen consensus system will generally
       * work with this to determine a sensible block time. e.g. For Aura, it will be double this
       * period on default settings.
       **/
      minimumPeriod: AugmentedConst<Moment>;
    };
    transactionPayment: {

      /**
       * The fee to be paid for making a transaction; the per-byte portion.
       **/
      transactionByteFee: AugmentedConst<BalanceOf>;
    };
    treasury: {

      /**
       * Percentage of spare funds (if any) that are burnt per spend period.
       **/
      burn: AugmentedConst<Permill>;
      /**
       * Minimum amount of *KTON* that should be placed in a deposit for making a proposal.
       **/
      ktonProposalBondMinimum: AugmentedConst<KtonBalance>;
      /**
       * The treasury's module id, used for deriving its sovereign account ID.
       **/
      moduleId: AugmentedConst<ModuleId>;
      /**
       * Fraction of a proposal's value that should be bonded in order to place the proposal.
       * An accepted proposal gets these back. A rejected proposal does not.
       **/
      proposalBond: AugmentedConst<Permill>;
      /**
       * Minimum amount of *RING* that should be placed in a deposit for making a proposal.
       **/
      ringProposalBondMinimum: AugmentedConst<RingBalance>;
      /**
       * Period between successive spends.
       **/
      spendPeriod: AugmentedConst<BlockNumber>;
      /**
       * The period for which a tip remains open after is has achieved threshold tippers.
       **/
      tipCountdown: AugmentedConst<BlockNumber>;
      /**
       * The amount of the final tip which goes to the original reporter of the tip.
       **/
      tipFindersFee: AugmentedConst<Percent>;
      /**
       * The amount held on deposit for placing a tip report.
       **/
      tipReportDepositBase: AugmentedConst<RingBalance>;
      /**
       * The amount held on deposit per byte within the tip report reason.
       **/
      tipReportDepositPerByte: AugmentedConst<RingBalance>;
    };
  }
}
