/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "./API";
type GeneratedQuery<InputType, OutputType> = string & {
  __generatedQueryInput: InputType;
  __generatedQueryOutput: OutputType;
};

export const getPortfolioStock = /* GraphQL */ `query GetPortfolioStock($id: ID!) {
  getPortfolioStock(id: $id) {
    budget
    createdAt
    id
    name
    owner
    pdp
    plr
    region
    symbol
    type
    updatedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetPortfolioStockQueryVariables,
  APITypes.GetPortfolioStockQuery
>;
export const listPortfolioStocks = /* GraphQL */ `query ListPortfolioStocks(
  $filter: ModelPortfolioStockFilterInput
  $limit: Int
  $nextToken: String
) {
  listPortfolioStocks(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      budget
      createdAt
      id
      name
      owner
      pdp
      plr
      region
      symbol
      type
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListPortfolioStocksQueryVariables,
  APITypes.ListPortfolioStocksQuery
>;
