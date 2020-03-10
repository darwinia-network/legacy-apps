/* eslint-disable @typescript-eslint/camelcase */
// Copyright 2017-2019 @polkadot/ui-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ApiProps } from '@polkadot/react-api/types';
import { I18nProps } from '@polkadot/react-components/types';
import BN from 'bn.js';
import React from 'react';
import { withCalls, withApi, withMulti } from '@polkadot/react-api/hoc';
import { assetToPower } from '@polkadot/util';
import { Balance } from '@polkadot/types/interfaces';

type Props = I18nProps & ApiProps & {
  accountId: string;
  controllerId?: string | null;
  staking_ktonPool: Balance;
  staking_ringPool: Balance;
  ringAmount?: BN;
  ktonAmount?: BN;
  ringExtraAmount?: BN;
  ktonExtraAmount?: BN;
};

type State = {
};

const ZERO = new BN(0);

class PowerTelemetry extends React.PureComponent<Props, State> {
  state: State;

  constructor (props: Props) {
    super(props);
    this.state = {

    };
  }

  render (): React.ReactElement {
    const { staking_ktonPool = ZERO, staking_ringPool = ZERO, ringAmount = ZERO, ringExtraAmount = ZERO, ktonAmount = ZERO, ktonExtraAmount = ZERO } = this.props;
    const power = assetToPower(ringAmount, ktonAmount, staking_ringPool, staking_ktonPool);
    const powerTelemetry = assetToPower(ringAmount.add(ringExtraAmount), ktonAmount.add(ktonExtraAmount), staking_ringPool.add(ringExtraAmount), staking_ktonPool.add(ktonExtraAmount));
    const subPower = powerTelemetry.minus(power).toFixed(0);
    return (
      <>
        {subPower.toString()}
      </>
    );
  }
}

export default withMulti(
  PowerTelemetry,
  withApi,
  withCalls<Props>(
    'query.staking.ktonPool',
    'query.staking.ringPool'
  )
);
