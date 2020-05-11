// Copyright 2017-2020 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { KeyringAddress } from '@polkadot/ui-keyring/types';
import { ComponentProps as Props, ModalProps } from './types';

import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import keyring from '@polkadot/ui-keyring';
import { getLedger, isLedger } from '@polkadot/react-api';
import { useAccounts, useFavorites, useAccountChecked } from '@polkadot/react-hooks';
import { Button, Input, Table, Modal } from '@polkadot/react-components';
import { I18nProps } from '@polkadot/react-components/types';

import CreateModal from './modals/Create';
import ImportModal from './modals/Import';
import QrModal from './modals/Qr';
import Account from './AccountListItem';
import Banner from './Banner';
import { useTranslation } from './translate';
import noAccountImg from './img/noAccount.svg';

import store from 'store';

interface Props extends ModalProps, I18nProps {
  onToggleAccountChecked: (address: string) => void;
  accountChecked: string;
}

type SortedAccount = { address: string; isFavorite: boolean };

const STORE_FAVS = 'accounts:favorites';

function AccountList ({ className, onStatusChange, onClose, accountChecked, onToggleAccountChecked }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { allAccounts, hasAccounts } = useAccounts();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [isQrOpen, setIsQrOpen] = useState(false);
  const [favorites, toggleFavorite] = useFavorites(STORE_FAVS);
  const [sortedAccounts, setSortedAccounts] = useState<SortedAccount[]>([]);
  const [filter, setFilter] = useState<string>('');

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
  }, [allAccounts, favorites]);

  const _toggleCreate = (): void => setIsCreateOpen(!isCreateOpen);
  const _toggleImport = (): void => setIsImportOpen(!isImportOpen);
  const _toggleQr = (): void => setIsQrOpen(!isQrOpen);

  return (
    <Modal onCancel={onClose}>
      <Wrapper className={className}>

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
        {hasAccounts
          ? (
            <>
              <div className={'overviewTab'}>
                <div>
                  <p>{t('Choose account')}</p>
                </div>
                <div>
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
              </div>
              {/* <div className='filter--tags'>
                <Input
                  autoFocus
                  isFull
                  label={t('filter by name or tags')}
                  onChange={setFilter}
                  value={filter}
                />
              </div> */}
              <Table>
                <Table.Body>
                  {sortedAccounts.map(({ address, isFavorite }): React.ReactNode => (
                    <Account
                      address={address}
                      filter={filter}
                      isFavorite={isFavorite}
                      isAccountChecked={accountChecked === address}
                      key={address}
                      toggleFavorite={toggleFavorite}
                      onToggleAccountChecked={onToggleAccountChecked}
                    />
                  ))}
                </Table.Body>
              </Table>
            </>
          )
          : <div className='noAccount'>
            <img src={noAccountImg} />
            <p className='h1'>{t('No account')}</p>
            <p>{t('Please add an account and open your Darwinia Network Surfing')}</p>

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
        }
      </Wrapper>
    </Modal>
  );
}

const Wrapper = styled.div`
  .overviewTab{
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 20px 15px 20px;
    margin: 0;
    p{
      font-size: 20px;
      color: #302B3C;
    }
  }

  .account-box{
    width: 100%;
  }

  .account-item{
    padding: 15px 58px 15px 20px;
    border-top: 1px solid rgba(237,237,237,1);
  }

  .account-item:last-child{
    border-bottom: 1px solid rgba(237,237,237,1);
  }

  @media (max-width: 767px) {
    .overviewTab{
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px;
    margin: 0;
    .ui.primary.button {
      margin-right: 5px;
    }

    p{
      font-size: 16px;
      color: #302B3C;
    }
  }
  }
`;

export default styled(AccountList)`
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
`;
