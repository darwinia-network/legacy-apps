// Copyright 2017-2020 @polkadot/app-toolbox authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import BN from 'bn.js';

import { Signer } from '@polkadot/api/types';
import { KeyringPair } from '@polkadot/keyring/types';

import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { web3FromSource } from '@polkadot/extension-dapp';
import { Button, Input, InputAddress, InputNumber, Output, Static } from '@polkadot/react-components';
import { useToggle } from '@polkadot/react-hooks';
import keyring from '@polkadot/ui-keyring';
import { hexToU8a, isFunction, isHex, stringToHex, stringToU8a, u8aToHex } from '@polkadot/util';
import { ProviderState, INITIAL_WEB3JS_STATE } from '@polkadot/react-darwinia/components/ConnectWeb3js';
import { ConnectWeb3js } from '@polkadot/react-darwinia/components';

import { useTranslation } from './translate';
import registry from '@polkadot/react-api/typeRegistry';

const ZERO = new BN(0);
const DVM_WITHDRAW_ADDRESS = '0x0000000000000000000000000000000000000015';

interface Props {
  className?: string;
}

function DvmWithdraw ({ className }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const [receivingAccountId, setReceivingAccountId] = useState<string | null>(null);
  const [{ data }, setData] = useState<{ data: string }>({ data: ZERO });

  const [isLocked, setIsLocked] = useState(false);
  const [{ isUsable, signer }, setSigner] = useState<{ isUsable: boolean; signer: Signer | null }>({ isUsable: true, signer: null });

  const [{ address, chainId, connected, networkId, provider, web3 }, setProviderState] = useState<ProviderState>(INITIAL_WEB3JS_STATE);

  const _onChangeAccount = useCallback(
    (accountId: string | null) => setReceivingAccountId(accountId),
    []
  );

  const _onChangeData = useCallback(
    (data: string) => setData({ data }),
    []
  );

  const _onProviderChange = useCallback(
    ({ address,
      chainId,
      connected,
      networkId,
      provider,
      web3 }): void => setProviderState({ web3,
      address,
      provider,
      connected,
      networkId,
      chainId }),
    []
  );

  const _onWithdraw = useCallback(
    async () => {
      const accountIdHex = registry.createType('AccountId', receivingAccountId).toHex();

      if (data && data?.toString() !== '0' && web3 && connected && accountIdHex !== '0x0000000000000000000000000000000000000000000000000000000000000000') {
        await web3.eth.sendTransaction(
          {
            from: address,
            to: DVM_WITHDRAW_ADDRESS,
            data: accountIdHex,
            value: web3.utils.toWei(data?.toString(), 'ether'),
            gas: 55000
          }
        );
      }
    },
    [web3, address, connected, receivingAccountId, data]
  );

  return (
    <div className={`toolbox--Sign ${className}`}>
      <ConnectWeb3js onProviderChange={_onProviderChange}/>
      <div className='ui--row'>
        <InputAddress
          className='full'
          help={t('select or enter an account address to receive transfers')}
          isInput
          label={t('receiving account')}
          onChange={_onChangeAccount}
          // type='account'
          type='all'
        />
      </div>
      <div className='ui--row'>
        <Input
          className='full'
          label={t('withdraw amount')}
          onChange={_onChangeData}
          type='number'
          value={data}
        />
      </div>
      <Button.Group>
        <Button
          icon='privacy'
          isDisabled={!(isUsable && !isLocked)}
          label={t('Withdraw')}
          onClick={_onWithdraw}
        />
      </Button.Group>
    </div>
  );
}

export default React.memo(styled(DvmWithdraw)`
  .toolbox--Sign-input {
    position: relative;
    width: 100%;
    height: 100%;

    .unlock-overlay {
      position: absolute;
      width: 100%;
      height: 100%;
      top:0;
      left:0;
      background-color: #0f0e0e7a;
    }

    .unlock-overlay-warning {
      display: flex;
      align-items: center;
      justify-content: center;
      height:100%;
    }

    .unlock-overlay-content {
      color:#fff;
      padding: 0 2.5rem;
      text-align:center;

      .ui--Button-Group {
        text-align: center;
      }
    }
  }
`);
