// Copyright 2017-2019 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/react-components/types';
import { SubjectInfo } from '@polkadot/ui-keyring/observable/types';
import { ComponentProps, bondList } from './types';
import styled from 'styled-components';
import { withRouter } from 'react-router-dom';
import React from 'react';
import { withMulti } from '@polkadot/react-api/hoc';
import { TxButton, Button } from '@polkadot/react-components';
import { Button as SButton, Checkbox } from 'semantic-ui-react';
import translate from './translate';
import { formatBalance, formatBalance as formatKtonBalance, formatNumber, ringToKton } from '@polkadot/util';
import dayjs from 'dayjs';
import ReactPaginate from 'react-paginate';
import { getBondList, SUBSCAN_URL } from '@polkadot/react-darwinia';

const PAGE_SIZE = 10;

type Props = ComponentProps & I18nProps & {
  account: string;
  controllerId: string;
  onStakingNow: () => void;
  history: any;
};

type State = {
  isCreateOpen: boolean;
  isRingStakingOpen: boolean;
  isImportOpen: boolean;
  isAccountsListOpen: boolean;
  AccountMain: string;
  bondList: bondList;
  page: number;
  status:
  | 'unbonding'
  | 'bonded'
  | 'map';
  pageCount: number;
  locked: 0 | 1;
};

class Overview extends React.PureComponent<Props, State> {
  state: State = {
    isRingStakingOpen: false,
    isCreateOpen: false,
    isImportOpen: false,
    isAccountsListOpen: false,
    AccountMain: '',
    bondList: {
      count: 0,
      list: []
    },
    page: 0,
    status: 'bonded',
    pageCount: 0,
    locked: 0
  };

  componentDidMount () {
    const { account } = this.props;
    const { locked } = this.state;
    this.updateBondList(0, 'bonded', locked, account);
  }

  UNSAFE_componentWillReceiveProps (nextProps: Props) {
    if (this.props.account !== nextProps.account) {
      this.updateBondList(0, 'bonded', this.state.locked, nextProps.account);
    }
  }

  updateBondList = async (page, status, locked, address) => {
    if (!address) {
      this.setState({
        status,
        bondList: {
          count: 0,
          list: []
        },
        pageCount: 1
      });
      return;
    }

    if (status === 'unbonding') {
      locked = 0;
    }

    const response = await getBondList({ page: page, row: PAGE_SIZE, status: status, locked, address: address });

    if (response.data.code === 0 && response.data.data) {
      this.setState({
        status,
        bondList: response.data.data,
        pageCount: (response.data.data.count > PAGE_SIZE && response.data.data.count % PAGE_SIZE > 0) ? (response.data.data.count / PAGE_SIZE + 1) : (response.data.data.count / PAGE_SIZE)
      });
    } else {
      this.setState({
        status,
        bondList: {
          count: 0,
          list: []
        },
        pageCount: 1
      });
    }
  }

  refreshList = () => {
    const { status, locked } = this.state;
    const { account } = this.props;
    setTimeout(() => {
      this.updateBondList(0, status, locked, account);
    }, 1500);
  }

  formatDate (date) {
    if (date) {
      return dayjs(date).format('YYYY-MM-DD');
    }
    return dayjs(0).format('YYYY-MM-DD');
  }

  process (start, expire): number {
    const now = dayjs().unix();
    const end = dayjs(expire).unix();
    if (end <= now) {
      return 100;
    } else {
      return 100 - (end - now) / (end - dayjs(start).unix()) * 100;
    }
  }

