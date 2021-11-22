import { ApiPromise } from '@polkadot/api';
import { AccountData } from '@darwinia/types';
import { useApi } from '@polkadot/react-hooks';
import { useEffect, useState } from 'react';

/**
 * @description other api can get balances:  api.derive.balances.all, api.query.system.account;
 * @see https://github.com/darwinia-network/wormhole-ui/issues/142
 */
export async function getDarwiniaAvailableBalances (api: ApiPromise, account = ''): Promise<[string, string]> {
  try {
    await api.isReady;
    // type = 0 query ring balance.  type = 1 query kton balance.
    /* eslint-disable */
    const ringUsableBalance = await (api.rpc as any).balances.usableBalance(0, account);
    const ktonUsableBalance = await (api.rpc as any).balances.usableBalance(1, account);
    /* eslint-enable */

    return [ringUsableBalance.usableBalance.toString(), ktonUsableBalance.usableBalance.toString()];
  } catch (error) {
    console.warn(
      '%c [ Failed to  querying balance through rpc ]',
      'font-size:13px; background:pink; color:#bf2c9f;',
      error
    );
  }

  try {
    const { data } = await api.query.system.account(account);
    const { free, freeKton } = data as unknown as AccountData;

    return [free.toString(), freeKton.toString()];
  } catch (error) {
    console.warn(
      '%c [ Failed to  querying balance through account info ]',
      'font-size:13px; background:pink; color:#bf2c9f;',
      error
    );

    return ['0', '0'];
  }
}

export function useDarwiniaAvailableBalances (account: string): string[] {
  const [balances, setBalances] = useState<[string, string]>(['', '']);
  const { api } = useApi();

  useEffect(() => {
    const getBalances: (acc: string) => Promise<string[]> = async (account: string) => {
      if (!api) {
        return [];
      }

      const balances = await getDarwiniaAvailableBalances(api, account);

      setBalances(balances);

      return balances;
    };

    getBalances(account).then();
  }, [account, api]);

  return balances;
}
