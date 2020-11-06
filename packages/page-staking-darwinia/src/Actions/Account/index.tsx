// Copyright 2017-2020 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { SubmittableExtrinsic } from '@polkadot/api/types';
import { DeriveBalancesAll, DeriveStakingAccount, DeriveStakingOverview as DerivedStakingOverview, DeriveHeartbeats as DerivedHeartbeats, DeriveStakingQuery as DerivedStakingQuery, DeriveStakerReward } from '@polkadot/api-derive/types';
import { AccountId, EraIndex, Exposure, StakingLedger, ValidatorPrefs, RewardDestination, Balance } from '@polkadot/types/interfaces';
import { Codec, ITuple } from '@polkadot/types/types';

import React, { useCallback, useEffect, useState, useContext } from 'react';
import styled from 'styled-components';
import { AddressSmall, Button, Menu, Popup, TxButton, StatusContext } from '@polkadot/react-components';
import { Table } from '@polkadot/react-components-darwinia';
import { useAccounts, useApi, useCall, useToggle, useOwnEraRewards } from '@polkadot/react-hooks';
import { u8aConcat, u8aToHex, formatNumber } from '@polkadot/util';
import { RowTitle, Box } from '@polkadot/react-darwinia/components';
import Identity from '@polkadot/app-account/modals/Identity';
import { ApiPromise } from '@polkadot/api';
import BN from 'bn.js';
import { Trans } from 'react-i18next';
import { FormatBalance } from '@polkadot/react-query';

import { useTranslation } from '../../translate';
import BondExtra from './BondExtra';
import InjectKeys from './InjectKeys';
import Nominate from './Nominate';
import SetControllerAccount from './SetControllerAccount';
import SetRewardDestination from './SetRewardDestination';
import SetSessionKey from './SetSessionKey';
import Unbond from './Unbond';
import Validate from './Validate';
import useInactives from './useInactives';
import PowerManage from './PowerManage';
import Earnings from './Earnings';
import { PayoutValidator } from '../../Payouts/types';
import useStakerPayouts from '../../Payouts/useStakerPayouts';
import { IndividualExposure, Power } from '@darwinia/typegen/interfaces';
import { DestinationType } from '../NewStake';

type ValidatorInfo = ITuple<[ValidatorPrefs, Codec]>;

interface Props {
  allStashes?: string[];
  className?: string;
  isOwnStash: boolean;
  next: string[];
  onUpdateType: (stashId: string, type: 'validator' | 'nominator' | 'started' | 'other') => void;
  recentlyOnline?: DerivedHeartbeats;
  stakingOverview?: DerivedStakingOverview;
  stashId: string;
  isInElection: boolean;
}

interface StakeState {
  controllerId: string | null;
  destination: DestinationType;
  destAccount: string | null;
  exposure?: Exposure;
  hexSessionIdNext: string | null;
  hexSessionIdQueue: string | null;
  isLoading: boolean;
  isOwnController: boolean;
  isStashNominating: boolean;
  isStashValidating: boolean;
  nominees?: string[];
  sessionIds: string[];
  stakingLedger?: StakingLedger;
  validatorPrefs?: ValidatorPrefs;
}

const payoutMaxAmount = 30;

interface Available {
  validators?: PayoutValidator[];
}

function toIdString (id?: AccountId | null): string | null {
  return id
    ? id.toString()
    : null;
}

