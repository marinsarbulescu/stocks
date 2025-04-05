/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.

export type PortfolioStock = {
  __typename: "PortfolioStock",
  budget?: number | null,
  createdAt: string,
  id: string,
  name?: string | null,
  owner?: string | null,
  pdp?: number | null,
  plr?: number | null,
  region: Region,
  symbol: string,
  type: StockType,
  updatedAt: string,
};

export enum Region {
  APAC = "APAC",
  EU = "EU",
  US = "US",
}


export enum StockType {
  Crypto = "Crypto",
  ETF = "ETF",
  Stock = "Stock",
}


export type ModelPortfolioStockFilterInput = {
  and?: Array< ModelPortfolioStockFilterInput | null > | null,
  budget?: ModelFloatInput | null,
  createdAt?: ModelStringInput | null,
  id?: ModelIDInput | null,
  name?: ModelStringInput | null,
  not?: ModelPortfolioStockFilterInput | null,
  or?: Array< ModelPortfolioStockFilterInput | null > | null,
  owner?: ModelStringInput | null,
  pdp?: ModelFloatInput | null,
  plr?: ModelFloatInput | null,
  region?: ModelRegionInput | null,
  symbol?: ModelStringInput | null,
  type?: ModelStockTypeInput | null,
  updatedAt?: ModelStringInput | null,
};

export type ModelFloatInput = {
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  between?: Array< number | null > | null,
  eq?: number | null,
  ge?: number | null,
  gt?: number | null,
  le?: number | null,
  lt?: number | null,
  ne?: number | null,
};

export enum ModelAttributeTypes {
  _null = "_null",
  binary = "binary",
  binarySet = "binarySet",
  bool = "bool",
  list = "list",
  map = "map",
  number = "number",
  numberSet = "numberSet",
  string = "string",
  stringSet = "stringSet",
}


export type ModelStringInput = {
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  beginsWith?: string | null,
  between?: Array< string | null > | null,
  contains?: string | null,
  eq?: string | null,
  ge?: string | null,
  gt?: string | null,
  le?: string | null,
  lt?: string | null,
  ne?: string | null,
  notContains?: string | null,
  size?: ModelSizeInput | null,
};

export type ModelSizeInput = {
  between?: Array< number | null > | null,
  eq?: number | null,
  ge?: number | null,
  gt?: number | null,
  le?: number | null,
  lt?: number | null,
  ne?: number | null,
};

export type ModelIDInput = {
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  beginsWith?: string | null,
  between?: Array< string | null > | null,
  contains?: string | null,
  eq?: string | null,
  ge?: string | null,
  gt?: string | null,
  le?: string | null,
  lt?: string | null,
  ne?: string | null,
  notContains?: string | null,
  size?: ModelSizeInput | null,
};

export type ModelRegionInput = {
  eq?: Region | null,
  ne?: Region | null,
};

export type ModelStockTypeInput = {
  eq?: StockType | null,
  ne?: StockType | null,
};

export type ModelPortfolioStockConnection = {
  __typename: "ModelPortfolioStockConnection",
  items:  Array<PortfolioStock | null >,
  nextToken?: string | null,
};

export type ModelPortfolioStockConditionInput = {
  and?: Array< ModelPortfolioStockConditionInput | null > | null,
  budget?: ModelFloatInput | null,
  createdAt?: ModelStringInput | null,
  name?: ModelStringInput | null,
  not?: ModelPortfolioStockConditionInput | null,
  or?: Array< ModelPortfolioStockConditionInput | null > | null,
  owner?: ModelStringInput | null,
  pdp?: ModelFloatInput | null,
  plr?: ModelFloatInput | null,
  region?: ModelRegionInput | null,
  symbol?: ModelStringInput | null,
  type?: ModelStockTypeInput | null,
  updatedAt?: ModelStringInput | null,
};

export type CreatePortfolioStockInput = {
  budget?: number | null,
  id?: string | null,
  name?: string | null,
  pdp?: number | null,
  plr?: number | null,
  region: Region,
  symbol: string,
  type: StockType,
};

export type DeletePortfolioStockInput = {
  id: string,
};

export type UpdatePortfolioStockInput = {
  budget?: number | null,
  id: string,
  name?: string | null,
  pdp?: number | null,
  plr?: number | null,
  region?: Region | null,
  symbol?: string | null,
  type?: StockType | null,
};

export type ModelSubscriptionPortfolioStockFilterInput = {
  and?: Array< ModelSubscriptionPortfolioStockFilterInput | null > | null,
  budget?: ModelSubscriptionFloatInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  id?: ModelSubscriptionIDInput | null,
  name?: ModelSubscriptionStringInput | null,
  or?: Array< ModelSubscriptionPortfolioStockFilterInput | null > | null,
  owner?: ModelStringInput | null,
  pdp?: ModelSubscriptionFloatInput | null,
  plr?: ModelSubscriptionFloatInput | null,
  region?: ModelSubscriptionStringInput | null,
  symbol?: ModelSubscriptionStringInput | null,
  type?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
};

export type ModelSubscriptionFloatInput = {
  between?: Array< number | null > | null,
  eq?: number | null,
  ge?: number | null,
  gt?: number | null,
  in?: Array< number | null > | null,
  le?: number | null,
  lt?: number | null,
  ne?: number | null,
  notIn?: Array< number | null > | null,
};

