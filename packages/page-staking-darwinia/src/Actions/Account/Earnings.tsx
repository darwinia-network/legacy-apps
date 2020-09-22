// Copyright 2017-2019 @polkadot/ui-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/react-components/types';
import { ApiProps } from '@polkadot/react-api/types';
import React from 'react';
import { withMulti, withApi } from '@polkadot/react-api/hoc';
import styled from 'styled-components';
import { ColorButton } from '@polkadot/react-darwinia/components';
import { Spinner } from '@polkadot/react-components';
import ExternalsLinks from '@polkadot/apps-config/links';
import { encodeAddress } from '@polkadot/util-crypto';
import translate from '../../translate';
import { formatBalance } from '@polkadot/util';
import { getStakingHistory, instance } from '@polkadot/react-darwinia';
import BN from 'bn.js';

type Props = I18nProps & ApiProps &{
  stashId: string;
  address: string;
  destinationId: string;
  unClaimedReward: BN;
  doPayout: () => void;
  doPayoutIsDisabled: boolean;
  isLoading: boolean;
  payoutsAmount: number;
  payoutMaxAmount: number;
};

type State = {
  error: string | null;
  isEarningsDetailOpen: boolean;
  sum: string;
  today: string;
  history: [];
};

const StyledWrapper = styled.div`
  .content {
    .reward-box {
      background: #fff;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 25px 20px 27px 57px;
    }

    .tip-box {
      text-align: right;
      display: flex;
      flex-direction: row-reverse;
      padding: 25px 20px 27px 57px;
      padding-top: 0;
      .tip{
        color: #ea2222;
        span {
          color: #db2828;
        }
      }
    }

    .inline-spinner {
      display: inline-block;
    }
  }

  @media (max-width: 767px) {
    .content {
      .reward-box {
        background: #fff;
        flex-wrap: wrap;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: space-between;
        padding: 10px 20px;
      }

      .tip-box {
        .tip{
          width: 100%;
          color: #ea2222;
        }
      }
    }
  }

  .earings-item {
    flex: 1;
    p {
      font-size: 16px;
      color: #302B3C;
      font-weight: bold
    }
    h1 {
      font-size: 26px;
      color:rgba(48,43,60,1);
      font-weight: bold;
      line-height:36px;
      color: #5930DD;
      margin-top: 10px;
      text-transform: uppercase;
    }
  }

  .button-box {
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

let timer: number | null = 0;

class Earnings extends React.PureComponent<Props, State> {
  state: State = {
    error: null,
    isEarningsDetailOpen: false,
    sum: '--',
    today: '--',
    history: []
  };

  axiosInstance = null;

  toggleEarningsDetail = () => {
    this.setState(({ isEarningsDetailOpen }) => ({
      isEarningsDetailOpen: !isEarningsDetailOpen
    }));
  }

  componentDidMount () {
    const { systemChain } = this.props;

    this.axiosInstance = instance[systemChain];

    this.getStakingHistory();
    timer && clearInterval(timer);
    timer = setInterval(() => {
      this.getStakingHistory();
    }, 20000);
  }

  componentWillUnmount () {
    timer && clearInterval(timer);
  }

  UNSAFE_componentWillReceiveProps (nextProps: Props) {
    if (nextProps.address !== this.props.address) {
      this.getStakingHistory(0, nextProps.address);

      return true;
    }

    return false;
  }

  private getStakingHistory = (page = 0, address = this.props.address): void => {
    if (!this.axiosInstance) {
      return;
    }

    getStakingHistory(this.axiosInstance, {
      page,
      address: address
    }, (data) => {
      this.setState({
        sum: data.data.sum
      });
    });
  }

  render () {
    const { destinationId, doPayout, doPayoutIsDisabled, isLoading, payoutMaxAmount, payoutsAmount, t, unClaimedReward, systemChain } = this.props;
    const { sum } = this.state;
    const extChain = ExternalsLinks.Subscan.chains[systemChain];
    const subscanDomain = ExternalsLinks.Subscan.createDomain(extChain);

    return (
      <StyledWrapper>
        <div className='content'>
          <div className='reward-box'>
            <div className='earings-item'>
              <p>{t('Claimed')}</p>
              {sum === '--' ? <Spinner className='inline-spinner'
                variant='mini'/> : <h1>{formatBalance(sum)}</h1>}
            </div>
            <div className='earings-item'>
              <p>{t('Unclaimed')}</p>
              {isLoading ? <Spinner className='inline-spinner'
                variant='mini'/> : <h1>{formatBalance(unClaimedReward)}</h1> }
            </div>
            <div className='button-box'>
              <ColorButton
                // isDisabled={history.length <= 0}
                key='detail'
                onClick={
                  (): void => {
                    window.open(`${subscanDomain}/account/${destinationId}?tab=reward`);
                  }
                }
              >{t('Reward History')}</ColorButton>

              <ColorButton
                isDisabled={doPayoutIsDisabled}
                key='claim'
                onClick={doPayout}
              >{t('Claim Reward')}</ColorButton>
            </div>
          </div>
          {payoutsAmount > payoutMaxAmount ? <div className='tip-box'>
            <p className='tip'>{t('There are {{payoutsAmount}} unclaimed rewards (maximum {{payoutMaxAmount}} rewards per extrinsic, {{tx}} times to receive all rewards)', {
              payoutsAmount,
              payoutMaxAmount,
              tx: Math.ceil(payoutsAmount / payoutMaxAmount)
            })}</p>
          </div> : null}
        </div>
      </StyledWrapper>
    );
  }
}

export default withMulti(
  Earnings,
  translate,
  withApi
);
