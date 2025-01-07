// src/components/layout/ProtectedRoute.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'; // Create this if you haven't

export function ProtectedRoute({ 
  children,
  requireAdmin = false 
}: { 
  children: React.ReactNode;
  requireAdmin?: boolean;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      // If no user, redirect to login
      if (!user) {
        router.push('/auth/login');
        return;
      }

      // If admin required but user is not admin
      if (requireAdmin && user.email !== 'admin@petition.parliament.sr') {
        router.push('/petitions');
        return;
      }
    }
  }, [user, loading, router, requireAdmin]);

  if (loading) {
    return <LoadingSpinner />;
  }

  // Only render children if authentication requirements are met
  if (!user) return null;
  if (requireAdmin && user.email !== 'admin@petition.parliament.sr') return null;

  return <>{children}</>;
}