// Copyright 2017-2020 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import styled from 'styled-components';
import { tokenType } from './types';

import ringImg from './img/ring.svg';
import cringImg from './img/cring.png';
import pringImg from './img/pring.svg';

import ktonImg from './img/kton.svg';
import cktonImg from './img/ckton.png';
import pktonImg from './img/pkton.svg';

interface Props {
  className?: string;
  type: tokenType;
}

const styles = `
  .ui--Box {
    background: #fff;
    border-radius: 2px;
    border:1px solid #EDEDED;
  }
`;

const tokenMap = {
  ring: ringImg,
  cring: cringImg,
  pring: pringImg,
  kton: ktonImg,
  ckton: cktonImg,
  pkton: pktonImg
};

function TokenIcon ({ className, type }: Props): React.ReactElement<Props> {
  const source = tokenMap[type.toLocaleLowerCase()] || ringImg;

  return (
    <img className={className}
      src={source}/>
  );
}

export default styled(TokenIcon)`${styles}`;
