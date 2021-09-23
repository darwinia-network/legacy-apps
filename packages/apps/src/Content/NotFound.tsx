// Copyright 2017-2020 @polkadot/apps authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import { Redirect } from 'react-router';
import settings from '@polkadot/ui-settings';

type Props = {};

function NotFound (): React.ReactElement<Props> {
  return (
    <Redirect to={{
      pathname: '/account',
      search: location.search.includes('rpc') ? '' : encodeURIComponent(`rpc=${settings.apiUrl}`)
    }} />
  );
}

export default React.memo(NotFound);
