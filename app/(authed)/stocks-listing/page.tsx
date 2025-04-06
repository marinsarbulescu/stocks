// app/stocks-listing/page.tsx
'use client'; // Needed for useState, useEffect

import React, { useState, useEffect } from 'react';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '@/amplify/data/resource'; // Adjust path

// Create client instance
const client = generateClient<Schema>();

// Define the accurate item type (as figured out previously)
type PortfolioStockItem = Awaited<ReturnType<typeof client.models.PortfolioStock.list>>['data'][number];

export default function StocksListingPage() {
  // --- Copy state, fetchPortfolio, useEffect from ProtectedStockDashboard ---
  const [portfolioStocks, setPortfolioStocks] = useState<PortfolioStockItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPortfolio = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data: stocks, errors } = await client.models.PortfolioStock.list();
      if (errors) {
        console.error('Error fetching portfolio:', errors);
        setError(errors[0]?.message || 'Failed to fetch portfolio data.');
        setPortfolioStocks([]);
      } else {
        setPortfolioStocks(stocks);
        console.log('Fetched portfolio:', stocks);
      }
    } catch (err: any) {
      console.error('Unexpected error fetching portfolio:', err);
      setError(err.message || 'An error occurred while fetching data.');
      setPortfolioStocks([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPortfolio();
  }, []);
  // --- End copied logic ---

  return (
    <div>
      <h1>Your Portfolio</h1>
      {/* --- Copy rendering logic from ProtectedStockDashboard --- */}
      {isLoading && <p>Loading portfolio...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      {!isLoading && !error && (
        <ul>
          {portfolioStocks.length === 0 ? (
            <li>Your portfolio is currently empty.</li>
          ) : (
            portfolioStocks.map((stock) => (
              <li key={stock.id} style={{ margin: '0.5rem 0', borderBottom: '1px solid #eee', paddingBottom: '0.5rem' }}>
                <strong>{stock.symbol?.toUpperCase()}</strong> ({stock.name || 'No Name'})
                <br />
                <small>Type: {stock.type} | Region: {stock.region}</small>
                <br />
                <small>PDP: {stock.pdp ?? 'N/A'}% | PLR: {stock.plr ?? 'N/A'} | Budget: ${stock.budget ?? 'N/A'}</small>
                 {/* Add Delete/Edit buttons here later */}
              </li>
            ))
          )}
        </ul>
      )}
      {/* --- End copied rendering logic --- */}
    </div>
  );
}