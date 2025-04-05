/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getPortfolioStock = /* GraphQL */ `
  query GetPortfolioStock($id: ID!) {
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
`;
export const listPortfolioStocks = /* GraphQL */ `
  query ListPortfolioStocks(
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
`;
