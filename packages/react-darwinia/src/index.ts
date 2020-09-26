import axios from 'axios';
import { i18nT } from './types';
import DARWINIA_CRAB_TYPES from './types_crab.json';

const SUBSCAN_URL_CRAB = 'https://crab.subscan.io';
const SUBSCAN_URL_DARWINIA = 'https://darwinia-cc1.subscan.io';
const ETHERSCAN_URL = 'https://ropsten.etherscan.io';
const INIT_VERSION = 'version-2020-05-0101';
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

const crabInstance = axios.create({
  baseURL: SUBSCAN_URL_CRAB,
  timeout: 30000
});

const darwiniaInstance = axios.create({
  baseURL: SUBSCAN_URL_DARWINIA,
  timeout: 30000
});

export const instance = {
  'Darwinia Crab': crabInstance,
  'Darwinia CC1': darwiniaInstance,
  'Darwinia Devnet': darwiniaInstance
};

async function getBondList (instance, { address, locked = 0, page = 0, row = 10, status = 'bonded' }) {
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

function getStakingHistory (instance, { address, page = 0, row = 10 }, callback) {
  if (!instance) {
    return;
  }

  instance.post('/api/scan/staking_history', {
    page: page,
    row: 10,
    address: address
  }).then((response) => {
    callback && callback(response.data);
  })
    .catch(function (error) {
      // handle error
      console.log(error);
    })
    .finally(function () {
      // always executed
    });
}

const lockLimitOptionsMaker = (t: i18nT): Array<object> => {
  const month = [];

  for (let i = 0; i <= 36; i++) {
    month.push(i);
  }

  const options: object[] = [];

  month.map((i) => {
    options.push({
      text: i === 0 ? t('No fixed term') : `${i} ${t('Month')}`,
      value: i
    });
  });

  return options;
};

export {
  SUBSCAN_URL_CRAB,
  RING_PROPERTIES,
  KTON_PROPERTIES,
  setRingProperties,
  setKtonProperties,
  INIT_VERSION,
  ETHERSCAN_URL,
  getBondList,
  getStakingHistory,
  lockLimitOptionsMaker,
  DARWINIA_CRAB_TYPES
};
