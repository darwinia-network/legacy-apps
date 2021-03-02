// Copyright 2017-2020 @polkadot/app-toolbox authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Signer } from '@polkadot/api/types';
import { KeyringPair } from '@polkadot/keyring/types';

import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { web3FromSource } from '@polkadot/extension-dapp';
import { Button, InputAddress, Output, Static } from '@polkadot/react-components';
import { Input } from 'semantic-ui-react';
import { useToggle } from '@polkadot/react-hooks';
import keyring from '@polkadot/ui-keyring';
import { hexToU8a, isFunction, isHex, stringToHex, stringToU8a, u8aToHex } from '@polkadot/util';
import Web3Modal from 'web3modal';
import Web3 from 'web3';

import { useTranslation } from '../../translate';

interface Props {
  className?: string;
}

interface AccountState {
  isExternal: boolean;
  isHardware: boolean;
  isInjected: boolean;
}

export interface ProviderState {
  address: string;
  web3: null | Web3;
  provider: null | any;
  connected: boolean;
  chainId: number;
  networkId: number;
}

function initWeb3 (provider: any) {
  const web3: any = new Web3(provider);

  web3.eth.extend({
    methods: [
      {
        name: 'chainId',
        call: 'eth_chainId',
        outputFormatter: web3.utils.hexToNumber
      }
    ]
  });

  return web3;
}

export const INITIAL_WEB3JS_STATE = {
  address: '',
  web3: null,
  provider: null,
  connected: false,
  chainId: 1,
  networkId: 1
};

function Sign ({ className, onProviderChange }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const [currentPair, setCurrentPair] = useState<KeyringPair | null>(keyring.getPairs()[0] || null);
  const [{ data, isHexData }, setData] = useState<{ data: string; isHexData: boolean }>({ data: '', isHexData: false });
  const [{ isInjected }, setAccountState] = useState<AccountState>({
    isExternal: false,
    isHardware: false,
    isInjected: false
  });

  const [isLocked, setIsLocked] = useState(false);
  const [{ isUsable, signer }, setSigner] = useState<{ isUsable: boolean; signer: Signer | null }>({ isUsable: true, signer: null });
  const [signature, setSignature] = useState('');
  const [isUnlockVisible, toggleUnlock] = useToggle();

  const providerOptions = {
    // Example with injected providers
    injected: {
      package: null
    }
  };

  const [web3Modal, setWeb3Modal] = useState(new Web3Modal({
    cacheProvider: false,
    providerOptions: providerOptions
  }));

  const [{ address, chainId, connected, networkId, provider, web3 }, setProviderState] = useState<ProviderState>(INITIAL_WEB3JS_STATE);

  useEffect((): void => {
    const isExternal = currentPair?.meta.isExternal || false;
    const isHardware = currentPair?.meta.isHardware || false;
    const isInjected = currentPair?.meta.isInjected || false;
    const isUsable = !(isExternal || isHardware || isInjected);

    setAccountState({
      isExternal,
      isHardware,
      isInjected
    });
    setIsLocked(
      isInjected
        ? false
        : currentPair?.isLocked || false
    );
    setSignature('');
    setSigner({ isUsable, signer: null });

    // for injected, retrieve the signer
    if (currentPair && isInjected) {
      const { meta: { source } } = currentPair;

      web3FromSource(source)
        .catch((): null => null)
        .then((injected): void => setSigner({
          isUsable: isFunction(injected?.signer?.signRaw),
          signer: injected?.signer || null
        }));
    }
  }, [currentPair]);

  const _onChangeAccount = useCallback(
    (accountId: string | null) => setCurrentPair(keyring.getPair(accountId || '')),
    []
  );

  const _onChangeData = useCallback(
    (data: string) => setData({ data, isHexData: isHex(data) }),
    []
  );

  const _onSign = useCallback(
    (): void => {
      if (isLocked || !isUsable || !currentPair) {
        return;
      }

      if (signer?.signRaw) {
        setSignature('');

        signer
          .signRaw({
            address: currentPair.address,
            data: isHexData
              ? data
              : stringToHex(data),
            type: 'bytes'
          })
          .then(({ signature }): void => setSignature(signature));
      } else {
        setSignature(u8aToHex(
          currentPair.sign(
            isHexData
              ? hexToU8a(data)
              : stringToU8a(data)
          )
        ));
      }
    },
    [currentPair, data, isHexData, isLocked, isUsable, signer]
  );

  const _onUnlock = useCallback(
    (): void => {
      setIsLocked(false);
      toggleUnlock();
    },
    [toggleUnlock]
  );

  const _onConnect = useCallback(
    async (): Promise<void> => {
      const provider = await web3Modal.connect();
      const web3: any = initWeb3(provider);

      const accounts = await web3.eth.getAccounts();

      const address = accounts[0];

      const networkId = await web3.eth.net.getId();

      const chainId = await web3.eth.chainId();

      console.log('connected: ', {
        web3,
        address,
        provider,
        connected: true,
        networkId,
        chainId
      });

      setProviderState({
        web3,
        address,
        provider,
        connected: true,
        networkId,
        chainId
      });

      onProviderChange({
        web3,
        address,
        provider,
        connected: true,
        networkId,
        chainId
      });
    },
    [web3Modal, onProviderChange]
  );

  const _resetApp = useCallback(async (): Promise<void> => {
    if (web3 && web3.currentProvider && web3.currentProvider.close) {
      await web3.currentProvider.close();
    }

    web3Modal.clearCachedProvider();

    setProviderState({ ...INITIAL_WEB3JS_STATE });
    onProviderChange({ ...INITIAL_WEB3JS_STATE });
  },
  [web3, web3Modal, onProviderChange]
  );

  return (
    <div className={`toolbox--Sign ${className}`}>
      <div className='ui--row connect-web3js'>
        <p className='grow'>连接DVM插件钱包：{address}</p>
        {connected && address ? <Button.Group className='shrink'><Button
          onClick={_resetApp}>断开连接</Button></Button.Group>
          : <Button.Group className='shrink'><Button
            onClick={_onConnect}>连接</Button></Button.Group>
        }
      </div>
    </div>
  );
}

export default React.memo(styled(Sign)`
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

  .connect-web3js {
    padding-left: 2rem;
    align-items: center;
    p {
      margin: 0;
      margin-top: 0.75rem;
    }
  }
`);
