'use client'

import { useMemo, useState } from 'react'

const PLATFORM_BPS = 1500
const DEFAULT_CREATOR_BPS = 8500
const DEFAULT_COLLABORATOR_BPS = 0
const DEFAULT_REFERRER_BPS = 0

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
  const [creatorBps, setCreatorBps] = useState(DEFAULT_CREATOR_BPS)
  const [collaboratorBps, setCollaboratorBps] = useState(DEFAULT_COLLABORATOR_BPS)
  const [referrerBps, setReferrerBps] = useState(DEFAULT_REFERRER_BPS)
  const [collaboratorRecipientId, setCollaboratorRecipientId] = useState('')
  const [referrerRecipientId, setReferrerRecipientId] = useState('')

  const totalBps = creatorBps + collaboratorBps + referrerBps + PLATFORM_BPS
  const exceeds = totalBps > 10000
  const hasMissingRecipient =
    (collaboratorBps > 0 && !collaboratorRecipientId) ||
    (referrerBps > 0 && !referrerRecipientId)

  const rules = useMemo<EditableRule[]>(() => {
    const next: EditableRule[] = [
      { recipientId: creatorId, role: 'CREATOR', basisPoints: creatorBps },
      { recipientId: creatorId, role: 'PLATFORM', basisPoints: PLATFORM_BPS },
    ]

    if (collaboratorBps > 0 && collaboratorRecipientId) {
      next.push({
        recipientId: collaboratorRecipientId,
        role: 'COLLABORATOR',
        basisPoints: collaboratorBps,
      })
    }

    if (referrerBps > 0 && referrerRecipientId) {
      next.push({
        recipientId: referrerRecipientId,
        role: 'REFERRER',
        basisPoints: referrerBps,
      })
    }

    return next
  }, [
    collaboratorBps,
    collaboratorRecipientId,
    creatorBps,
    creatorId,
    referrerBps,
    referrerRecipientId,
  ])

  async function saveRules() {
    if (exceeds || hasMissingRecipient) {
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
          Collaborator recipient ID
          <input
            type="text"
            value={collaboratorRecipientId}
            onChange={(event) => setCollaboratorRecipientId(event.target.value)}
            className="mt-1 w-full rounded-lg border border-white/20 bg-black/40 px-3 py-2"
            placeholder="Optional collaborator user ID"
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
        <label className="text-sm">
          Referrer recipient ID
          <input
            type="text"
            value={referrerRecipientId}
            onChange={(event) => setReferrerRecipientId(event.target.value)}
            className="mt-1 w-full rounded-lg border border-white/20 bg-black/40 px-3 py-2"
            placeholder="Optional referrer user ID"
          />
        </label>
        <div className="rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm">
          Platform fee: {PLATFORM_BPS / 100}% ({PLATFORM_BPS} bps)
        </div>
      </div>
      <p
        className={`mt-3 text-sm ${
          exceeds || hasMissingRecipient ? 'text-red-400' : 'text-white/60'
        }`}
      >
        Total: {(totalBps / 100).toFixed(2)}% ({totalBps} bps)
      </p>
      {hasMissingRecipient ? (
        <p className="mt-1 text-xs text-red-400">
          Add recipient IDs for collaborator/referrer splits before saving.
        </p>
      ) : null}
      <button
        type="button"
        onClick={saveRules}
        disabled={exceeds || hasMissingRecipient}
        className="mt-4 rounded-lg bg-[#C9A24A] px-4 py-2 text-sm font-semibold text-black disabled:opacity-60"
      >
        Save revenue rules
      </button>
    </div>
  )
}
