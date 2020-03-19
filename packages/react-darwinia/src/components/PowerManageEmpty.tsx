// Copyright 2017-2020 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import styled from 'styled-components';
import { Button } from '@polkadot/react-components';
import Box from './Box';
import { useTranslation } from '../translate';
import { RING_PROPERTIES, KTON_PROPERTIES } from '../index';
import RowTitle from './RowTitle';
import ActionNote from './ActionNote';

interface Props {
  className?: string;
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

function PowerManageEmpty({ className, onStart }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  return (
    <div className={className}>
      <RowTitle title={t('My Nomination')} />
      <Box>
        <Button.Group>
          <Button
            isPrimary
            key='new-stake'
            label={t('New stake')}
            icon='add'
            onClick={onStart}
          />
        </Button.Group>
      </Box>
      <RowTitle title={t('Power Manager')} />
      <RowTitle title={t('Start')} />
      <ActionNote onStart={onStart} type="nominate" />
    </div>
  );
}

export default styled(PowerManageEmpty)`${styles}`;