function getStakeState (allAccounts: string[], allStashes: string[] | undefined, { controllerId: _controllerId, exposure, nextSessionIds, nominators, rewardDestination, sessionIds, stakingLedger, validatorPrefs }: DeriveStakingAccount, stashId: string, validateInfo: ValidatorInfo): StakeState {
  const isStashNominating = !!(nominators?.length);
  const isStashValidating = !(Array.isArray(validateInfo) ? validateInfo[1].isEmpty : validateInfo.isEmpty) || !!allStashes?.includes(stashId);
  const nextConcat = u8aConcat(...nextSessionIds.map((id): Uint8Array => id.toU8a()));
  const currConcat = u8aConcat(...sessionIds.map((id): Uint8Array => id.toU8a()));
  const controllerId = toIdString(_controllerId);

  return {
    controllerId,
    destination: (rewardDestination?.isAccount ? 'Account' : rewardDestination?.toString() || 'Staked') as 'Staked',
    destAccount: rewardDestination?.isAccount ? rewardDestination.asAccount.toString() : null,
    exposure,
    hexSessionIdNext: u8aToHex(nextConcat, 48),
    hexSessionIdQueue: u8aToHex(currConcat.length ? currConcat : nextConcat, 48),
    isLoading: false,
    isOwnController: allAccounts.includes(controllerId || ''),
    isStashNominating,
    isStashValidating,
    // we assume that all ids are non-null
    nominees: nominators?.map(toIdString) as string[],
    sessionIds: (
      nextSessionIds.length
        ? nextSessionIds
        : sessionIds
    ).map(toIdString) as string[],
    stakingLedger,
    validatorPrefs
  };
}

function groupByValidator (allRewards: Record<string, DeriveStakerReward[]>, stakerPayoutsAfter: BN): PayoutValidator[] {
  return Object
    .entries(allRewards)
    .reduce((grouped: PayoutValidator[], [stashId, rewards]): PayoutValidator[] => {
      rewards
        .filter(({ era }) => era.gte(stakerPayoutsAfter))
        .forEach((reward): void => {
          Object
            .entries(reward.validators)
            .forEach(([validatorId, { value }]): void => {
              const entry = grouped.find((entry) => entry.validatorId === validatorId);

              if (entry) {
                const eraEntry = entry.eras.find((entry) => entry.era.eq(reward.era));

                if (eraEntry) {
                  eraEntry.stashes[stashId] = value;
                } else {
                  entry.eras.push({
                    era: reward.era,
                    stashes: { [stashId]: value }
                  });
                }

                entry.available = entry.available.add(value);
              } else {
                grouped.push({
                  available: value,
                  eras: [{
                    era: reward.era,
                    stashes: { [stashId]: value }
                  }],
                  validatorId
                });
              }
            });
        });

      return grouped;
    }, [])
    .sort((a, b) => b.available.cmp(a.available));
}

function createPayout (api: ApiPromise, payout: PayoutValidator | PayoutValidator[]): SubmittableExtrinsic<'promise'> {
  if (Array.isArray(payout)) {
    if (payout.length === 1) {
      return createPayout(api, payout[0]);
    }

    const calls = payout.reduce((calls: SubmittableExtrinsic<'promise'>[], { eras, validatorId }): SubmittableExtrinsic<'promise'>[] =>
      calls.concat(
        ...eras.map(({ era }) => api.tx.staking.payoutStakers(validatorId, era))
      ), []);

    if (calls.length > payoutMaxAmount) {
      calls.length = payoutMaxAmount;
    }

    return api.tx.utility.batch(calls);
  }

  const { eras, validatorId } = payout;

  const limitEras = eras.slice(0, payoutMaxAmount);

  return eras.length === 1
    ? api.tx.staking.payoutStakers(validatorId, eras[0].era)
    : api.tx.utility.batch(
      limitEras.map(({ era }) => api.tx.staking.payoutStakers(validatorId, era))
    );
}

