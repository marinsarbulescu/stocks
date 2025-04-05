/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "./API";
type GeneratedMutation<InputType, OutputType> = string & {
  __generatedMutationInput: InputType;
  __generatedMutationOutput: OutputType;
};

export const createPortfolioStock = /* GraphQL */ `mutation CreatePortfolioStock(
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
` as GeneratedMutation<
  APITypes.CreatePortfolioStockMutationVariables,
  APITypes.CreatePortfolioStockMutation
>;
export const deletePortfolioStock = /* GraphQL */ `mutation DeletePortfolioStock(
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
` as GeneratedMutation<
  APITypes.DeletePortfolioStockMutationVariables,
  APITypes.DeletePortfolioStockMutation
>;
export const updatePortfolioStock = /* GraphQL */ `mutation UpdatePortfolioStock(
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
` as GeneratedMutation<
  APITypes.UpdatePortfolioStockMutationVariables,
  APITypes.UpdatePortfolioStockMutation
>;
