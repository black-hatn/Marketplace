'use client';

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

type DataPoint = { name: string; revenue: number; orders: number };

export function VendorRevenueChart({ data }: { data: DataPoint[] }) {
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
          <linearGradient id="revenueGradVendor" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.4} />
            <stop offset="95%" stopColor="#06B6D4" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.15)" vertical={false} />
        <XAxis 
          dataKey="name" 
          tick={{ fontSize: 10, fill: '#64748b', fontWeight: 600 }} 
          axisLine={false} 
          tickLine={false} 
          dy={10}
          interval={4} // Only show some ticks to avoid clutter
        />
        <YAxis 
          tick={{ fontSize: 10, fill: '#64748b', fontWeight: 600 }} 
          axisLine={false} 
          tickLine={false} 
          tickFormatter={(v) => v >= 1000 ? `${(v / 1000)}k` : v} 
          dx={-10}
        />
        <Tooltip
          contentStyle={{ 
            background: 'rgba(255, 255, 255, 0.9)', 
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(0,0,0,0.05)', 
            borderRadius: '16px', 
            fontSize: '12px', 
            fontWeight: 'bold',
            color: '#0f172a',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)'
          }}
          itemStyle={{ color: '#06B6D4', fontWeight: 900 }}
          formatter={(v: any) => [`${parseFloat(v).toLocaleString()} FCFA`, 'Ventes']}
        />
        <Area 
          type="monotone" 
          dataKey="revenue" 
          stroke="#06B6D4" 
          strokeWidth={3} 
          fill="url(#revenueGradVendor)" 
          dot={false}
          activeDot={{ r: 6, fill: '#06B6D4', stroke: '#fff', strokeWidth: 3 }} 
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
