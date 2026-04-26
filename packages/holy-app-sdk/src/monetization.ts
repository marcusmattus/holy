export function checkout(listingId: string) {
  if (typeof window === 'undefined') {
    return null
  }

  window.location.assign(`/checkout/${encodeURIComponent(listingId)}`)
  return { redirected: true }
}
