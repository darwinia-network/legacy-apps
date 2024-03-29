import axios from 'axios';
import { i18nT } from './types';

const SUBSCAN_URL_CRAB = 'https://crab.webapi.subscan.io';
const SUBSCAN_URL_DARWINIA = 'https://darwinia.webapi.subscan.io';
const SUBSCAN_URL_PANGOLIN = 'https://pangolin.webapi.subscan.io';
const SUBSCAN_URL_PANGORO = 'https://pangoro.webapi.subscan.io';
const ETHERSCAN_URL = 'https://ropsten.etherscan.io';
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

const pangolinInstance = axios.create({
  baseURL: SUBSCAN_URL_PANGOLIN,
  timeout: 30000
});

const pangoroInstance = axios.create({
  baseURL: SUBSCAN_URL_PANGORO,
  timeout: 30000
});

export const instance = {
  'Darwinia Crab': crabInstance,
  'Darwinia CC1': darwiniaInstance,
  'Darwinia Devnet': darwiniaInstance,
  Darwinia: darwiniaInstance,
  Pangolin: pangolinInstance,
  Pangoro: pangoroInstance
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
      text: i === 0 ? t('No fixed term (Set a lock period will get additional {{KTON}} rewards)', {
        replace: {
          KTON: KTON_PROPERTIES.tokenSymbol
        }
      }) : `${i} ${t('Month')}`,
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
  ETHERSCAN_URL,
  getBondList,
  getStakingHistory,
  lockLimitOptionsMaker
};
