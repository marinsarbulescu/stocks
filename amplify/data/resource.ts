import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

// Define Enums first
const stockTypeEnum = a.enum(['Stock', 'ETF', 'Crypto']); // Changed order to match default in form example
const regionEnum = a.enum(['US', 'EU', 'APAC']);

/* Define the schema */
const schema = a.schema({
  // Add Enums to the schema so they are usable types
  StockType: stockTypeEnum,
  Region: regionEnum,

  // Define the model for storing portfolio stocks
  PortfolioStock: a
    .model({
      // Amplify automatically adds id, createdAt, updatedAt
      // The owner field is implicitly added by the .authorization() rule below

      symbol: a.string().required(), // Stock symbol, required
      type: a.ref('StockType').required(), // Reference the StockType enum, required
      region: a.ref('Region').required(),   // Reference the Region enum, required
      name: a.string(), // Stock name, optional
      pdp: a.float(),   // Price Dip Percent, optional number
      plr: a.float(),   // Profit Loss Ratio, optional number
      budget: a.float(), // Annual budget, optional number
    })
    // Add owner-based authorization: grants full access ONLY to the record's owner
    .authorization((allow) => [allow.owner()]),

  // ... any other models you might have
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



/*== STEP 1 ===============================================================
The section below creates a Todo database table with a "content" field. Try
adding a new "isDone" field as a boolean. The authorization rule below
specifies that any user authenticated via an API key can "create", "read",
"update", and "delete" any "Todo" records.
=========================================================================*/
// const schema = a.schema({
//   Todo: a
//     .model({
//       content: a.string(),
//     })
//     .authorization((allow) => [allow.publicApiKey()]),
// });

// export type Schema = ClientSchema<typeof schema>;

// export const data = defineData({
//   schema,
//   authorizationModes: {
//     defaultAuthorizationMode: "apiKey",
//     apiKeyAuthorizationMode: {
//       expiresInDays: 30,
//     },
//   },
// });

/*== STEP 2 ===============================================================
Go to your frontend source code. From your client-side code, generate a
Data client to make CRUDL requests to your table. (THIS SNIPPET WILL ONLY
WORK IN THE FRONTEND CODE FILE.)

Using JavaScript or Next.js React Server Components, Middleware, Server 
Actions or Pages Router? Review how to generate Data clients for those use
cases: https://docs.amplify.aws/gen2/build-a-backend/data/connect-to-API/
=========================================================================*/

/*
"use client"
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";

const client = generateClient<Schema>() // use this Data client for CRUDL requests
*/

/*== STEP 3 ===============================================================
Fetch records from the database and use them in your frontend component.
(THIS SNIPPET WILL ONLY WORK IN THE FRONTEND CODE FILE.)
=========================================================================*/

/* For example, in a React component, you can use this snippet in your
  function's RETURN statement */
// const { data: todos } = await client.models.Todo.list()

// return <ul>{todos.map(todo => <li key={todo.id}>{todo.content}</li>)}</ul>
