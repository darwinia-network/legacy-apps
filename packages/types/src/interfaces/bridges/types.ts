// Auto-generated via `yarn polkadot-types-from-defs`, do not edit
/* eslint-disable */

import type { Bytes, Compact, Enum, Option, Struct, U8aFixed, Vec, bool, u128, u32, u64 } from '@polkadot/types';
import type { ITuple } from '@polkadot/types/types';
import type { AuthorityId } from '@polkadot/types/interfaces/consensus';
import type { MultiSignature } from '@polkadot/types/interfaces/extrinsics';
import type { AuthorityList, SetId } from '@polkadot/types/interfaces/grandpa';
import type { AuthoritySignature } from '@polkadot/types/interfaces/imOnline';
import type { AccountId, Consensus, H256, H512, PreRuntime, Seal, SealV0, Weight } from '@polkadot/types/interfaces/runtime';

/** @name AccountSigner */
export interface AccountSigner extends MultiSigner {}

/** @name AncestryProof */
export interface AncestryProof extends ITuple<[]> {}

/** @name AuthoritySet */
export interface AuthoritySet extends Struct {
  readonly authorities: AuthorityList;
  readonly set_id: SetId;
}

/** @name BridgedBlockHash */
export interface BridgedBlockHash extends MillauBlockHash {}

/** @name BridgedBlockNumber */
export interface BridgedBlockNumber extends MillauBlockNumber {}

/** @name BridgedHeader */
export interface BridgedHeader extends MillauHeader {}

/** @name BridgedOpaqueCall */
export interface BridgedOpaqueCall extends Bytes {}

/** @name CallOrigin */
export interface CallOrigin extends Enum {
  readonly isSourceRoot: boolean;
  readonly asSourceRoot: ITuple<[]>;
  readonly isTargetAccount: boolean;
  readonly asTargetAccount: ITuple<[SourceAccountId, MultiSigner, MultiSignature]>;
  readonly isSourceAccount: boolean;
  readonly asSourceAccount: SourceAccountId;
}

/** @name ChainId */
export interface ChainId extends Id {}

/** @name Commit */
export interface Commit extends Struct {
  readonly target_hash: BridgedBlockHash;
  readonly target_number: BridgedBlockNumber;
  readonly precommits: Vec<SignedPrecommit>;
}

/** @name Fee */
export interface Fee extends MillauBalance {}

/** @name GrandpaJustification */
export interface GrandpaJustification extends Struct {
  readonly round: u64;
  readonly commit: Commit;
  readonly votes_ancestries: Vec<BridgedHeader>;
}

/** @name Id */
export interface Id extends U8aFixed {}

/** @name ImportedHeader */
export interface ImportedHeader extends Struct {
  readonly header: BridgedHeader;
  readonly requires_justification: bool;
  readonly is_finalized: bool;
  readonly signal_hash: Option<BridgedBlockHash>;
}

/** @name InboundLaneData */
export interface InboundLaneData extends Struct {
  readonly relayers: Vec<ITuple<[MessageNonce, MessageNonce, RelayerId]>>;
  readonly last_confirmed_nonce: MessageNonce;
}

/** @name InboundRelayer */
export interface InboundRelayer extends AccountId {}

/** @name LaneId */
export interface LaneId extends Id {}

/** @name MessageData */
export interface MessageData extends Struct {
  readonly payload: MessagePayload;
  readonly fee: Fee;
}

/** @name MessageFeeData */
export interface MessageFeeData extends Struct {
  readonly lane_id: LaneId;
  readonly payload: OutboundPayload;
}

/** @name MessageId */
export interface MessageId extends ITuple<[Id, u64]> {}

/** @name MessageKey */
export interface MessageKey extends Struct {
  readonly lane_id: LaneId;
  readonly nonce: MessageNonce;
}

/** @name MessageNonce */
export interface MessageNonce extends u64 {}

/** @name MessagePayload */
export interface MessagePayload extends Bytes {}

