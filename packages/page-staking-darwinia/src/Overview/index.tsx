// Copyright 2017-2020 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DeriveHeartbeats, DeriveStakingOverview } from '@polkadot/api-derive/types';
import { BareProps } from '@polkadot/react-components/types';
import { RowTitle } from '@polkadot/react-darwinia/components';

import React, { useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { BlockAuthorsContext } from '@polkadot/react-query';
import { useTranslation } from '../translate';

import CurrentList from './CurrentList';

interface Props extends BareProps {
  hasQueries: boolean;
  isVisible: boolean;
  recentlyOnline?: DeriveHeartbeats;
  next: string[];
  setNominators: (nominators: string[]) => void;
  stakingOverview?: DeriveStakingOverview;
}

export default function Overview ({ className, hasQueries, isVisible, next, recentlyOnline, setNominators, stakingOverview }: Props): React.ReactElement<Props> {
  const { pathname } = useLocation();
  const { t } = useTranslation();
  const { byAuthor, lastBlockAuthors } = useContext(BlockAuthorsContext);
  const isIntentions = pathname !== '/scan';

  return (
    <div className={`staking--Overview ${className} ${!isVisible && 'staking--hidden'}`}>
      <div>
        <RowTitle title={t('Validators')} />
        <CurrentList
          authorsMap={byAuthor}
          hasQueries={hasQueries}
          isIntentions={false}
          isVisible={isVisible}
          lastAuthors={lastBlockAuthors}
          next={next}
          recentlyOnline={recentlyOnline}
          setNominators={setNominators}
          stakingOverview={stakingOverview}
        />
      </div>
      <div>
        <RowTitle title={t('Waiting')} />
        <CurrentList
          authorsMap={byAuthor}
          hasQueries={hasQueries}
          isIntentions={true}
          isVisible={isVisible}
          lastAuthors={lastBlockAuthors}
          next={next}
          recentlyOnline={recentlyOnline}
          setNominators={setNominators}
          stakingOverview={stakingOverview}
        />
      </div>
    </div>
  );
}
