// Copyright 2017-2020 @polkadot/app-toolbox authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React, { useCallback, useState } from 'react';
import { Input, Output } from '@polkadot/react-components';
import { isHex } from '@polkadot/util';
import { dvmAddressToAccountId } from '@polkadot/react-darwinia/util';
import { AccountId } from '@polkadot/types/interfaces';

import { useTranslation } from './translate';

interface State {
  data: string;
  accountId: AccountId | '';
  isHexData: boolean;
}

function DvmAddress (): React.ReactElement {
  const { t } = useTranslation();
  const [{ accountId, data, isHexData }, setState] = useState<State>({
    data: '',
    accountId: '',
    isHexData: false
  });

  const _onChangeData = useCallback(
    (data: string): void => {
      const isHexData = isHex(data);

      setState({
        data,
        accountId: dvmAddressToAccountId(
          isHexData
            ? data : null
        ),
        isHexData
      });
    },
    []
  );

  return (
    <div className='toolbox--Hash'>
      <div className='ui--row'>
        <Input
          autoFocus
          className='full'
          help={t('The input DVM account to Darwinia Network Accound Id.')}
          isError={!isHexData}
          label={t('dvm account (e.g. 0x267be1C...)')}
          onChange={_onChangeData}
          value={data}
        />
      </div>
      <div className='ui--row'>
        <Output
          className='full'
          help={t('Darwinia Network Account Id')}
          isHidden={accountId.length === 0}
          isMonospace
          label={t('the resulting Darwinia Network Account Id is')}
          value={!isHexData ? '' : accountId && accountId.toHuman()}
          withCopy
        />
      </div>
    </div>
  );
}

export default React.memo(DvmAddress);
