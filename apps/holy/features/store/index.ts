/**
 * Holy Store feature module
 *
 * Public surface:
 *  - submitForReview     — submit a project listing for admin review
 *  - approveListing      — admin: approve and publish a listing
 *  - rejectListing       — admin: reject a listing
 *  - recordInstall       — track a store install + fire analytics event
 *  - getFeaturedListings — return published listings ordered by installs
 */

export {
  submitForReview,
  approveListing,
  rejectListing,
  recordInstall,
  getFeaturedListings,
} from '@/server/services/store.service'
