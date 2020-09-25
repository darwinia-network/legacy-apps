// Copyright 2017-2020 @polkadot/apps-routing authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Routes } from './types';

import appSettings from '@polkadot/ui-settings';

// When adding here, also ensure to add to Dummy.tsx

// import accounts from './accounts';
import account from './account';
import claims from './claims';
import contracts from './contracts';
import council from './council';
// import dashboard from './dashboard';
import democracy from './democracy';
import explorer from './explorer';
import extrinsics from './extrinsics';
import genericAsset from './generic-asset';
import i18n from './i18n';
import js from './js';
import parachains from './parachains';
import settings from './settings';
import society from './society';
import staking from './staking';
import stakingDarwinia from './staking-darwinia';
// import scan from './scan';
import storage from './storage';
import sudo from './sudo';
import techcomm from './techcomm';
import toolbox from './toolbox';
// import transfer from './transfer';
import treasury from './treasury';
// import vanity from './vanity';

export default function create (t: (key: string, text: string, options: { ns: string }) => string): Routes {
  return appSettings.uiMode === 'light'
    ? [
      account(t),
      stakingDarwinia(t),
      staking(t),
      democracy(t),
      council(t),
      treasury(t),
      techcomm(t),
      parachains(t),
      society(t),
      contracts(t),
      claims(t),
      // dashboard,
      // accounts(t),
      // transfer(t),
      // genericAsset(t),
      // vanity(t),
      // null,
      // staking(t),
      // explorer(t),
      // democracy(t),
      // council(t),
      // TODO Not sure about the inclusion of treasury, parachains & society here
      null,
      settings(t)
    ]
    : [
      // dashboard(t),
      // accounts(t),
      // scan(t),
      // transfer(t),
      // vanity(t),
      account(t),
      stakingDarwinia(t),
      staking(t),
      democracy(t),
      council(t),
      treasury(t),
      techcomm(t),
      parachains(t),
      society(t),
      contracts(t),
      claims(t),
      null,
      genericAsset(t),
      explorer(t),
      storage(t),
      extrinsics(t),
      sudo(t),
      null,
      settings(t),
      toolbox(t),
      js(t),
      // hidden
      i18n(t)
    ];
}
