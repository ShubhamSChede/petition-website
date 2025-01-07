'use client'
import Link from 'next/link';
import { useAuth } from '../../hooks/useAuth';
import { logoutUser } from '../../lib/firebase/auth';
import { useRouter } from 'next/navigation';

export function Navbar() {
  const { user } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logoutUser();
      router.push('/auth/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold">
              SLPP
            </Link>
            {user && (
              <div className="ml-10 flex items-baseline space-x-4">
                <Link
                  href="/petitions"
                  className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md"
                >
                  Petitions
                </Link>
                <Link
                  href="/create-petition"
                  className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md"
                >
                  Create Petition
                </Link>
              </div>
            )}
          </div>

          <div className="flex items-center">
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-gray-700">{user.email}</span>
                <button
                  onClick={handleLogout}
                  className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                href="/auth/login"
                className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}