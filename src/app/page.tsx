// src/app/page.tsx
import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)]">
      <h1 className="text-4xl font-bold mb-4">
        Welcome to Shangri-La Public Petition Platform
      </h1>
      <p className="text-xl text-gray-600 mb-8">
        Create and sign petitions to make your voice heard
      </p>
      <div className="space-x-4">
        <Link
          href="/auth/login"
          className="inline-block bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
        >
          Login
        </Link>
        <Link
          href="/auth/register"
          className="inline-block bg-white text-blue-500 px-6 py-2 rounded-lg border border-blue-500 hover:bg-blue-50"
        >
          Register
        </Link>
      </div>
    </div>
  );
}