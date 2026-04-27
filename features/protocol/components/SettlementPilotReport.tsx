'use client'

import { useState } from 'react'

export function SettlementPilotReport() {
  const [data, setData] = useState<{
    totalBatches: number
    successRate: number
    emergencyStops: number
  } | null>(null)

  async function load() {
    const res = await fetch('/api/admin/settlement/reports')
    const json = await res.json()
    setData(json.report)
  }

  return (
    <div className="rounded-xl border border-[#C9A24A33] bg-[#0A0A0A]/80 p-4">
      <h3 className="text-[#C9A24A] font-semibold">Settlement Pilot Report</h3>
      <button className="mt-3 rounded-md border border-[#C9A24A66] px-3 py-2 text-sm" onClick={load}>
        Load report
      </button>
      {data ? (
        <div className="mt-3 text-xs text-[#c4c4c4] space-y-1">
          <p>Total batches: {data.totalBatches}</p>
          <p>Success rate: {Math.round(data.successRate * 100)}%</p>
          <p>Emergency stops: {data.emergencyStops}</p>
        </div>
      ) : null}
    </div>
  )
}
