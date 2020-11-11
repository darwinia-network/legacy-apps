import { hexToU8a, stringToU8a } from '@polkadot/util';
import { AccountId } from '@polkadot/types/interfaces';
import registry from '@polkadot/react-api/typeRegistry';

function dvmAddressToAccountId (address: string | null | undefined): AccountId {
  if (!address) return registry.createType('AccountId', '');
  const data = new Uint8Array(32);

  data.set(stringToU8a('dvm:'));
  data.set(hexToU8a(address), 11);
  const checksum = data.reduce((pre: number, current: number): number => {
    return pre ^ current;
  });

  data.set(hexToU8a('0x' + checksum.toString(16)), 31);
  const accountId = registry.createType('AccountId', data);

  return accountId;
}

export {
  dvmAddressToAccountId
};
