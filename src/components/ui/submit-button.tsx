'use client';

import { useFormStatus } from 'react-dom';

export function SubmitButton({ children }: { children: React.ReactNode }) {
  const { pending } = useFormStatus();

  return (
    <button 
      type="submit" 
      disabled={pending}
      className="w-full h-14 bg-black text-white font-bold rounded-lg hover:bg-pink-600 transition-colors mt-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {pending ? 'Saving...' : children}
    </button>
  );
}
