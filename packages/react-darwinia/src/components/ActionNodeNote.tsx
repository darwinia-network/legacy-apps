// Copyright 2017-2020 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import styled from 'styled-components';
import Box from './Box';
import { useTranslation } from '../translate';

interface Props {
  className?: string;
  children?: React.ReactNode;
  type: 'nominate' | 'validate';

}

const styles = `
  .ui--SorryNote {
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

function SorryNote ({ children, className, type }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  return (
    <div className={className}>
      <Box className={className}>
        {type === 'nominate' ? <div className='ui--SorryNote'>
          <h1>{t('Sorry！')}</h1>
          <p>{t('You are in the status of a nominators and cannot be a node for now.')}</p>
          <p>{t('We will develop the upgrade to be a node function in future.')}</p>
          {children}
        </div>
          : <div className='ui--SorryNote'>
            <h1>{t('Sorry！')}</h1>
            <p>{t('You are in the status of a nominators and cannot be a node for now.')}</p>
            <p>{t('We will develop the upgrade to be a node function in future.')}</p>
            {children}
          </div>}
      </Box>
    </div>
  );
}

export default styled(SorryNote)`${styles}`;
