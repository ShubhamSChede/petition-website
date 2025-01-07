// src/app/admin/layout.tsx
import { ProtectedRoute } from '../../components/layout/ProtectedRoute';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute requireAdmin={true}>
      <div className="space-y-6">
        <div className="bg-white shadow-sm rounded-lg">
          <div className="px-4 py-5 sm:p-6">{children}</div>
        </div>
      </div>
    </ProtectedRoute>
  );
}