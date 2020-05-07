// Copyright 2017-2019 @polkadot/ui-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/react-components/types';
import { ApiProps } from '@polkadot/react-api/types';

import React from 'react';
import { AccountId } from '@polkadot/types/interfaces';
import { Modal, IdentityIcon } from '@polkadot/react-components';
import { withMulti } from '@polkadot/react-api/hoc';
import styled from 'styled-components';
import dayjs from 'dayjs';
import ReactPaginate from 'react-paginate';
import translate from '../../translate';
import { RING_PROPERTIES, getStakingHistory } from '@polkadot/react-darwinia';
import { formatFloat } from '@polkadot/util';

const PAGE_SIZE = 10;

type Props = I18nProps & ApiProps & {
  controllerId?: AccountId | null;
  isOpen: boolean;
  onClose: () => void;
  address: string;
};

type State = {
  history: Array<any>;
  count: number;
  pageCount: number;
};

const StyleWrapper = styled.div`
  color: #302B3C;
  .td, .th{
    display: flex;
    justify-content: center;
    font-weight: bold;
    font-size: 16px;
    text-align: center;
  }

  .th{
    padding: 12px 0;
    &>div{
      flex: 1;
    }
  }

  .td {
    padding: 12px 0;
    &>div{
      flex: 1;
    }
    .earning {
      color:rgba(48,43,60,1);
      background:linear-gradient(315deg, #FE3876 0%, #7C30DD 75%, #3A30DD 100%);
      -webkit-background-clip:text;
      -webkit-text-fill-color:transparent;
    }
    .validator-box{
      display: flex;
      justify-content: center;
      align-items: center;
      &>div{
        margin-right: 10px;
      }
    }
  }

  .even{
    background: #FBFBFB;
  }
`;

class EarningsDetail extends React.PureComponent<Props, State> {
  state: State = {
    history: [],
    count: 0,
    pageCount: 0
  };

  componentDidMount () {
    this.getStakingHistory();
  }

  UNSAFE_componentWillReceiveProps (nextProps: Props) {
    if (nextProps.isOpen === true && this.props.isOpen === false) {
      this.setState({
        history: []
      });
      this.getStakingHistory();
    }
  }

  private getStakingHistory = (page = 0) => {
    const { address } = this.props;
    getStakingHistory({
      page,
      address: address
    }, (data) => {
      this.setState({
        history: data.data.history,
        count: data.data.count,
        pageCount: (data.data.count > PAGE_SIZE && data.data.count % PAGE_SIZE > 0) ? (data.data.count / PAGE_SIZE + 1) : (data.data.count / PAGE_SIZE)
      });
    });
  }

  render () {
    const { isOpen, onClose, t } = this.props;
    const { pageCount } = this.state;
    if (!isOpen) {
      return null;
    }

    return (
      <>
        <Modal
          className='staking--Unbond'
          dimmer='inverted'
          open
          onCancel={onClose}
        >
          {this.renderContent()}
          <Modal.Actions withCancel={false}>
            <ReactPaginate
              previousLabel={'<'}
              nextLabel={'>'}
              breakLabel={'...'}
              breakClassName={'break-me'}
              pageCount={pageCount}
              marginPagesDisplayed={2}
              pageRangeDisplayed={3}
              onPageChange={this.handlePageClick}
              containerClassName={'pagination'}
              subContainerClassName={'pages pagination'}
              activeClassName={'active'}
            />
          </Modal.Actions>
        </Modal>
      </>
    );
  }

  private handlePageClick = data => {
    const selected = data.selected;
    this.getStakingHistory(selected);
  };

  private renderContent () {
    const { t } = this.props;
    const { history } = this.state;

    return (
      <>
        <Modal.Content className='ui--signer-Signer-Content'>
          <StyleWrapper>
            <div className="th">
              <div>{t('Date')}</div>
              <div>{t('Era')}</div>
              <div>{t('Type')}</div>
              <div>{t('Reward')}</div>
            </div>
            {history.map((item, index) => (
              <div className={`td ${index % 2 === 0 ? 'even' : 'odd'}`} key={item.Id}>
                <div>{this.parserDate(item.block_timestamp)}</div>
                <div>{item.era}</div>
                <div className="validator-box">
                  <IdentityIcon key={index} value={'0x' + item.validator} size={20} />
                  <p>{item.reward_type}</p>
                </div>
                <div className="earning">{formatFloat(item.reward)} {RING_PROPERTIES.tokenSymbol}</div>
              </div>
            ))}
          </StyleWrapper>
        </Modal.Content>
      </>
    );
  }

  private nextState (newState: Partial<State>): void {
    this.setState((prevState: State): State => {
      const { history, count, pageCount } = newState;

      return {
        history,
        count,
        pageCount
      };
    });
  }

  private parserDate = (date) => {
    return dayjs(date * 1000).format('YYYY-MM-DD HH:mm:ss');
  }
}

export default withMulti(
  styled(EarningsDetail)`
    .ui--signer-Signer-Content {
      padding:0;
    }
  `,
  translate
);
