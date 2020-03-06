import axios from 'axios';

const SUBSCAN_URL = 'https://icefrog.subscan.io';
const ETHERSCAN_URL = 'https://ropsten.etherscan.io';
const INIT_VERSION = 'version-2019-12-30';
let KTON_PROPERTIES = { ss58Format: 42, tokenDecimals: 9, tokenSymbol: 'CKTON' };
let RING_PROPERTIES = { ss58Format: 42, tokenDecimals: 9, tokenSymbol: 'CRING' };

const setRingProperties = (properties) => {
  RING_PROPERTIES = {
    ...RING_PROPERTIES,
    ...properties
  };
};

const setKtonProperties = (properties) => {
  KTON_PROPERTIES = {
    ...KTON_PROPERTIES,
    ...properties
  };
};

const instance = axios.create({
  baseURL: SUBSCAN_URL,
  // baseURL: 'http://localhost:8000',
  timeout: 30000
});

export async function getBondList ({ page = 0, row = 10, status = 'bonded', locked = 0, address }) {
  if (status === 'map') {
    return await instance.post('/api/wallet/mapping_history', {
      row: row,
      page: page,
      address: address
    });
  }
  return await instance.post('/api/wallet/bond_list', {
    row: row,
    page: page,
    status: status,
    address: address,
    locked
  });
}

export {
  SUBSCAN_URL,
  RING_PROPERTIES,
  KTON_PROPERTIES,
  setRingProperties,
  setKtonProperties,
  INIT_VERSION,
  ETHERSCAN_URL
};