  private renderTitle = () => {
    const { account, t } = this.props;
    const { status, locked } = this.state;
    return (<TitleWrapper className={'titleRow'}>
      <div className={'titleLeft'}>
        <p className="titleRow-main">{t('History')}</p>
        <div className={'statusButtons'}>
          <SButton.Group>
            <SButton active={status === 'bonded'} onClick={() => this.updateBondList(0, 'bonded', locked, account)}>{t('Bonded')}</SButton>
            <SButton active={status === 'unbonding'} onClick={() => this.updateBondList(0, 'unbonding', locked, account)}>{t('Unbond')}</SButton>
            <SButton active={status === 'map'} onClick={() => this.updateBondList(0, 'map', locked, account)}>{t('Map')}</SButton>
          </SButton.Group>
        </div>
      </div>
      <div>
        {status === 'bonded' ? <Checkbox onChange={((event, data) => {
          const _status = data.checked ? 1 : 0;
          this.setState({
            locked: _status
          });
          this.updateBondList(0, status, _status, account);
        })} label={t('Only Locked')} /> : null}
      </div>
    </TitleWrapper>);
  }

  private handlePageClick = data => {
    const { status, locked } = this.state;
    const { account } = this.props;
    const selected = data.selected;
    this.updateBondList(selected, status, locked, account);
  };

  private getUnbondingEndTime (start) {
    return dayjs(start).add(14, 'day');
  }

  renderBondedList () {
    const { controllerId, t } = this.props;
    const { bondList, pageCount } = this.state;
    if (!bondList || bondList.count === 0 || (bondList.list.length === 0)) {
      return (
        <Wrapper>
          <table className={'stakingTable stakingTableEmpty'}>
            <tbody>
              <tr className='stakingTh'>
                <td>{t('Extrinsic ID')}</td>
                <td>{t('Date')}</td>
                <td>{t('Amount')}</td>
                <td>{t('Reward')}</td>
                <td>{t('Setting')}</td>
              </tr>
              <tr>
                <td colSpan={5} className="emptyTd">
                  <p className="no-items">{t('No data')}</p>
                </td>
              </tr>
            </tbody>
          </table>
        </Wrapper>
      );
    }

    return (
      <Wrapper>
        <table className={'stakingTable'}>
          <tbody>
            <tr className='stakingTh'>
              <td>{t('Extrinsic ID')}</td>
              <td>{t('Date')}</td>
              <td>{t('Amount')}</td>
              <td>{t('Reward')}</td>
              <td>{t('Setting')}</td>
            </tr>
            {bondList.list.map((item, index) => {
              return (<tr key={`${index}${item.Id}`}>
                <td><a className="stakingLink" target="_blank" rel="noopener noreferrer" href={`${SUBSCAN_URL}/extrinsic/${item.extrinsic_index}`}>{item.extrinsic_index}</a></td>
                <td>
                  <p className="stakingRange">{`${this.formatDate(item.start_at)} - ${this.formatDate(item.expired_at)}`}</p>
                  <div className="stakingProcess">
                    <div className="stakingProcessPassed" style={{ width: `${this.process(item.start_at, item.expired_at)}%` }}></div>
                  </div>
                </td>
                <td>{formatBalance(item.amount, false)} {item.currency.toUpperCase()}</td>
                <td>
                  <div className="textGradient">{(item.currency.toLowerCase() === 'kton' || item.month === 0) ? '--' : formatKtonBalance(ringToKton(item.amount, item.month))}</div>
                </td>
                <td>
                  {item.month === 0 ? <>{t('Completed')}</> : (dayjs(item.expired_at).unix() < dayjs().unix()) ? <TxButton
                    accountId={controllerId}
                    isBasic={true}
                    // isSecondary={true}
                    onSuccess={() => { this.refreshList(); }}
                    label={t('Release')}
                    tx='staking.claimMatureDeposits'
                  /> : (item.unlock ? <>{t('Lock limit canceled')}</> : <TxButton
                    accountId={controllerId}
                    isBasic={true}
                    // isSecondary={true}
                    onSuccess={() => { this.refreshList(); }}
                    params={[
                      item.expired_at
                    ]}
                    label={
                      t('Cancel lock limit')
                    }
                    key='Redeem'
                    tx='staking.tryClaimDepositsWithPunish'
                  />)}
                </td>
              </tr>);
            })}
          </tbody>
        </table>
        <PaginationWrapper>
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
        </PaginationWrapper>
      </Wrapper>
    );
  }

