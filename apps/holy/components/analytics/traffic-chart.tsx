'use client'

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

const DATA = [
  { date: 'Jan 1', views: 1200, visitors: 480 },
  { date: 'Jan 8', views: 1800, visitors: 720 },
  { date: 'Jan 15', views: 2400, visitors: 960 },
  { date: 'Jan 22', views: 2100, visitors: 840 },
  { date: 'Jan 29', views: 3200, visitors: 1280 },
  { date: 'Feb 5', views: 2900, visitors: 1160 },
  { date: 'Feb 12', views: 3800, visitors: 1520 },
  { date: 'Feb 19', views: 4200, visitors: 1680 },
  { date: 'Feb 26', views: 3900, visitors: 1560 },
  { date: 'Mar 5', views: 5100, visitors: 2040 },
  { date: 'Mar 12', views: 4800, visitors: 1920 },
  { date: 'Mar 19', views: 6200, visitors: 2480 },
]

export function TrafficChart() {
  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <h2 className="font-semibold mb-4">Traffic Over Time</h2>
      <ResponsiveContainer width="100%" height={240}>
        <LineChart data={DATA}>
          <CartesianGrid strokeDasharray="3 3" stroke="#27272A" />
          <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#A1A1AA' }} tickLine={false} axisLine={false} />
          <YAxis tick={{ fontSize: 11, fill: '#A1A1AA' }} tickLine={false} axisLine={false} />
          <Tooltip
            contentStyle={{ background: '#18181B', border: '1px solid #27272A', borderRadius: 8, fontSize: 12 }}
          />
          <Line type="monotone" dataKey="views" stroke="#7C3AED" strokeWidth={2} dot={false} name="Views" />
          <Line type="monotone" dataKey="visitors" stroke="#10B981" strokeWidth={2} dot={false} name="Visitors" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