export type ModelSubscriptionStringInput = {
  beginsWith?: string | null,
  between?: Array< string | null > | null,
  contains?: string | null,
  eq?: string | null,
  ge?: string | null,
  gt?: string | null,
  in?: Array< string | null > | null,
  le?: string | null,
  lt?: string | null,
  ne?: string | null,
  notContains?: string | null,
  notIn?: Array< string | null > | null,
};

export type ModelSubscriptionIDInput = {
  beginsWith?: string | null,
  between?: Array< string | null > | null,
  contains?: string | null,
  eq?: string | null,
  ge?: string | null,
  gt?: string | null,
  in?: Array< string | null > | null,
  le?: string | null,
  lt?: string | null,
  ne?: string | null,
  notContains?: string | null,
  notIn?: Array< string | null > | null,
};

export type GetPortfolioStockQueryVariables = {
  id: string,
};

export type GetPortfolioStockQuery = {
  getPortfolioStock?:  {
    __typename: "PortfolioStock",
    budget?: number | null,
    createdAt: string,
    id: string,
    name?: string | null,
    owner?: string | null,
    pdp?: number | null,
    plr?: number | null,
    region: Region,
    symbol: string,
    type: StockType,
    updatedAt: string,
  } | null,
};

export type ListPortfolioStocksQueryVariables = {
  filter?: ModelPortfolioStockFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListPortfolioStocksQuery = {
  listPortfolioStocks?:  {
    __typename: "ModelPortfolioStockConnection",
    items:  Array< {
      __typename: "PortfolioStock",
      budget?: number | null,
      createdAt: string,
      id: string,
      name?: string | null,
      owner?: string | null,
      pdp?: number | null,
      plr?: number | null,
      region: Region,
      symbol: string,
      type: StockType,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type CreatePortfolioStockMutationVariables = {
  condition?: ModelPortfolioStockConditionInput | null,
  input: CreatePortfolioStockInput,
};

export type CreatePortfolioStockMutation = {
  createPortfolioStock?:  {
    __typename: "PortfolioStock",
    budget?: number | null,
    createdAt: string,
    id: string,
    name?: string | null,
    owner?: string | null,
    pdp?: number | null,
    plr?: number | null,
    region: Region,
    symbol: string,
    type: StockType,
    updatedAt: string,
  } | null,
};

export type DeletePortfolioStockMutationVariables = {
  condition?: ModelPortfolioStockConditionInput | null,
  input: DeletePortfolioStockInput,
};

export type DeletePortfolioStockMutation = {
  deletePortfolioStock?:  {
    __typename: "PortfolioStock",
    budget?: number | null,
    createdAt: string,
    id: string,
    name?: string | null,
    owner?: string | null,
    pdp?: number | null,
    plr?: number | null,
    region: Region,
    symbol: string,
    type: StockType,
    updatedAt: string,
  } | null,
};

export type UpdatePortfolioStockMutationVariables = {
  condition?: ModelPortfolioStockConditionInput | null,
  input: UpdatePortfolioStockInput,
};

export type UpdatePortfolioStockMutation = {
  updatePortfolioStock?:  {
    __typename: "PortfolioStock",
    budget?: number | null,
    createdAt: string,
    id: string,
    name?: string | null,
    owner?: string | null,
    pdp?: number | null,
    plr?: number | null,
    region: Region,
    symbol: string,
    type: StockType,
    updatedAt: string,
  } | null,
};

export type OnCreatePortfolioStockSubscriptionVariables = {
  filter?: ModelSubscriptionPortfolioStockFilterInput | null,
  owner?: string | null,
};

export type OnCreatePortfolioStockSubscription = {
  onCreatePortfolioStock?:  {
    __typename: "PortfolioStock",
    budget?: number | null,
    createdAt: string,
    id: string,
    name?: string | null,
    owner?: string | null,
    pdp?: number | null,
    plr?: number | null,
    region: Region,
    symbol: string,
    type: StockType,
    updatedAt: string,
  } | null,
};

export type OnDeletePortfolioStockSubscriptionVariables = {
  filter?: ModelSubscriptionPortfolioStockFilterInput | null,
  owner?: string | null,
};

export type OnDeletePortfolioStockSubscription = {
  onDeletePortfolioStock?:  {
    __typename: "PortfolioStock",
    budget?: number | null,
    createdAt: string,
    id: string,
    name?: string | null,
    owner?: string | null,
    pdp?: number | null,
    plr?: number | null,
    region: Region,
    symbol: string,
    type: StockType,
    updatedAt: string,
  } | null,
};

export type OnUpdatePortfolioStockSubscriptionVariables = {
  filter?: ModelSubscriptionPortfolioStockFilterInput | null,
  owner?: string | null,
};

export type OnUpdatePortfolioStockSubscription = {
  onUpdatePortfolioStock?:  {
    __typename: "PortfolioStock",
    budget?: number | null,
    createdAt: string,
    id: string,
    name?: string | null,
    owner?: string | null,
    pdp?: number | null,
    plr?: number | null,
    region: Region,
    symbol: string,
    type: StockType,
    updatedAt: string,
  } | null,
};
