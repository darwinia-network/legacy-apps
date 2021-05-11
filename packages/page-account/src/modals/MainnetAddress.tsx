// Copyright 2017-2020 @polkadot/app-accounts authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React, { useEffect, useCallback, useState } from 'react';
import styled from 'styled-components';
import CopyToClipboard from 'react-copy-to-clipboard';
import { InputAddress, Modal, Button } from '@polkadot/react-components';
import { encodeAddress } from '@polkadot/util-crypto';
import { Available } from '@polkadot/react-query';

import { useTranslation } from '../translate';

interface Props {
  className?: string;
  onClose: () => void;
  senderId?: string;
}

function MainnetAddress ({ className, onClose, senderId: propSenderId }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const [senderId, setSenderId] = useState<string | null>(propSenderId || null);
  const [darwiniaAddress, setDarwiniaAddress] = useState<string>('');
  const [didCopy, setDidCopy] = useState(false);

  useEffect(() => {
    if (didCopy) {
      setTimeout((): void => {
        setDidCopy(false);
      }, 1000);
    }
  }, [didCopy]);

  useEffect((): void => {
    if (senderId) {
      setDarwiniaAddress(encodeAddress(senderId, 18));
    }
  }, [senderId]);

  const onCopy = useCallback(() => {
    setDidCopy(true);
  }, []);

  const transferrable = <span className='label'>{t('transferrable')}</span>;

  return (
    <Modal
      className='app--accounts-Modal'
      header={t('Convert to Darwinia account')}
      onCancel={onClose}
    >
      <Modal.Content>
        <div className={className}>
          <InputAddress
            defaultValue={senderId}
            help={t('Address to be converted')}
            isInput={false}
            label={t('Address to be converted')}
            labelExtra={<Available label={transferrable}
              params={senderId}
              withCurrency />}
            onChange={setSenderId}
            type='account'
            value={senderId}
          />
          <div className='ui-MainnetAddress-address'>
            <p>{t('Darwinia Address')}：{darwiniaAddress}</p>
            <CopyToClipboard
              onCopy={onCopy}
              text={darwiniaAddress}
            >
              <Button
                isPrimary
                label={t(didCopy ? 'copied' : 'copy')}
              />
            </CopyToClipboard>
          </div>
        </div>
      </Modal.Content>
    </Modal>
  );
}

export default styled(MainnetAddress)`
  article.padded {
    box-shadow: none;
    margin-left: 2rem;
  }

  .ui-MainnetAddress-address {
    padding: 28px;
    justify-content: space-between;
    align-items: center;
    display: flex;
    p {
      margin-bottom: 0;

    }
  }

  label.with-help {
    flex-basis: 10rem;
  }
`;
