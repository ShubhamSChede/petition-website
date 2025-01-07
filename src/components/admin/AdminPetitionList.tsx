// src/components/admin/AdminPetitionList.tsx
'use client';

import { useState } from 'react';
import { updatePetitionResponse } from '@/lib/firebase/db';
import type { PetitionWithPetitioner } from '@/types/petition';

interface AdminPetitionListProps {
  petitions: PetitionWithPetitioner[];
}

export function AdminPetitionList({ petitions }: AdminPetitionListProps) {
  const [responses, setResponses] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState<{ [key: string]: boolean }>({});
  const [error, setError] = useState<string | null>(null);

  const handleResponseChange = (petitionId: string, value: string) => {
    setResponses(prev => ({
      ...prev,
      [petitionId]: value
    }));
  };

  const handleSubmitResponse = async (petitionId: string) => {
    if (!responses[petitionId]?.trim()) {
      setError('Response cannot be empty');
      return;
    }

    setLoading(prev => ({ ...prev, [petitionId]: true }));
    setError(null);

    try {
      await updatePetitionResponse(petitionId, responses[petitionId]);
      // Refresh the page or update the petition list
      window.location.reload();
    } catch (err) {
      setError('Failed to submit response');
    } finally {
      setLoading(prev => ({ ...prev, [petitionId]: false }));
    }
  };

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-50 text-red-500 p-3 rounded-md">{error}</div>
      )}
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Petitioner
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Signatures
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Response
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {petitions.map((petition) => (
              <tr key={petition.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {petition.title}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">
                    {petition.petitioner.fullName}
                  </div>
                  <div className="text-sm text-gray-500">
                    {petition.petitioner.email}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {petition.signatures}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    petition.status === 'open' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {petition.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  {petition.status === 'open' ? (
                    <textarea
                      className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      rows={3}
                      value={responses[petition.id] || ''}
                      onChange={(e) => handleResponseChange(petition.id, e.target.value)}
                      placeholder="Enter response..."
                    />
                  ) : (
                    <div className="text-sm text-gray-900">
                      {petition.response}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {petition.status === 'open' && (
                    <button
                      onClick={() => handleSubmitResponse(petition.id)}
                      disabled={loading[petition.id]}
                      className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                    >
                      {loading[petition.id] ? 'Submitting...' : 'Submit Response'}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}