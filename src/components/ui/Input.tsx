// src/components/ui/Input.tsx
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string;
  }
  
  export function Input({ label, error, ...props }: InputProps) {
    return (
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">{label}</label>
        <input
          {...props}
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
      </div>
    );
  }