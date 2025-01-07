// src/app/petitions/create/page.tsx
'use client';

import { ProtectedRoute } from '@/components/layout/ProtectedRoute';
import { PetitionForm } from '@/components/petitions/PetitionForm';

export default function CreatePetitionPage() {
  return (
    <ProtectedRoute>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Create a New Petition</h1>
        <PetitionForm />
      </div>
    </ProtectedRoute>
  );
}
