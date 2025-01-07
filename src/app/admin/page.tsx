// src/app/admin/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { getAllPetitions, getSignatureThreshold, updateSignatureThreshold } from '../../lib/firebase/db';
import { AdminPetitionList } from '../../components/admin/AdminPetitionList';
import { validateThreshold } from '../../lib/utils/validation';
import type { PetitionWithPetitioner } from '../../types/petition';

export default function AdminDashboardPage() {
  const [petitions, setPetitions] = useState<PetitionWithPetitioner[]>([]);
  const [threshold, setThreshold] = useState<number>(100);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    totalPetitions: 0,
    openPetitions: 0,
    closedPetitions: 0,
    totalSignatures: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [fetchedPetitions, currentThreshold] = await Promise.all([
          getAllPetitions(),
          getSignatureThreshold()
        ]);

        setPetitions(fetchedPetitions);
        setThreshold(currentThreshold);

        // Calculate statistics
        setStats({
          totalPetitions: fetchedPetitions.length,
          openPetitions: fetchedPetitions.filter(p => p.status === 'open').length,
          closedPetitions: fetchedPetitions.filter(p => p.status === 'closed').length,
          totalSignatures: fetchedPetitions.reduce((acc, p) => acc + p.signatures, 0)
        });
      } catch (err) {
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleThresholdUpdate = async () => {
    const errors = validateThreshold(threshold);
    if (errors.length > 0) {
      setError(errors[0].message);
      return;
    }

    try {
      await updateSignatureThreshold(threshold);
      setError(null);
    } catch (err) {
      setError('Failed to update threshold');
    }
  };

  if (loading) {
    return <div>Loading dashboard...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>

      {error && (
        <div className="bg-red-50 text-red-500 p-3 rounded-md">
          {error}
        </div>
      )}

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Total Petitions</h3>
          <p className="mt-2 text-3xl font-semibold text-gray-900">
            {stats.totalPetitions}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Open Petitions</h3>
          <p className="mt-2 text-3xl font-semibold text-green-600">
            {stats.openPetitions}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Closed Petitions</h3>
          <p className="mt-2 text-3xl font-semibold text-gray-600">
            {stats.closedPetitions}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Total Signatures</h3>
          <p className="mt-2 text-3xl font-semibold text-blue-600">
            {stats.totalSignatures}
          </p>
        </div>
      </div>

      {/* Threshold Settings */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-medium mb-4">Signature Threshold Settings</h2>
        <div className="flex items-center space-x-4">
          <input
            type="number"
            value={threshold}
            onChange={(e) => setThreshold(parseInt(e.target.value))}
            className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-32 sm:text-sm border-gray-300 rounded-md"
          />
          <button
            onClick={handleThresholdUpdate}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Update Threshold
          </button>
        </div>
      </div>

      {/* Petitions List */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-medium mb-4">Manage Petitions</h2>
        <AdminPetitionList petitions={petitions} />
      </div>
    </div>
  );
}