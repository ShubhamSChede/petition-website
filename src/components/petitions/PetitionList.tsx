// src/components/petitions/PetitionList.tsx
'use client';

import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { signPetition } from '../../lib/firebase/db';
import type { PetitionWithPetitioner } from '../../types/petition';

interface PetitionListProps {
  petitions: PetitionWithPetitioner[];
}

export function PetitionList({ petitions }: PetitionListProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState<{ [key: string]: boolean }>({});
  const [error, setError] = useState<string | null>(null);
  const [localPetitions, setLocalPetitions] = useState(petitions);

  const handleSignPetition = async (petitionId: string) => {
    if (!user) {
      setError('You must be logged in to sign a petition');
      return;
    }

    setLoading(prev => ({ ...prev, [petitionId]: true }));
    setError(null);

    try {
      await signPetition(user.uid, petitionId);
      
      // Update local state instead of reloading
      setLocalPetitions(prev => 
        prev.map(petition => 
          petition.id === petitionId 
            ? { ...petition, signatures: petition.signatures + 1 }
            : petition
        )
      );
    } catch (err: any) {
      setError(err.message || 'Failed to sign petition');
    } finally {
      setLoading(prev => ({ ...prev, [petitionId]: false }));
    }
  };

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-50 text-red-500 p-3 rounded-md">
          {error}
        </div>
      )}

      {localPetitions.map((petition) => (
        <div 
          key={petition.id}
          className="bg-white shadow rounded-lg overflow-hidden"
        >
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900">
              {petition.title}
            </h2>
            
            <div className="mt-2 text-sm text-gray-600">
              <p>Created by: {petition.petitioner.fullName}</p>
              <p>Signatures: {petition.signatures}</p>
            </div>

            <p className="mt-4 text-gray-700">
              {petition.content}
            </p>

            {petition.response && (
              <div className="mt-4 p-4 bg-gray-50 rounded-md">
                <h3 className="text-sm font-medium text-gray-900">
                  Official Response:
                </h3>
                <p className="mt-2 text-sm text-gray-700">
                  {petition.response}
                </p>
              </div>
            )}

            {petition.status === 'open' && user && (
              <div className="mt-6">
                <button
                  onClick={() => handleSignPetition(petition.id)}
                  disabled={loading[petition.id]}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {loading[petition.id] ? 'Signing...' : 'Sign Petition'}
                </button>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}