function Account ({ allStashes, className, isInElection, isOwnStash, next, onUpdateType, stakingOverview, stashId }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { queueExtrinsic } = useContext(StatusContext);
  const { api } = useApi();
  const { allAccounts } = useAccounts();
  const validateInfo = useCall<ValidatorInfo>(api.query.staking.validators, [stashId]);
  const balancesAll = useCall<DeriveBalancesAll>(api.derive.balances.all as any, [stashId]);
  const stakingAccount = useCall<DeriveStakingAccount>(api.derive.staking.account as any, [stashId]);
  const [[payoutEras, payoutTotal], setStakingRewards] = useState<[EraIndex[], BN]>([[], new BN(0)]);
  const stakingInfo = useCall<DerivedStakingQuery>(api.derive.staking.query as any, [stashId]);
  const [{ controllerId, destAccount, destination, hexSessionIdNext, hexSessionIdQueue, isLoading, isOwnController, isStashNominating, isStashValidating, nominees, sessionIds, stakingLedger, validatorPrefs }, setStakeState] = useState<StakeState>({ controllerId: null, destination: 'Staked', hexSessionIdNext: null, destAccount: '', hexSessionIdQueue: null, isLoading: true, isOwnController: false, isStashNominating: false, isStashValidating: false, stakingLedger: null, sessionIds: [] });
  const [activeNoms, setActiveNoms] = useState<string[]>([]);
  const inactiveNoms = useInactives(stashId, nominees);
  const stakingInfoMulti = useCall<DerivedStakingQuery[]>(api.derive.staking.queryMulti as any, [nominees || []]);
  const [nomsPower, setNomsPower] = useState<(IndividualExposure | null)[]>([]);
  const [isBondExtraOpen, toggleBondExtra] = useToggle();
  const [isInjectOpen, toggleInject] = useToggle();
  const [isNominateOpen, toggleNominate] = useToggle();
  const [isRewardDestinationOpen, toggleRewardDestination] = useToggle();
  const [isSetControllerOpen, toggleSetController] = useToggle();
  const [isSetSessionOpen, toggleSetSession] = useToggle();
  const [isSettingsOpen, toggleSettings] = useToggle();
  const [isUnbondOpen, toggleUnbond] = useToggle();
  const [isValidateOpen, toggleValidate] = useToggle();
  const [isIdentityOpen, toggleIdentity] = useToggle();
  const [nominators, setNominators] = useState<[string, Power][]>([]);
  const [payoutsAmount, setPayoutsAmount] = useState<number>(0);
  const [{ validators }, setPayouts] = useState<Available>({});
  const stakerPayoutsAfter = useStakerPayouts();
  const { allRewards: rewards } = useOwnEraRewards([stashId]);
  const isPayoutEmpty = !validators || (Array.isArray(validators) && validators.length === 0);

  // useEffect((): void => {
  //   if (!isPayoutEmpty) {
  //     const amount = validators?.reduce((total: number, validator: PayoutValidator) => {
  //       return total + validator.eras.length;
  //     }, 0);
  //     // setPayoutsAmount(amount);
  //   }
  // }, [validators]);

  useEffect((): void => {
    if (stakingInfoMulti) {
      const power = stakingInfoMulti.map((stakingInfo: DerivedStakingQuery) => {
        return (stakingInfo && stakingInfo.exposure)
          ? stakingInfo.exposure.others.filter((nominator) => nominator.who.eq(stashId))[0]
          : null;
      });

      setNomsPower(power);
    }
  }, [stakingInfoMulti, stashId]);

  useEffect((): void => {
    if (rewards) {
      setPayouts({
        validators: groupByValidator(rewards, stakerPayoutsAfter)
      });
    }
  }, [rewards, stakerPayoutsAfter]);

  useEffect((): void => {
    if (stakingAccount && validateInfo) {
      const state = getStakeState(allAccounts, allStashes, stakingAccount, stashId, validateInfo);

      setStakeState(state);

      if (state.isStashValidating) {
        onUpdateType(stashId, 'validator');
      } else if (state.isStashNominating) {
        onUpdateType(stashId, 'nominator');
      } else {
        onUpdateType(stashId, 'other');
      }
    }
  }, [allStashes, stakingAccount, stashId, validateInfo]);

  useEffect((): void => {
    if (nominees) {
      setActiveNoms(nominees.filter((id): boolean => !inactiveNoms.includes(id)));
    }
  }, [inactiveNoms, nominees]);

  useEffect((): void => {
    let payoutsAmount = 0;

    rewards && setStakingRewards([
      rewards[stashId].map(({ era }): EraIndex => era),
      rewards[stashId].reduce((result, { validators }) => {
        const eraTotalList: Balance[] = Object.keys(validators).map((validatorId: string): Balance => {
          payoutsAmount++;

          return validators[validatorId].value;
        });

        const eraTotal = eraTotalList.reduce((total, item) => {
          return total.iadd(item);
        }, new BN(0));

        return result.iadd(eraTotal);
      }, new BN(0))
    ]);

    setPayoutsAmount(payoutsAmount);
  }, [rewards, stashId]);

  useEffect((): void => {
    if (stakingInfo) {
      const { exposure } = stakingInfo;
      const nominators = exposure
        ? exposure.others.map(({ power, who }): [string, Power] => [toIdString(who), power])
        : [];

      setNominators(nominators);
    }
  }, [stakingInfo]);

  const _doPayout = useCallback(
    (): void => {
      return queueExtrinsic({
        accountId: controllerId,
        extrinsic: createPayout(api, validators)
      });
    },
    [api, controllerId, validators, queueExtrinsic]
  );

  return (
    <div className={className}>

      <BondExtra
        controllerId={controllerId}
        isOpen={isBondExtraOpen}
        onClose={toggleBondExtra}
        stashId={stashId}
      />
      <Unbond
        controllerId={controllerId}
        isOpen={isUnbondOpen}
        onClose={toggleUnbond}
        stashId={stashId}
      />
      <Validate
        controllerId={controllerId}
        isOpen={isValidateOpen}
        onClose={toggleValidate}
        stashId={stashId}
        validatorPrefs={validatorPrefs}
      />
      {isInjectOpen && (
        <InjectKeys onClose={toggleInject} />
      )}
      {isNominateOpen && controllerId && (
        <Nominate
          controllerId={controllerId}
          next={next}
          nominees={nominees}
          onClose={toggleNominate}
          stakingOverview={stakingOverview}
          stashId={stashId}
        />
      )}
      {isSetControllerOpen && (
        <SetControllerAccount
          defaultControllerId={controllerId}
          isValidating={isStashValidating}
          onClose={toggleSetController}
          stashId={stashId}
        />
      )}
      {isRewardDestinationOpen && controllerId && (
        <SetRewardDestination
          controllerId={controllerId}
          defaultDestAccount={destAccount}
          defaultDestination={destination}
          onClose={toggleRewardDestination}
        />
      )}
      {controllerId && (
        <SetSessionKey
          controllerId={controllerId}
          isOpen={isSetSessionOpen}
          onClose={toggleSetSession}
          sessionIds={sessionIds}
          stashId={stashId}
        />
      )}

      {isIdentityOpen && (
        <Identity
          address={stashId}
          key='modal-identity'
          onClose={toggleIdentity}
        />
      )}

      <RowTitle title={t('Account')} />
      <Box className='staking--Account-mynomination'>
        {isLoading
          ? null
          : (
            <Table>
              <Table.Body>
                <tr>
                  <td>
                    <AddressSmall value={stashId} />
                  </td>
                  <td>
                    {(isStashNominating || isStashValidating)
                      ? (
                        <TxButton
                          accountId={controllerId}
                          isBasic
                          isDisabled={isInElection}
                          key='stop'
                          // icon='stop'
                          label={
                            isStashNominating
                              ? t('Stop Nominating')
                              : t('Stop Validating')
                          }
                          tx='staking.chill'
                        />
                      )
                      : (

                        <>
                          {(!sessionIds.length || hexSessionIdNext === '0x')
                            ? (
                              <Button
                                isBasic
                                isDisabled={isInElection}
                                key='set'
                                label={t('Session Key')}
                                onClick={toggleSetSession}
                              // icon='sign-in'
                              />
                            )
                            : (
                              <Button
                                isBasic
                                isDisabled={isInElection}
                                key='validate'
                                label={t('Validate')}
                                onClick={toggleValidate}
                              // icon='check circle outline'
                              />
                            )
                          }
                          {/* <Button.Or key='nominate.or' /> */}
                          <Button
                            isBasic
                            isDisabled={isInElection}
                            key='nominate'
                            label={t('Nominate')}
                            onClick={toggleNominate}
                          // icon='hand paper outline'
                          />
                        </>
                      )
                    }
                    <Popup
                      key='settings'
                      onClose={toggleSettings}
                      open={isSettingsOpen}
                      position='bottom right'
                      trigger={
                        <Button
                          icon='setting'
                          onClick={toggleSettings}
                        />
                      }
                    >
                      <Menu
                        onClick={toggleSettings}
                        text
                        vertical
                      >
                        {api.query.staking.activeEra && (
                          <Menu.Item
                            disabled={isPayoutEmpty || isInElection}
                            onClick={_doPayout}
                          >
                            <Trans i18nKey='payoutEras'>
                              {t('Claim Reward')}&nbsp;{
                                payoutEras.length
                                  ? <>(<FormatBalance value={payoutTotal}
                                    withSi={false}
                                    withUnit/>)</>
                                  : ''
                              }
                            </Trans>
                          </Menu.Item>
                        )}
                        {balancesAll?.freeBalance.gtn(0) && (
                          <Menu.Item
                            // disabled={!isOwnStash}
                            disabled={isInElection}
                            onClick={toggleBondExtra}
                          >
                            {t('Bond more funds')}
                          </Menu.Item>
                        )}
                        <Menu.Item
                          disabled={!isOwnController || isInElection}
                          onClick={toggleUnbond}
                        >
                          {t('Unbond funds')}
                        </Menu.Item>
                        <Menu.Item
                          disabled={isInElection}
                          onClick={toggleSetController}
                        >
                          {t('Change controller account')}
                        </Menu.Item>
                        <Menu.Item
                          disabled={!isOwnController || isInElection}
                          onClick={toggleRewardDestination}
                        >
                          {t('Change reward destination')}
                        </Menu.Item>
                        {isStashValidating &&
                          <Menu.Item
                            disabled={!isOwnController || isInElection}
                            onClick={toggleValidate}
                          >
                            {t('Change validator preferences')}
                          </Menu.Item>
                        }
                        {!isStashNominating &&
                          <Menu.Item
                            disabled={!isOwnController || isInElection}
                            onClick={toggleSetSession}
                          >
                            {t('Change session keys')}
                          </Menu.Item>
                        }
                        {isStashNominating &&
                          <Menu.Item
                            disabled={!isOwnController || isInElection}
                            onClick={toggleNominate}
                          >
                            {t('Set nominees')}
                          </Menu.Item>
                        }
                        <Menu.Item
                          disabled={(!api.tx.identity?.setIdentity && isStashValidating) || isInElection}
                          onClick={toggleIdentity}
                        >
                          {t('Set on-chain identity')}
                        </Menu.Item>
                        {/* {!isStashNominating &&
                          <Menu.Item onClick={toggleInject}>
                            {t('Inject session keys (advanced)')}
                          </Menu.Item>
                        } */}
                      </Menu>
                    </Popup>
                  </td>
                </tr>
              </Table.Body>
            </Table>
          )
        }
      </Box>

      <RowTitle subTitle={t('POWER = your stake / total stake')}
        title={t('Power Manager')}/>
      <Box>
        <PowerManage
          buttons={
            <div className='staking--PowerMange-buttons'>

              <Button
                isBasic
                isDisabled={isInElection}
                key='bondmore'
                label={t('Bond More')}
                onClick={toggleBondExtra}
              // icon='check circle outline'
              />
              {/* <Button.Or key='nominate.or' /> */}
              <Button
                isBasic
                isDisabled={isInElection}
                key='unbond'
                label={t('Unbond')}
                onClick={toggleUnbond}
              // icon='hand paper outline'
              />
            </div>
          }
          stakingAccount={stakingAccount}
          stakingLedger={stakingLedger} />
      </Box>
      <RowTitle title={t('Earnings')} />
      <Box>
        <Earnings address={stashId}
          destinationId={destination === 'Controller' ? controllerId : stashId}
          doPayout={_doPayout}
          doPayoutIsDisabled={isPayoutEmpty || isInElection}
          isLoading={!rewards}
          payoutMaxAmount={payoutMaxAmount}
          payoutsAmount={payoutsAmount}
          unClaimedReward={payoutTotal}/>
      </Box>
      {/* <AddressMini
        className='mini-nopad'
        label={t('controller')}
        value={controllerId}
      />

      <AddressInfo
        address={stashId}
        withBalance={{
          available: false,
          bonded: true,
          free: false,
          redeemable: true,
          unlocking: true
        }}
        withRewardDestination
      /> */}

      {isStashValidating
        ? (
          // <div className='top'>
          //   <AddressInfo
          //     address={stashId}
          //     withBalance={false}
          //     withHexSessionId={hexSessionIdNext !== '0x' && [hexSessionIdQueue, hexSessionIdNext]}
          //     withValidatorPrefs
          //   />
          // </div>
          <div className='lastBox'>
            <RowTitle title={t('Nominating')}
            />
            <Box>
              <>
                {nominators.length !== 0 && (
                  <div>
                    {nominators.map((nominee, index): React.ReactNode => (
                      <div className='staking--Noms-accountbox'
                        key={nominee[0]}>
                        <AddressSmall
                          key={index}
                          value={nominee[0]}
                        // withBalance={false}
                        // withBonded
                        />
                        <p className='staking--Noms-accountbox-power'>{formatNumber(nominee[1])} Power</p>
                      </div>
                    ))}
                  </div>
                )}
                {nominators.length === 0 && (<div className='staking--Noms-accountbox'>
                  <p>{t('No nominators')}</p>
                </div>)}
              </>
            </Box>
          </div>
        )
        : isStashNominating && (
          <div className='lastBox'>
            <RowTitle subTitle={t('Your nomination will take effect in the next era. Before that, the POWER may be displayed as 0')}
              title={t('Nominating')} />
            <Box>
              <>
                {nominees.length !== 0 && (
                  <div>
                    {nominees?.map((nomineeId, index): React.ReactNode => (
                      <div className='staking--Noms-accountbox'
                        key={nomineeId}>
                        <AddressSmall
                          key={index}
                          value={nomineeId}
                        />
                        <p className='staking--Noms-accountbox-power'>{formatNumber(nomsPower[index]?.power)} Power</p>
                        {/* <ColorButton
                          isDisabled={doPayoutIsDisabled}
                          key='claim'
                          onClick={doPayout}
                        >{t('Claim Reward')}</ColorButton> */}
                      </div>
                    ))}
                  </div>
                )}
                {/* {inactiveNoms.length !== 0 && (
                  <div>
                    {inactiveNoms.map((nomineeId, index): React.ReactNode => (
                      <div className='staking--Noms-accountbox'
                        key={nomineeId}>
                        <AddressSmall
                          key={index}
                          value={nomineeId}
                        />
                        <p className='staking--Noms-accountbox-power'>{formatNumber(nomsPower[index]?.power)} Power</p>
                      </div>
                    ))}
                  </div>
                )} */}
              </>
            </Box>
            {/* {isStashNominating && (
              <>
                {activeNoms.length !== 0 && (
                  <details>
                    <summary>{t('Active nominations ({{count}})', { replace: { count: activeNoms.length } })}</summary>
                    {activeNoms.map((nomineeId, index): React.ReactNode => (
                      <AddressMini
                        key={index}
                        value={nomineeId}
                        withBalance={false}
                        withBonded
                      />
                    ))}
                  </details>
                )}
                {inactiveNoms.length !== 0 && (
                  <details>
                    <summary>{t('Inactive nominations ({{count}})', { replace: { count: inactiveNoms.length } })}</summary>
                    {inactiveNoms.map((nomineeId, index): React.ReactNode => (
                      <AddressMini
                        key={index}
                        value={nomineeId}
                        withBalance={false}
                        withBonded
                      />
                    ))}
                  </details>
                )}
              </>
            )} */}
          </div>
        )
      }
    </div>
  );
}

export default styled(Account)`
  .ui--Button-Group {
    display: inline-block;
    margin-right: 0.25rem;
    vertical-align: inherit;
  }

  .mini-nopad {
    padding: 0;
  }

  .staking--Account-mynomination{
    .ui--Table{
      margin-bottom: 0;
    }
    table tr td:first-child {
      border-left-width: 0px;
      border-radius: 0;
    }
    table tr td:last-child {
      text-align: right;
    }
    table tr td {
      border: 0;
    }
  }

  .staking--PowerMange-buttons {
    display: flex;
    align-items: center;
    flex: 1;
    justify-content: flex-end;
  }

  .staking--Noms-accountbox {
    padding: 15px 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .staking--Noms-accountbox+.staking--Noms-accountbox {
    border-top: 1px solid #EDEDED;
  }

  .staking--Noms-accountbox-power {
    font-weight: bold;
  }

  .lastBox {
    margin-bottom: 50px;
  }
`;
