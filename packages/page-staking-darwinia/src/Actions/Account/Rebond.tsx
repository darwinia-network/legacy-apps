/* eslint-disable @typescript-eslint/camelcase */
// Copyright 2017-2020 @polkadot/ui-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

// import { calcTxLength } from '@polkadot/react-signer/Checks';
import { SubmittableExtrinsic } from '@polkadot/api/promise/types';
import { withApi, withMulti } from '@polkadot/react-api/hoc';
import { ApiProps } from '@polkadot/react-api/types';
import { TxButton } from '@polkadot/react-components';
import { InputAddress, InputBalance, Modal, TxComponent } from '@polkadot/react-components-darwinia';
import { I18nProps } from '@polkadot/react-components/types';
import { currencyType } from '@polkadot/react-darwinia/types';
import { Available, AvailableKton } from '@polkadot/react-query';
import { Balance } from '@polkadot/types/interfaces/runtime';
import BN from 'bn.js';
import React from 'react';
import translate from '../../translate';
import { CalculateBalanceProps } from '../../types';



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
}

const ZERO = new BN(0);

class BondExtra extends TxComponent<Props, State> {
  public state: State = {
    amountError: null,
    extrinsic: null,
    currencyType: 'ring'
  };

  public render (): React.ReactNode {
    const { isOpen, onClose, stashId, t } = this.props;
    const { currencyType, extrinsic, maxAdditional } = this.state;
    const canSubmit = !!maxAdditional && maxAdditional.gtn(0);

    if (!isOpen) {
      return null;
    }

    return (
      <Modal
        className='staking--BondExtra'
        header={t('Rebond funds')}
        subheader={t('rebond the unbonding funds')}
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
            label={t('Rebond funds')}
            onStart={onClose}
            withSpinner
          />
        </Modal.Actions>
      </Modal>
    );
  }

  private renderContent (): React.ReactNode {
    const { stashId, t } = this.props;
    const { amountError } = this.state;

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
          isError={!!amountError}
          isSiShow={false}
          isType
          label={t('Amount')}
          onChange={this.onChangeValue}
          onChangeType={this.onChangeType}
          onEnter={this.sendTx}
        />
      </Modal.Content>
    );
  }

  private nextState (newState: Partial<State>): void {
    this.setState((prevState: State): State => {
      const { api } = this.props;
      const { amountError = prevState.amountError, maxAdditional = prevState.maxAdditional, maxBalance = prevState.maxBalance, currencyType = prevState.currencyType } = newState;
      const params: [BN | number, BN | number] = currencyType === 'ring' ? [maxAdditional || 0, ZERO] : [ZERO, maxAdditional || 0];
      const extrinsic: any = (maxAdditional && maxAdditional.gte(ZERO))
        ? api.tx.staking.rebond(...params)
        : null;

      return {
        amountError,
        extrinsic,
        maxAdditional,
        maxBalance,
        currencyType
      };
    });
  }

  private onChangeValue = (maxAdditional?: BN): void => {
    this.nextState({ maxAdditional });
  }

  private onChangeType = (currencyType?: currencyType): void => {
    this.nextState({ currencyType });
  }
}

export default withMulti(
  BondExtra,
  translate,
  withApi
);