  renderUnbondList () {
    const { t } = this.props;
    const { bondList, pageCount, status } = this.state;
    if (!bondList || bondList.count === 0 || (bondList.list.length === 0)) {
      return (
        <Wrapper>
          <table className={'stakingTable stakingTableEmpty unbondedStakingTable'}>
            <tbody>
              <tr className='stakingTh'>
                <td>{t('Extrinsic ID')}</td>
                <td>{t('Date')}</td>
                <td>{t('Amount')}</td>
                <td>{t('Status')}</td>
              </tr>
              <tr>
                <td colSpan={4} className="emptyTd">
                  <p className="no-items">{t('No Data')}</p>
                </td>
              </tr>
            </tbody>
          </table>
        </Wrapper>
      );
    }

    return (
      <Wrapper>
        <table className={'stakingTable unbondedStakingTable'}>
          <tbody>
            <tr className='stakingTh'>
              <td>{t('Extrinsic ID')}</td>
              <td>{t('Date')}</td>
              <td>{t('Amount')}</td>
              <td>{t('Status')}</td>
            </tr>
            {bondList.list.map((item, index) => {
              return (<tr key={`${index}${item.Id}`}>
                <td><a className="stakingLink" target="_blank" rel="noopener noreferrer" href={`${SUBSCAN_URL}/extrinsic/${item.extrinsic_index}`}>{item.extrinsic_index}</a></td>
                <td>
                  <p className="stakingRange">{`${this.formatDate(item.unbonding_at)} - ${this.formatDate(this.getUnbondingEndTime(item.unbonding_at))}`}</p>
                  <div className="stakingProcess">
                    <div className="stakingProcessPassed" style={{ width: `${this.process(item.unbonding_at, this.getUnbondingEndTime(item.unbonding_at))}%` }}></div>
                  </div>
                </td>
                <td>{formatBalance(item.amount)}</td>
                <td>
                  {/* <div className="textGradient">{formatKtonBalance(ringToKton(item.amount, item.month))}</div> */}
                  <div className="textGradient">{this.renderUnbondingStatus(this.getUnbondingEndTime(item.unbonding_at))}</div>
                </td>
              </tr>);
            })}
          </tbody>
        </table>
        <PaginationWrapper>
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
        </PaginationWrapper>
      </Wrapper>
    );
  }

  renderMapList () {
    const { controllerId, t } = this.props;
    const { bondList, pageCount } = this.state;
    if (!bondList || bondList.count === 0 || (bondList.list.length === 0)) {
      return (
        <Wrapper>
          <table className={'stakingTable stakingTableEmpty'}>
            <tbody>
              <tr className='stakingTh'>
                <td>{t('Extrinsic ID')}</td>
                <td>{t('Date')}</td>
                <td>{t('Amount')}</td>
                <td>{t('Reward')}</td>
                <td>{t('Setting')}</td>
              </tr>
              <tr>
                <td colSpan={5} className="emptyTd">
                  <p className="no-items">{t('No data')}</p>
                </td>
              </tr>
            </tbody>
          </table>
        </Wrapper>
      );
    }

    return (
      <Wrapper>
        <table className={'stakingTable'}>
          <tbody>
            <tr className='stakingTh'>
              <td>{t('Extrinsic ID')}</td>
              <td>{t('Date')}</td>
              <td>{t('Amount')}</td>
              <td>{t('Type')}</td>
              <td>{t('Tx Hash')}</td>
            </tr>
            {bondList.list.map((item, index) => {
              return (<tr key={`${index}${item.Id}`}>
                <td><a className="stakingLink" target="_blank" rel="noopener noreferrer" href={`${SUBSCAN_URL}/extrinsic/${item.extrinsic_index}`}>{item.extrinsic_index}</a></td>
                <td>
                  {this.formatDate(item.mapping_at)}
                </td>
                <td>{formatBalance(item.amount, false)}</td>
                <td>
                  {item.mapping_type}
                </td>
                <td>
                  <a className="stakingLink" target="_blank" rel="noopener noreferrer" href={`${SUBSCAN_URL}/tx/${item.from_tx}`}>{item.from_tx}</a>
                </td>
              </tr>);
            })}
          </tbody>
        </table>
        <PaginationWrapper>
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
        </PaginationWrapper>
      </Wrapper>
    );
  }

