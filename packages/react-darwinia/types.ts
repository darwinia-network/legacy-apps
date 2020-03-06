import BN from 'bn.js';
import { Struct } from '@polkadot/types';

export interface DerivedRingBalances extends Struct {
  freeBalance: BN;
}
