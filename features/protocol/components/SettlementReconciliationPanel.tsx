export function SettlementReconciliationPanel() {
  return (
    <section className="rounded-xl border border-zinc-800 bg-zinc-950/70 p-5">
      <h3 className="text-lg text-white">Settlement reconciliation</h3>
      <p className="mt-2 text-sm text-zinc-400">
        Compare RewardLedger, RevenueShare, Payout, SettlementBatch, and provider receipts/tx hashes.
      </p>
      <p className="mt-2 text-xs text-[#C9A24A]">Pilot-only. Admin approval required for exports.</p>
    </section>
  )
}
