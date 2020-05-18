// Copyright 2017-2020 @polkadot/app-accounts authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AppProps as Props } from '@polkadot/react-components/types';
import { ComponentProps } from './types';

import React, { useEffect, useMemo, useState } from 'react';
import { useAccounts } from '@polkadot/react-hooks';

import Overview from './Overview';
import { useTranslation } from './translate';

export default function AccountsApp ({ basePath, onStatusChange }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { hasAccounts } = useAccounts();
  const [hidden, setHidden] = useState<string[]>(['vanity']);

  useEffect((): void => {
    setHidden(
      hasAccounts
        ? []
        : ['vanity']
    );
  }, [hasAccounts]);

  const _renderComponent = (Component: React.ComponentType<ComponentProps>): React.ReactNode => (
    <Component
      basePath={basePath}
      onStatusChange={onStatusChange}
    />
  );

  return (
    <main className='accounts--App'>
      {_renderComponent(Overview)}
    </main>
  );
}
