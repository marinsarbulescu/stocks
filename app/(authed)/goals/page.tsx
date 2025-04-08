// app/(authed)/goals/page.tsx
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../../../amplify/data/resource'; // Adjust path if needed

// Define the type for the Goals model instance (includes id, etc.)
type GoalsItem = Schema['PortfolioGoals'];
// Define the type for the form data (just the fields)
type GoalsFormData = Omit<GoalsItem, 'id' | 'createdAt' | 'updatedAt' | 'owner'>;

const client = generateClient<Schema>();

export default function GoalsPage() {
  // State for the existing goals record (if found)
  const [existingGoals, setExistingGoals] = useState<GoalsItem | null>(null);

  // State for individual form fields (bound to inputs)
  const [totalBudget, setTotalBudget] = useState('');
  const [usBudgetPercent, setUsBudgetPercent] = useState('');
  const [intBudgetPercent, setIntBudgetPercent] = useState('');
  const [usStocksTarget, setUsStocksTarget] = useState('');
  const [usEtfsTarget, setUsEtfsTarget] = useState('');
  const [intStocksTarget, setIntStocksTarget] = useState('');
  const [intEtfsTarget, setIntEtfsTarget] = useState('');

  // State for loading, saving, errors, success
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Function to populate form state from fetched data
  const populateForm = (goalsData: GoalsItem | null | undefined) => {
    setTotalBudget(goalsData?.totalBudget?.toString() ?? '');
    setUsBudgetPercent(goalsData?.usBudgetPercent?.toString() ?? '');
    setIntBudgetPercent(goalsData?.intBudgetPercent?.toString() ?? '');
    setUsStocksTarget(goalsData?.usStocksTarget?.toString() ?? '');
    setUsEtfsTarget(goalsData?.usEtfsTarget?.toString() ?? '');
    setIntStocksTarget(goalsData?.intStocksTarget?.toString() ?? '');
    setIntEtfsTarget(goalsData?.intEtfsTarget?.toString() ?? '');
  };

  // Fetch existing goals for the current user
  const fetchGoals = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Owner auth rules mean list() will return 0 or 1 item for the logged-in user
      const { data: goalsList, errors } = await client.models.PortfolioGoals.list();
      if (errors) throw errors;

      const currentGoals = goalsList[0]; // Get the first (and likely only) item
      setExistingGoals(currentGoals ?? null);
      populateForm(currentGoals); // Populate form with fetched data or defaults
      console.log('Fetched goals:', currentGoals);

    } catch (err: any) {
      console.error("Error fetching goals:", err);
      setError(err.message || "Failed to load goals data.");
      setExistingGoals(null);
      populateForm(null); // Reset form on error
    } finally {
      setIsLoading(false);
    }
  }, []); // useCallback with empty dependency array

  // Fetch goals on initial load
  useEffect(() => {
    fetchGoals();
  }, [fetchGoals]);


  // Handle saving the goals (Create or Update)
  const handleSaveGoals = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSaving(true);
    setError(null);
    setSuccess(null);

    try {
      // Prepare payload with parsed numbers (handle empty strings)
      const payload: GoalsFormData = {
        totalBudget: totalBudget ? parseFloat(totalBudget) : null,
        usBudgetPercent: usBudgetPercent ? parseFloat(usBudgetPercent) : null,
        intBudgetPercent: intBudgetPercent ? parseFloat(intBudgetPercent) : null,
        usStocksTarget: usStocksTarget ? parseInt(usStocksTarget, 10) : null,
        usEtfsTarget: usEtfsTarget ? parseInt(usEtfsTarget, 10) : null,
        intStocksTarget: intStocksTarget ? parseInt(intStocksTarget, 10) : null,
        intEtfsTarget: intEtfsTarget ? parseInt(intEtfsTarget, 10) : null,
      };

      let savedGoals: GoalsItem | undefined;
      let saveErrors;

      if (existingGoals?.id) {
        // --- UPDATE existing goals ---
        console.log('Updating goals with ID:', existingGoals.id, payload);
        const { data, errors } = await client.models.PortfolioGoals.update({
          id: existingGoals.id,
          ...payload
        });
        savedGoals = data ?? undefined;
        saveErrors = errors;
      } else {
        // --- CREATE new goals ---
        console.log('Creating new goals:', payload);
        const { data, errors } = await client.models.PortfolioGoals.create(payload);
        savedGoals = data ?? undefined;
        saveErrors = errors;
      }

      if (saveErrors) throw saveErrors;

      console.log('Goals saved successfully:', savedGoals);
      setSuccess('Goals saved successfully!');
      // Update local state with the saved data (including new ID if created)
      if (savedGoals) {
         setExistingGoals(savedGoals);
         populateForm(savedGoals); // Re-populate form to ensure consistency
      }

    } catch (err: any) {
      console.error("Error saving goals:", err);
      const errorMessage = Array.isArray(err) ? err[0].message : (err.message || "An unexpected error occurred.");
      setError(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  // Render UI
  if (isLoading) {
    return <p>Loading goals...</p>;
  }

  return (
    <div>
      <h1>Portfolio Goals</h1>
      <form onSubmit={handleSaveGoals} style={{ display: 'flex', flexDirection: 'column', gap: '15px', maxWidth: '500px' }}>
        {error && <p style={{ color: 'red' }}>Error: {error}</p>}
        {success && <p style={{ color: 'green' }}>{success}</p>}

        <div>
          <label htmlFor="totalBudget">Annual Total Budget ($):</label>
          <input id="totalBudget" type="number" step="0.01" value={totalBudget} onChange={e => setTotalBudget(e.target.value)} disabled={isSaving} style={{ width: '100%' }} />
        </div>
        <div>
          <label htmlFor="usBudgetPercent">Annual US Budget (%):</label>
          <input id="usBudgetPercent" type="number" step="0.01" value={usBudgetPercent} onChange={e => setUsBudgetPercent(e.target.value)} disabled={isSaving} style={{ width: '100%' }} />
        </div>
         <div>
          <label htmlFor="intBudgetPercent">Annual Int'l Budget (%):</label>
          <input id="intBudgetPercent" type="number" step="0.01" value={intBudgetPercent} onChange={e => setIntBudgetPercent(e.target.value)} disabled={isSaving} style={{ width: '100%' }} />
        </div>
         <div>
          <label htmlFor="usStocksTarget">Target # US Stocks:</label>
          <input id="usStocksTarget" type="number" step="1" value={usStocksTarget} onChange={e => setUsStocksTarget(e.target.value)} disabled={isSaving} style={{ width: '100%' }} />
        </div>
         <div>
          <label htmlFor="usEtfsTarget">Target # US ETFs:</label>
          <input id="usEtfsTarget" type="number" step="1" value={usEtfsTarget} onChange={e => setUsEtfsTarget(e.target.value)} disabled={isSaving} style={{ width: '100%' }} />
        </div>
        <div>
          <label htmlFor="intStocksTarget">Target # Int'l Stocks:</label>
          <input id="intStocksTarget" type="number" step="1" value={intStocksTarget} onChange={e => setIntStocksTarget(e.target.value)} disabled={isSaving} style={{ width: '100%' }} />
        </div>
         <div>
          <label htmlFor="intEtfsTarget">Target # Int'l ETFs:</label>
          <input id="intEtfsTarget" type="number" step="1" value={intEtfsTarget} onChange={e => setIntEtfsTarget(e.target.value)} disabled={isSaving} style={{ width: '100%' }} />
        </div>

        <button type="submit" disabled={isSaving} style={{ marginTop: '1rem', padding: '10px' }}>
          {isSaving ? 'Saving...' : 'Save Goals'}
        </button>
      </form>
    </div>
  );
}