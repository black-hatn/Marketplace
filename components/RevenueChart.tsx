'use client';

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

type DataPoint = { month: string; revenue: number };

export function RevenueChart({ data }: { data: DataPoint[] }) {
  if (data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-slate-400 text-sm font-medium">
        Aucune donnée de revenus disponible.
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.4} />
            <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.15)" vertical={false} />
        <XAxis 
          dataKey="month" 
          tick={{ fontSize: 11, fill: '#64748b', fontWeight: 600 }} 
          axisLine={false} 
          tickLine={false} 
          dy={10}
        />
        <YAxis 
          tick={{ fontSize: 11, fill: '#64748b', fontWeight: 600 }} 
          axisLine={false} 
          tickLine={false} 
          tickFormatter={(v) => `${(v / 1000)}k`} 
          dx={-10}
        />
        <Tooltip
          contentStyle={{ 
            background: 'rgba(255, 255, 255, 0.9)', 
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(0,0,0,0.05)', 
            borderRadius: '16px', 
            fontSize: '13px', 
            fontWeight: 'bold',
            color: '#0f172a',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)'
          }}
          itemStyle={{ color: '#8B5CF6', fontWeight: 900 }}
          formatter={(v: any) => [`${parseFloat(v).toLocaleString()} FCFA`, 'Revenus']}
        />
        <Area 
          type="monotone" 
          dataKey="revenue" 
          stroke="#8B5CF6" 
          strokeWidth={3} 
          fill="url(#revenueGrad)" 
          dot={{ r: 4, fill: '#fff', stroke: '#8B5CF6', strokeWidth: 2 }} 
          activeDot={{ r: 6, fill: '#8B5CF6', stroke: '#fff', strokeWidth: 3 }} 
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

