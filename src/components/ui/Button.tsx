// src/components/ui/Button.tsx
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    isLoading?: boolean;
  }
  
  export function Button({ children, isLoading, ...props }: ButtonProps) {
    return (
      <button
        {...props}
        disabled={isLoading || props.disabled}
        className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
      >
        {isLoading ? 'Loading...' : children}
      </button>
    );
  }