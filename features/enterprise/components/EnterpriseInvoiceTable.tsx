interface InvoiceRecord {
  id: string
  amountCents: number
  currency: string
  status: string
}

export function EnterpriseInvoiceTable({ invoices }: { invoices: InvoiceRecord[] }) {
  return (
    <div className="rounded-xl border border-[#C9A24A33] bg-[#0A0A0A]/90 p-4 font-['Space_Grotesk']">
      <h3 className="text-[#C9A24A] text-sm uppercase tracking-widest">Enterprise Invoices</h3>
      <table className="mt-3 w-full text-sm">
        <thead>
          <tr className="text-left opacity-70">
            <th>ID</th>
            <th>Amount</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {invoices.map((invoice) => (
            <tr key={invoice.id} className="border-t border-white/10">
              <td className="py-2">{invoice.id}</td>
              <td> {(invoice.amountCents / 100).toFixed(2)} {invoice.currency.toUpperCase()} </td>
              <td>
                <span className="rounded-full border border-white/20 px-2 py-0.5 text-xs">{invoice.status}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
