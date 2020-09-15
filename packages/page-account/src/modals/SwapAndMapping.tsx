// Copyright 2017-2020 @polkadot/app-accounts authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { SubmittableExtrinsic } from '@polkadot/api/promise/types';

import BN from 'bn.js';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { InputAddress, Modal, TxButton } from '@polkadot/react-components';
import { InputBalance } from '@polkadot/react-components-darwinia';
import { useApi } from '@polkadot/react-hooks';
import { Available } from '@polkadot/react-query';
// import Checks from '@polkadot/react-signer/Checks';

import { useTranslation } from '../translate';

interface Props {
  className?: string;
  onClose: () => void;
  recipientId?: string;
  senderId?: string;
}

const ZERO = new BN(0);

function Transfer ({ className, onClose, recipientId: propRecipientId, senderId: propSenderId }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const [amount, setAmount] = useState<BN | undefined>(new BN(0));
  const [extrinsic, setExtrinsic] = useState<SubmittableExtrinsic | null>(null);
  const [hasAvailable] = useState(true);
  const [maxBalance] = useState(new BN(0));
  const [senderId, setSenderId] = useState<string | null>(propSenderId || null);

  useEffect((): void => {
    if (senderId) {
      setExtrinsic(api.tx.crabIssuing.swapAndBurnToGenesis(amount || ZERO));
    }
  }, [amount, api.tx.crabIssuing, api.tx.crabIssuing.swapAndBurnToGenesis, senderId]);

  const transferrable = <span className='label'>{t('transferrable')}</span>;

  return (
    <Modal
      className='app--accounts-Modal'
      header={t('Darwainias Genesis Swap and Generating')}
      onCancel={onClose}
    >
      <Modal.Content>
        <div className={className}>
          <InputAddress
            defaultValue={propSenderId}
            help={t('The account you will send funds from.')}
            isDisabled={!!propSenderId}
            label={t('send from account')}
            labelExtra={<Available label={transferrable}
              params={senderId}
              withCurrency/>}
            onChange={setSenderId}
            type='account'
          />
          <InputBalance
            autoFocus
            currencyType={'ring'}
            help={t('Type the amount you want to swap and mapping.')}
            isError={!hasAvailable}
            isZeroable
            label={t('amount')}
            maxValue={maxBalance}
            onChange={setAmount}
            withMax
          />
        </div>
      </Modal.Content>
      <Modal.Actions onCancel={onClose}>
        <TxButton
          accountId={senderId}
          extrinsic={extrinsic}
          icon='send'
          isDisabled={!hasAvailable}
          isPrimary
          label={t('Make Genesis Swap')}
          onStart={onClose}
        />
      </Modal.Actions>
    </Modal>
  );
}

export default styled(Transfer)`
  article.padded {
    box-shadow: none;
    margin-left: 2rem;
  }

  .balance {
    margin-bottom: 0.5rem;
    text-align: right;
    padding-right: 1rem;

    .label {
      opacity: 0.7;
    }
  }

  label.with-help {
    flex-basis: 10rem;
  }
`;
