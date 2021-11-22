// Copyright 2017-2020 @polkadot/react-query authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BareProps } from '@polkadot/react-api/types';
import { AccountId, AccountIndex, Address } from '@polkadot/types/interfaces';

import React from 'react';
import FormatBalance from './FormatBalance';
import { useDarwiniaAvailableBalances } from '@polkadot/react-query/helper';

interface Props extends BareProps {
  children?: React.ReactNode;
  label?: React.ReactNode;
  params?: AccountId | AccountIndex | Address | string | Uint8Array | null;
}

function BalanceDisplay ({ children, className, label, params }: Props): React.ReactElement<Props> {
  const [value] = useDarwiniaAvailableBalances(params as string);

  return (
    <FormatBalance
      className={className}
      label={label}
      value={value}
    >
      {children}
    </FormatBalance>
  );
}

export default React.memo(BalanceDisplay);
