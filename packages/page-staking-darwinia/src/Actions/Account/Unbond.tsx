/* eslint-disable @typescript-eslint/camelcase */
// Copyright 2017-2020 @polkadot/ui-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AccountId } from '@polkadot/types/interfaces';
import { StakingLedgerT as StakingLedger } from '@darwinia/types';
import { I18nProps } from '@polkadot/react-components/types';
import { ApiProps } from '@polkadot/react-api/types';

import BN from 'bn.js';
import React from 'react';
import styled from 'styled-components';
import { Option } from '@polkadot/types';
import { AddressInfo, InputAddress, TxButton, TxComponent } from '@polkadot/react-components';
import { InputNumber, Modal } from '@polkadot/react-components-darwinia';

import { withCalls, withApi, withMulti } from '@polkadot/react-api/hoc';
import { currencyType } from '@polkadot/react-darwinia/types';

import translate from '../../translate';

interface Props extends I18nProps, ApiProps {
  controllerId?: AccountId | null;
  isOpen: boolean;
  onClose: () => void;
  stashId: string;
  staking_ledger?: Option<StakingLedger>;
}

interface State {
  maxBalance?: BN;
  maxUnbond?: BN;
  currencyType: currencyType;
}

const BalanceWrapper = styled.div`
  & > div {
    justify-content: flex-end;

    & .column {
      flex: 0;
    }
  }
`;

class Unbond extends TxComponent<Props, State> {
  public state: State = {
    currencyType: 'ring'
  };

  public componentDidUpdate (prevProps: Props): void {
    const { staking_ledger } = this.props;

    if (staking_ledger !== prevProps.staking_ledger) {
      this.setMaxBalance();
    }
  }

  private onChangeType = (currencyType?: currencyType): void => {
    this.nextState({ currencyType });
  }

  public render (): React.ReactNode {
    const { controllerId, isOpen, onClose, t } = this.props;
    const { currencyType, maxUnbond } = this.state;
    const canSubmit = !!maxUnbond && maxUnbond.gtn(0);
    const typeKey = currencyType + 'balance';

    if (!isOpen) {
      return null;
    }

    return (
      <Modal
        className='staking--Unbond'
        header={t('Unbond funds')}
        onCancel={onClose}
        size='small'
      >
        {this.renderContent()}
        <Modal.Actions onCancel={onClose}>
          <TxButton
            accountId={controllerId}
            icon='sign-out'
            isDisabled={!canSubmit}
            isPrimary
            label={t('Unbond')}
            onStart={onClose}
            params={[{ [typeKey]: maxUnbond }]}
            tx='staking.unbond'
            withSpinner
          />
        </Modal.Actions>
      </Modal>
    );
  }

  private renderContent (): React.ReactNode {
    const { controllerId, stashId, t } = this.props;
    const { maxBalance } = this.state;

    return (
      <Modal.Content className='ui--signer-Signer-Content'>
        <InputAddress
          className='medium'
          defaultValue={controllerId}
          isDisabled
          label={t('controller account')}
        />
        <BalanceWrapper>
          <AddressInfo
            accountId={stashId}
            withBalance={{
              bonded: true
            }}
          />
        </BalanceWrapper>
        <InputNumber
          autoFocus
          className='medium'
          help={t('The amount of funds to unbond, this is adjusted using the bonded funds on the stash account.')}
          isSiShow={false}
          isType
          label={t('unbond amount')}
          maxValue={maxBalance}
          onChange={this.onChangeValue}
          onChangeType={this.onChangeType}
          onEnter={this.sendTx}
          withMax
        />
      </Modal.Content>
    );
  }

  private nextState (newState: Partial<State>): void {
    this.setState((prevState: State): State => {
      const { maxUnbond = prevState.maxUnbond, maxBalance = prevState.maxBalance, currencyType = prevState.currencyType } = newState;

      return {
        maxUnbond,
        maxBalance,
        currencyType
      };
    });
  }

  private setMaxBalance = (): void => {
    const { staking_ledger } = this.props;
    const { currencyType } = this.state;

    if (!staking_ledger || staking_ledger.isNone) {
      return;
    }

    const { activeKton, activeRing } = staking_ledger.unwrap();

    this.nextState({
      maxBalance: currencyType === 'kton' ? activeKton.unwrap() : activeRing.unwrap()
    });
  }

  private onChangeValue = (maxUnbond?: BN): void => {
    this.nextState({ maxUnbond });
  }
}

export default withMulti(
  Unbond,
  translate,
  withApi,
  withCalls<Props>(
    ['query.staking.ledger', { paramName: 'controllerId' }]
  )
);
