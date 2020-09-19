// Copyright 2017-2020 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { KeyringAddress } from '@polkadot/ui-keyring/types';
import { ComponentProps } from './types';

import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import keyring from '@polkadot/ui-keyring';
import { getLedger } from '@polkadot/react-api';
import { useAccounts, useFavorites, useApi } from '@polkadot/react-hooks';
import { AddressRow } from '@polkadot/react-components';
import { ActionStatus } from '@polkadot/react-components/Status/types';

import CreateModal from './modals/Create';
import ImportModal from './modals/Import';
import QrModal from './modals/Qr';
import AccountList from './AccountList';
import { useTranslation } from './translate';
import SwitchIcon from './img/switchAccount.svg';

interface Props {
  onStatusChange: (status: ActionStatus) => void;
  onToggleAccountChecked: (address: string) => void;
  accountChecked: string;
}

type SortedAccount = { address: string; isFavorite: boolean };

const STORE_FAVS = 'accounts:favorites';

// query the ledger for the address, adding it to the keyring
async function queryLedger (): Promise<void> {
  const ledger = getLedger();

  try {
    const { address } = await ledger.getAddress();

    keyring.addHardware(address, 'ledger', { name: 'ledger' });
  } catch (error) {
    console.error(error);
  }
}

function hackParseSystemChain (systemChain: string): string {
  if (systemChain === 'Crab' || systemChain === 'crab') {
    return 'Darwinia Crab';
  }

  return systemChain;
}

function AccountStatus ({ accountChecked, className, onStatusChange, onToggleAccountChecked }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { allAccounts, hasAccounts } = useAccounts();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [isAccountListOpen, setIsAccountListOpen] = useState(false);
  const [isQrOpen, setIsQrOpen] = useState(false);
  const [favorites, toggleFavorite] = useFavorites(STORE_FAVS);
  const [sortedAccounts, setSortedAccounts] = useState<SortedAccount[]>([]);
  const { systemChain } = useApi();

  useEffect((): void => {
    setSortedAccounts(
      allAccounts
        .map((address): SortedAccount => ({ address, isFavorite: favorites.includes(address) }))
        .sort((a, b): number => {
          const accA = keyring.getAccount(a.address) as KeyringAddress;
          const accB = keyring.getAccount(b.address) as KeyringAddress;

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
  const _toggleAccountList = (): void => setIsAccountListOpen(!isAccountListOpen);
  const _toggleQr = (): void => setIsQrOpen(!isQrOpen);

  return (
    <div className={className}>
      {/* <Banner /> */}
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
      {isAccountListOpen && (
        <AccountList
          accountChecked={accountChecked}
          onClose={_toggleAccountList}
          onStatusChange={onStatusChange}
          onToggleAccountChecked={onToggleAccountChecked}
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
          <StyledWrapper>
            <div className='ui--AccountStatus-Box'>
              <div className='ui--AccountStatus-Network'>
                <span>•</span><span>{hackParseSystemChain(systemChain)} {t('Network')}</span>
              </div>
              <AddressRow
                className='ui--AccountStatus-Address'
                isEditable={true}
                value={accountChecked}
              // withExplorer
              // withIndex
              // withTags
              >
              </AddressRow>
              <div><img className='switchBtn'
                onClick={_toggleAccountList}
                src={SwitchIcon} /></div>
            </div>
          </StyledWrapper>
        )
        : null
      }
    </div>
  );
}

const StyledWrapper = styled.div`
  background: #fff;
  padding: 4px 0 0px 2rem;
  margin: 0 -2rem;
  border-bottom: 1px solid rgba(237,237,237,1);

  @media (max-width: 767px) {
    padding: 0 0.5rem;
    margin: 0 0;
    .ui--AccountStatus-Address{
      display: none;
    }
  }

  .ui--AccountStatus-Box{
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .ui--AccountStatus-Network{
    color: #8231D8;
    font-size: 14px;
    font-weight: bold;
    flex: 1;
    span{
      margin-right: .5rem;
    }
  }
  button{
    background-color: transparent!important;
  }
  .accounts--Account-buttons{
    padding: 40px;
  }
  .switchBtn{
    margin-left: 16px;
    cursor: pointer;
  }
`;

export default styled(AccountStatus)`
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
