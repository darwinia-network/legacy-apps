/* eslint-disable @typescript-eslint/camelcase */
// Copyright 2017-2019 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/react-components/types';
import { BlockNumber } from '@polkadot/types/interfaces';
import { ComponentProps, bondList } from './types';
import styled from 'styled-components';
import React from 'react';
import { withMulti, withCalls, withApi } from '@polkadot/react-api/hoc';
import { ApiProps } from '@polkadot/react-api/types';
import { TxButton } from '@polkadot/react-components';
import { Button as SButton, Checkbox } from 'semantic-ui-react';
import translate from './translate';
import { formatBalance, formatKtonBalance, ringToKton } from '@polkadot/util';
import dayjs from 'dayjs';
import ReactPaginate from 'react-paginate';
import { getBondList, instance } from '@polkadot/react-darwinia';
import ExternalsLinks from '@polkadot/apps-config/links';

const PAGE_SIZE = 10;

type Props = ComponentProps & I18nProps & ApiProps & {
  account: string;
  controllerId: string;
  onStakingNow: () => void;
  history: any;
  chain_bestNumber: BlockNumber;
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
  unbondEnd = 201600;
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

    const { systemChain } = this.props;
    const axiosInstance = instance[systemChain];

    if (!axiosInstance) {
      return;
    }

    const response = await getBondList(axiosInstance, { page: page, row: PAGE_SIZE, status: status, locked, address: address });

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
    const { locked, status } = this.state;
    const { account } = this.props;

    setTimeout(() => {
      this.updateBondList(0, status, locked, account);
    }, 1500);
  }

  formatDate (date: number, params = { format: 'YYYY-MM-DD', isUnix: false }): string {
    if (date && params.isUnix) {
      return dayjs.unix(date).format(params.format);
    }

    if (date) {
      return dayjs(date).format(params.format);
    }

    return dayjs(0).format(params.format);
  }

  formatType (type = ''): string {
    const { t } = this.props;

    switch (type.toLowerCase()) {
      case 'redeemdeposit':
        return t('Deposit');
        break;
      case 'redeemring':
        return 'RING';
        break;
      case 'redeemkton':
        return 'KTON';
        break;
      default:
        return type;
        break;
    }
  }

  formatIndex (extrinsicIndex: string): number {
    let idx = 0;

    try {
      idx = parseInt(extrinsicIndex.split('-')[0]);
    } catch (error) {
      console.error(error);
    }

    return idx;
  }

  computeUnbondProgress (start: number, current: number, end: number): string {
    if (current < end) {
      return ((current - start) / (end - start) * 100).toFixed(2) + ' %';
    } else {
      return '100 %';
    }
  }

  process (start: number, expire: number): number {
    const { chain_bestNumber } = this.props;

    if (!chain_bestNumber) {
      return 0;
    }

    if (chain_bestNumber.toNumber() < start) {
      return 0;
    }

    if (expire <= chain_bestNumber.toNumber()) {
      return 100;
    } else {
      return parseFloat((100 - (expire - chain_bestNumber.toNumber()) / (expire - start) * 100).toFixed(2));
    }
  }

  processTime (start: number, expire: number): number {
    const now = dayjs().unix();
    const end = dayjs(expire).unix();

    if (end <= now) {
      return 100;
    } else {
      return 100 - (end - now) / (end - dayjs(start).unix()) * 100;
    }
  }

  private renderTitle = (): React.ReactNode => {
    const { account, t } = this.props;
    const { locked, status } = this.state;

    return (<TitleWrapper className={'titleRow'}>
      <div className={'titleLeft'}>
        <p className='titleRow-main'>{t('History')}</p>
        <div className={'statusButtons'}>
          <SButton.Group>
            <SButton active={status === 'bonded'}
              onClick={() => this.updateBondList(0, 'bonded', locked, account)}>{t('Bonded')}</SButton>
            <SButton active={status === 'unbonding'}
              onClick={() => this.updateBondList(0, 'unbonding', locked, account)}>{t('Unbond')}</SButton>
            <SButton active={status === 'map'}
              onClick={() => this.updateBondList(0, 'map', locked, account)}>{t('Map')}</SButton>
          </SButton.Group>
        </div>
      </div>
      <div>
        {status === 'bonded' ? <Checkbox label={t('Only Locked')}
          onChange={((event, data) => {
            const _status = data.checked ? 1 : 0;

            this.setState({
              locked: _status
            });
            this.updateBondList(0, status, _status, account);
          })} /> : null}
      </div>
    </TitleWrapper>);
  }

  private handlePageClick = (data) => {
    const { locked, status } = this.state;
    const { account } = this.props;
    const selected = data.selected;

    this.updateBondList(selected, status, locked, account);
  };

  private getUnbondingEndTime (start) {
    return dayjs(start).add(14, 'day');
  }

  textEllipsis (text = '', maxLength = 30): string {
    if (text.length > maxLength) {
      return text.substr(0, 10) + '...' + text.substr(text.length - 10, 10);
    }

    return text;
  }

  renderBondedList (): React.ReactNode {
    const { controllerId, systemChain, t } = this.props;
    const { bondList, pageCount } = this.state;

    const { chains, paths } = ExternalsLinks.Subscan;
    const extChain = chains[systemChain];
    const extPaths = paths.extrinsic;

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
                <td className='emptyTd'
                  colSpan={5}>
                  <p className='no-items'>{t('No data')}</p>
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
                <td><a className='stakingLink'
                  href={ExternalsLinks.Subscan.create(extChain, extPaths || '', item.extrinsic_index)}
                  rel='noopener noreferrer'
                  target='_blank'>{item.extrinsic_index}</a></td>
                <td>
                  <p className='stakingRange'>{`${this.formatDate(item.start_at)} - ${this.formatDate(item.expired_at)}`}</p>
                  <div className='stakingProcess'>
                    <div className='stakingProcessPassed'
                      style={{ width: `${this.processTime(item.start_at, item.expired_at)}%` }}></div>
                  </div>
                </td>
                <td>{formatBalance(item.amount, false)} {item.currency.toUpperCase()}</td>
                <td>
                  <div className='textGradient'>{(item.currency.toLowerCase() === 'kton' || item.month === 0) ? '--' : formatKtonBalance(ringToKton(item.amount, item.month))}</div>
                </td>
                <td>
                  {item.month === 0 ? <>{t('Completed')}</> : (dayjs(item.expired_at).unix() < dayjs().unix() && !item.unlock) ? <TxButton
                    accountId={controllerId}
                    isBasic={true}
                    // isSecondary={true}
                    label={t('Release')}
                    onSuccess={() => { this.refreshList(); }}
                    tx='staking.claimMatureDeposits'
                  /> : (item.unlock ? <>{t('Lock limit canceled')}</> : <TxButton
                    accountId={controllerId}
                    isBasic={true}
                    // isSecondary={true}
                    key='tryClaimDepositsWithPunish'
                    label={
                      t('Cancel lock limit')
                    }
                    onSuccess={() => { this.refreshList(); }}
                    params={[
                      item.expired_at
                    ]}
                    tx='staking.tryClaimDepositsWithPunish'
                  />)}
                </td>
              </tr>);
            })}
          </tbody>
        </table>
        <PaginationWrapper>
          <ReactPaginate
            activeClassName={'active'}
            breakClassName={'break-me'}
            breakLabel={'...'}
            containerClassName={'pagination'}
            marginPagesDisplayed={2}
            nextLabel={'>'}
            onPageChange={this.handlePageClick}
            pageCount={pageCount}
            pageRangeDisplayed={3}
            previousLabel={'<'}
            subContainerClassName={'pages pagination'}
          />
        </PaginationWrapper>
      </Wrapper>
    );
  }

  extrinsicIndexToBlockNumber = (index: string): number => {
    return parseInt(index.split('-')[0]);
  }

  renderUnbondList () {
    const { chain_bestNumber, systemChain, t } = this.props;
    const { bondList, pageCount } = this.state;

    const { chains, paths } = ExternalsLinks.Subscan;
    const extChain = chains[systemChain];
    const extPaths = paths.extrinsic;

    if (!bondList || bondList.count === 0 || (bondList.list?.length === 0)) {
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
                <td className='emptyTd'
                  colSpan={4}>
                  <p className='no-items'>{t('No Data')}</p>
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
              <td>{t('Progress')}</td>
              <td>{t('Amount')}</td>
              <td>{t('Status')}</td>
            </tr>
            {bondList.list?.map((item, index) => {
              return (<tr key={`${index}${item.Id}`}>
                <td><a className='stakingLink'
                  href={ExternalsLinks.Subscan.create(extChain, extPaths || '', item.extrinsic_index)}
                  rel='noopener noreferrer'
                  target='_blank'>{item.extrinsic_index}</a></td>
                <td>
                  {/* <p className='stakingRange'>{`${this.formatDate(item.unbonding_at)} - ${this.formatDate(this.getUnbondingEndTime(item.unbonding_at))}`}</p> */}
                  {chain_bestNumber && (
                    <div>{this.process(this.extrinsicIndexToBlockNumber(item.unbonding_extrinsic_index), item.unbonding_block_end)}%</div>
                  )}
                  <div className='stakingProcess'>
                    <div className='stakingProcessPassed'
                      style={{ width: `${this.process(this.extrinsicIndexToBlockNumber(item.unbonding_extrinsic_index), item.unbonding_block_end)}%` }}></div>
                  </div>
                </td>
                <td>{formatBalance(item.amount, false)} {item.currency.toUpperCase()}</td>
                <td>
                  {/* <div className="textGradient">{formatKtonBalance(ringToKton(item.amount, item.month))}</div> */}
                  {/* <div className='textGradient'>{this.renderUnbondingStatus(this.getUnbondingEndTime(item.unbonding_at))}</div> */}
                  <div className='textGradient'>{this.renderUnbondingStatusWithBlockNumber(chain_bestNumber.toNumber(), item.unbonding_block_end)}</div>
                </td>
              </tr>);
            })}
          </tbody>
        </table>
        <PaginationWrapper>
          <ReactPaginate
            activeClassName={'active'}
            breakClassName={'break-me'}
            breakLabel={'...'}
            containerClassName={'pagination'}
            marginPagesDisplayed={2}
            nextLabel={'>'}
            onPageChange={this.handlePageClick}
            pageCount={pageCount}
            pageRangeDisplayed={3}
            previousLabel={'<'}
            subContainerClassName={'pages pagination'}
          />
        </PaginationWrapper>
      </Wrapper>
    );
  }

  renderMapList () {
    const { controllerId, systemChain, t } = this.props;
    const { bondList, pageCount } = this.state;

    const { chains, paths } = ExternalsLinks.Subscan;
    const extChain = chains[systemChain];
    const extPaths = paths.extrinsic;
    const txPaths = paths.transaction;


    if (!bondList || bondList.count === 0 || (bondList.list?.length === 0)) {
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
                <td className='emptyTd'
                  colSpan={5}>
                  <p className='no-items'>{t('No data')}</p>
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
              <td>{t('Mapping Date')}</td>
              <td>{t('Amount')}</td>
              <td>{t('Type')}</td>
              <td>{t('Ethereum Tx Hash')}</td>
            </tr>
            {bondList.list.map((item, index) => {
              return (<tr key={`${index}${item.Id}`}>
                <td><a className='stakingLink'
                  href={ExternalsLinks.Subscan.create(extChain, extPaths || '', item.extrinsic_index)}
                  rel='noopener noreferrer'
                  target='_blank'>{item.extrinsic_index}</a></td>
                <td>
                  {this.formatDate(item.mapping_at, {
                    format: 'YYYY-MM-DD HH:mm:ss',
                    isUnix: true
                  })}
                </td>
                <td>{formatBalance(item.amount, false)}</td>
                <td>
                  {this.formatType(item.mapping_type)}
                </td>
                <td>
                  <a className='stakingLink'
                    href={ExternalsLinks.Etherscan.create(t(ExternalsLinks.Etherscan.key || ''), 'tx', item.from_tx)}
                    rel='noopener noreferrer'
                    target='_blank'>{this.textEllipsis(item.from_tx)}</a>
                </td>
              </tr>);
            })}
          </tbody>
        </table>
        <PaginationWrapper>
          <ReactPaginate
            activeClassName={'active'}
            breakClassName={'break-me'}
            breakLabel={'...'}
            containerClassName={'pagination'}
            marginPagesDisplayed={2}
            nextLabel={'>'}
            onPageChange={this.handlePageClick}
            pageCount={pageCount}
            pageRangeDisplayed={3}
            previousLabel={'<'}
            subContainerClassName={'pages pagination'}
          />
        </PaginationWrapper>
      </Wrapper>
    );
  }

  // renderUnbondingStatus = (expire) => {
  //   const { t } = this.props;
  //   const now = dayjs().unix();
  //   const end = dayjs(expire).unix();

  //   if (now >= end) {
  //     return t('Unbonded');
  //   } else {
  //     return t('Unbonding');
  //   }
  // }

  renderUnbondingStatusWithBlockNumber (current: number, end: number): string {
    const { t } = this.props;

    return end > current ? t('Unbonding') : t('Unbonded');
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
  // withRouter,
  withApi,
  withCalls<Props>(
    'derive.chain.bestNumber'
  )
);
