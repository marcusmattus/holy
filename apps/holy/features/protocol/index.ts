/**
 * Holystic Protocol feature module
 *
 * Public surface:
 *  - emitReward           — add a PENDING reward to the ledger
 *  - settleReward         — mark a reward SETTLED after on-chain confirmation
 *  - getClaimableBalance  — return claimable USDC + HOL for a user
 *  - emitInstallBounty    — convenience: emit $0.50 + 2 HOL per install
 */

export {
  emitReward,
  settleReward,
  getClaimableBalance,
  emitInstallBounty,
} from '@/server/services/protocol.service'
