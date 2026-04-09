'use client'

import { useState } from 'react'

export function WalletConnect() {
  const [connected, setConnected] = useState(false)
  const [address] = useState('0x71C7656EC7ab88b098defB751B7401B5f6d8976F')

  return (
    <div className="rounded-xl border border-border bg-card p-6 space-y-4">
      <h2 className="font-semibold">Wallet</h2>
      {connected ? (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#10B981]" />
            <span className="text-sm text-[#10B981] font-medium">Connected</span>
          </div>
          <p className="font-mono text-xs text-muted-foreground break-all">{address}</p>
          <div className="flex gap-3">
            <div className="flex-1 rounded-lg border border-border p-3 text-center">
              <p className="text-xs text-muted-foreground">USDC Balance</p>
              <p className="font-bold">423.70</p>
            </div>
            <div className="flex-1 rounded-lg border border-border p-3 text-center">
              <p className="text-xs text-muted-foreground">HOL Tokens</p>
              <p className="font-bold">1,200</p>
            </div>
          </div>
          <button
            onClick={() => setConnected(false)}
            className="w-full rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-muted transition-colors"
          >
            Disconnect
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Connect your wallet to receive on-chain USDC payouts from Holy Rewards.
          </p>
          <button
            onClick={() => setConnected(true)}
            className="w-full rounded-lg bg-[#7C3AED] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#6D28D9] transition-colors"
          >
            Connect Wallet
          </button>
        </div>
      )}
    </div>
  )
}
