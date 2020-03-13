// Copyright 2017-2020 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AccountId, AccountIndex, Address } from '@polkadot/types/interfaces';
import { BareProps } from './types';

import React from 'react';
import { AvailableKton } from '@polkadot/react-query';

import { classes } from './util';

export interface Props extends BareProps {
  label?: React.ReactNode;
  params?: AccountId | AccountIndex | Address | string | Uint8Array | null;
  withUnit?: boolean;
}

export default function AvailableDisplay ({ params, className, label, style, withUnit }: Props): React.ReactElement<Props> | null {
  if (!params) {
    return null;
  }

  return (
    <AvailableKton
      className={classes('ui--Available', className)}
      label={label}
      params={params}
      style={style}
      withUnit={withUnit}
    />
  );
}
