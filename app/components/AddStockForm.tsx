// app/components/AddStockForm.tsx
'use client';

import React, { useState } from 'react';
// 1. Import the generated Schema type and generateClient
import { type Schema } from '@/amplify/data/resource'; // Adjust path if needed
import { generateClient } from 'aws-amplify/data';

// 2. Create the Amplify Data client instance, typed with your schema
const client = generateClient<Schema>();

// Define props for the component, like a callback when a stock is added
type AddStockFormProps = {
  onStockAdded?: () => void;
};

export default function AddStockForm({ onStockAdded }: AddStockFormProps) {
  // State for each form field
  const [symbol, setSymbol] = useState('');
  const [type, setType] = useState<string>('Stock'); // Default value
  const [region, setRegion] = useState<string>('US');   // Default value
  const [name, setName] = useState('');
  const [pdp, setPdp] = useState(''); // Store as string for input binding
  const [plr, setPlr] = useState(''); // Store as string for input binding
  const [budget, setBudget] = useState(''); // Store as string for input binding

  // State for loading and error messages
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Handle form submission
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault(); // Prevent default browser form submission
    setIsLoading(true);
    setError(null);

    if (!symbol || !type || !region) {
      setError('Symbol, Type, and Region are required.');
      setIsLoading(false);
      return;
    }

    try {
        type StockTypeValue = "Stock" | "ETF" | "Crypto";
        type RegionValue = "US" | "EU" | "APAC";
      // 3. Prepare the data payload, converting numbers correctly
      const stockInput = {
        symbol: symbol.toUpperCase(), // Example: Normalize to uppercase
        type: type as StockTypeValue,
        region: region as RegionValue,
        name: name || undefined, // Send undefined if name is empty
        // Parse numeric fields, send undefined if empty/invalid
        pdp: pdp ? parseFloat(pdp) : undefined,
        plr: plr ? parseFloat(plr) : undefined,
        budget: budget ? parseFloat(budget) : undefined,
      };

      // 4. Use the client to call the create mutation for PortfolioStock
      console.log('Submitting stock input:', stockInput);
      const { errors, data: newStock } = await client.models.PortfolioStock.create(stockInput);

      if (errors) {
        console.error('Error creating stock:', errors);
        setError(errors[0].message || 'Failed to add stock.');
      } else {
        console.log('Stock added successfully:', newStock);
        // Reset form fields
        setSymbol('');
        setType('Stock');
        setRegion('US');
        setName('');
        setPdp('');
        setPlr('');
        setBudget('');
        setError(null);
        // Call the callback function if provided
        onStockAdded?.();
      }
    } catch (err: any) {
      console.error('Form submission error:', err);
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false); // Ensure loading state is reset
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: '2rem', border: '1px solid #ccc', padding: '1rem' }}>
      <h2>Add New Stock to Portfolio</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div>
        <label htmlFor="symbol" style={{ marginRight: '0.5rem' }}>Stock Symbol:</label>
        <input
          id="symbol"
          type="text"
          value={symbol}
          onChange={(e) => setSymbol(e.target.value)}
          required
          disabled={isLoading}
        />
      </div>

      <div style={{ marginTop: '0.5rem' }}>
        <label htmlFor="type" style={{ marginRight: '0.5rem' }}>Type:</label>
        <select
          id="type"
          value={type}
          // Type assertion needed because event value is string
          onChange={(e) => setType(e.target.value)}
          required
          disabled={isLoading}
        >
          {/* Consider generating these options dynamically from the schema if needed */}
          <option value="Stock">Stock</option>
          <option value="ETF">ETF</option>
          <option value="Crypto">Crypto</option>
        </select>
      </div>

      <div style={{ marginTop: '0.5rem' }}>
        <label htmlFor="region" style={{ marginRight: '0.5rem' }}>Region:</label>
        <select
          id="region"
          value={region}
          onChange={(e) => setRegion(e.target.value)}
          required
          disabled={isLoading}
        >
          <option value="US">US</option>
          <option value="EU">EU</option>
          <option value="APAC">APAC</option>
        </select>
      </div>

      <div style={{ marginTop: '0.5rem' }}>
        <label htmlFor="name" style={{ marginRight: '0.5rem' }}>Stock Name (Optional):</label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={isLoading}
        />
      </div>

      <div style={{ marginTop: '0.5rem' }}>
        <label htmlFor="pdp" style={{ marginRight: '0.5rem' }}>PDP (%):</label>
        <input
          id="pdp"
          type="number"
          step="any" // Allow decimal numbers
          value={pdp}
          onChange={(e) => setPdp(e.target.value)}
          placeholder="e.g., 10.5"
          disabled={isLoading}
        />
      </div>

      <div style={{ marginTop: '0.5rem' }}>
        <label htmlFor="plr" style={{ marginRight: '0.5rem' }}>PLR:</label>
        <input
          id="plr"
          type="number"
          step="any"
          value={plr}
          onChange={(e) => setPlr(e.target.value)}
          placeholder="e.g., 3.0"
          disabled={isLoading}
        />
      </div>

      <div style={{ marginTop: '0.5rem' }}>
        <label htmlFor="budget" style={{ marginRight: '0.5rem' }}>Annual Budget:</label>
        <input
          id="budget"
          type="number"
          step="any"
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
          placeholder="e.g., 5000"
          disabled={isLoading}
        />
      </div>

      <button type="submit" disabled={isLoading} style={{ marginTop: '1rem' }}>
        {isLoading ? 'Adding...' : 'Add Stock'}
      </button>
    </form>
  );
}