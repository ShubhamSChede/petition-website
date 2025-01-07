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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const user = await loginUser(formData);
      console.log("Login successful", user);
      
      // Wait a bit for the auth state to update
      setTimeout(() => {
        router.push(redirectPath);
      }, 100);
      
    } catch (err: any) {
      console.error("Login error:", err);
      setError(err.message || 'Failed to login');
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