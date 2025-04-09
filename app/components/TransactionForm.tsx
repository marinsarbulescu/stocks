// app/components/TransactionForm.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { type Schema } from '@/amplify/data/resource'; // Adjust path if needed
import { generateClient } from 'aws-amplify/data';

const client = generateClient<Schema>();

// Define the accurate item types
type TransactionItem = Schema['Transaction'];
type PortfolioStockItem = Schema['PortfolioStock']; // Keep if needed elsewhere, maybe not here

// Define props for the component
interface TransactionFormProps {
  // Always required now for linking
  portfolioStockId: string;
  // Optional display info
  portfolioStockSymbol?: string;
  // Callback for Add mode
  onTransactionAdded?: () => void;
  // Props for Edit mode
  isEditMode?: boolean;
  initialData?: Partial<TransactionItem> | null; // Data of txn being edited
  onUpdate?: (updatedData: TransactionItem) => Promise<void>; // Update handler from parent
  onCancel?: () => void; // Cancel handler from parent
}

// Define specific types for dropdowns if available in schema
// @ts-ignore
type TxnActionValue = Schema['Transaction']['action'];
// @ts-ignore
type TxnSignalValue = Schema['Transaction']['signal'];

export default function TransactionForm({
  // Destructure ALL props, including new ones
  portfolioStockId,
  portfolioStockSymbol,
  onTransactionAdded,
  isEditMode = false, // Default to Add mode
  initialData,
  onUpdate,
  onCancel
}: TransactionFormProps) { // Make sure all props are destructured here

  // State for form fields
  const [date, setDate] = useState('');
  const [action, setAction] = useState<TxnActionValue>('Buy'); // Default value
  const [signal, setSignal] = useState<TxnSignalValue | undefined>(undefined);
  const [price, setPrice] = useState('');
  const [investment, setInvestment] = useState('');
  const [shares, setShares] = useState('');

  // State for submission status
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // --- CORRECTED: Effect to populate form for editing ---
  useEffect(() => {
    if (isEditMode && initialData) {
      // Populate state from initialData for editing
      // @ts-ignore
      setDate(initialData.date ?? ''); // Date should be YYYY-MM-DD string
      // @ts-ignore
      setAction(initialData.action ?? 'Buy');
      // @ts-ignore - Use ignore for signal if explicit cast doesn't work
      setSignal(initialData.signal ?? undefined);
      // @ts-ignore
      setPrice(initialData.price?.toString() ?? ''); // Convert number back to string
      // @ts-ignore
      setInvestment(initialData.investment?.toString() ?? ''); // Convert number back to string
      // @ts-ignore
      setShares(initialData.shares?.toString() ?? '');
      
      setError(null);
      setSuccess(null); // Clear success message when starting edit
    } else {
      // Reset form for Add mode
      setDate('');
      setAction('Buy');
      setSignal(undefined);
      setPrice('');
      setInvestment('');
      setShares('');
      
      setError(null);
      // Don't clear success message here, let it persist after adding
    }
    // Only re-run when switching modes or the initial data changes
  }, [isEditMode, initialData]);
  // --- End CORRECTED Effect ---

  // Handle form submission
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null); // Clear previous success message

    // Use portfolioStockId from props for both add and edit linking
    if (!date || (!isEditMode && !portfolioStockId) || !action) {
      setError('Date, Action required. Stock context must be provided when adding.');
      setIsLoading(false);
      return;
    }

    // Prepare payload - common fields
    const commonPayload = {
        date: date,
        action: action as TxnActionValue, // Cast enum
        signal: (action === 'Buy' || action === 'Div') ? (signal || undefined) : undefined,
        price: (action === 'Buy' || action === 'Sell' || action === 'Div') ? (price ? parseFloat(price) : undefined) : undefined,
        investment: (action === 'Buy' || action === 'Div') ? (investment ? parseFloat(investment) : undefined) : undefined,
        shares: (action === 'Sell') ? (shares ? parseFloat(shares) : undefined) : undefined,
    };

    // --- ADDED: Handle Edit vs Add ---
    if (isEditMode) {
      // --- EDIT MODE ---
      // @ts-ignore
      if (!initialData?.id || !onUpdate) { /* ... error handling ... */ return; }
        try {
          // @ts-ignore  
          const updatePayload = { id: initialData.id, portfolioStockId: portfolioStockId, ...commonPayload };
            console.log('Updating transaction:', updatePayload);
            // @ts-ignore
            await onUpdate(updatePayload as TransactionItem); // Cast might be needed
        } catch (err: any) { /* ... error handling ... */ }
        finally { setIsLoading(false); }
    } else {
        // --- ADD MODE ---
        try {
            const createPayload = { portfolioStockId: portfolioStockId, ...commonPayload };
            console.log('Creating transaction:', createPayload);
            const { errors, data: newTransaction } = await client.models.Transaction.create(createPayload);
            if (errors) { /* ... error handling ... */ }
            else { /* ... success handling, reset form, call onTransactionAdded ... */ }
        } catch (err: any) { /* ... error handling ... */ }
        finally { setIsLoading(false); }
    }
    // --- End Edit vs Add Handling ---
  };

  return (
     // --- UPDATED: Form Title and Buttons ---
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '400px' }}>
      {/* Display Stock Symbol if provided (useful context) */}
      {portfolioStockSymbol && !isEditMode && <p>Adding transaction for: <strong>{portfolioStockSymbol.toUpperCase()}</strong></p>}

      {/* Change title based on mode */}
      {/* @ts-ignore */}
      <h2>{isEditMode ? `Edit Transaction (ID: ${initialData?.id.substring(0, 5)}...)` : 'Add New Transaction'}</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && !isEditMode && <p style={{ color: 'green' }}>{success}</p>} {/* Show success only in Add mode */}

      {/* Form Fields... (These should be fine as they were) */}
      <div>
        <label htmlFor="date">Date:</label>
        <input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required disabled={isLoading} style={{ width: '100%' }} />
      </div>
      {/* Action Select */}
      <div>
         <label htmlFor="action">Action:</label>
         <select id="action" value={action} onChange={(e) => setAction(e.target.value as TxnActionValue)} required disabled={isLoading} style={{ width: '100%' }}>
            <option value="Buy">Buy</option> <option value="Sell">Sell</option> <option value="Div">Dividend</option>
         </select>
      </div>
      {/* Conditional Fields */}
      {(action === 'Buy') && (
        <>
          {/* Signal (Optional) - Only for Buy/Div */}
          <div>
              <label htmlFor="signal">Signal (Optional):</label>
              <select id="signal" value={signal ?? ''} onChange={(e) => setSignal(e.target.value as TxnSignalValue || undefined)} disabled={isLoading} style={{ width: '100%' }}>
                <option value="">-- Select Signal --</option>
                <option value="_5DD">_5DD</option> {/* Correct value */}
                <option value="Cust">Cust</option>
                <option value="Initial">Initial</option>
                <option value="EOM">EOM</option>
                <option value="LBD">LBD</option>
                <option value="TP">TP</option>
              </select>
          </div>
        </>
      )} 
      {(action === 'Buy' || action === 'Sell') && (
        <>
          <div>
              <label htmlFor="price">Price:</label>
              <input id="price" type="number" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="e.g., 150.25" disabled={isLoading} style={{ width: '100%' }} />
          </div>
        </>
      )}
      {(action === 'Buy') && (  
        <>
          <div>
              <label htmlFor="investment">Investment:</label>
              <input id="investment" type="number" step="0.01" value={investment} onChange={(e) => setInvestment(e.target.value)} placeholder="e.g., 1000.00" disabled={isLoading} style={{ width: '100%' }}/>
          </div>
        </>
      )}
      {(action === 'Div') && (  
        <>
          <div>
              <label htmlFor="investment">Amount:</label>
              <input id="investment" type="number" step="0.01" value={investment} onChange={(e) => setInvestment(e.target.value)} placeholder="e.g., 1000.00" disabled={isLoading} style={{ width: '100%' }}/>
          </div>
        </>
      )}
      {action === 'Sell' && (
        <>  
          <div><label htmlFor="shares">Shares:</label><input id="shares" type="number" step="any" value={shares} onChange={(e) => setShares(e.target.value)} required placeholder="e.g., 10.5" disabled={isLoading} style={{ width: '100%' }} /></div>
        </>
      )}
      {/* --- End Form Fields --- */}

      {/* Submit and Cancel Buttons */}
      <div style={{ marginTop: '1rem' }}>
        <button type="submit" disabled={isLoading}>
          {/* Change button text based on mode */}
          {isLoading ? 'Saving...' : (isEditMode ? 'Update Transaction' : 'Add Transaction')}
        </button>
        {/* Show Cancel button ONLY in Edit mode */}
        {isEditMode && onCancel && (
          <button type="button" onClick={onCancel} disabled={isLoading} style={{ marginLeft: '10px' }}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}