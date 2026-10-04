'use client';

import { Trash2 } from 'lucide-react';
import { deleteTransaction } from '@/app/actions/delete';
import { useTransition } from 'react';

export function DeleteButton({ id, type }: { id: string, type: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <button 
      onClick={() => startTransition(() => deleteTransaction(id, type))}
      disabled={isPending}
      className="text-gray-400 hover:text-red-600 disabled:opacity-50 transition-colors p-2 flex items-center justify-center"
      title="Delete"
    >
      <Trash2 className="w-4 h-4" />
    </button>
  );
}
