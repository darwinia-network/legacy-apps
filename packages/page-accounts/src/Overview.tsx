// Copyright 2017-2020 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { KeyringAddress } from '@polkadot/ui-keyring/types';
import { ComponentProps as Props } from './types';

import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import keyring from '@polkadot/ui-keyring';
import { getLedger, isLedger } from '@polkadot/react-api';
import { useAccounts, useFavorites, useToggle, useAccountChecked, useApi, useCall } from '@polkadot/react-hooks';
import { Button, Input, Table, Available, AvailableKton, Balance, BalanceKton } from '@polkadot/react-components';

import CreateModal from './modals/Create';
import ImportModal from './modals/Import';
import QrModal from './modals/Qr';
import Account from './Account';
import { useTranslation } from './translate';
import noAccountImg from './img/noAccount.svg';
import ringImg from './img/ring.svg';
import ktonImg from './img/kton.svg';
import AccountStatus from './AccountStatus';
import StakingList from './StakingList';
import { RING_PROPERTIES, KTON_PROPERTIES } from '@polkadot/react-darwinia';
import { RowTitle } from '@polkadot/react-darwinia/components';
import Transfer from './modals/Transfer';
import TransferKton from './modals/TransferKton';

type SortedAccount = { address: string; isFavorite: boolean };

const STORE_FAVS = 'accounts:favorites';
const STORE_CHECKED = 'accounts:checked';

// query the ledger for the address, adding it to the keyring
async function queryLedger(): Promise<void> {
  const ledger = getLedger();

  try {
    const { address } = await ledger.getAddress();

    keyring.addHardware(address, 'ledger', { name: 'ledger' });
  } catch (error) {
    console.error(error);
  }
}

