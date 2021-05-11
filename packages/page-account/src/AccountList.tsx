// Copyright 2017-2020 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ComponentProps as Props, ModalProps } from './types';

import React, { useEffect, useState, useCallback } from 'react';
import styled from 'styled-components';
import keyring from '@polkadot/ui-keyring';
import { useAccounts, useFavorites } from '@polkadot/react-hooks';
import { Button, Table, Modal } from '@polkadot/react-components-darwinia';
import { I18nProps } from '@polkadot/react-components/types';
import BN from 'bn.js';
import { BN_ZERO } from '@polkadot/util';
import { FormatBalance } from '@polkadot/react-query';

import CreateModal from './modals/Create';
import ImportModal from './modals/Import';
import QrModal from './modals/Qr';
import Account from './AccountListItem';
import { useTranslation } from './translate';
import noAccountImg from './img/noAccount.svg';
import { RING_PROPERTIES, KTON_PROPERTIES } from '@polkadot/react-darwinia';

interface Balances {
  accounts: Record<string, BN[]>;
  balanceTotal?: BN;
  balanceKtonTotal?: BN;
  availableBalanceTotal?: BN;
  availableBalanceKtonTotal?: BN;
}

interface Props extends ModalProps, I18nProps {
  onToggleAccountChecked: (address: string) => void;
  accountChecked: string;
}

type SortedAccount = { address: string; isFavorite: boolean };

const STORE_FAVS = 'accounts:favorites';

function AccountList ({ accountChecked, className, onClose, onStatusChange, onToggleAccountChecked }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { allAccounts, hasAccounts } = useAccounts();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [isQrOpen, setIsQrOpen] = useState(false);
  const [favorites, toggleFavorite] = useFavorites(STORE_FAVS);
  const [sortedAccounts, setSortedAccounts] = useState<SortedAccount[]>([]);
  const [filter, setFilter] = useState<string>('');
  const [{ accounts, availableBalanceKtonTotal, availableBalanceTotal, balanceKtonTotal, balanceTotal }, setBalances] = useState<Balances>({ accounts: {} });

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

  const _setBalance = useCallback(
    (account: string, balance: BN[]) => {
      accounts[account] = balance;

      if (sortedAccounts.length === Object.values(accounts).length) {
        setBalances(({ accounts }: Balances): Balances => {
          return {
            accounts,
            balanceTotal: Object.values(accounts).reduce((total: BN, value: BN[]) => total.add(value[0]), BN_ZERO),
            balanceKtonTotal: Object.values(accounts).reduce((total: BN, value: BN[]) => total.add(value[1]), BN_ZERO),
            availableBalanceTotal: Object.values(accounts).reduce((total: BN, value: BN[]) => total.add(value[2]), BN_ZERO),
            availableBalanceKtonTotal: Object.values(accounts).reduce((total: BN, value: BN[]) => total.add(value[3]), BN_ZERO)
          };
        });
      }
    },
    [accounts, sortedAccounts]
  );

  const _toggleCreate = useCallback((): void => setIsCreateOpen(!isCreateOpen), [isCreateOpen]);
  const _toggleImport = useCallback((): void => setIsImportOpen(!isImportOpen), [isImportOpen]);
  const _toggleQr = useCallback((): void => setIsQrOpen(!isQrOpen), [isQrOpen]);

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
                      isAccountChecked={accountChecked === address}
                      isFavorite={isFavorite}
                      key={address}
                      onToggleAccountChecked={onToggleAccountChecked}
                      setBalance={_setBalance}
                      toggleFavorite={toggleFavorite}
                    />
                  ))}
                  {sortedAccounts.length > 1 ? <tr className='total'>
                  <td>{t('Total')}</td>
                    <td className='middle'>
                      <FormatBalance label={`${RING_PROPERTIES.tokenSymbol}: `}
                        value={balanceTotal} />
                      <p className='avaliableBalance'>
                        <FormatBalance label={`${t('transferrable')}: `}
                          value={availableBalanceTotal} />
                      </p>
                    </td>
                    <td className='middle'>
                      <FormatBalance label={`${KTON_PROPERTIES.tokenSymbol}: `}
                        value={balanceKtonTotal}/>
                      <p className='avaliableBalance'>
                        <FormatBalance label={`${t('transferrable')}: `}
                          value={availableBalanceKtonTotal}/>
                      </p>
                    </td>
                    <td></td>

                  </tr> : null}
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


  .middle {
    padding: 1.07142rem 1.02857rem;
    .avaliableBalance {
      margin-top: 5px;
      color: #959595;
      font-size: 12px;
    }
  }

  .total {
    td {
      border-bottom: 0;
      background: transparent !important;
    }
  }
`;
