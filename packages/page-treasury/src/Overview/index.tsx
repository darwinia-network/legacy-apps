// Copyright 2017-2020 @polkadot/app-treasury authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { SubmittableExtrinsic } from '@polkadot/api/types';

import BN from 'bn.js';
import { DeriveTreasuryProposals } from '@polkadot/api-derive/types';
import { BareProps as Props } from '@polkadot/react-components/types';

import React, { useCallback, useMemo, useState, useEffect } from 'react';
import { Button } from '@polkadot/react-components';
import { useApi, useCall, useIncrement, useMembers, useIsMountedRef, useAccounts } from '@polkadot/react-hooks';

import ProposalCreate from './ProposalCreate';
import Proposals from './Proposals';
import Summary from './Summary';
import TipCreate from './TipCreate';
import Tips from './Tips';

interface QuickTipsState {
  quickTips: Record<string, BN | null>;
  quickTx: SubmittableExtrinsic<'promise'> | null;
}

function Overview ({ className }: Props): React.ReactElement<Props> {
  const { api } = useApi();
  const { allAccounts } = useAccounts();
  const [{ quickTx }, setQuickTips] = useState<QuickTipsState>({ quickTips: {}, quickTx: null });
  const info = useCall<DeriveTreasuryProposals>(api.derive.treasury.proposals, []);
  const { isMember, members } = useMembers();

  const mountedRef = useIsMountedRef();
  const [hashTrigger, triggerHashes] = useIncrement();
  const [hashes, setHashes] = useState<string[] | null>(null);

  const defaultId = useMemo(
    () => members.find((memberId) => allAccounts.includes(memberId)) || null,
    [allAccounts, members]
  );

  const _selectTip = useCallback(
    (hash: string, isSelected: boolean, value: BN) => setQuickTips(({ quickTips }): QuickTipsState => {
      quickTips[hash] = isSelected ? value : null;

      const available = Object
        .entries(quickTips)
        .map(([hash, value]) => value ? (api.tx.tips || api.tx.treasury).tip(hash, value) : null)
        .filter((value): value is SubmittableExtrinsic<'promise'> => !!value);

      return {
        quickTips,
        quickTx: available.length
          ? available.length === 1
            ? available[0]
            : api.tx.utility.batch(available)
          : null
      };
    }),
    [api]
  );

  useEffect((): void => {
    if (hashTrigger && mountedRef.current) {
      (api.query.tips || api.query.treasury).tips.keys().then((keys) =>
        mountedRef.current && setHashes(
          keys.map((key) => key.args[0].toHex())
        )
      );
    }
  }, [api, hashTrigger, mountedRef]);

  return (
    <div className={className}>
      <Summary
        approvalCount={info?.approvals.length}
        proposalCount={info?.proposals.length}
      />
      <Button.Group>
        <ProposalCreate />
        <TipCreate
          members={members}
          refresh={triggerHashes}
        />
      </Button.Group>
      <Proposals
        isMember={isMember}
        members={members}
        proposals={info?.proposals}
      />
      <Proposals
        isApprovals
        isMember={isMember}
        members={members}
        proposals={info?.approvals}
      />
      <Tips
        defaultId={defaultId}
        hashes={hashes}
        isMember={isMember}
        members={members}
        onSelectTip={_selectTip}
      />
    </div>
  );
}

export default React.memo(Overview);
