import formatDecimal from './formatDecimal';

export default function formatFloat (_value?: string | null): string {
  if (!_value) {
    return '0';
  }

  const _f = _value.split('.')[0];
  const _l = _value.split('.')[1];

  const value = formatDecimal(_f) + '.' + (_l || '000').substr(0, 3);
  // const value = (_value as any).toBn
  //   ? (_value as Compact).toBn()
  //   : bnToBn(_value as BN);

  return value;
}
