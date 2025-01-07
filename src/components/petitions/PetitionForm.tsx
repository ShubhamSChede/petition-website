// src/components/petitions/PetitionForm.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../hooks/useAuth';
import { createPetition } from '../../lib/firebase/db';
import type { CreatePetitionInput } from '../../types/petition';

export function PetitionForm() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<CreatePetitionInput>({
    title: '',
    content: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      setError('You must be logged in to create a petition');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await createPetition(user.uid, formData);
      router.push('/petitions');
    } catch (err) {
      setError('Failed to create petition. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 text-red-500 p-3 rounded-md">
          {error}
        </div>
      )}

      <div>
        <label 
          htmlFor="title" 
          className="block text-sm font-medium text-gray-700"
        >
          Petition Title
        </label>
        <input
          type="text"
          name="title"
          id="title"
          value={formData.title}
          onChange={handleChange}
          required
          className="mt-1 block w-full shadow-sm sm:text-sm focus:ring-blue-500 focus:border-blue-500 border-gray-300 rounded-md"
        />
      </div>

      <div>
        <label 
          htmlFor="content" 
          className="block text-sm font-medium text-gray-700"
        >
          Petition Content
        </label>
        <textarea
          name="content"
          id="content"
          rows={6}
          value={formData.content}
          onChange={handleChange}
          required
          className="mt-1 block w-full shadow-sm sm:text-sm focus:ring-blue-500 focus:border-blue-500 border-gray-300 rounded-md"
        />
      </div>

      <div>
        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {loading ? 'Creating...' : 'Create Petition'}
        </button>
      </div>
    </form>
  );
}