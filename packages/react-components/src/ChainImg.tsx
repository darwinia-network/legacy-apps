// Copyright 2017-2020 @polkadot/apps authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React, { useMemo } from 'react';
import styled from 'styled-components';
import { chainLogos, emptyLogo, namedLogos, nodeLogos } from '@polkadot/apps-config/ui/logos';
import { useApi } from '@polkadot/react-hooks';
import { getSystemChainLogoBgColor } from '@polkadot/apps-config/ui';

interface Props {
  className?: string;
  logo?: keyof typeof namedLogos;
  onClick?: () => any;
}

function sanitize (value?: string): string {
  return value?.toLowerCase().replace('-', ' ') || '';
}

function ChainImg ({ className, logo, onClick }: Props): React.ReactElement<Props> {
  const { systemChain, systemName } = useApi();
  const img = useMemo((): any => {
    return namedLogos[logo || ''] || chainLogos[sanitize(systemChain)] || nodeLogos[sanitize(systemName)] || emptyLogo;
  }, [logo, systemChain, systemName]);

  const uiLogoBgColor = useMemo(
    (): string | undefined => getSystemChainLogoBgColor(systemChain, logo),
    [systemChain, logo]
  );

  return (
    <div className={className}
      style={{ background: uiLogoBgColor }}
    >
      <img
        alt='chain logo'
        onClick={onClick}
        src={img}
      />
    </div>
  );
}

export default React.memo(styled(ChainImg)`
  border-radius: 50%;
  box-sizing: border-box;
  img{
    width: 100%;
    border-radius: 50%;
  }
`);
