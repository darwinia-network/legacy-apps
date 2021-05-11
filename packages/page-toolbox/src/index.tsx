// Copyright 2017-2020 @polkadot/app-toolbox authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AppProps as Props } from '@polkadot/react-components/types';

import React, { useMemo } from 'react';
import { Route, Switch } from 'react-router';
import Tabs from '@polkadot/react-components/Tabs';
import { useAccounts } from '@polkadot/react-hooks';
import Vanity from '@polkadot/app-account/Vanity';

import DvmAddress from './DvmAddress';
import Hash from './Hash';
import Rpc from './Rpc';
import Sign from './Sign';
import Verify from './Verify';
import DvmWithdraw from './DvmWithdraw';
import { useTranslation } from './translate';

function ToolboxApp ({ basePath }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { hasAccounts } = useAccounts();
  const items = useMemo(() => [
    {
      isRoot: true,
      name: 'rpc',
      text: t('RPC calls')
    },
    {
      name: 'hash',
      text: t('Hash data')
    },
    {
      name: 'sign',
      text: t('Sign message')
    },
    {
      name: 'verify',
      text: t('Verify signature')
    },
    {
      name: 'vanity',
      text: t('Vanity')
    },
    {
      name: 'dvmaddress',
      text: t('DVM address')
    },
    {
      name: 'dvmwithdraw',
      text: t('DVM Withdraw')
    }
  ], [t]);

  return (
    <main className='toolbox--App'>
      <header>
        <Tabs
          basePath={basePath}
          hidden={
            hasAccounts
              ? []
              : ['sign', 'verify', 'dvmwithdraw']
          }
          items={items}
        />
      </header>
      <Switch>
        <Route path={`${basePath}/hash`}><Hash /></Route>
        <Route path={`${basePath}/sign`}><Sign /></Route>
        <Route path={`${basePath}/verify`}><Verify /></Route>
        <Route path={`${basePath}/vanity`}><Vanity /></Route>
        <Route path={`${basePath}/dvmaddress`}><DvmAddress /></Route>
        <Route path={`${basePath}/dvmwithdraw`}><DvmWithdraw /></Route>
        <Route><Rpc /></Route>
      </Switch>
    </main>
  );
}

export default React.memo(ToolboxApp);
