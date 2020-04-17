// Copyright 2017-2020 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AccountId, Address } from '@polkadot/types/interfaces';
import { BareProps } from '@polkadot/react-api/types';

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useApi, useCall } from '@polkadot/react-hooks';

import { toShortAddress } from './util';

interface Props extends BareProps {
  children?: React.ReactNode;
  defaultValue?: string;
  label?: React.ReactNode;
  value?: string | AccountId | Address | null | Uint8Array;
}

function AccountAddress ({ children, className, defaultValue, label, style, value }: Props): React.ReactElement<Props> | null {
  const address = toShortAddress(value.toString());


  if (!value) {
    return null;
  }

  return (
    <div
      className={`ui--AccountIndex ${className}`}
      style={style}
    >
      {label || ''}<div className='account-index'>{address || defaultValue || '-'}</div>{children}
    </div>
  );
}

export default styled(AccountAddress)`
  .account-index {
    font-family: monospace;
    font-weight: normal !important;
    -webkit-filter: grayscale(100%);
    filter: grayscale(100%);
    opacity: 0.6;
  }
`;
