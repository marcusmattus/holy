'use client'

export function CheckoutButton({
  listingId,
  buyerId,
}: {
  listingId: string
  buyerId: string
}) {
  async function checkout() {
    const res = await fetch(`/api/store/${listingId}/checkout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ buyerId }),
    })

    const data = await res.json()

    if (data.mode === 'free') {
      window.location.href = '/dashboard/projects'
      return
    }

    if (data.checkoutUrl) {
      window.location.href = data.checkoutUrl
    }
  }

  return (
    <button
      onClick={checkout}
      className="rounded-full bg-[#C9A24A] px-5 py-3 text-sm font-bold text-black transition hover:brightness-110"
      type="button"
    >
      Install / Buy App
    </button>
  )
}
