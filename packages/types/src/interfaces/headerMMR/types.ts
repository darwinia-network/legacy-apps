// Auto-generated via `yarn polkadot-types-from-defs`, do not edit
/* eslint-disable */

import type { Struct, Text, u64 } from '@polkadot/types';
import type { BlockNumber } from '@polkadot/types/interfaces/runtime';

/** @name BlockNumberFor */
export interface BlockNumberFor extends BlockNumber {}

/** @name MmrNodesPruningConfiguration */
export interface MmrNodesPruningConfiguration extends Struct {
  readonly step: NodeIndex;
  readonly progress: NodeIndex;
  readonly lastPosition: NodeIndex;
}

/** @name MMRProofResult */
export interface MMRProofResult extends Struct {
  readonly mmrSize: u64;
  readonly proof: Text;
}

/** @name NodeIndex */
export interface NodeIndex extends u64 {}

export type PHANTOM_HEADERMMR = 'headerMMR';
