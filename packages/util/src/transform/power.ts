
import { Balance } from '@polkadot/types/interfaces';
import Bignumber from 'bignumber.js';
import BN from 'bn.js';

const ZERO = new Bignumber(0);
export const POWER_CAP = 1000000000;

export default function assetToPower (ringAmount: BN | Balance, ktonAmount: BN | Balance, ringPool: BN | Balance, ktonPool: BN | Balance) {
  let power = ZERO;
  let _div = new Bignumber(0);

  if (!ringPool || (ringPool && ringPool.toString() === '0')) {
    return power;
  }

  //  (ring + (kton * (ringPool / KtonPool))) / (ringPool * 2) * 100000
  if (ktonPool && ktonPool.toString() !== '0') {
    _div = new Bignumber(ringPool.toString()).div(new Bignumber(ktonPool.toString()));
  }

  power = new Bignumber(new Bignumber(ringAmount.toString()).plus(new Bignumber(ktonAmount.toString()).times(_div)).div(new Bignumber(ringPool.toString()).times(2)).times(POWER_CAP).toFixed(0));

  return power;
}

export function bondedToPower (bondedAmount: Balance, ringPool: Balance) {
  let power = ZERO;

  if (!ringPool || (ringPool && ringPool.toString() === '0') || !bondedAmount || (bondedAmount && bondedAmount.toString() === '0')) {
    return power;
  }

  power = new Bignumber(new Bignumber(bondedAmount.toString()).div(new Bignumber(ringPool.toString()).times(2)).times(POWER_CAP).toFixed(0));

  return power;
}
