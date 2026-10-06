'use client';

import { useOptimistic } from 'react';
import { DeleteButton } from './delete-button';
import { deleteTransaction } from '@/app/actions/delete';

type Activity = {
  id: string;
  type: string;
  amount: number;
  date: string;
  title: string;
};

export function RecentActivityList({ initialActivities }: { initialActivities: Activity[] }) {
  const [optimisticActivities, addOptimisticActivity] = useOptimistic(
    initialActivities,
    (state, idToRemove: string) => state.filter(a => a.id !== idToRemove)
  );

  if (optimisticActivities.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-gray-400">
        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <div className="text-sm font-semibold">No recent activity yet.</div>
        <div className="text-xs mt-1">Your logged transactions will appear here.</div>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-6">
      {optimisticActivities.map(act => (
        <div key={act.id} className="flex justify-between items-center transition-all duration-300">
          <div className="flex items-center gap-4">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${act.type === 'sale' ? 'bg-green-50 text-green-600' : 'bg-pink-50 text-pink-600'}`}>
              {act.type === 'sale' ? 'S' : act.type === 'purchase' ? 'P' : 'E'}
            </div>
            <div>
              <div className="font-bold text-sm">{act.title}</div>
              <div className="text-xs font-medium text-gray-400">{new Date(act.date).toLocaleDateString()}</div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className={`font-bold text-sm ${act.type === 'sale' ? 'text-green-600' : ''}`}>
              {act.type === 'sale' ? '+' : '-'}₹{act.amount.toLocaleString('en-IN')}
            </div>
            <form action={async () => {
              addOptimisticActivity(act.id);
              await deleteTransaction(act.id, act.type);
            }}>
              <button 
                type="submit"
                className="text-gray-400 hover:text-red-600 transition-colors p-2 flex items-center justify-center"
                title="Delete"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
              </button>
            </form>
          </div>
        </div>
      ))}
    </div>
  );
}
