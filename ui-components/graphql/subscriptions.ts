/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreatePortfolioStock = /* GraphQL */ `
  subscription OnCreatePortfolioStock(
    $filter: ModelSubscriptionPortfolioStockFilterInput
    $owner: String
  ) {
    onCreatePortfolioStock(filter: $filter, owner: $owner) {
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
export const onDeletePortfolioStock = /* GraphQL */ `
  subscription OnDeletePortfolioStock(
    $filter: ModelSubscriptionPortfolioStockFilterInput
    $owner: String
  ) {
    onDeletePortfolioStock(filter: $filter, owner: $owner) {
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
export const onUpdatePortfolioStock = /* GraphQL */ `
  subscription OnUpdatePortfolioStock(
    $filter: ModelSubscriptionPortfolioStockFilterInput
    $owner: String
  ) {
    onUpdatePortfolioStock(filter: $filter, owner: $owner) {
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
