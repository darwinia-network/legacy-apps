/* eslint-disable @typescript-eslint/camelcase */
// Copyright 2017-2020 @polkadot/app-123code authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Balance, EcdsaSignature, EthereumAddress } from '@polkadot/types/interfaces';

import React, { useState, useCallback, useEffect } from 'react';
import styled from 'styled-components';
import CopyToClipboard from 'react-copy-to-clipboard';
import { useApi } from '@polkadot/react-hooks';
import { Button, Card, Columar, Column, InputAddress, Tooltip, TxButton } from '@polkadot/react-components';
import { TokenUnit } from '@polkadot/react-components-darwinia/InputNumber';
import { u8aToHex, u8aToString } from '@polkadot/util';
import { decodeAddress } from '@polkadot/util-crypto';
import AccountStatus from '@polkadot/app-account/AccountStatus';
import { useAccounts, useAccountChecked, useOwnEraRewards } from '@polkadot/react-hooks-darwinia';

import { ChainType } from './types';
import ClaimDisplay from './Claim';
import { recoverFromJSON } from './util';

import { useTranslation } from './translate';

enum Step {
  Account = 0,
  Sign = 1,
  Claim = 2,
}

const STORE_CHECKED = 'accounts:checked';

const Error = styled.p`
  color: #9f3a38;
`;

const Payload = styled.pre`
  cursor: copy;
  font-family: monospace;
  border: 1px dashed #c2c2c2;
  background: #fafafa;
  padding: 1rem;
  width: 100%;
  margin: 1rem 0;
  white-space: normal;
  word-break: break-all;
`;

const Signature = styled.textarea`
  font-family: monospace;
  padding: 1rem;
  border: 1px solid rgba(34, 36, 38, 0.15);
  border-radius: 0.25rem;
  margin: 1rem 0;
  resize: none;
  width: 100%;

  &::placeholder {
    color: rgba(0, 0, 0, 0.5);
  }

  &:-ms-input-placeholder {
    color: rgba(0, 0, 0, 0.5);
  }

  &::-ms-input-placeholder {
    color: rgba(0, 0, 0, 0.5);
  }
`;

function ClaimsApp (): React.ReactElement {
  const [didCopy, setDidCopy] = useState(false);
  const [ethereumAddress, setEthereumAddress] = useState<string | undefined | null>(null);
  const [signature, setSignature] = useState<EcdsaSignature | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [chain, setChain] = useState<ChainType | null>(null);
  const [step, setStep] = useState<Step>(Step.Sign);
  const [accountId, setAccountId] = useState<string | null>(null);
  const [accountChecked, toggleAccountChecked] = useAccountChecked(STORE_CHECKED);
  const { api, systemChain } = useApi();
  const { t } = useTranslation();

  useEffect(() => {
    if (didCopy) {
      setTimeout((): void => {
        setDidCopy(false);
      }, 1000);
    }
  }, [didCopy]);

  useEffect(() => {
    setAccountId(accountChecked[0]);
  }, [accountChecked]);

  const isDisabled = !accountId || !signature;

  const isUnsigned = (): boolean => true;

  const goToStepAccount = useCallback(() => {
    setStep(Step.Account);
  }, []);

  const goToStepSign = useCallback(() => {
    setStep(Step.Sign);
  }, []);

  const goToStepClaim = useCallback(() => {
    setStep(Step.Claim);
  }, []);

  const onChangeSignature = useCallback((event: React.SyntheticEvent<Element>) => {
    const { value: signatureJson } = event.target as HTMLInputElement;

    const { chain, ethereumAddress, msg, signature } = recoverFromJSON(signatureJson);

    setEthereumAddress(ethereumAddress?.toString());
    setSignature(signature);
    setMsg(msg);
    setChain(chain);
    setStep(Step.Sign);
  }, []);

  const onCopy = useCallback(() => {
    setDidCopy(true);
  }, []);

  const payload = accountId
    ? (
      u8aToString(api.consts.claims?.prefix.toU8a(true)) +
      u8aToHex(decodeAddress(accountId), -1, false)
    )
    : '';
  const msgCheck = (msg === payload);

  const onStatusChange = () => {};

  const _accountChecked = accountChecked[0];

  return (
    <main>
      <AccountStatus
        accountChecked={_accountChecked}
        onStatusChange={onStatusChange}
        onToggleAccountChecked={toggleAccountChecked}
      />
      <header />
      <h1>
        {t('Claim your {{token}} tokens', {
          replace: {
            token: TokenUnit.abbr
          }
        })}
      </h1>
      <Columar>
        <Column>
          {(step >= Step.Sign && !!accountId) && (
            <Card>
              <h3>{t('Sign ETH/TRON transaction')}</h3>
              <CopyToClipboard
                onCopy={onCopy}
                text={payload}
              >
                <Payload
                  data-for='tx-payload'
                  data-tip
                >
                  {payload}
                </Payload>
              </CopyToClipboard>
              <Tooltip
                place='right'
                text={didCopy ? t('copied') : t('click to copy')}
                trigger='tx-payload'
              />
              <div>
                {t('Method 1: Copy the above string and sign an Ethereum/Tron transaction with the account that got airdrop in the wallet of your choice, using the string as the payload, and copy the transaction signature.')}
                <br />
                {t('Method 2: Use the [')}<a href='https://claim.darwinia.network'
                  rel='noopener noreferrer'
                  style={{ textDecoration: 'underline' }}
                  target='_blank'>{t('cRING Claim Tool')}</a>{t('] generate and copy the transaction signature.')}
                <br />
                <br />
                <p>
                  {t('Please paste the transaction signature object below')} :</p>
              </div>
              <Signature
                onChange={onChangeSignature}
                placeholder='{\n  "address": "0x ...",\n  "msg": "Pay RINGs to the Crab account: ...",\n  "sig": "0x ...",\n  "version": "2"\n}'
                rows={10}
              />
              {!msgCheck && signature ? <Error>{t('The current account is different from the receiving account in the signature. Please check and try again.')}</Error> : null}
              {(step === Step.Sign) && (
                <Button.Group>
                  <Button
                    icon='sign-in'
                    isDisabled={!accountId || !signature || !msgCheck}
                    isPrimary
                    label={t('Confirm claim')}
                    onClick={goToStepClaim}
                  />
                </Button.Group>
              )}
            </Card>
          )}
        </Column>
        <Column showEmptyText={false}>
          {(step >= Step.Claim) && (
            <ClaimDisplay
              button={<TxButton
                icon='send'
                isDisabled={!accountId || !signature || !msgCheck}
                isPrimary
                isUnsigned
                label={t('Claim')}
                onSuccess={() => goToStepSign()}
                params={[
                  accountId ? accountId.toString() : null,
                  { [chain]: signature } || null
                ]}
                tx='claims.claim'
              />}
              chain={chain}
              ethereumAddress={ethereumAddress}
            />
          )}
        </Column>
      </Columar>
    </main>
  );
}

export default React.memo(ClaimsApp);
