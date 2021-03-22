/* eslint-disable @typescript-eslint/camelcase */
// Copyright 2017-2020 @polkadot/ui-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

// import { calcTxLength } from '@polkadot/react-signer/Checks';
import { SubmittableExtrinsic } from '@polkadot/api/promise/types';
import { withApi, withCalls, withMulti } from '@polkadot/react-api/hoc';
import { ApiProps } from '@polkadot/react-api/types';
import { TxButton } from '@polkadot/react-components';
import { Dropdown, InputAddress, InputBalance, Modal, TxComponent } from '@polkadot/react-components-darwinia';
import { I18nProps } from '@polkadot/react-components/types';
import { KTON_PROPERTIES, lockLimitOptionsMaker, RING_PROPERTIES } from '@polkadot/react-darwinia';
import { PowerTelemetry } from '@polkadot/react-darwinia/components';
import { currencyType, promiseMonth } from '@polkadot/react-darwinia/types';
import { Available, AvailableKton } from '@polkadot/react-query';
import { ZERO_BALANCE, ZERO_FEES } from '@polkadot/react-signer/Checks/constants';
import { Balance } from '@polkadot/types/interfaces/runtime';
import { bnMax, formatBalance, ringToKton } from '@polkadot/util';
import BN from 'bn.js';
import React from 'react';
import { Checkbox } from 'semantic-ui-react';
import styled from 'styled-components';
import translate from '../../translate';
import { CalculateBalanceProps } from '../../types';
import detectUnsafe from '../../unsafeChains';



interface Props extends I18nProps, ApiProps, CalculateBalanceProps {
  controllerId: string;
  isOpen: boolean;
  onClose: () => void;
  stashId: string;
  staking_ktonPool: Balance;
  staking_ringPool: Balance;
}

interface State {
  amountError: string | null;
  extrinsic: SubmittableExtrinsic | null;
  maxAdditional?: BN;
  maxBalance?: BN;
  currencyType: currencyType;
  promiseMonth: promiseMonth;
  accept: boolean;
}

const ZERO = new BN(0);

class BondExtra extends TxComponent<Props, State> {
  public state: State = {
    amountError: null,
    extrinsic: null,
    currencyType: 'ring',
    promiseMonth: 0,
    accept: false
  };

  public componentDidUpdate (prevProps: Props, prevState: State): void {
    const { balances_fees } = this.props;
    const { extrinsic } = this.state;

    const hasLengthChanged = ((extrinsic && extrinsic.encodedLength) || 0) !== ((prevState.extrinsic && prevState.extrinsic.encodedLength) || 0);

    if ((balances_fees !== prevProps.balances_fees) ||
      hasLengthChanged
    ) {
      // this.setMaxBalance();
    }
  }

  public render (): React.ReactNode {
    const { isOpen, onClose, stashId, t } = this.props;
    const { accept, currencyType, extrinsic, maxAdditional, promiseMonth } = this.state;
    const canSubmit = !!maxAdditional && maxAdditional.gtn(0) && (promiseMonth && currencyType === 'ring' ? accept : true);

    if (!isOpen) {
      return null;
    }

    return (
      <Modal
        className='staking--BondExtra'
        header={t('Bond more funds')}
        subheader={t('adds bonded tokens for staking to obtain more power.')}
        onCancel={onClose}
        size='small'
      >
        {this.renderContent()}
        <Modal.Actions onCancel={onClose}>
          <TxButton
            accountId={stashId}
            extrinsic={extrinsic}
            icon='sign-in'
            isDisabled={!canSubmit}
            isPrimary
            label={t('Bond more')}
            onStart={onClose}
            withSpinner
          />
        </Modal.Actions>
      </Modal>
    );
  }

