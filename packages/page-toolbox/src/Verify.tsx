// Copyright 2017-2020 @polkadot/app-toolbox authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { KeypairType } from '@polkadot/util-crypto/types';

import React, { useCallback, useEffect, useState } from 'react';
import { Dropdown, Icon, Input, InputAddress, Static } from '@polkadot/react-components';
import keyring from '@polkadot/ui-keyring';
import uiSettings from '@polkadot/ui-settings';
import { isHex } from '@polkadot/util';
import { signatureVerify } from '@polkadot/util-crypto';
import styled from 'styled-components';

import { useTranslation } from './translate';

type CryptoTypes = KeypairType | 'unknown';

const AlignedIcon = styled(Icon)`
  &&&::before {
    position: relative;
    left: 0.88rem;
    top: 1rem;
    width: 32px;
    height: 32px;
    font-size: 32px;
    background: white !important;
    border-radius: 50%;
  }

  &&&.big.icon {
    font-size: 32px;
  }
`;

function Verify (): React.ReactElement<{}> {
  const { t } = useTranslation();
  const [{ cryptoType, isValid }, setValidity] = useState<{ cryptoType: CryptoTypes; isValid: boolean }>({ cryptoType: 'unknown', isValid: false });
  const [{ data, isHexData }, setData] = useState<{ data: string; isHexData: boolean }>({ data: '', isHexData: false });
  const [{ isValidPk, publicKey }, setPublicKey] = useState<{ isValidPk: boolean; publicKey: Uint8Array | null }>({ isValidPk: false, publicKey: null });
  const [{ isValidSignature, signature }, setSignature] = useState<{ isValidSignature: boolean; signature: string }>({ isValidSignature: false, signature: '' });
  const [cryptoOptions] = useState([{ text: t('Crypto not detected'), value: 'unknown' }].concat(uiSettings.availableCryptos as any[]));

  useEffect((): void => {
    let cryptoType: CryptoTypes = 'unknown';
    let isValid = isValidPk && isValidSignature;

    // We use signatureVerify to detect validity and crypto type
    if (isValid && publicKey) {
      const verification = signatureVerify(data, signature, publicKey);

      if (verification.crypto !== 'none') {
        cryptoType = verification.crypto;
        isValid = verification.isValid;
      } else {
        isValid = false;
      }
    }

    setValidity({ cryptoType, isValid });
  }, [data, isValidPk, isValidSignature, publicKey, signature]);

  const _onChangeAddress = useCallback(
    (accountId: string | null): void => {
      let publicKey: Uint8Array | null = null;

      try {
        publicKey = keyring.decodeAddress(accountId || '');
      } catch (err) {
        console.error(err);
      }

      setPublicKey({ isValidPk: !!publicKey && publicKey.length === 32, publicKey });
    },
    []
  );

  const _onChangeData = useCallback(
    (data: string) => setData({ data, isHexData: isHex(data) }),
    []
  );

  const _onChangeSignature = useCallback(
    (signature: string) => setSignature({ isValidSignature: isHex(signature) && signature.length === 130, signature }),
    []
  );

  return (
    <div className='toolbox--Verify'>
      <div className='ui--row'>
        <InputAddress
          className='full'
          help={t('The account that signed the input')}
          isError={!isValidPk}
          isInput
          label={t('verify using address')}
          onChange={_onChangeAddress}
        />
      </div>
      <div className='ui--row'>
        <Input
          autoFocus
          className='full'
          help={t('The data that was signed. This is used in combination with the signature for the verification. It can either be hex or a string.')}
          label={t('using the following data')}
          onChange={_onChangeData}
          value={data}
        />
      </div>
      <div className='ui--row'>
        <div
          className='ui--AlignedIconContainer'
          style={{ position: 'absolute', zIndex: 1 }}
        >
          <AlignedIcon
            color={isValid ? 'green' : (isValidSignature ? 'red' : undefined)}
            name={isValid ? 'check circle' : (isValidSignature ? 'exclamation circle' : 'help circle')}
            size='big'
          />
        </div>
        <Input
          className='full'
          help={t('The signature as by the account being checked, supplied as a hex-formatted string.')}
          isError={!isValidSignature}
          label={t('the supplied signature')}
          onChange={_onChangeSignature}
          value={signature}
        />
      </div>
      <div className='ui--row'>
        <Dropdown
          defaultValue={cryptoType}
          help={t('Cryptography used to create this signature. It is auto-detected on valid signatures.')}
          isDisabled
          label={t('signature crypto type')}
          options={cryptoOptions}
        />
        <Static
          className='medium'
          help={t('Detection on the input string to determine if it is hex or non-hex.')}
          label={t('hex input data')}
          value={
            isHexData
              ? t('Yes')
              : t('No')
          }
        />
      </div>
    </div>
  );
}

export default React.memo(Verify);
