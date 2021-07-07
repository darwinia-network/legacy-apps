// Copyright 2017-2020 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BlockNumber, Scheduled } from '@polkadot/types/interfaces';
import { ScheduledExt } from './types';

import React, { useRef } from 'react';
import { Table } from '@polkadot/react-components';
import { useApi, useCall } from '@polkadot/react-hooks';
import { Option, StorageKey } from '@polkadot/types';

import { useTranslation } from '../translate';
import ScheduledView from './Scheduled';

interface Props {
  className?: string;
}

const transformKeys = {
  transform: (entries: StorageKey[]): BlockNumber[] => entries
    .map((key) => key.args[0] as BlockNumber)
    .filter((blockNumber) => (blockNumber.toString() !== '2332800'))
};

const transformEntries = {
  withParams: true,
  transform: (entries: Option<Scheduled>[][]): ScheduledExt[] => {
    return entries
      .filter((vecSchedOpt) => vecSchedOpt.some((schedOpt) => schedOpt.isSome))
      .reduce((items: ScheduledExt[], vecSchedOpt): ScheduledExt[] => {
        return vecSchedOpt
          .filter((schedOpt) => schedOpt.isSome)
          .map((schedOpt) => schedOpt.unwrap())
          .reduce((items: ScheduledExt[], { call, maybeId, maybePeriodic, priority }, index) => {
            items.push({ call, index, maybeId, maybePeriodic, priority });

            return items;
          }, items);
      }, []);
  }
};

function Schedule ({ className = '' }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();

  const headerRef = useRef([
    [t('scheduled'), 'start'],
    [t('id'), 'start'],
    [t('remaining')],
    [t('period')],
    [t('count')]
  ]);

  const blockNumbers = useCall<BlockNumber[]>(api.query.scheduler.agenda.keys, undefined, transformKeys);

  const items = useCall<[BlockNumber[], ScheduledExt[]]>(api.query.scheduler.agenda.multi, (!blockNumbers || blockNumbers?.length === 0) ? [] : [blockNumbers], transformEntries) || [];

  return (
    <Table
      className={className}
      empty={(!items || items?.length === 0) && t<string>('No active schedules')}
      header={headerRef.current}
    >
      {items[1]?.map((scheduled: ScheduledExt, index: number): React.ReactNode => (
        <ScheduledView
          blockNumber={items[0][0][index]}
          key={`${items[0][0][index]}${scheduled.index}`}
          value={scheduled}
        />
      ))}
    </Table>
  );
}

export default React.memo(Schedule);
