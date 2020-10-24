/* eslint-disable @typescript-eslint/camelcase */
// Copyright 2017-2020 @polkadot/ui-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/react-components/types';
import { ApiProps } from '@polkadot/react-api/types';
import { CalculateBalanceProps } from '../types';
import { Balance } from '@polkadot/types/interfaces/runtime';

import BN from 'bn.js';
import React from 'react';
import { Checkbox } from 'semantic-ui-react';
import { SubmittableExtrinsic } from '@polkadot/api/promise/types';
import { Dropdown, InputAddress, Modal, TxButton, TxComponent } from '@polkadot/react-components';
import { InputBalanceBonded } from '@polkadot/react-components-darwinia';

import { withApi, withMulti } from '@polkadot/react-api/hoc';
import { currencyType, promiseMonth } from '@polkadot/react-darwinia/types';
import { lockLimitOptionsMaker, RING_PROPERTIES, KTON_PROPERTIES } from '@polkadot/react-darwinia';
import { PowerTelemetry } from '@polkadot/react-darwinia/components';
import styled from 'styled-components';
import { formatBalance, ringToKton } from '@polkadot/util';

import translate from '../translate';
import detectUnsafe from '../unsafeChains';
import InputValidateAmount from './Account/InputValidateAmount';
import { TFunction } from 'i18next';
// import InputValidationController from './Account/InputValidationController';
// import { rewardDestinationOptions } from './constants';

function rewardDestinationOptions (t: TFunction): any {
  return [
    { text: t('Stash account (increase the amount at stake)'), value: 'Staked' },
    { text: t('Stash account (do not increase the amount at stake)'), value: 'Stash' },
    { text: t('Controller account'), value: 'Controller' },
    { text: t('Account'), value: 'Account' }
  ];
}

export type DestinationType = 'Staked' | 'Stash' | 'Controller' | 'Account';

interface Props extends ApiProps, I18nProps, CalculateBalanceProps {
  onClose: () => void;
  accountId: string;
  staking_ktonPool: Balance;
  staking_ringPool: Balance;
}

interface State {
  amountError: string | null;
  bondValue?: BN;
  controllerError: string | null;
  controllerId: string | null;
  destAccount: string | null;
  destination: DestinationType;
  extrinsic: SubmittableExtrinsic | null;
  stashId: string | null;
  currencyType: currencyType;
  promiseMonth: promiseMonth;
  accept: boolean;
  isAccount: boolean;
}

const ZERO = new BN(0);

class NewStake extends TxComponent<Props, State> {
  public state: State;

  constructor (props: Props) {
    super(props);

    this.state = {
      amountError: null,
      controllerError: null,
      controllerId: null,
      destAccount: null,
      destination: 'Staked',
      extrinsic: null,
      stashId: null,
      currencyType: 'ring',
      promiseMonth: 0,
      accept: false,
      isAccount: false
    };
  }

