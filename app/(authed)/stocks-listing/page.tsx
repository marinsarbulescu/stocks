// app/stocks-listing/page.tsx
'use client'; // Needed for useState, useEffect

import React, { useState, useEffect } from 'react';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '@/amplify/data/resource'; // Adjust path
import AddStockForm from '../../components/AddStockForm';

// Create client instance
const client = generateClient<Schema>();

// Define the accurate item type (as figured out previously)
type PortfolioStockItem = Awaited<ReturnType<typeof client.models.PortfolioStock.list>>['data'][number];

export default function StocksListingPage() {
  // --- Copy state, fetchPortfolio, useEffect from ProtectedStockDashboard ---
  const [portfolioStocks, setPortfolioStocks] = useState<PortfolioStockItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isEditing, setIsEditing] = useState(false); // Is the edit form/modal open?
  const [stockToEdit, setStockToEdit] = useState<PortfolioStockItem | null>(null); // Which stock data are we editing?

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
  
const handleDeleteStock = async (idToDelete: string) => {
    if (!window.confirm('Are you sure you want to delete this stock entry?')) {
      return;
    }
    console.log(`Attempting to delete stock with id: ${idToDelete}`);
    setError(null); // Clear previous errors
  
    try {
      const { errors } = await client.models.PortfolioStock.delete({
        id: idToDelete,
      });
  
      if (errors) {
        console.error('Error deleting stock:', errors);
        setError(errors[0]?.message || 'Failed to delete stock.');
      } else {
        console.log('Stock deleted successfully!');
        // Refresh the portfolio list to reflect the deletion
        fetchPortfolio();
      }
    } catch (err: any) {
      console.error('Unexpected error deleting stock:', err);
      setError(err.message || 'An error occurred during deletion.');
    }
};

const handleEditClick = (stock: PortfolioStockItem) => {
    console.log('Editing stock:', stock);
    setStockToEdit(stock); // Store the data of the stock to edit
    setIsEditing(true);    // Set editing mode to true
};

const handleCancelEdit = () => {
    setIsEditing(false);    // Set editing mode to false
    setStockToEdit(null);  // Clear the stock data being edited
};

// --- Add function to handle the update submission ---
const handleUpdateStock = async (updatedData: Schema['PortfolioStock']) => {
  console.log('Attempting to update stock:', updatedData);
  // Consider adding loading/saving state indication
  setError(null); // Clear previous errors

  try {
      // Note: updatedData MUST include the correct stock 'id'
      // @ts-ignore - TS incorrectly
      const { data: updatedStock, errors } = await client.models.PortfolioStock.update(updatedData);

      if (errors) {
          console.error('Error updating stock:', errors);
          setError(errors[0]?.message || 'Failed to update stock.');
          // Keep edit form open on error? Or close? Your choice.
      } else {
          console.log('Stock updated successfully:', updatedStock);
          // Update succeeded: close edit mode and refresh list
          setIsEditing(false);
          setStockToEdit(null);
          fetchPortfolio(); // Refresh the list
      }
  } catch (err: any) {
      console.error('Unexpected error updating stock:', err);
      setError(err.message || 'An error occurred during update.');
  } finally {
      // Stop loading/saving indication
  }
};
// --- End handleUpdateStock ---

  return (
    <div>
      <h1>Your Stock Portfolio</h1>
  
      {/* Loading Indicator */}
      {isLoading && <p>Loading stocks...</p>}
  
      {/* Error Display */}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
  
      {/* Stock List (Only show list if NOT editing, or adjust UI later) */}
      {!isLoading && !error && !isEditing && ( // Conditionally hide list while editing? Or keep visible? Your choice.
        <ul>
          {portfolioStocks.length === 0 ? (
            <li>Your portfolio is currently empty. Add stocks via the Add Stocks page.</li>
          ) : (
            // The .map() code with Edit/Delete buttons goes here (as modified above)
            portfolioStocks.map((stock) => (
               <li key={stock.id} /* ... */ >
                  <strong>{stock.symbol?.toUpperCase()}</strong> ({stock.name || 'No Name'})
                  <br />
                  <small>Type: {stock.type} | Region: {stock.region}</small>
                  <br />
                  <small>PDP: {stock.pdp ?? 'N/A'}% | PLR: {stock.plr ?? 'N/A'} | Budget: ${stock.budget ?? 'N/A'}</small>
                  <br /> {/* Optional spacing */}
                  
                  <button onClick={() => handleEditClick(stock)} /* ... */>Edit</button>
                  <button onClick={() => handleDeleteStock(stock.id)} /* ... */>Delete</button>
               </li>
            ))
          )}
        </ul>
      )}
  
      {/* --- Add Conditional Edit UI Placeholder --- */}
      {isEditing && stockToEdit && (
        <div style={{ marginTop: '2rem', border: '1px solid #ccc', padding: '1rem' }}>
          <h2>Edit Stock: {stockToEdit.symbol?.toUpperCase()}</h2>
          <p>ID: {stockToEdit.id}</p>
          
          <AddStockForm
            isEditMode={true}
            // @ts-ignore - TS incorrectly
            initialData={stockToEdit}
            onUpdate={handleUpdateStock} // Pass the update handler
            onCancel={handleCancelEdit}   // Pass the cancel handler
          />

        </div>
      )}
      {/* --- End Conditional Edit UI Placeholder --- */}
  
    </div>
  );
}