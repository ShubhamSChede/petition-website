// src/components/auth/LoginForm.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { loginUser } from '@/lib/firebase/auth';
import type { LoginInput } from '@/types/auth';

interface LoginFormProps {
  redirectPath?: string;
}

export function LoginForm({ redirectPath = '/petitions' }: LoginFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState<LoginInput>({
    email: '',
    password: ''
  });

// src/components/auth/LoginForm.tsx
// Update handleSubmit to redirect admin correctly
const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
  
    try {
      await loginUser(formData);
      // Redirect admin to admin dashboard
      if (formData.email === 'admin@petition.parliament.sr') {
        router.push('/admin');
      } else {
        router.push('/petitions');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-3 text-sm text-red-500 bg-red-50 rounded-md">
          {error}
        </div>
      )}

      <Input
        label="Email"
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        required
      />

      <Input
        label="Password"
        type="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        required
      />

      <Button type="submit" isLoading={loading}>
        Login
      </Button>
    </form>
  );
}