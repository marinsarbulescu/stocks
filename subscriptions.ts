/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "./API";
type GeneratedSubscription<InputType, OutputType> = string & {
  __generatedSubscriptionInput: InputType;
  __generatedSubscriptionOutput: OutputType;
};

export const onCreatePortfolioStock = /* GraphQL */ `subscription OnCreatePortfolioStock(
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
` as GeneratedSubscription<
  APITypes.OnCreatePortfolioStockSubscriptionVariables,
  APITypes.OnCreatePortfolioStockSubscription
>;
export const onDeletePortfolioStock = /* GraphQL */ `subscription OnDeletePortfolioStock(
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
` as GeneratedSubscription<
  APITypes.OnDeletePortfolioStockSubscriptionVariables,
  APITypes.OnDeletePortfolioStockSubscription
>;
export const onUpdatePortfolioStock = /* GraphQL */ `subscription OnUpdatePortfolioStock(
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
` as GeneratedSubscription<
  APITypes.OnUpdatePortfolioStockSubscriptionVariables,
  APITypes.OnUpdatePortfolioStockSubscription
>;
