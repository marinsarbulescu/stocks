import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

// Define Enums first
const stockTypeEnum = a.enum(['Stock', 'ETF', 'Crypto']); // Changed order to match default in form example
const regionEnum = a.enum(['US', 'EU', 'APAC']);

const txnActionEnum = a.enum(['Buy', 'Sell', 'Div']); // Div = Dividend
const txnSignalEnum = a.enum(['_5DD', 'Cust', 'Initial', 'EOM', 'LBD', 'TP']);

/* Define the schema */
const schema = a.schema({
  StockType: stockTypeEnum,
  Region: regionEnum,
  TxnAction: txnActionEnum,
  TxnSignal: txnSignalEnum,

  // Define the model for storing portfolio stocks
  PortfolioStock: a
    .model({
      symbol: a.string().required(), // Stock symbol, required
      type: a.ref('StockType').required(), // Reference the StockType enum, required
      region: a.ref('Region').required(),   // Reference the Region enum, required
      name: a.string(), // Stock name, optional
      pdp: a.float(),   // Price Dip Percent, optional number
      plr: a.float(),   // Profit Loss Ratio, optional number
      budget: a.float(), // Annual budget, optional number
      transactions: a.hasMany('Transaction', 'portfolioStockId')
    })
    // Add owner-based authorization: grants full access ONLY to the record's owner
    .authorization((allow) => [allow.owner()]),

  Transaction: a
    .model({
      date: a.date().required(),           // Transaction date (YYYY-MM-DD)
      action: a.ref('TxnAction').required(), // Reference the TxnAction enum
      signal: a.ref('TxnSignal'),           // Reference the TxnSignal enum (optional?)
      price: a.float(),                     // Price (optional? required?)
      investment: a.float(),                // Investment amount (optional? required?)

      // Define the relationship back to PortfolioStock
      portfolioStockId: a.id().required(), // Foreign key ID
      portfolioStock: a.belongsTo('PortfolioStock', 'portfolioStockId'), // Define the relationship
    })
    .authorization((allow) => [allow.owner()]),

PortfolioGoals: a
    .model({
      totalBudget: a.float(),       // Annual total budget (optional float)
      usBudgetPercent: a.float(),   // Annual US budget % (optional float)
      intBudgetPercent: a.float(),  // Annual Int budget % (optional float)
      usStocksTarget: a.integer(),  // # of US stocks target (optional integer)
      usEtfsTarget: a.integer(),    // # of US ETFs target (optional integer)
      intStocksTarget: a.integer(), // # of Int stocks target (optional integer)
      intEtfsTarget: a.integer(),   // # of Int ETFs target (optional integer)
    })
    .authorization((allow) => [allow.owner()]),
});

// Export the schema type for use in client-side code generation
export type Schema = ClientSchema<typeof schema>;

// Define the data resource for your backend
export const data = defineData({
  schema,
  // Configure authorization modes
  authorizationModes: {
    // Use Cognito User Pools as the default mechanism for authorizing API calls
    defaultAuthorizationMode: 'userPool',
    // You could add an API key for public read access if needed later
    // apiKeyAuthorizationMode: { expiresInDays: 30 },
  },
});