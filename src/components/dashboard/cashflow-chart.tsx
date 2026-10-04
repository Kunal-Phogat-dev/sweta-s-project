'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const data = [
  { name: 'Mon', In: 4000, Out: 2400 },
  { name: 'Tue', In: 3000, Out: 1398 },
  { name: 'Wed', In: 2000, Out: 9800 },
  { name: 'Thu', In: 2780, Out: 3908 },
  { name: 'Fri', In: 1890, Out: 4800 },
  { name: 'Sat', In: 2390, Out: 3800 },
  { name: 'Sun', In: 3490, Out: 4300 },
];

export function CashflowChart() {
  return (
    <div className="h-[400px] w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 20, right: 0, left: -20, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f5f5f4" />
          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#78716c', fontSize: 12 }} dy={10} />
          <YAxis axisLine={false} tickLine={false} tick={{ fill: '#78716c', fontSize: 12 }} />
          <Tooltip 
            cursor={{ fill: '#fafaf9' }}
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' }}
          />
          <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
          <Bar dataKey="In" fill="#1c1917" radius={[4, 4, 0, 0]} maxBarSize={40} />
          <Bar dataKey="Out" fill="#f472b6" radius={[4, 4, 0, 0]} maxBarSize={40} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
