// Copyright 2017-2019 @polkadot/ui-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/react-components/types';
import React from 'react';
import { withMulti } from '@polkadot/react-api/hoc';
import styled from 'styled-components';
import { ColorButton } from '@polkadot/react-darwinia/components';
import EarningsDetail from './EarningsDetail';
import translate from '../../translate';
import { formatFloat, formatBalance } from '@polkadot/util';
import { RING_PROPERTIES, getStakingHistory, SUBSCAN_URL_CRAB } from '@polkadot/react-darwinia';
import BN from 'bn.js';

type Props = I18nProps & {
  stashId: string;
  address: string;
  destinationId: string;
  unClaimedReward: BN;
  doPayout: () => void;
  doPayoutIsDisabled: boolean;
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
    background: #fff;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 25px 20px 27px 57px; 
  }

  @media (max-width: 767px) {
    .content {
      background: #fff;
      flex-wrap: wrap;
      border: 1px solid #EDEDED;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: space-between;
      padding: 10px 20px;
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

class Earnings extends React.PureComponent<Props, State> {
  state: State = {
    error: null,
    isEarningsDetailOpen: false,
    sum: '--',
    today: '--',
    history: [],
  };

  toggleEarningsDetail = () => {
    this.setState(({ isEarningsDetailOpen }) => ({
      isEarningsDetailOpen: !isEarningsDetailOpen
    }));
  }

  componentDidMount () {
    this.getStakingHistory();
  }

  componentWillReceiveProps (nextProps: Props) {
    if (nextProps.address !== this.props.address) {
      this.getStakingHistory(0, nextProps.address);
      return true;
    }
    return false;
  }

  private getStakingHistory = (page = 0, address = this.props.address) => {
    getStakingHistory({
      page,
      address: address
    }, (data) => {
      this.setState({
        sum: data.data.sum,
        today: data.data.today,
        history: data.data.history,
      });
    });
  }

  render () {
    const { t, address, doPayout, doPayoutIsDisabled, unClaimedReward, destinationId } = this.props;
    const { isEarningsDetailOpen, sum, today, history } = this.state;

    return (
      <StyledWrapper>
        <div className="content">
          <div className="earings-item">
            <p>{t('Claimed')}</p>
            <h1>{sum === '--' ? '--' : formatBalance(sum)}</h1>
          </div>
          <div className="earings-item">
            <p>{t('Unclaimed')}</p>
            <h1>{formatBalance(unClaimedReward)}</h1>
          </div>
          <div className="button-box">
            <ColorButton
              // isDisabled={history.length <= 0}
              key='detail'
              onClick={
                () => {
                  window.open(`${SUBSCAN_URL_CRAB}/account/${destinationId}`)
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
        {address ? <EarningsDetail
          isOpen={isEarningsDetailOpen}
          onClose={this.toggleEarningsDetail}
          address={address}
        /> : null}
      </StyledWrapper>
    );
  }
}

export default withMulti(
  Earnings,
  translate
);
