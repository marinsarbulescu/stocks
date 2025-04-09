// app/(authed)/txns/[stockId]/add/page.tsx
'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams } from 'next/navigation'; // Hook to get URL params
import TransactionForm from '@/app/components/TransactionForm'; // Adjust path if needed
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '@/amplify/data/resource';

import { FaEdit, FaTrashAlt } from 'react-icons/fa';

const client = generateClient<Schema>();
type TransactionItem = Schema['Transaction'];

export default function AddTransactionForStockPage() {
  const params = useParams();
  const stockId = params.stockId as string; // Get stockId from URL

  type SortableTxnKey = 'date' | 'price' | 'action' | 'signal' | 'investment'; // Add others if needed
  const [txnSortConfig, setTxnSortConfig] = useState<{ key: SortableTxnKey; direction: 'ascending' | 'descending' } | null>(null);

  const [stockSymbol, setStockSymbol] = useState<string | undefined>(undefined);

  const [transactions, setTransactions] = useState<TransactionItem[]>([]);
  const [isTxnLoading, setIsTxnLoading] = useState(true);
  const [txnError, setTxnError] = useState<string | null>(null);

  const [isEditingTxn, setIsEditingTxn] = useState(false);
  const [txnToEdit, setTxnToEdit] = useState<TransactionItem | null>(null);

  const [userGoals, setUserGoals] = useState<Schema['PortfolioGoals'] | null>(null);
  const [allUserTxns, setAllUserTxns] = useState<Schema['Transaction'][]>([]);
  const [isGoalsLoading, setIsGoalsLoading] = useState(true);
  const [isAllTxnsLoading, setIsAllTxnsLoading] = useState(true);

  // --- Add Function to Handle Sort Requests ---
  const requestTxnSort = (key: SortableTxnKey) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    // If clicking the same key again, toggle direction
    if (txnSortConfig && txnSortConfig.key === key && txnSortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setTxnSortConfig({ key, direction });
    console.log(`Sorting by ${key}, direction ${direction}`);
  };
  // --- End Sort Request Function ---
  
  // --- Add Function to Fetch Goals ---
  const fetchUserGoals = useCallback(async () => {
    setIsGoalsLoading(true);
    // setError(null); // Use a specific error state if preferred
    try {
      const { data: goalsList, errors } = await client.models.PortfolioGoals.list();
      if (errors) throw errors;
      const currentGoals = goalsList[0] ?? null;
      // @ts-ignore
      setUserGoals(currentGoals);
      console.log('Fetched goals for budget calc:', currentGoals);
    } catch (err: any) {
      console.error("Error fetching goals:", err);
      // setGoalsError(err.message || "Failed to load goals data.");
      setUserGoals(null);
    } finally {
      setIsGoalsLoading(false);
    }
  }, []);
  // --- End Fetch Goals ---

  // --- Add Function to Fetch All Buy Transactions ---
  const fetchAllUserTransactions = useCallback(async () => {
    setIsAllTxnsLoading(true);
    // setTxnError(null); // Use specific error state if preferred
    try {
        console.log('Fetching all buy transactions for budget calc...');
        const { data: userTxns, errors } = await client.models.Transaction.list({
            // filter: { action: { eq: 'Buy' } },
            // Fetch all, pagination might be needed for very large numbers later
            selectionSet: ['id', 'action', 'investment', 'price', 'shares']
        });
        if (errors) throw errors;
        // @ts-ignore
        setAllUserTxns(userTxns);
        console.log('Fetched all buy transactions:', userTxns);
    } catch (err: any) {
        console.error('Error fetching all buy transactions:', err);
        // setAllTxnError(err.message || 'Failed to load all transactions.');
        setAllUserTxns([]);
    } finally {
        setIsAllTxnsLoading(false);
    }
  }, []);
  // --- End Fetch All Buy Txns ---
  
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

  // Rename and update the calculation logic
  const netBudgetImpact = useMemo(() => {
    // @ts-ignore - Keep if needed for allUserTxns type
    return allUserTxns.reduce((sum, txn) => {
      // @ts-ignore - Keep if needed for txn type
      const investment = typeof txn.investment === 'number' ? txn.investment : 0;
      // @ts-ignore - Acknowledge potential type issues on txn
      const price = typeof txn.price === 'number' ? txn.price : 0;
      // @ts-ignore - Acknowledge potential type issues on txn
      const shares = typeof txn.shares === 'number' ? txn.shares : 0;
      // @ts-ignore - Keep if needed for txn type
      
      // @ts-ignore - Acknowledge potential type issues on txn
      if (txn.action === 'Buy' || txn.action === 'Div') {
        // Buys and Dividends decrease budget (increase spending sum)
        return sum + investment;
      // @ts-ignore - Acknowledge potential type issues on txn
      } else if (txn.action === 'Sell') {
        // Sells increase budget (decrease spending sum)
        const sellReturn = price * shares;
        return sum - sellReturn;
      } else {
        return sum; // Ignore other types if any
      }
    }, 0);
  // @ts-ignore - Keep if needed
  }, [allUserTxns]); // Depend on the state holding all transactions

  const remainingBudget = useMemo(() => {
    // @ts-ignore - Acknowledge potential type issues on userGoals
    const totalBudget = typeof userGoals?.totalBudget === 'number' ? userGoals.totalBudget : 0;
    // Subtract the net impact (Buys/Divs are positive impact, Sells are negative impact)
    return totalBudget - netBudgetImpact;
    // @ts-ignore - Acknowledge potential type issues on userGoals
  }, [userGoals?.totalBudget, netBudgetImpact]);
  
  // --- Add Memoized Sort Logic ---
  const sortedTransactions = useMemo(() => {
    let sortableItems = [...transactions]; // Create a mutable copy of transactions for THIS stock
    if (txnSortConfig !== null) {
      sortableItems.sort((a, b) => {
        // @ts-ignore - Bypassing TS check due to known issues with accessing props on Amplify types
        const valA = a[txnSortConfig.key];
        // @ts-ignore - Bypassing TS check
        const valB = b[txnSortConfig.key];

        // Handle null/undefined and different types for robust comparison
        let comparison = 0;
        if (valA === null || valA === undefined) comparison = -1;
        else if (valB === null || valB === undefined) comparison = 1;
        else if (valA < valB) comparison = -1;
        else if (valA > valB) comparison = 1;

        return txnSortConfig.direction === 'ascending' ? comparison : comparison * -1;
      });
    }
    // Add default sort? The fetch already sorts by date descending.
    // If you remove sort from fetch, you could add default here:
    // else { sortableItems.sort((a, b) => (a.date < b.date ? 1 : -1)); } // Example default sort
    return sortableItems;
  }, [transactions, txnSortConfig]); // Re-sort only when transactions data or sort config changes
  // --- End Memoized Sort Logic ---
  
  useEffect(() => {
    if (stockId) {
      client.models.PortfolioStock.get({ id: stockId }, { selectionSet: ['symbol'] })
        .then(({ data, errors }) => {
          if (data) {
            fetchUserGoals();
            fetchAllUserTransactions();
            setStockSymbol(data.symbol ?? undefined);
          }
          if (errors) console.error("Error fetching stock symbol", errors);
        });
    }
  }, [stockId, fetchUserGoals, fetchAllUserTransactions]);
  
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

      {/* --- Display Remaining Budget --- */}
      <div style={{ marginBottom: '1.5rem', padding: '10px', border: '1px solid #ddd' }}>
          <h3>Budget Overview</h3>
          {(isGoalsLoading || isAllTxnsLoading) ? (
            <p>Loading budget data...</p>
          ) : (
            <p>
              Remaining Annual Budget:
              <strong style={{ marginLeft: '10px', fontSize: '1.1em' }}>
                ${remainingBudget.toFixed(2)}
              </strong>
              <small style={{ marginLeft: '10px' }}>
                {/* @ts-ignore */ }
                (Target: ${userGoals?.totalBudget?.toFixed(2) ?? '0.00'} - Net Impact: ${netBudgetImpact.toFixed(2)})
              </small>
            </p>
          )}
        </div>
        {/* --- End Display --- */}

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
                onTransactionAdded={() => {
                  fetchTransactions(); // Refetch txns for current stock list
                  fetchAllUserTransactions(); // Refetch all buy txns for budget calc
               }}
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
              <th style={{ padding: '8px', cursor: 'pointer' }} onClick={() => requestTxnSort('date')}>
                Date {txnSortConfig?.key === 'date' ? (txnSortConfig.direction === 'ascending' ? '▲' : '▼') : null}
              </th>
                <th style={{ padding: '8px' }}>Action</th>
                <th style={{ padding: '8px' }}>Signal</th>
                <th style={{ padding: '8px', cursor: 'pointer' }} onClick={() => requestTxnSort('price')}>
                  Price {txnSortConfig?.key === 'price' ? (txnSortConfig.direction === 'ascending' ? '▲' : '▼') : null}
                </th>
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
                sortedTransactions.map((txn) => (
                  // @ts-ignore
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
                            // @ts-ignore
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