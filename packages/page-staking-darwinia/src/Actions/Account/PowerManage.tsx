// Copyright 2017-2019 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

// import { DerivedBalances, DerivedStaking } from '@polkadot/api-derive/types';
import { BareProps, I18nProps } from '@polkadot/react-components/types';

import BN from 'bn.js';
import React from 'react';
import styled from 'styled-components';
// import { formatBalance, formatNumber, formatKtonBalance } from '@polkadot/util';
import { withMulti } from '@polkadot/react-api/hoc';

import translate from '../../translate';
// import { Option, createType } from '@polkadot/types';
import { StakingLedgerT as StakingLedger } from '@darwinia/types/interfaces';
import powerbg from '../../Assets/power-bg.svg';
import { Power, TokenIcon } from '@polkadot/react-darwinia/components';
import { AvailableKton, Available, Balance, BalanceKton } from '@polkadot/react-components-darwinia';
import { DeriveStakingAccount } from '@polkadot/api-derive/types';
import { RING_PROPERTIES, KTON_PROPERTIES } from '@polkadot/react-darwinia';
import { FormatBalance } from '@polkadot/react-query';

// true to display, or (for bonded) provided values [own, ...all extras]
export type BalanceActiveType = {
  available?: boolean;
  bonded?: boolean | Array<BN>;
  free?: boolean;
  redeemable?: boolean;
  unlocking?: boolean;
};

export type CryptoActiveType = {
  crypto?: boolean;
  nonce?: boolean;
};

type Props = BareProps & I18nProps & {
  // balances_all?: DerivedBalances;
  // kton_all?: DerivedBalances;
  // children?: React.ReactNode;
  buttons?: React.ReactNode;
  // staking_info?: DerivedStaking;
  // value: string;
  // stashId?: string;
  // withBalance?: boolean | BalanceActiveType;
  // withExtended?: boolean | CryptoActiveType;
  // ringBalances_freeBalance?: BN;
  // kton_locks: Array<any>;
  // balances_locks: Array<any>;
  // isReadyStaking: boolean;
  // staking_ledger: StakingLedgers;
  stakingLedger?: StakingLedger;
  stakingAccount: DeriveStakingAccount;
  checkedAccount?: string;
};

class AddressInfoStaking extends React.PureComponent<Props> {
  render (): React.ReactElement {
    const { children, className } = this.props;

    return (
      <div className={`${className}`}>
        <div className='PowerManage--box'>
          {this.renderPower()}
          {this.renderBalances()}
          {children && (
            <div className='column'>
              {children}
            </div>
          )}
        </div>
      </div>
    );
  }

  private renderPower (): React.ReactElement {
    const { stakingLedger } = this.props;

    if (!stakingLedger || stakingLedger.isEmpty) {
      return (<div className='power-box'>
        <h3>Power</h3>
        <p><Power ktonAmount={new BN(0)}
          ringAmount={new BN(0)} /></p>
      </div>);
    }

    return (
      <div className='power-box'>
        <h3>Power</h3>
        <p><Power ktonAmount={stakingLedger.activeKton}
          ringAmount={stakingLedger.activeRing} /></p>
      </div>
    );
  }

