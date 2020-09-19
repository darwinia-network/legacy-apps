// Copyright 2017-2020 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Balance } from '@polkadot/types/interfaces';

import BN from 'bn.js';
import React, { useEffect, useState } from 'react';
import { SummaryBox, CardSummary } from '@polkadot/react-components';
import { useApi, useCall } from '@polkadot/react-hooks';
import { FormatBalance, FormatKtonBalance } from '@polkadot/react-query';
import { formatNumber } from '@polkadot/util';
import { RING_PROPERTIES, KTON_PROPERTIES } from '@polkadot/react-darwinia';

import { useTranslation } from '../translate';

interface Props {
  lastReward?: BN;
  numNominators?: number;
  numValidators?: number;
  totalStaked?: BN;
}

function capitalize (s: string): string {
  if (typeof s !== 'string') return '';

  return s.charAt(0).toUpperCase() + s.slice(1);
}

function Summary ({ lastReward, numNominators, numValidators, totalStaked }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const totalIssuance = useCall<Balance>(api.query.balances?.totalIssuance, []);
  const totalIssuanceKton = useCall<Balance>(api.query.kton?.totalIssuance, []);
  // const [percentage, setPercentage] = useState<string | undefined>();

  // useEffect((): void => {
  //   totalIssuance && totalStaked?.gtn(0) && setPercentage(
  //     `${(totalStaked.muln(10000).div(totalIssuance).toNumber() / 100).toFixed(2)}%`
  //   );
  // }, [totalIssuance, totalStaked]);

  return (
    <SummaryBox>
      <section className='ui--media-small'>
        {totalStaked && (
          <CardSummary label={t('total staked')}>
            {formatNumber(totalStaked)}
          </CardSummary>
        )}
        {totalStaked && totalIssuance && (
          <CardSummary label=''>/</CardSummary>
        )}
        {totalIssuance && (
          <CardSummary label={`${t('total issuance')}(${capitalize(RING_PROPERTIES.tokenSymbol.toLocaleLowerCase())})`}>
            <FormatBalance
              value={totalIssuance}
              withSi
            />
          </CardSummary>
        )}
        {totalIssuanceKton && (
          <CardSummary label={`${t('total issuance')}(${capitalize(KTON_PROPERTIES.tokenSymbol.toLocaleLowerCase())})`}>
            <FormatKtonBalance
              value={totalIssuanceKton}
              withSi
            />
          </CardSummary>
        )}
      </section>
      {/* {percentage && (
        <CardSummary label={t('staked')}>
          {percentage}
        </CardSummary>
      )} */}
      {(numValidators && numNominators) ? (
        <CardSummary label={t('validators/nominators')}>
          {numValidators}/{numNominators}
        </CardSummary>
      ) : null}
      {lastReward?.gtn(0) && (
        <CardSummary label={`${t('last reward')}(${capitalize(RING_PROPERTIES.tokenSymbol.toLocaleLowerCase())})`}>
          <FormatBalance
            value={lastReward}
            withSi
          />
        </CardSummary>
      )}
    </SummaryBox>
  );
}

export default React.memo(Summary);
