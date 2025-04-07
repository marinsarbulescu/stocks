// app/stocks-listing/page.tsx
'use client'; // Needed for useState, useEffect

import React, { useState, useEffect } from 'react';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '@/amplify/data/resource'; // Adjust path
import AddStockForm from '../../components/AddStockForm';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import Link from 'next/link';

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

    {/* Table Display - Render only when not loading, no error, and NOT editing */}
    {/* You might adjust the !isEditing condition later if you prefer the table visible during edit */}
    {!isLoading && !error && !isEditing && (
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid #ccc', textAlign: 'left' }}>
            {/* Add table headers - add onClick for sorting later */}
            <th style={{ padding: '8px' }}>Symbol</th>
            <th style={{ padding: '8px' }}>Name</th>
            <th style={{ padding: '8px' }}>Type</th>
            <th style={{ padding: '8px' }}>Region</th>
            <th style={{ padding: '8px' }}>PDP (%)</th>
            <th style={{ padding: '8px' }}>PLR</th>
            <th style={{ padding: '8px' }}>Budget ($)</th>
            <th style={{ padding: '8px' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {portfolioStocks.length === 0 ? (
            <tr>
              <td colSpan={8} style={{ textAlign: 'center', padding: '1rem' }}>
                Your portfolio is currently empty.
              </td>
            </tr>
          ) : (
            // Use portfolioStocks.map for now, we'll add sorting later
            portfolioStocks.map((stock) => (
              <tr key={stock.id} style={{ borderBottom: '1px solid #eee' }}>
                <Link href={`/txns/${stock.id}/add`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <td style={{ padding: '8px' }}>{stock.symbol?.toUpperCase()}</td>
                </Link>
                <td style={{ padding: '8px' }}>{stock.name || '--'}</td>
                <td style={{ padding: '8px' }}>{stock.type}</td>
                <td style={{ padding: '8px' }}>{stock.region}</td>
                <td style={{ padding: '8px' }}>{stock.pdp ?? '--'}</td>
                <td style={{ padding: '8px' }}>{stock.plr ?? '--'}</td>
                <td style={{ padding: '8px' }}>{stock.budget ?? '--'}</td>
                <td style={{ padding: '8px', textAlign: 'center' }}>
                  {/* Edit Button with Icon */}
                  <button
                    onClick={() => handleEditClick(stock)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '5px', marginRight: '5px', color: 'blue' }} // Minimalist style
                    title="Edit Stock" // Tooltip
                  >
                    <FaEdit /> {/* Edit Icon */}
                  </button>
                  {/* Delete Button with Icon */}
                  <button
                    onClick={() => handleDeleteStock(stock.id)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '5px', color: 'red' }} // Minimalist style
                    title="Delete Stock" // Tooltip
                  >
                    <FaTrashAlt /> {/* Delete Icon */}
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    )}

    {/* Conditional Edit Form (Keep this as it was) */}
    {isEditing && stockToEdit && (
      <div style={{ marginTop: '2rem', border: '1px solid #ccc', padding: '1rem' }}>
        <h2>Edit Stock: {stockToEdit.symbol?.toUpperCase()}</h2>
        <AddStockForm
          isEditMode={true}
          // @ts-ignore
          initialData={stockToEdit}
          onUpdate={handleUpdateStock}
          onCancel={handleCancelEdit}
        />
      </div>
    )}
  </div>
);
}