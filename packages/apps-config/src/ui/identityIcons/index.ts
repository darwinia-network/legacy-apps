// Copyright 2017-2020 @polkadot/apps-config authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

// overrides based on the actual software node type
const identityNodes: Record<string, string> = [
  ['darwinia-crab', 'polkadot'],
  ['darwinia', 'polkadot']
].reduce((icons, [spec, icon]): Record<string, string> => ({
  ...icons,
  [spec.toLowerCase().replace(/-/g, ' ')]: icon
}), {});

export {
  identityNodes
};