  private renderBalances (): React.ReactElement {
    const { buttons, checkedAccount, stakingAccount, stakingLedger, t } = this.props;
    // const { staking_info, t, withBalance = true, kton_locks, balances_locks, buttons, isReadyStaking = false, staking_ledger, balances_all, kton_all, stashId } = this.props;
    // const balanceDisplay = withBalance === true
    //   ? { available: true, bonded: true, free: true, redeemable: true, unlocking: true }
    //   : withBalance || undefined;

    // if (!balanceDisplay || !balances_all || !kton_all) {
    //   return null;
    // }

    // let _balances_locks = new BN(0);
    // let _ktonBalances_locks = new BN(0);

    // if (staking_info) {
    //   if (staking_info.unlocking) {
    //     staking_info.unlocking.forEach((item) => {
    //       _balances_locks = _balances_locks.add(item.value);
    //     });
    //   }

    //   if (staking_info.unlockingKton) {
    //     staking_info.unlockingKton.forEach((item) => {
    //       _ktonBalances_locks = _ktonBalances_locks.add(item.value);
    //     });
    //   }
    // }

    if (!stakingLedger || stakingLedger.isEmpty && checkedAccount) {
      return (
        <div className='token-box'>
          <div className='empty-staking-box'>
            <div className='balance-box'>
              <p>{RING_PROPERTIES.tokenSymbol}</p>
              <h1><Balance className='accountBox--all'
                label={''}
                params={checkedAccount} /></h1>
            </div>
            <div className='balance-box'>
              <p>{KTON_PROPERTIES.tokenSymbol}</p>
              <h1><BalanceKton className='accountBox--all'
                label={''}
                params={checkedAccount} /></h1>
            </div>
          </div>
        </div>
      );
    }

    if (!stakingLedger || stakingLedger.isEmpty) {
      return null;
    }

    return (
      <div className='token-box'>
        <div className='nominate-balance-box'>
          <div className='box-left'>
            <TokenIcon className='logo'
              type={RING_PROPERTIES.tokenSymbol.toLocaleLowerCase()} />
            <p>{RING_PROPERTIES.tokenSymbol}</p>
          </div>
          <div className='box-right'>
            <div>
              <label>{t('available')}</label>
              <Available params={stakingLedger.stash}/>
            </div>
            <div>
              <label>{t('bonded')}</label>
              <FormatBalance value={stakingLedger.activeRing} />
            </div>
            <div>
              <label>{t('unbonding')}</label>
              <FormatBalance value={stakingAccount.unlockingTotalValue} />
            </div>
          </div>

        </div>

        <div className='nominate-balance-box'>
          <div className='box-left'>
            <TokenIcon className='logo'
              type={KTON_PROPERTIES.tokenSymbol.toLocaleLowerCase()} />
            <p>{KTON_PROPERTIES.tokenSymbol}</p>
          </div>
          <div className='box-right'>
            <div><label>{t('available')}</label><AvailableKton params={stakingLedger.stash}/></div>
            <div><label>{t('bonded')}</label><FormatBalance value={stakingLedger.activeKton} /></div>
            <div><label>{t('unbonding')}</label><FormatBalance value={stakingAccount.unlockingKtonTotalValue} /></div>
          </div>
        </div>
        {buttons}
      </div>
    );
  }
}

export default withMulti(
  styled(AddressInfoStaking)`
    align-items: flex-start;
    display: flex;
    flex: 1;
    justify-content: center;
    background: #fff;
    align-items: center;

    .PowerManage--box{
      display: flex;
      flex: 1;
      padding: 15px;
      flex-wrap: wrap;
      .power-box{
        display: flex;
        background: url(${powerbg}) no-repeat;
        flex-direction: column;
        align-items: flex-start;
        width: 175px;
        height: 102px;
        justify-content: center;
        padding-left: 15px;
        margin-right: 23px;
        color: #fff;
        h3,p{
          color:#fff;
          font-weight: bold;
        }
        h3{
          font-size: 14px;
        }
        p{
          font-size: 24px;
        }
      }

    }

    .token-box {
      display: flex;
      flex: 1;s
      .balance-box{
        flex-basis: 205px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        h1{
          font-size: 18px;
          font-weight: bold;
          margin-top: 0;
          color: #302B3C;
        }
        p{
          font-size: 14px;
          font-weight: bold;
          color: #302B3C;
        }
      }
      .empty-staking-box{
        display: flex;
        align-items: center;
        .balance-box{
          width: 200px;
          text-align: center;
          p {
            margin-bottom: 0;
          }
          h1{
            margin-top: 0;
          }
          .accountBox--all{
            font-size: 18px;
            color: #302B3C;
          }
        }
      }
      .nominate-balance-box {
        margin: 0 5px;
        flex-basis: 332px;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        padding: 10px 30px;
        background: #FBFBFB;
        .box-left{
          text-align: center;
          margin-top: 5px;

          img{
            width: 40px;
          }
          p{
            text-transform: uppercase;
            font-weight: bold;
          }
        }
        .box-right{
          flex: 1;
          margin-left: 30px;
          &>div:last-child {
            margin-bottom: 0;
          }
          &>div {
            display: flex;
            flex-direction: row;
            margin-bottom: 0.9rem;
            label{
              color: #98959F;
              font-size: 12px;
              min-width: 88px;
              text-align: left;
              font-weight: bold;
            }
            div{
              color: #5930DD;
              font-size: 16px;
              font-weight: bold;
              span {
                font-size: 16px;
                font-weight: bold;
              }
            }
          }
          p:last-child {
            margin-bottom: 0;
          }
        }
      }
      h1{
        text-transform: none;
      }
      label {
        grid-column:  1;
        padding-right: 0.5rem;
        text-align: right;

        .help.circle.icon {
          display: none;
        }
      }

      .result {
        grid-column:  2;
        margin-right: 1rem;
        .iconButton {
          padding-left: 0!important;
        }

        i.info.circle.icon {
          margin-left: .3em;
        }
      }
    }

    @media (max-width: 767px) {
      flex-wrap: wrap;
      div.ui--address-value{
        flex-direction: column;
        flex-wrap: wrap;
        align-items: stretch;
        padding: 10px 20px;
      }

      .column {
        .nominate-balance-box {
          padding: 10px;
          margin: 5px 0;
        }
      }
    }
  `,
  translate
);
