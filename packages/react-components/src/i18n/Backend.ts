// Copyright 2017-2020 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import languageCache from './cache';

type Callback = (error: string | null, data: any) => void;

type LoadResult = [string | null, any];

const loaders: Record<string, Promise<LoadResult>> = {};

export default class Backend {
  type = 'backend'

  static type: 'backend' = 'backend'

  async read (lng: string, _namespace: string, responder: Callback): Promise<void> {
    if (languageCache[_namespace]) {
      return responder(null, languageCache[_namespace]);
    }

    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    if (!loaders[_namespace]) {
      loaders[_namespace] = this.createLoader(lng, _namespace);
    }

    const [error, data] = await loaders[_namespace];

    return responder(null, data);
  }

  async createLoader (lng: string, _namespace: string): Promise<LoadResult> {
    try {
      if (_namespace.includes('app-')) {
        _namespace = _namespace.replace(/app-/, 'page-');
      }

      const response = await fetch(`locales/${lng}/${_namespace}.json`, {});

      if (!response.ok) {
        return [`i18n: failed loading ${lng}`, response.status >= 500 && response.status < 600];
      } else {
        languageCache[_namespace] = await response.json();

        return [null, languageCache[_namespace]];
      }
    } catch (error) {
      return [error.message, false];
    }
  }
}
