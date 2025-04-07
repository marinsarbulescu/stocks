// app/components/AddStockForm.tsx
'use client';

import React, { useState, useEffect } from 'react'; // Added useEffect
import { type Schema } from '@/amplify/data/resource'; // Adjust path if needed
import { generateClient } from 'aws-amplify/data';

const client = generateClient<Schema>();

// Define the accurate item type from your schema
type PortfolioStockItem = Schema['PortfolioStock'];

// Define props for the component
type AddStockFormProps = {
  // For Add mode
  onStockAdded?: () => void;
  // For Edit mode
  isEditMode?: boolean;
  initialData?: Partial<PortfolioStockItem> | null; // Data of stock being edited
  onUpdate?: (updatedData: PortfolioStockItem) => Promise<void>; // Update handler from parent
  onCancel?: () => void; // Cancel handler from parent
};

// Define specific types for dropdowns if available in schema
type StockTypeValue = Schema['PortfolioStock']['type'];
// @ts-ignore - TS incorrectly
type RegionValue = Schema['PortfolioStock']['region'];

export default function AddStockForm({
  onStockAdded,
  isEditMode = false, // Default to Add mode
  initialData,
  onUpdate,
  onCancel
}: AddStockFormProps) {
  // State for each form field
  const [symbol, setSymbol] = useState('');
  // @ts-ignore - TS incorrectly
  const [type, setType] = useState<StockTypeValue>('Stock'); // Default value
  const [region, setRegion] = useState<RegionValue>('US');   // Default value
  const [name, setName] = useState('');
  const [pdp, setPdp] = useState(''); // Store as string for input binding
  const [plr, setPlr] = useState(''); // Store as string for input binding
  const [budget, setBudget] = useState(''); // Store as string for input binding

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // --- NEW: Effect to populate form for editing ---
  useEffect(() => {
    if (isEditMode && initialData) {
      // Populate state when initialData is provided for editing
      // @ts-ignore - TS incorrectly
      setSymbol(initialData.symbol ?? '');
      // @ts-ignore - TS incorrectly
      setName(initialData.name ?? '');
      setType((initialData.type ?? 'Stock') as StockTypeValue);
      // @ts-ignore
      setRegion((initialData.region ?? 'US') as RegionValue);
      // Convert potential numbers back to string for input values
      // @ts-ignore - TS incorrectly
      setPdp(initialData.pdp?.toString() ?? '');
      // @ts-ignore - TS incorrectly
      setPlr(initialData.plr?.toString() ?? '');
      // @ts-ignore - TS incorrectly
      setBudget(initialData.budget?.toString() ?? '');
      setError(null); // Clear error when starting edit
    } else {
      // Reset form for Add mode or when initialData is cleared
      setSymbol('');
      // @ts-ignore
      setType('Stock' as StockTypeValue);
      setRegion('US' as RegionValue);
      setName('');
      setPdp('');
      setPlr('');
      setBudget('');
      setError(null);
    }
  }, [isEditMode, initialData]); // Rerun when mode or data changes
  // --- End NEW Effect ---

  // Handle form submission
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    if (!symbol || !type || !region) {
      setError('Symbol, Type, and Region are required.');
      setIsLoading(false);
      return;
    }

    // --- UPDATED: Prepare data payload ---
    // Ensure correct types and handle optional/nullable fields
    const stockDataPayload = {
      symbol: symbol.toUpperCase(),
      type: type as StockTypeValue, // Assert type based on state
      region: region as RegionValue, // Assert type based on state
      name: name || undefined,
      pdp: pdp ? parseFloat(pdp) : undefined,
      plr: plr ? parseFloat(plr) : undefined,
      budget: budget ? parseFloat(budget) : undefined,
    };
    // --- End UPDATED data payload ---

    // --- UPDATED: Handle Edit vs Add ---
    if (isEditMode) {
      // --- EDIT MODE ---
      // @ts-ignore - TS incorrectly
      if (!initialData?.id || !onUpdate) {
        setError('Cannot update stock: Missing ID or update handler.');
        setIsLoading(false);
        return;
      }
      try {
        // @ts-ignore - TS incorrectly
        console.log('Updating stock input:', { id: initialData.id, ...stockDataPayload });
        // Call the onUpdate prop passed from the parent page
        // @ts-ignore - TS incorrectly
        await onUpdate({ id: initialData.id, ...stockDataPayload });
        // Parent component handles closing the form and refreshing data
      } catch (err: any) {
        console.error('Form update error:', err);
        setError(err.message || 'An unexpected error occurred during update.');
      } finally {
        setIsLoading(false);
      }
    } else {
      // --- ADD MODE (Existing Logic) ---
      try {
        console.log('Creating stock input:', stockDataPayload);
        // @ts-ignore - TS incorrectly
        const { errors, data: newStock } = await client.models.PortfolioStock.create(stockDataPayload); // Cast needed if strict

        if (errors) {
          console.error('Error creating stock:', errors);
          setError(errors[0].message || 'Failed to add stock.');
        } else {
          console.log('Stock added successfully:', newStock);
          // Reset form fields manually on success
          // @ts-ignore - TS incorrectly
          setSymbol(''); setType('Stock'); setRegion('US'); setName(''); setPdp(''); setPlr(''); setBudget('');
          setError(null);
          onStockAdded?.(); // Call the callback if provided
        }
      } catch (err: any) {
        console.error('Form submission error:', err);
        setError(err.message || 'An unexpected error occurred.');
      } finally {
        setIsLoading(false);
      }
    }
    // --- End UPDATED Edit vs Add ---
  };

  return (
    // --- UPDATED: Form Title and Buttons ---
    <form onSubmit={handleSubmit} style={{ marginTop: '1rem', borderTop: '1px dashed #eee', paddingTop: '1rem' }}>
      {/* Change title based on mode */}
      {/* @ts-ignore - TS incorrectly */}
      <h2>{isEditMode ? `Edit ${initialData?.symbol ?? 'Stock'}` : 'Add New Stock to Portfolio'}</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Form Fields (Your existing fields go here) */}
      {/* Symbol Input */}
      <div>
         <label htmlFor="symbol" style={{ marginRight: '0.5rem' }}>Stock Symbol:</label>
         <input id="symbol" type="text" value={symbol} onChange={(e) => setSymbol(e.target.value)} required disabled={isLoading} />
      </div>
      {/* Type Select */}
      <div style={{ marginTop: '0.5rem' }}>
         <label htmlFor="type" style={{ marginRight: '0.5rem' }}>Type:</label>
         {/* @ts-ignore - TS incorrectly */}
         <select id="type" value={type} onChange={(e) => setType(e.target.value as StockTypeValue)} required disabled={isLoading}>
            <option value="Stock">Stock</option> <option value="ETF">ETF</option> <option value="Crypto">Crypto</option>
         </select>
      </div>
       {/* Region Select */}
      <div style={{ marginTop: '0.5rem' }}>
         <label htmlFor="region" style={{ marginRight: '0.5rem' }}>Region:</label>
         <select id="region" value={region} onChange={(e) => setRegion(e.target.value as RegionValue)} required disabled={isLoading}>
            <option value="US">US</option> <option value="EU">EU</option> <option value="APAC">APAC</option>
         </select>
      </div>
      {/* Name Input */}
      <div style={{ marginTop: '0.5rem' }}>
        <label htmlFor="name" style={{ marginRight: '0.5rem' }}>Stock Name (Optional):</label>
        <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} disabled={isLoading} />
      </div>
       {/* PDP Input */}
       <div style={{ marginTop: '0.5rem' }}>
         <label htmlFor="pdp" style={{ marginRight: '0.5rem' }}>PDP (%):</label>
         <input id="pdp" type="number" step="any" value={pdp} onChange={(e) => setPdp(e.target.value)} placeholder="e.g., 10.5" disabled={isLoading} />
       </div>
       {/* PLR Input */}
       <div style={{ marginTop: '0.5rem' }}>
          <label htmlFor="plr" style={{ marginRight: '0.5rem' }}>PLR:</label>
          <input id="plr" type="number" step="any" value={plr} onChange={(e) => setPlr(e.target.value)} placeholder="e.g., 3.0" disabled={isLoading} />
       </div>
       {/* Budget Input */}
       <div style={{ marginTop: '0.5rem' }}>
          <label htmlFor="budget" style={{ marginRight: '0.5rem' }}>Annual Budget:</label>
          <input id="budget" type="number" step="any" value={budget} onChange={(e) => setBudget(e.target.value)} placeholder="e.g., 5000" disabled={isLoading} />
       </div>
      {/* --- End Form Fields --- */}


      {/* Submit and Cancel Buttons */}
      <div style={{ marginTop: '1rem' }}>
        <button type="submit" disabled={isLoading}>
          {/* Change button text based on mode */}
          {isLoading ? 'Saving...' : (isEditMode ? 'Update Stock' : 'Add Stock')}
        </button>
        {/* Show Cancel button ONLY in Edit mode */}
        {isEditMode && onCancel && (
          <button type="button" onClick={onCancel} disabled={isLoading} style={{ marginLeft: '10px' }}>
            Cancel
          </button>
        )}
      </div>
      {/* --- End UPDATED Buttons --- */}
    </form>
  );
}