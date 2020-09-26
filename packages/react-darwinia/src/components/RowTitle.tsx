// Copyright 2017-2020 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import styled from 'styled-components';

interface Props {
  className?: string;
  children?: React.ReactNode;
  title: string;
  subTitle?: string;
}

const styles = `
.ui--RowTitle {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    text-transform: uppercase;
    margin-bottom: 10px;
    margin-top: 20px;
    .ui--RowTitle-main {
        font-weight: bold;
        margin-left: 10px;
        font-size: 16px;
        span {
          text-transform: initial;
          font-size: 13px;
          color: gray;
        }
    }
}

.ui--RowTitle::before {
    content: ' ';
    display: inline-block;
    background:linear-gradient(315deg,rgba(254,56,118,1) 0%,rgba(124,48,221,1) 71%,rgba(58,48,221,1) 100%);
    width: 3px;
    height: 18px;
}
`;

function RowTitle ({ children, className, subTitle, title }: Props): React.ReactElement<Props> {
  return (
    <div className={className}>
      <div className='ui--RowTitle'>
        <p className='ui--RowTitle-main'>{title}
          { subTitle ? <span> - {subTitle}</span> : null }
        </p>
        {children}
      </div>
    </div>
  );
}

export default styled(RowTitle)`${styles}`;