  renderUnbondingStatus = (expire) => {
    const { t } = this.props;
    const now = dayjs().unix();
    const end = dayjs(expire).unix();
    if (now >= end) {
      return t('Unbonded');
    } else {
      return t('Unbonding');
    }
  }

  render () {
    const { status } = this.state;
    return (
      <BoxWrapper>
        {this.renderTitle()}
        {status === 'bonded' ? this.renderBondedList() : null}
        {status === 'unbonding' ? this.renderUnbondList() : null}
        {status === 'map' ? this.renderMapList() : null}
      </BoxWrapper>
    );
  }
}

const BoxWrapper = styled.div`
`;

const PaginationWrapper = styled.div`
  display: flex;
  flex-direction: row-reverse;
  margin: 0 -15px;
`;

const TitleWrapper = styled.div`
  justify-content: space-between;
  .titleLeft{
    flex: 1;
    display: flex;
    flex-direction: row;
    align-items: center;
    p{
      margin-bottom: 0;
    }
    .statusButtons{
      margin-left: 35px;
      .ui.buttons {
        .button{
          color: #B3B3B3;
          background-color: #fff!important;
        }
        .active.button{
          background-color: #fff!important;
          color: #302B3C;
        }
      }
    }
  }
`;
const Wrapper = styled.div`
    padding-bottom: 30px;
    margin-top: 10px;
    .stakingTable{
      border-collapse: collapse;
      background: #fff;
      width: 100%;
      border-radius:2px;
      border:1px solid rgba(237,237,237,1);
      td{
        width: 20%;
        font-weight: bold;
      }
      .textGradient{
        color:rgba(48,43,60,1);
        background:linear-gradient(315deg, #FE3876 0%, #7C30DD 75%, #3A30DD 100%);
        -webkit-background-clip:text;
        -webkit-text-fill-color:transparent;
      }
      .stakingLink{
        color: #5930DD;
        font-size: 14px;
        text-decoration: underline;
        font-weight: bold;
      }
      .stakingProcess{
        height:3px;
        background:rgba(216,216,216,1);
        border-radius:4px;
        margin: 0 12%;
      }
      .stakingRange{
        margin-bottom: 6px;
      }
      .stakingProcessPassed{
        height:3px;
        background:linear-gradient(315deg,rgba(254,56,118,1) 0%,rgba(124,48,221,1) 71%,rgba(58,48,221,1) 100%);
        border-radius:4px;
      }
      .stakingTh{
        td{
          font-size: 16px;
        }
      }
      tr{
        td{
          text-align: center;
          padding: 17px 10px;
        }
      }
      tr:nth-child(even) {
        td{
          background: #FBFBFB;
        }
      }
      
    }

    .unbondedStakingTable{
      td{
        width: 25%;
      }
    }
    
    .stakingTableEmpty{
      .no-items{
        padding: 15px;
        text-align: center;
        color: #B4B6BC;
        margin-bottom: 0;
      }
      .emptyTd{
        padding: 100px 0!important;
        background: #fff!important;
      }
    }
    @media (max-width: 767px) {
      .stakingTable{
        tr{
          td{
            text-align: center;
            padding: 15px 2px;
          }
        }

        .stakingRange{
          font-size: 12px;
        }
      }
    }
`;

export default withMulti(
  Overview,
  translate,
  withRouter
);