  public render (): React.ReactNode {
    const { accountId, onClose, systemChain, t } = this.props;
    const { accept, amountError, bondValue, controllerError, controllerId, currencyType, destAccount, destination, extrinsic, isAccount, promiseMonth, stashId } = this.state;
    const hasValue = !!bondValue && bondValue.gtn(0);
    const isUnsafeChain = detectUnsafe(systemChain);
    const isDestAccount = !isAccount || ((isAccount) && destAccount);
    const canSubmit = isDestAccount && (hasValue && (isUnsafeChain || (!controllerError && !!controllerId))) && (promiseMonth && currencyType === 'ring' ? accept : true);

    return (
      <Modal
        className='staking--Bonding'
        header={t('Bonding Preferences')}
        onCancel={onClose}
        size='small'
      >
        <Modal.Content className='ui--signer-Signer-Content'>
          <InputAddress
            className='medium'
            defaultValue={accountId}
            isDisabled
            label={t('stash account')}
            onChange={this.onChangeStash}
            // value={stashId}
            type='account'
          />
          <InputAddress
            className='medium'
            help={t('The controller is the account that will be used to control any nominating or validating actions. Should not match another stash or controller.')}
            isError={!isUnsafeChain && !!controllerError}
            label={t('controller account')}
            onChange={this.onChangeController}
            type='account'
            value={controllerId}
          />
          {/* <InputValidationController
            accountId={stashId}
            controllerId={controllerId}
            isUnsafeChain={isUnsafeChain}
            onError={this.onControllerError}
          /> */}
          <InputBalanceBonded
            autoFocus
            className='medium'
            controllerId={controllerId}
            currencyType={currencyType}
            destination={destination}
            extrinsicProp={'staking.bond'}
            help={t('The total amount of the stash balance that will be at stake in any forthcoming rounds (should be less than the total amount available)')}
            isError={!hasValue || !!amountError}
            isSiShow={false}
            isType
            label={t('value bonded')}
            onChange={this.onChangeValue}
            onChangeType={this.onChangeType}
            onEnter={this.sendTx}
            stashId={stashId}
            withMax={!isUnsafeChain}
          />
          <WarnTipsWrapper>{t('Note: Please keep a little {{token}} as fee', { replace: { token: RING_PROPERTIES.tokenSymbol } })}</WarnTipsWrapper>

          <InputValidateAmount
            accountId={stashId}
            onError={this.onAmountError}
            value={bondValue}
          />
          <Dropdown
            className='medium'
            defaultValue={0}
            help={t('The destination account for any payments as either a nominator or validator')}
            label={t('payment destination')}
            onChange={this.onChangeDestination}
            options={rewardDestinationOptions(t)}
            value={destination}
          />
          {isAccount && <InputAddress
            className='medium'
            help={t('An account that is to receive the rewards.')}
            label={t('the payment account')}
            onChange={this.onChangeDestAccount}
            type='allPlus'
            value={destAccount}
          />}
          {currencyType === 'ring' ? <Dropdown
            className='medium'
            defaultValue={promiseMonth}
            help={t('lock limit')}
            label={t('lock limit')}
            onChange={this.onChangePromiseMonth}
            options={lockLimitOptionsMaker(t)}
          /> : null}
          {promiseMonth ? <KtonTipStyledWrapper>
            <div>
              <p>{t('After setting a lock limit, you will receive an additional {{KTON}} bonus; if you unlock it in advance within the lock limit, you will be charged a penalty of 3 times the {{KTON}} reward.', {
                replace: {
                  KTON: KTON_PROPERTIES.tokenSymbol
                }
              })}</p>
              <Checkbox checked={accept}
                label={t('I Accept')}
                onChange={this.toggleAccept} />
            </div>
          </KtonTipStyledWrapper> : null}

          <GetPowerStyledWrapper>
            <p>{t('You will get')}: <span>{this.getPowerAmount()} POWER</span></p>
            {promiseMonth ? <p><span>{this.getKtonAmount()} {KTON_PROPERTIES.tokenSymbol}</span></p> : null}
          </GetPowerStyledWrapper>
        </Modal.Content>
        <Modal.Actions onCancel={onClose}>
          <TxButton
            accountId={stashId}
            extrinsic={extrinsic}
            icon='sign-in'
            isDisabled={!canSubmit}
            isPrimary
            label={t('Bond')}
            onStart={onClose}
            withSpinner
          />
        </Modal.Actions>
      </Modal>
    );
  }

  private onChangeType = (currencyType?: currencyType): void => {
    this.nextState({ currencyType, promiseMonth: 0 });
  }

  private onChangePromiseMonth = (promiseMonth: promiseMonth): void => {
    this.nextState({ promiseMonth });
  }

  private toggleAccept = (): void => {
    const { accept } = this.state;

    this.nextState({ accept: !accept });
  }

