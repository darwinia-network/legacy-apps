// Copyright 2017-2020 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import styled from 'styled-components';
import Box from './Box';
import { useTranslation } from '../translate';
import { RING_PROPERTIES, KTON_PROPERTIES } from '../index';
import ColorButton from './ColorButton/Button';

interface Props {
  className?: string;
  type: 'nominate' | 'validate';
  onStart: () => void;
}

const styles = `
  .ui--ActionNote {
    padding: 40px 60px;
    h1{
      font-size: 26px;
      font-weight: bold;
      color: #302B3C;
      text-transform:none;
    }
    p{
      font-size: 14px;
      font-weight: bold;
      color: #302B3C;
      max-width: 512px;
    }
  }
`;

function ActionNote ({ className, type, onStart }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  return (
    <div className={className}>
      <Box className={className}>
        <div>
          <div className="ui--ActionNote">
            <h1>{t('Get Power')}</h1>
            <p>{t('note')}: </p>
            <p>
              {t('1. You need to stake some {{KTON}} or {{RING}} to get POWER. The higher the POWER, the greater the share of reward.', {
                replace: {
                  RING: RING_PROPERTIES.tokenSymbol,
                  KTON: KTON_PROPERTIES.tokenSymbol
                }
              })}<br />
              {t('2. Please make sure that you have some excess {{RING}} in this account as gas fee.', {
                replace: {
                  RING: RING_PROPERTIES.tokenSymbol
                }
              })}
              <br/>
            </p>
            <ColorButton
              key='detail'
              onClick={onStart}
            >{t('Staking now')}</ColorButton>
          </div>
        </div>
      </Box>
    </div>
  );
}

export default styled(ActionNote)`${styles}`;
