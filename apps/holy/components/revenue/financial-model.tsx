'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const DATA = [
  { month: 'Oct', sales: 840, ads: 210, subs: 420 },
  { month: 'Nov', sales: 1020, ads: 280, subs: 480 },
  { month: 'Dec', sales: 1380, ads: 320, subs: 540 },
  { month: 'Jan', sales: 1240, ads: 380, subs: 620 },
]

export function FinancialModel() {
  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <h2 className="font-semibold mb-4">Revenue Breakdown</h2>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={DATA}>
          <CartesianGrid strokeDasharray="3 3" stroke="#27272A" />
          <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#A1A1AA' }} tickLine={false} axisLine={false} />
          <YAxis tick={{ fontSize: 11, fill: '#A1A1AA' }} tickLine={false} axisLine={false} />
          <Tooltip contentStyle={{ background: '#18181B', border: '1px solid #27272A', borderRadius: 8, fontSize: 12 }} />
          <Bar dataKey="sales" stackId="a" fill="#7C3AED" name="Sales" radius={[0, 0, 0, 0]} />
          <Bar dataKey="ads" stackId="a" fill="#2563EB" name="Ads" />
          <Bar dataKey="subs" stackId="a" fill="#10B981" name="Subscriptions" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
