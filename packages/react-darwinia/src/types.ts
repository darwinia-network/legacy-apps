import { TFunction } from 'i18next';

export type i18nT = TFunction;

export type currencyType = 'ring' | 'kton';

export type promiseMonth = 0 | 3 | 6 | 12 | 18 | 24 | 30 | 36;

export type DefinitionTypeType = string;

export type DefinitionTypeEnum = { _enum: DefinitionTypeType[] } | { _enum: Record<string, DefinitionTypeType | null> };

export type DefinitionTypeSet = { _set: Record<string, number> };

// Don't believe the `& object` here is proper, but cannot do `& Record<string, DefinitionTypeType>`
export type DefinitionTypeStruct = Record<string, DefinitionTypeType> | { _alias?: Record<string, DefinitionTypeType> } & object;

export type DefinitionType = string | DefinitionTypeEnum | DefinitionTypeSet | DefinitionTypeStruct;

export interface DefinitionRpcParam {
  isOptional?: boolean;
  name: string;
  type: DefinitionTypeType;
}

export interface DefinitionRpc {
  alias?: string[];
  description: string;
  params: DefinitionRpcParam[];
  type: DefinitionTypeType;
}

export interface DefinitionRpcExt extends DefinitionRpc {
  isSubscription: boolean;
  jsonrpc: string;
  method: string;
  pubsub?: [string, string, string];
  section: string;
}

export interface DefinitionRpcSub extends DefinitionRpc {
  pubsub: [string, string, string];
}

export interface Definitions {
  rpc: Record<string, DefinitionRpc | DefinitionRpcSub>;
  types: Record<string, DefinitionType>;
}
