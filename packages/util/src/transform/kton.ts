import BigNumber from 'bignumber.js';

export default function ringToKton (value: any, month: number): string {
  return new BigNumber(value).times(new BigNumber(67 / 66).pow(month).minus(1)).div(new BigNumber(1970)).integerValue().toString();
}
