// app/(authed)/txns/[stockId]/add/page.tsx
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation'; // Hook to get URL params
import TransactionForm from '@/app/components/TransactionForm'; // Adjust path if needed
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '@/amplify/data/resource';

import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import Link from 'next/link';

const client = generateClient<Schema>();
type TransactionItem = Schema['Transaction'];

export default function AddTransactionForStockPage() {
  const params = useParams();
  const stockId = params.stockId as string; // Get stockId from URL

  const [stockSymbol, setStockSymbol] = useState<string | undefined>(undefined);

  const [transactions, setTransactions] = useState<TransactionItem[]>([]);
  const [isTxnLoading, setIsTxnLoading] = useState(true);
  const [txnError, setTxnError] = useState<string | null>(null);

  const [isEditingTxn, setIsEditingTxn] = useState(false);
  const [txnToEdit, setTxnToEdit] = useState<TransactionItem | null>(null);

  const handleEditTxnClick = (transaction: TransactionItem) => {
    console.log('Editing transaction:', transaction);
    setTxnToEdit(transaction);
    setIsEditingTxn(true);
    // Optional: Scroll to the form or display it prominently
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUpdateTransaction = async (updatedTxnData: TransactionItem) => {
    // Similar logic to handleUpdateStock, but uses Transaction model
    console.log('Attempting to update transaction:', updatedTxnData);
    setTxnError(null);
    try {
      // Prepare payload - ensure 'id' is present, potentially omit read-only fields
      // @ts-ignore 
      const payload = {
        // @ts-ignore  
        id: updatedTxnData.id, // Required
        // @ts-ignore
        date: updatedTxnData.date,
        // @ts-ignore
        action: updatedTxnData.action,
        // @ts-ignore
        signal: updatedTxnData.signal,
        // @ts-ignore
        price: updatedTxnData.price,
        // @ts-ignore
        investment: updatedTxnData.investment,
        // @ts-ignore
        portfolioStockId: updatedTxnData.portfolioStockId // Include if needed by update
       };
  
        // @ts-ignore
        const { data: updatedTxn, errors } = await client.models.Transaction.update(payload as Schema['Transaction']); // Use explicit payload, cast if needed
  
      if (errors) throw errors;
  
      console.log('Transaction updated successfully:', updatedTxn);
      setIsEditingTxn(false);
      setTxnToEdit(null);
      fetchTransactions(); // Refresh list
    } catch (err: any) {
      console.error('Error updating transaction:', err);
      setTxnError(err.message || 'Failed to update transaction.');
      // Maybe keep form open on error?
    }
    // Add loading state logic if desired
  };

  const handleCancelEditTxn = () => {
    setIsEditingTxn(false);
    setTxnToEdit(null);
  };
  
  const handleDeleteTransaction = async (idToDelete: string) => {
    if (!window.confirm('Are you sure you want to delete this transaction?')) {
      return;
    }
    console.log(`Attempting to delete transaction with id: ${idToDelete}`);
    setTxnError(null); // Clear previous errors
  
    try {
      const { errors } = await client.models.Transaction.delete({ id: idToDelete });
  
      if (errors) {
        console.error('Error deleting transaction:', errors);
        setTxnError(errors[0]?.message || 'Failed to delete transaction.');
      } else {
        console.log('Transaction deleted successfully!');
        // Refresh the transactions list
        fetchTransactions();
      }
    } catch (err: any) {
      console.error('Unexpected error deleting transaction:', err);
      setTxnError(err.message || 'An error occurred during deletion.');
    }
    // Maybe add specific loading state logic if needed
  };
  
  useEffect(() => {
    if (stockId) {
      client.models.PortfolioStock.get({ id: stockId }, { selectionSet: ['symbol'] })
        .then(({ data, errors }) => {
          if (data) {
            setStockSymbol(data.symbol ?? undefined);
          }
          if (errors) console.error("Error fetching stock symbol", errors);
        });
    }
  }, [stockId]);


  // --- Add Function to Fetch Transactions ---
  // Use useCallback to memoize the function, preventing unnecessary calls
  const fetchTransactions = useCallback(async () => {
    if (!stockId) return; // Don't fetch if stockId isn't available yet

    setIsTxnLoading(true);
    setTxnError(null);
    try {
      console.log(`Workspaceing transactions for stockId: ${stockId}`);
      // List transactions, filtering by portfolioStockId and sorting by date descending
      const { data: fetchedTxns, errors } = await client.models.Transaction.list({
        filter: { portfolioStockId: { eq: stockId } },
        // @ts-ignore
        sort: (t) => t.date('DESC'), // Sort newest first
         // Select specific fields if needed
         selectionSet: ['id', 'date', 'action', 'signal', 'price', 'investment']
      });

      if (errors) throw errors;

      // @ts-ignore
      setTransactions(fetchedTxns);
      console.log('Fetched transactions:', fetchedTxns);

    } catch (err: any) {
      console.error('Error fetching transactions:', err);
      setTxnError(err.message || 'Failed to load transactions.');
      setTransactions([]);
    } finally {
      setIsTxnLoading(false);
    }
  }, [stockId]); // Dependency array includes stockId
  // --- End Fetch Transactions Function ---

  // --- Fetch Transactions on Initial Load or when stockId changes ---
  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]); // Call fetchTransactions when it's available/changes
  // --- End Initial Fetch ---


  if (!stockId) {
    return <p>Stock ID not found.</p>;
  }

  return (
    <div>
      <h1>
        Add Transaction {stockSymbol ? `for ${stockSymbol.toUpperCase()}` : ''}
      </h1>

      {isEditingTxn && txnToEdit ? (
        // Render form in Edit mode
        // @ts-ignore
        <TransactionForm
            isEditMode={true}
            initialData={txnToEdit}
            onUpdate={handleUpdateTransaction}
            onCancel={handleCancelEditTxn}
            // No portfolioStockId needed if editing existing txn
        />
        ) : (
            // Render form in Add mode (existing setup)
            <TransactionForm
                portfolioStockId={stockId}
                portfolioStockSymbol={stockSymbol}
                onTransactionAdded={fetchTransactions}
            />
        )}

      {/* --- Add Transaction List/Table Below Form --- */}
      <div style={{ marginTop: '3rem' }}>
        <h2>Recent Transactions {stockSymbol ? `for ${stockSymbol.toUpperCase()}` : ''}</h2>

        {isTxnLoading && <p>Loading transactions...</p>}
        {txnError && <p style={{ color: 'red' }}>Error loading transactions: {txnError}</p>}

        {!isTxnLoading && !txnError && (
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #ccc', textAlign: 'left' }}>
                <th style={{ padding: '8px' }}>Date</th>
                <th style={{ padding: '8px' }}>Action</th>
                <th style={{ padding: '8px' }}>Signal</th>
                <th style={{ padding: '8px' }}>Price</th>
                <th style={{ padding: '8px' }}>Investment/Amount</th>
                <th style={{ padding: '8px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '1rem' }}>
                    No transactions found for this stock.
                  </td>
                </tr>
              ) : (
                transactions.map((txn) => (
                  <tr key={txn.id} style={{ borderBottom: '1px solid #eee' }}>
                    {/* @ts-ignore */ }
                    <td style={{ padding: '8px' }}>{txn.date}</td>
                    {/* @ts-ignore */ }
                    <td style={{ padding: '8px' }}>{txn.action}</td>
                    {/* @ts-ignore */ }
                    <td style={{ padding: '8px' }}>{txn.signal || '--'}</td>
                    {/* @ts-ignore */ }
                    <td style={{ padding: '8px' }}>{txn.price?.toFixed(2) ?? '--'}</td>
                    {/* @ts-ignore */ }
                    <td style={{ padding: '8px' }}>{txn.investment?.toFixed(2) ?? '--'}</td>
                    <td style={{ padding: '8px', textAlign: 'center' }}>
                        {/* Edit Button placeholder */}
                        <button
                            onClick={() => handleEditTxnClick(txn)}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '5px', marginRight: '5px', color: 'blue' }}
                            title="Edit Transaction"
                        >
                            <FaEdit />
                        </button>
                        {/* Delete Button */}
                        <button
                            onClick={() => handleDeleteTransaction(txn.id)} // Call delete handler
                            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '5px', color: 'red' }}
                            title="Delete Transaction"
                        >
                            <FaTrashAlt />
                        </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
      {/* --- End Transaction List --- */}

    </div>
  );
}