  private getKtonAmount = (): string => {
    const { currencyType, bondValue = ZERO, promiseMonth } = this.state;
    const parsedBondValue = bondValue;

    if (currencyType === 'ring' && promiseMonth !== 0) {
      return formatBalance(new BN(ringToKton(parsedBondValue.toString(), promiseMonth)), false);
    }

    return '0';
  };

  private getPowerAmount = (): React.ReactElement => {
    const { staking_ktonPool, staking_ringPool } = this.props;
    const { currencyType, bondValue = ZERO } = this.state;

    const ktonBonded = new BN(0);
    const ringBonded = new BN(0);

    return <PowerTelemetry
      ktonAmount={ktonBonded}
      ktonExtraAmount={currencyType === 'kton' ? bondValue : new BN(0)}
      ktonPool={staking_ktonPool}
      ringAmount={ringBonded}
      ringExtraAmount={currencyType === 'ring' ? bondValue : new BN(0)}
      ringPool={staking_ringPool}
    />;
  }

  private nextState (newState: Partial<State>): void {
    this.setState((prevState: State): State => {
      const { api } = this.props;
      const { amountError = prevState.amountError, bondValue = prevState.bondValue, destAccount = prevState.destAccount, controllerError = prevState.controllerError, controllerId = prevState.controllerId, destination = prevState.destination, stashId = prevState.stashId, currencyType = prevState.currencyType, promiseMonth = prevState.promiseMonth, accept = prevState.accept, isAccount = prevState.isAccount } = newState;
      // const typeKey = currencyType.charAt(0).toUpperCase() + currencyType.slice(1) + 'Balance';
      const typeKey = currencyType + 'balance';
      const extrinsic = (bondValue && controllerId)
        ? api.tx.staking.bond(controllerId, { [typeKey]: bondValue }, isAccount ? { Account: destAccount } : destination, promiseMonth)
        : null;

      return {
        amountError,
        bondValue,
        controllerError,
        controllerId,
        destination,
        extrinsic,
        stashId,
        currencyType,
        promiseMonth,
        accept,
        isAccount,
        destAccount
      };
    });
  }

  private onAmountError = (amountError: string | null): void => {
    this.nextState({ amountError });
  }

  private onChangeController = (controllerId: string | null): void => {
    this.nextState({ controllerId });
  }

  private onChangeDestination = (destination: DestinationType): void => {
    const isAccount = destination === 'Account';

    this.nextState({ destination, isAccount });
  }

  private onChangeDestAccount = (destAccount: string | null): void => {
    this.nextState({ destAccount });
  }

  private onChangeStash = (stashId: string | null): void => {
    this.nextState({ stashId });
  }

  private onChangeValue = (bondValue?: BN): void => {
    this.nextState({ bondValue });
  }

  private onControllerError = (controllerError: string | null): void => {
    this.setState({ controllerError });
  }
}

const WarnTipsWrapper = styled.div`
  margin-left: 2rem;
  color: #9F3A38;
  margin-top: 5px;
  margin-bottom: 10px;
`;

const KtonTipStyledWrapper = styled.div`
  display: flex;
  margin-top: -4px;
  padding-left: 2rem;
  label{
    flex: 0 0 15rem;
  }
  &>div{
    width: 100%;
    border: 1px solid #DEDEDF;
    border-top-left-radius: 3px;
    border-top-right-radius: 3px;
    p{
      color: #98959F;
      font-size: 12px;
    }

    padding: 10px 20px;
    background: #FBFBFB;
  }
`;

const GetPowerStyledWrapper = styled.div`
  font-size: 0;
  margin-top: 20px;
  p{
    text-align: right;
    font-size: 16px;
    color: #302B3C;
    margin-bottom: 10px;
  }

  p:last-child{
    margin-top: 0;
    margin-bottom: 0;
  }

  span{
    color: #5930DD;
    font-weight: bold;
  }
`;

export default withMulti(
  NewStake,
  translate,
  withApi
);
