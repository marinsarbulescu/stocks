"use client";

//import { useState, useEffect } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import "./../app/app.css";
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";
import "@aws-amplify/ui-react/styles.css";

import React, { useState, useEffect } from 'react'; // Import hooks
import { Authenticator, useAuthenticator } from '@aws-amplify/ui-react';
// Ensure styles are imported, though importing in layout.tsx is often sufficient
// import '@aws-amplify/ui-react/styles.css';
import styles from './page.module.css';

// 1. Import the new form component
import AddStockForm from '@/app/components/AddStockForm';

Amplify.configure(outputs);

const client = generateClient<Schema>();

// --- Define the type HERE ---
type PortfolioStockItem = Awaited<ReturnType<typeof client.models.PortfolioStock.list>>['data'][number];

// --- This is your component that shows content ONLY to logged-in users ---
function ProtectedStockDashboard() {
  // Use hooks to access authentication status, user info, and sign out function
  const { user, signOut } = useAuthenticator((context) => [context.user]);

  // 1. State for storing the fetched portfolio stocks
  const [portfolioStocks, setPortfolioStocks] = useState<PortfolioStockItem[]>([]);
  // State for loading status
  const [isLoading, setIsLoading] = useState(true); // Start in loading state
  // State for fetch errors
  const [error, setError] = useState<string | null>(null);

  // 2. Function to fetch portfolio stocks from Amplify DataStore
  const fetchPortfolio = async () => {
    setIsLoading(true); // Set loading true when fetching starts
    setError(null);     // Clear previous errors
    try {
      // Use client.models.PortfolioStock.list()
      // Owner auth rule automatically filters for the logged-in user
      const { data: stocks, errors } = await client.models.PortfolioStock.list();

      if (errors) {
        console.error('Error fetching portfolio:', errors);
        setError(errors[0]?.message || 'Failed to fetch portfolio data.');
        setPortfolioStocks([]); // Clear data on error
      } else {
        setPortfolioStocks(stocks); // Set fetched stocks to state
        console.log('Fetched portfolio:', stocks);
      }
    } catch (err: any) {
      console.error('Unexpected error fetching portfolio:', err);
      setError(err.message || 'An error occurred while fetching data.');
      setPortfolioStocks([]); // Clear data on error
    } finally {
      setIsLoading(false); // Set loading false when fetching completes (success or fail)
    }
  };

  // 3. Fetch portfolio when the component mounts
  useEffect(() => {
    fetchPortfolio();
  }, []); // Empty dependency array means this runs once after initial render

  // 4. Callback function to pass to the form - will re-fetch data after adding
  const handleStockAdded = () => {
    console.log("Stock added! Refreshing portfolio list...");
    fetchPortfolio(); // Call fetchPortfolio again to update the list
  };

  // You can inspect `user` object for details like username, email etc.
  // The exact attributes depend on your auth configuration in resource.ts
  console.log('User info:', user);

  return (
    <div>
      {/* Example: Display username or email */}
      <h1>Welcome, {user?.signInDetails?.loginId || user?.username || 'User'}!</h1>
      <button onClick={signOut} style={{ marginTop: '20px' }}>Sign Out</button>

      <hr style={{ margin: '2rem 0' }}/>

      {/* 2. Render the AddStockForm component */}
      <AddStockForm onStockAdded={handleStockAdded} />

      <hr style={{ margin: '2rem 0' }}/>

      <h2>Your Portfolio</h2>
      {/* 5. Render based on loading/error/data state */}
      {isLoading && <p>Loading portfolio...</p>}

      {error && <p style={{ color: 'red' }}>Error: {error}</p>}

      {!isLoading && !error && (
        <ul>
          {portfolioStocks.length === 0 ? (
            <li>Your portfolio is currently empty.</li>
          ) : (
            // Map over the portfolioStocks array and render each stock
            portfolioStocks.map((stock) => {
              
              console.log('Stock object from API:', JSON.stringify(stock, null, 2));

              return(
                <li key={stock.id} style={{ margin: '0.5rem 0', borderBottom: '1px solid #eee', paddingBottom: '0.5rem' }}>
                  <strong>{stock.symbol?.toUpperCase()}</strong> ({stock.name || 'No Name'})
                  <br />
                  <small>Type: {stock.type} | Region: {stock.region}</small>
                  <br />
                  {/* Optionally display other details */}
                  <small>PDP: {stock.pdp ?? 'N/A'}% | PLR: {stock.plr ?? 'N/A'} | Budget: ${stock.budget ?? 'N/A'}</small>
                  {/* Add Delete/Edit buttons here later */}
                </li>
              );
            })
          )}
        </ul>
      )}
    </div>
  );
}
// --- End of protected component ---

// --- This is the main export for your page route ---
export default function Home() {
  return (
    <main className={styles.main}>
      {/* Wrap the protected component with Authenticator */}
      <Authenticator>
        {/*
          The content inside Authenticator is only rendered after a successful sign-in.
          You can optionally receive { signOut, user } as props here too,
          but using the useAuthenticator hook inside the child component is common.
        */}
        <ProtectedStockDashboard />
      </Authenticator>
    </main>
  );
}