'use client'

import { useState, useCallback } from 'react'
import { TrendingUp, Save, Calculator, Loader2 } from 'lucide-react'

type Scenario = {
  name: string
  monthlyVisitors: number
  conversionRate: number
  avgOrderValue: number
  revenueSharePct: number
}

const DEFAULT: Scenario = {
  name: 'My Scenario',
  monthlyVisitors: 5000,
  conversionRate: 2.5,
  avgOrderValue: 49,
  revenueSharePct: 15,
}

function fmt(n: number) {
  return n >= 1000
    ? '$' + (n / 1000).toFixed(1) + 'k'
    : '$' + n.toFixed(0)
}

export function RevenueScenarioPlanner() {
  const [scenario, setScenario] = useState<Scenario>(DEFAULT)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const update = useCallback(
    (key: keyof Scenario, value: number | string) => {
      setSaved(false)
      setScenario((prev) => ({ ...prev, [key]: value }))
    },
    [],
  )

  const monthlyRevenue =
    (scenario.monthlyVisitors * (scenario.conversionRate / 100) * scenario.avgOrderValue)
  const creatorShare = monthlyRevenue * (1 - scenario.revenueSharePct / 100)
  const annualRevenue = monthlyRevenue * 12
  const annualCreator = creatorShare * 12

  const handleSave = async () => {
    setSaving(true)
    try {
      await fetch('/api/insights/scenarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: 'dev-user',
          ...scenario,
          monthlyRevenue,
          annualRevenue,
        }),
      })
      setSaved(true)
    } catch (err) {
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <div className="p-5 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calculator size={16} className="text-[#C9A24A]" />
          <h2 className="font-semibold">Revenue Scenario Planner</h2>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium hover:bg-muted disabled:opacity-50 transition-colors"
        >
          {saving ? (
            <Loader2 size={12} className="animate-spin" />
          ) : saved ? (
            <span className="text-[#10B981]">✓ Saved</span>
          ) : (
            <>
              <Save size={12} />
              Save Scenario
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 divide-y lg:divide-y-0 lg:divide-x divide-border">
        {/* Inputs */}
        <div className="p-5 space-y-5">
          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Scenario Name
            </label>
            <input
              type="text"
              value={scenario.name}
              onChange={(e) => update('name', e.target.value)}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#7C3AED]/50"
            />
          </div>

          {[
            {
              key: 'monthlyVisitors' as const,
              label: 'Monthly Visitors',
              min: 100,
              max: 500000,
              step: 100,
              format: (v: number) => v.toLocaleString(),
            },
            {
              key: 'conversionRate' as const,
              label: 'Conversion Rate (%)',
              min: 0.1,
              max: 20,
              step: 0.1,
              format: (v: number) => v.toFixed(1) + '%',
            },
            {
              key: 'avgOrderValue' as const,
              label: 'Avg Order Value (USD)',
              min: 1,
              max: 999,
              step: 1,
              format: (v: number) => '$' + v,
            },
            {
              key: 'revenueSharePct' as const,
              label: 'Platform Fee (%)',
              min: 5,
              max: 30,
              step: 1,
              format: (v: number) => v.toFixed(0) + '%',
            },
          ].map(({ key, label, min, max, step, format }) => (
            <div key={key} className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  {label}
                </label>
                <span className="text-sm font-semibold text-[#C9A24A]">
                  {format(scenario[key] as number)}
                </span>
              </div>
              <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={scenario[key] as number}
                onChange={(e) => update(key, parseFloat(e.target.value))}
                className="w-full accent-[#7C3AED] cursor-pointer"
              />
            </div>
          ))}
        </div>

        {/* Output */}
        <div className="p-5 space-y-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Projected Outcomes
          </p>

          <div className="space-y-3">
            {[
              { label: 'Monthly Revenue', value: fmt(monthlyRevenue), sub: 'total gross', highlight: false },
              { label: 'Your Monthly Take', value: fmt(creatorShare), sub: `after ${scenario.revenueSharePct}% platform fee`, highlight: true },
              { label: 'Annual Revenue', value: fmt(annualRevenue), sub: 'total gross', highlight: false },
              { label: 'Your Annual Take', value: fmt(annualCreator), sub: 'your creator share', highlight: true },
            ].map(({ label, value, sub, highlight }) => (
              <div
                key={label}
                className={`rounded-xl p-4 border ${highlight ? 'border-[#10B981]/30 bg-[#10B981]/5' : 'border-border bg-muted/20'}`}
              >
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">{label}</p>
                    <p className={`text-2xl font-bold mt-0.5 ${highlight ? 'text-[#10B981]' : ''}`}>
                      {value}
                    </p>
                  </div>
                  {highlight && <TrendingUp size={18} className="text-[#10B981] mb-1" />}
                </div>
                <p className="text-[10px] text-muted-foreground/60 mt-1">{sub}</p>
              </div>
            ))}
          </div>

          <div className="rounded-xl border border-[#C9A24A]/20 bg-[#C9A24A]/5 p-3 space-y-1">
            <p className="text-xs font-semibold text-[#C9A24A]">
              + Holy Protocol Rewards
            </p>
            <p className="text-xs text-muted-foreground">
              Earn additional USDC + HOL tokens for installs, referrals, and participation.
              Not reflected above.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
