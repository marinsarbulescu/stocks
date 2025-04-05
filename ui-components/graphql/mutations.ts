/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createPortfolioStock = /* GraphQL */ `
  mutation CreatePortfolioStock(
    $condition: ModelPortfolioStockConditionInput
    $input: CreatePortfolioStockInput!
  ) {
    createPortfolioStock(condition: $condition, input: $input) {
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
export const deletePortfolioStock = /* GraphQL */ `
  mutation DeletePortfolioStock(
    $condition: ModelPortfolioStockConditionInput
    $input: DeletePortfolioStockInput!
  ) {
    deletePortfolioStock(condition: $condition, input: $input) {
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
export const updatePortfolioStock = /* GraphQL */ `
  mutation UpdatePortfolioStock(
    $condition: ModelPortfolioStockConditionInput
    $input: UpdatePortfolioStockInput!
  ) {
    updatePortfolioStock(condition: $condition, input: $input) {
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