function Overview ({ className, onStatusChange }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();

  const { allAccounts, hasAccounts } = useAccounts();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [isQrOpen, setIsQrOpen] = useState(false);
  const [favorites, toggleFavorite] = useFavorites(STORE_FAVS);
  const [accountChecked, toggleAccountChecked] = useAccountChecked(STORE_CHECKED);
  const [sortedAccounts, setSortedAccounts] = useState<SortedAccount[]>([]);
  const [filter, setFilter] = useState<string>('');
  const [controllerId, setControllerId] = useState<string>('');
  const [isTransferOpen, toggleTransfer] = useToggle();
  const [isTransferKtonOpen, toggleKtonTransfer] = useToggle();
  const _accountChecked = accountChecked[0];

  useEffect((): void => {
    setSortedAccounts(
      allAccounts
        .map((address): SortedAccount => ({ address, isFavorite: favorites.includes(address) }))
        .sort((a, b): number => {
          const accA = keyring.getAccount(a.address);
          const accB = keyring.getAccount(b.address);

          return (accA.meta.whenCreated || 0) - (accB.meta.whenCreated || 0);
        })
        .sort((a, b): number =>
          a.isFavorite === b.isFavorite
            ? 0
            : b.isFavorite
              ? 1
              : -1
        )
    );
    api.derive.staking.estimateController(_accountChecked, (controllerId) => {
      setControllerId(controllerId?.toString())
    });
  }, [allAccounts, favorites, _accountChecked]);

  const _toggleCreate = (): void => setIsCreateOpen(!isCreateOpen);
  const _toggleImport = (): void => setIsImportOpen(!isImportOpen);
  const _toggleQr = (): void => setIsQrOpen(!isQrOpen);

  // const controllerId = useCall<AccountId>(api.derive.staking.estimateController, [_accountChecked]);
 
  return (
    <div className={className}>
      {hasAccounts ? <>
        <AccountStatus
          onStatusChange={onStatusChange}
          onToggleAccountChecked={toggleAccountChecked}
          accountChecked={_accountChecked}
        />
        <RowTitle title={t('Darwinia asset')} />
        <div>
          <div className="accountBox">
            <div>
              <div className="allvalueBox ring">
                <div className="logoBox">
                  <img className="logo" src={ringImg} />
                </div>
                <div>
                  <h1>{RING_PROPERTIES.tokenSymbol}</h1>
                  {/* <p className='ui--value'>{formatBalance(ringBalances_freeBalance)}</p> */}
                  <div className='ui--value'>
                    <Balance className="accountBox--all" label={''} params={_accountChecked} />
                  </div>
                </div>
              </div>
              <div className="info-bottom">
                <div className="ui--value-box">
                  <p className="p-title">{t('available')}:</p>
                  <div className="p-amount">
                    <Available params={_accountChecked} />
                  </div>
                  <p className="p-btn"><Button
                    isBasic={true}
                    // isSecondary={true}
                    label={t('Transfer')}
                    onClick={(): void => { toggleTransfer(); }}
                  /></p>
                </div>
              </div>
            </div>
            <div>
              <div className="allvalueBox kton">
                <div className="logoBox">
                  <img className="logo" src={ktonImg} />
                </div>
                <div>
                  <h1>{KTON_PROPERTIES.tokenSymbol}</h1>
                  <div className='ui--value'><BalanceKton className="accountBox--all" label={''} params={_accountChecked} /></div>
                </div>
              </div>
              <div className="info-bottom">
                <div className="ui--value-box">
                  <p className="p-title">{t('available')}:</p>
                  <div className="p-amount"><AvailableKton label={''} params={_accountChecked} /></div>
                  <p className="p-btn"><Button
                    isBasic={true}
                    // isSecondary={true}
                    label={t('Transfer')}
                    onClick={(): void => { toggleKtonTransfer(); }}
                  /></p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <StakingList
          account={_accountChecked}
          controllerId={controllerId}
        />
      </>
        : <div className='noAccount'>
          <img src={noAccountImg} />
          <p className='h1'>No account</p>
          <p>Please add an account and open your Darwinia Network Surfing</p>

          <Button
            isPrimary
            label={t('Add account')}
            onClick={_toggleCreate}
          />

          <Button
            isPrimary
            label={t('Restore JSON')}
            onClick={_toggleImport}
          />

        </div>}
      {isCreateOpen && (
        <CreateModal
          onClose={_toggleCreate}
          onStatusChange={onStatusChange}
        />
      )}
      {isImportOpen && (
        <ImportModal
          onClose={_toggleImport}
          onStatusChange={onStatusChange}
        />
      )}
      {isQrOpen && (
        <QrModal
          onClose={_toggleQr}
          onStatusChange={onStatusChange}
        />
      )}
      {isTransferOpen && (
        <Transfer
          key='modal-transfer'
          onClose={toggleTransfer}
          senderId={_accountChecked}
        />
      )}
      {isTransferKtonOpen && (
        <TransferKton
          key='modal-transfer'
          onClose={toggleKtonTransfer}
          senderId={_accountChecked}
        />
      )}
      {/* <Button.Group>
        <Button
          icon='add'
          isPrimary
          label={t('Add account')}
          onClick={_toggleCreate}
        />
        <Button.Or />
        <Button
          icon='sync'
          isPrimary
          label={t('Restore JSON')}
          onClick={_toggleImport}
        />
        <Button.Or />
        <Button
          icon='qrcode'
          isPrimary
          label={t('Add via Qr')}
          onClick={_toggleQr}
        />
        {isLedger() && (
          <>
            <Button.Or />
            <Button
              icon='question'
              isPrimary
              label={t('Query Ledger')}
              onClick={queryLedger}
            />
          </>
        )}
      </Button.Group> */}
      {/* {hasAccounts
        ? (
          <>
            <div className='filter--tags'>
              <Input
                autoFocus
                isFull
                label={t('filter by name or tags')}
                onChange={setFilter}
                value={filter}
              />
            </div>
            <Table>
              <Table.Body>
                {sortedAccounts.map(({ address, isFavorite }): React.ReactNode => (
                  <Account
                    address={address}
                    filter={filter}
                    isFavorite={isFavorite}
                    key={address}
                    toggleFavorite={toggleFavorite}
                  />
                ))}
              </Table.Body>
            </Table>
          </>
        )
        : <div className='noAccount'>
          <img src={noAccountImg} />
          <p className='h1'>No account</p>
          <p>Please add an account and open your Darwinia Network Surfing</p>

          <Button
            isPrimary
            label={t('Add account')}
            onClick={_toggleCreate}
          />

          <Button
            isPrimary
            label={t('Restore JSON')}
            onClick={_toggleImport}
          />

        </div>
      } */}
    </div>
  );
}

