// Copyright 2017-2020 @polkadot/ui-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/react-components/types';

import React from 'react';
import { Dropdown, InputAddress, Modal, TxButton, TxComponent } from '@polkadot/react-components';
import { withMulti } from '@polkadot/react-api/hoc';

import translate from '../../translate';
import { rewardDestinationOptions } from '../constants';
import { DestinationType } from '../NewStake';

interface Props extends I18nProps {
  defaultDestination?: DestinationType;
  defaultDestAccount?: string | null;
  controllerId: string;
  onClose: () => void;
}

interface State {
  destination: DestinationType;
  destAccount: string | null;
  isAccount: boolean;
}

class SetRewardDestination extends TxComponent<Props, State> {
  constructor (props: Props) {
    super(props);

    this.state = {
      destination: props.defaultDestination || 'Staked',
      isAccount: false,
      destAccount: props.defaultDestAccount || ''
    };
  }

  public render (): React.ReactNode {
    const { controllerId, onClose, t } = this.props;
    const { destAccount, destination, isAccount } = this.state;
    const canSubmit = !!controllerId;

    return (
      <Modal
        className='staking--Bonding'
        header={t('Bonding Preferences')}
        onCancel={onClose}
        size='small'
      >
        {this.renderContent()}
        <Modal.Actions onCancel={onClose}>
          <TxButton
            accountId={controllerId}
            icon='sign-in'
            isDisabled={!canSubmit}
            isPrimary
            label={t('Set reward destination')}
            onStart={onClose}
            params={[
              isAccount
                ? { Account: destAccount }
                : destination
            ]}
            tx={'staking.setPayee'}
            withSpinner
          />
        </Modal.Actions>
      </Modal>
    );
  }

  private renderContent (): React.ReactNode {
    const { controllerId, defaultDestination, t } = this.props;
    const { destAccount, destination, isAccount } = this.state;

    return (
      <Modal.Content className='ui--signer-Signer-Content'>
        <InputAddress
          className='medium'
          defaultValue={controllerId}
          help={t('The controller is the account that is be used to control any nominating or validating actions. I will sign this transaction.')}
          isDisabled
          label={t('controller account')}
        />
        <Dropdown
          className='medium'
          defaultValue={defaultDestination}
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
      </Modal.Content>
    );
  }

  private onChangeDestination = (destination: DestinationType): void => {
    const isAccount = destination === 'Account';

    this.setState({ destination, isAccount });
  }

  private onChangeDestAccount = (destAccount: string | null): void => {
    this.setState({ destAccount });
  }
}

export default withMulti(
  SetRewardDestination,
  translate
);
