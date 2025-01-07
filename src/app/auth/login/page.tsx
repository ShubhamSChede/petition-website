// src/app/auth/login/page.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { LoginForm } from '@/components/auth/LoginForm';

export default function LoginPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      // Redirect based on user role
      if (user.email === 'admin@petition.parliament.sr') {
        router.push('/admin');
      } else {
        router.push('/petitions');
      }
    }
  }, [user, loading, router]);

  // Don't show login form if user is already logged in
  if (loading || user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full space-y-8">
        <h1 className="text-3xl font-bold text-center">Login to SLPP</h1>
        <LoginForm />
      </div>
    </div>
  );
}