  private renderContent (): React.ReactNode {
    const { stashId, systemChain, t } = this.props;
    const { accept, amountError, currencyType, maxAdditional, maxBalance, promiseMonth } = this.state;
    const isUnsafeChain = detectUnsafe(systemChain);

    return (
      <Modal.Content className='ui--signer-Signer-Content'>
        <InputAddress
          className='medium'
          defaultValue={stashId}
          isDisabled
          label={t('stash account')}
          labelExtra={
            <>
              <Available label={<span className='label'>{t('transferrable')}</span>}
                params={stashId}
                withCurrency/>
              <AvailableKton label={<span className='label'>{t(' ')}</span>}
                params={stashId}
                withCurrency/>
            </>
          }
        />
        <InputBalance
          autoFocus
          className='medium'
          help={t('Amount to add to the currently bonded funds. This is adjusted using the available funds on the account.')}
          isError={!!amountError}
          isSiShow={false}
          isType
          label={t('additional bonded funds')}
          // maxValue={maxBalance}
          onChange={this.onChangeValue}
          onChangeType={this.onChangeType}
          onEnter={this.sendTx}
          // withMax={!isUnsafeChain}
        />
        <WarnTipsWrapper>{t('Note: Please keep a little {{token}} as fee', { replace: { token: RING_PROPERTIES.tokenSymbol } })}</WarnTipsWrapper>
        {/* <ValidateAmount
          accountId={stashId}
          onError={this.setAmountError}
          value={maxAdditional}
        /> */}
        {currencyType === 'ring' ? (<>
          <Dropdown
            className='medium'
            defaultValue={promiseMonth}
            help={t('lock limit')}
            label={t('lock limit')}
            onChange={this.onChangePromiseMonth}
            options={lockLimitOptionsMaker(t)}
          />
          <TipsWrapper>{t('The funds status will become locked after freezing period set')}</TipsWrapper>
        </>) : null}
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
    );
  }

  private nextState (newState: Partial<State>): void {
    this.setState((prevState: State): State => {
      const { api } = this.props;
      const { amountError = prevState.amountError, maxAdditional = prevState.maxAdditional, maxBalance = prevState.maxBalance, currencyType = prevState.currencyType, promiseMonth = prevState.promiseMonth, accept = prevState.accept } = newState;
      const typeKey = currencyType + 'balance';
      const extrinsic: any = (maxAdditional && maxAdditional.gte(ZERO))
        ? api.tx.staking.bondExtra({ [typeKey]: maxAdditional }, promiseMonth)
        : null;

      return {
        amountError,
        extrinsic,
        maxAdditional,
        maxBalance,
        currencyType,
        promiseMonth,
        accept
      };
    });
  }

  private setMaxBalance = (): void => {
    const { api, balances_fees = ZERO_FEES, balances_all = ZERO_BALANCE } = this.props;
    const { currencyType, maxAdditional, promiseMonth } = this.state;

    const { transactionBaseFee, transactionByteFee } = balances_fees;
    const { accountNonce, freeBalance } = balances_all;

    let prevMax = new BN(0);
    let maxBalance = new BN(1);
    let extrinsic: any;
    const typeKey = currencyType + 'balance';

    while (!prevMax.eq(maxBalance)) {
      prevMax = maxBalance;
      extrinsic = (maxAdditional && maxAdditional.gte(ZERO))
        ? api.tx.staking.bondExtra({ [typeKey]: maxAdditional }, promiseMonth)
        : null;

      // const txLength = calcTxLength(extrinsic, accountNonce);
      // const fees = transactionBaseFee.add(transactionByteFee.mul(txLength));

      maxBalance = bnMax(freeBalance, ZERO);
    }

    this.nextState({
      extrinsic,
      maxAdditional,
      maxBalance
    });
  }

  private onChangeValue = (maxAdditional?: BN): void => {
    this.nextState({ maxAdditional });
  }

  private setAmountError = (amountError: string | null): void => {
    this.nextState({ amountError });
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
    const { currencyType, maxAdditional = ZERO, promiseMonth } = this.state;
    const parsedBondValue = maxAdditional;

    if (currencyType === 'ring' && promiseMonth !== 0) {
      return formatBalance(new BN(ringToKton(parsedBondValue.toString(), promiseMonth)), false);
    }

    return '0';
  };

  private getPowerAmount = (): React.ReactElement => {
    const { staking_ktonPool, staking_ringPool } = this.props;
    const { currencyType, maxAdditional = ZERO } = this.state;

    const ktonBonded = new BN(0);
    const ringBonded = new BN(0);

    return <PowerTelemetry
      ktonAmount={ktonBonded}
      ktonExtraAmount={currencyType === 'kton' ? maxAdditional : new BN(0)}
      ktonPool={staking_ktonPool}
      ringAmount={ringBonded}
      ringExtraAmount={currencyType === 'ring' ? maxAdditional : new BN(0)}
      ringPool={staking_ringPool}
    />;
  }
}

const TipsWrapper = styled.div`
  margin-left: 2rem;
  margin-top: 5px;
  margin-bottom: 10px;
  font-size: 12px;
`;

const WarnTipsWrapper = styled(TipsWrapper)`
  color: #9F3A38;
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
  BondExtra,
  translate,
  withApi,
  withCalls<Props>(
    'derive.balances.fees'
  )
);
