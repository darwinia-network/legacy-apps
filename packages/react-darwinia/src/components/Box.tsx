// Copyright 2017-2020 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import styled from 'styled-components';

interface Props {
  className?: string;
  children?: React.ReactNode;
}

const styles = `
  .ui--Box {
    background: #fff;
    border-radius: 2px;
    border:1px solid #EDEDED;
  }
`;

function Box ({ className, children }: Props): React.ReactElement<Props> {
  return (
    <div className={className}>
      <div className="ui--Box">
        {children}
      </div>
    </div>
  );
}

export default styled(Box)`${styles}`;