/** @name MessagesDeliveryProofOf */
export interface MessagesDeliveryProofOf extends Struct {
  readonly bridged_header_hash: BridgedBlockHash;
  readonly storage_proof: Vec<StorageProofItem>;
  readonly lane: LaneId;
}

/** @name MessagesProofOf */
export interface MessagesProofOf extends Struct {
  readonly bridged_header_hash: BridgedBlockHash;
  readonly storage_proof: Vec<StorageProofItem>;
  readonly lane: LaneId;
  readonly nonces_start: MessageNonce;
  readonly nonces_end: MessageNonce;
}

/** @name MillauBalance */
export interface MillauBalance extends u64 {}

/** @name MillauBlockHash */
export interface MillauBlockHash extends H512 {}

/** @name MillauBlockNumber */
export interface MillauBlockNumber extends u64 {}

/** @name MillauDigest */
export interface MillauDigest extends Struct {
  readonly logs: Vec<MillauDigestItem>;
}

/** @name MillauDigestItem */
export interface MillauDigestItem extends Enum {
  readonly isOther: boolean;
  readonly asOther: Bytes;
  readonly isAuthoritiesChange: boolean;
  readonly asAuthoritiesChange: Vec<AuthorityId>;
  readonly isChangesTrieRoot: boolean;
  readonly asChangesTrieRoot: MillauBlockHash;
  readonly isSealV0: boolean;
  readonly asSealV0: SealV0;
  readonly isConsensus: boolean;
  readonly asConsensus: Consensus;
  readonly isSeal: boolean;
  readonly asSeal: Seal;
  readonly isPreRuntime: boolean;
  readonly asPreRuntime: PreRuntime;
}

/** @name MillauHeader */
export interface MillauHeader extends Struct {
  readonly parent_Hash: MillauBlockHash;
  readonly number: Compact<MillauBlockNumber>;
  readonly state_root: MillauBlockHash;
  readonly extrinsics_root: MillauBlockHash;
  readonly digest: MillauDigest;
}

/** @name MultiSigner */
export interface MultiSigner extends Enum {
  readonly isEd25519: boolean;
  readonly asEd25519: H256;
  readonly isSr25519: boolean;
  readonly asSr25519: H256;
  readonly isEcdsa: boolean;
  readonly asEcdsa: U8aFixed;
}

/** @name OutboundLaneData */
export interface OutboundLaneData extends Struct {
  readonly latest_generated_nonce: MessageNonce;
  readonly latest_received_nonce: MessageNonce;
  readonly oldest_unpruned_nonce: MessageNonce;
}

/** @name OutboundMessageFee */
export interface OutboundMessageFee extends Fee {}

/** @name OutboundPayload */
export interface OutboundPayload extends Struct {
  readonly spec_version: SpecVersion;
  readonly weight: Weight;
  readonly origin: CallOrigin;
  readonly call: BridgedOpaqueCall;
}

/** @name Parameter */
export interface Parameter extends Enum {
  readonly isMillauToRialtoConversionRate: boolean;
  readonly asMillauToRialtoConversionRate: u128;
}

/** @name Precommit */
export interface Precommit extends Struct {
  readonly target_hash: BridgedBlockHash;
  readonly target_number: BridgedBlockNumber;
}

/** @name RelayerId */
export interface RelayerId extends AccountId {}

/** @name SignedPrecommit */
export interface SignedPrecommit extends Struct {
  readonly precommit: Precommit;
  readonly signature: AuthoritySignature;
  readonly id: AuthorityId;
}

/** @name SourceAccountId */
export interface SourceAccountId extends AccountId {}

/** @name SpecVersion */
export interface SpecVersion extends u32 {}

/** @name StorageProofItem */
export interface StorageProofItem extends Bytes {}

/** @name UnrewardedRelayersState */
export interface UnrewardedRelayersState extends Struct {
  readonly unrewarded_relayer_entries: MessageNonce;
  readonly messages_in_oldest_entry: MessageNonce;
  readonly total_messages: MessageNonce;
}

export type PHANTOM_BRIDGES = 'bridges';