export default styled(Overview)`
  .filter--tags {
    .ui--Dropdown {
      padding-left: 0;

      label {
        left: 1.55rem;
      }
    }
  }
  .noAccount{
      margin: 200px auto 0 auto;
      width: 630px;
      text-align: center;
      border: 1px solid #EDEDED;
      padding: 80px 100px;
      color: #302b3c;
      background: #fff;
      img{
        margin-bottom: 30px;
      }
      .h1{
        font-size: 20px;
        font-weight: bold;
      }
      p{
        font-size: 14px;
        margin-bottom: 40px;
      }
      button+button{
        margin-left: 30px;
      }
    }

    @media (max-width: 767px) {
      .noAccount{
        width: auto;
        padding: 40px 0px;
      }
    }

    .accountBox {
      align-items: flex-start;
      display: flex;
      flex: 1;
      justify-content: center;
      flex-wrap: wrap;
      margin: -10px;
      margin-bottom: 20px;
      .accountBox--all{
        font-size: 21px;
        color: #fff;
        font-weight: bold;
      }
      &>div{
        flex: 1;
        border: 1px solid #EDEDED;
        background: #fff;
        margin:10px;
        min-width: 430px;
      }
      .ui--value{
        font-weight: bold;
      }
      .ui--value-box+.ui--value-box{
        margin-top: 20px;
      }
      .ui--value-box {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        font-weight: bold;
        p{
          margin-bottom: 0;
          color: #98959F;
        }
        .p-title{
          flex-basis: 103px;
        }
        .p-amount{
          flex: 1;
          text-align: left;
          color: #302B3C;
          font-size: 16px;
        }
        .p-grey{
          color: #98959F;
        }
        .p-btn{

        }
        button{
          width: 110px;
          padding: 8px 0px;
          font-weight: bold!important;
        }
      }

      .logoBox{
        margin-right: 18px;
        width: 71px;
        height: 71px;
        border-radius: 36px;
        background: #fff;
        display:flex;
        justify-content: center;
        align-items: center;
      }

      .logo{
        width: 46px;
        height: 46px;
      }

      .allvalueBox.ring {
        background:linear-gradient(315deg,#B8C2EB 0%,#6E809E 100%);
      }

      .allvalueBox.kton {
        background:linear-gradient(315deg,rgba(74,202,120,1) 0%,rgba(79,164,105,1) 100%);
      }
      
      .allvalueBox {
        display: flex;
        flex-direction: row;
        align-items: center;
        background: #fbfbfb;
        padding: 11px 25px 11px 35px;
        border-bottom: 1px solid #EDEDED;

        h1{
          font-size: 24px;
          font-weight: bold;
          margin-bottom: 0px;
          text-transform: uppercase;
          color: #fff;
        }
        p{
          color: #fff;
          font-size: 18px;
        }
      }

      .info-bottom{
        padding: 23px 25px 23px 58px;
      }

      .column {
        flex: 1;
        display: grid;
        opacity: 1;

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

          .iconButton {
            padding-left: 0!important;
          }

          i.info.circle.icon {
            margin-left: .3em;
          }
        }
      }

      @media (max-width: 767px) {
        .allvalueBox {
          padding: 10px;
        }
        
        .info-bottom {
          padding: 23px 10px;
        }

        &>div{
          min-width: 320px;
        }

        .ui--value-box {
          button{
            width: 90px;
          }
        }
      }
    }
    
`;
