'use client'

import { useMemo, useState } from 'react'

const PLATFORM_BPS = 1500

type EditableRule = {
  recipientId: string
  role: 'CREATOR' | 'COLLABORATOR' | 'REFERRER' | 'PLATFORM'
  basisPoints: number
}

export function RevenueSplitEditor({
  listingId,
  creatorId,
}: {
  listingId: string
  creatorId: string
}) {
  const [creatorBps, setCreatorBps] = useState(8000)
  const [collaboratorBps, setCollaboratorBps] = useState(500)
  const [referrerBps, setReferrerBps] = useState(500)

  const totalBps = creatorBps + collaboratorBps + referrerBps + PLATFORM_BPS
  const exceeds = totalBps > 10000

  const rules = useMemo<EditableRule[]>(
    () => [
      { recipientId: creatorId, role: 'CREATOR', basisPoints: creatorBps },
      { recipientId: creatorId, role: 'COLLABORATOR', basisPoints: collaboratorBps },
      { recipientId: creatorId, role: 'REFERRER', basisPoints: referrerBps },
      { recipientId: creatorId, role: 'PLATFORM', basisPoints: PLATFORM_BPS },
    ],
    [collaboratorBps, creatorBps, creatorId, referrerBps]
  )

  async function saveRules() {
    if (exceeds) {
      return
    }

    await fetch('/api/revenue/rules', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ listingId, rules }),
    })
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-6 text-white">
      <h3 className="text-xl font-semibold">Revenue split editor</h3>
      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <label className="text-sm">
          Creator (%)
          <input
            type="number"
            min={0}
            max={100}
            value={creatorBps / 100}
            onChange={(event) => setCreatorBps(Number(event.target.value) * 100)}
            className="mt-1 w-full rounded-lg border border-white/20 bg-black/40 px-3 py-2"
          />
        </label>
        <label className="text-sm">
          Collaborator (%)
          <input
            type="number"
            min={0}
            max={100}
            value={collaboratorBps / 100}
            onChange={(event) => setCollaboratorBps(Number(event.target.value) * 100)}
            className="mt-1 w-full rounded-lg border border-white/20 bg-black/40 px-3 py-2"
          />
        </label>
        <label className="text-sm">
          Referrer (%)
          <input
            type="number"
            min={0}
            max={100}
            value={referrerBps / 100}
            onChange={(event) => setReferrerBps(Number(event.target.value) * 100)}
            className="mt-1 w-full rounded-lg border border-white/20 bg-black/40 px-3 py-2"
          />
        </label>
        <div className="rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm">
          Platform fee: {(PLATFORM_BPS / 100).toFixed(0)}% ({PLATFORM_BPS} bps)
        </div>
      </div>
      <p className={`mt-3 text-sm ${exceeds ? 'text-red-400' : 'text-white/60'}`}>
        Total: {(totalBps / 100).toFixed(2)}% ({totalBps} bps)
      </p>
      <button
        type="button"
        onClick={saveRules}
        disabled={exceeds}
        className="mt-4 rounded-lg bg-[#C9A24A] px-4 py-2 text-sm font-semibold text-black disabled:opacity-60"
      >
        Save revenue rules
      </button>
    </div>
  )
}
