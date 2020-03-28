// Copyright 2017-2020 @polkadot/app-extrinsics authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { useTranslation as useTranslationBase, UseTranslationResponse, withTranslation } from 'react-i18next';

export function useTranslation (): UseTranslationResponse {
  return useTranslationBase('page-extrinsics');
}

export default withTranslation(['page-extrinsics']);
