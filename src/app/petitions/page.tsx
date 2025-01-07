// src/app/petitions/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { PetitionList } from '@/components/petitions/PetitionList';
import { getAllPetitions } from '@/lib/firebase/db';
import type { PetitionWithPetitioner } from '@/types/petition';

export default function PetitionsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [petitions, setPetitions] = useState<PetitionWithPetitioner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login?from=/petitions');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    async function fetchPetitions() {
      try {
        const fetchedPetitions = await getAllPetitions();
        setPetitions(fetchedPetitions);
      } catch (err) {
        setError('Failed to load petitions');
        console.error('Error loading petitions:', err);
      } finally {
        setLoading(false);
      }
    }

    if (user) {
      fetchPetitions();
    }
  }, [user]);

  if (authLoading || loading) return <div>Loading...</div>;
  if (!user) return null;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Petitions</h1>
      <PetitionList petitions={petitions} />
    </div>
  );
}