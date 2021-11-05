// Copyright 2017-2020 @polkadot/apps-config authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

const defaultColor = undefined; // '#f19135'
const emptyColor = '#999';

const chainKulupu = '#003366';
const chainKusama = '#d32e79';
const chainWestend = '#da68a7';

const chainLogoDarwiniaCrab = '#EC3783';
const chainLogoEmpty = '#313131';
const chainLogoDarwinia = 'linear-gradient(315deg, #FE3876 0%, #7C30DD 71%, #3A30DD 100%)';
const chainLogoPangolin = '#5744DE';

const nodeCentrifuge = '#fcc367';
const nodeEdgeware = '#0a95df';
const nodeNodle = '#1ab394';

// overrides based on the actual matched chain name
const chainColors: Record<string, any> = [
  ['Kulupu', chainKulupu],
  ['Kusama', chainKusama], // new name after CC3
  ['Kusama CC1', chainKusama],
  ['Kusama CC2', chainKusama],
  ['Kusama CC3', chainKusama],
  ['Westend', chainWestend]
].reduce((colors, [chain, color]): Record<string, any> => ({
  ...colors,
  [chain.toLowerCase()]: color
}), {});

// overrides based on the actual software node type (all '-' converted to ' ')
const nodeColors: Record<string, any> = [
  ['centrifuge chain', nodeCentrifuge],
  ['edgeware node', nodeEdgeware],
  ['nodle chain node', nodeNodle]
  // ['node template', emptyColor],
  // ['parity polkadot', emptyColor],
  // ['substrate node', emptyColor]
].reduce((colors, [node, color]): Record<string, any> => ({
  ...colors,
  [node.toLowerCase().replace(/-/g, ' ')]: color
}), {});

// overrides based on the actual matched chain name
// get by RPC system.chain()
const logoBgColors: Record<string, any> = [
  ['Darwinia Crab', chainLogoDarwiniaCrab],
  ['Crab', chainLogoDarwiniaCrab],
  ['empty', chainLogoEmpty],
  ['Darwinia', chainLogoDarwinia], // new name after CC3
  ['Darwinia CC1', chainLogoDarwinia],
  ['Darwinia CC2', chainLogoDarwinia],
  ['Darwinia CC3', chainLogoDarwinia],
  ['Darwinia Devnet', chainLogoDarwinia],
  ['Pangolin', chainLogoPangolin],
  ['Pangoro', chainLogoPangolin]
].reduce((colors, [chain, color]): Record<string, any> => ({
  ...colors,
  [chain.toLowerCase()]: color
}), {});

export {
  defaultColor,
  chainColors,
  emptyColor,
  nodeColors,
  logoBgColors
};
