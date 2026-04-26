import { NextResponse } from 'next/server'
import { createEnterpriseInvoice, listEnterpriseInvoices } from '@/server/services/enterprise-invoice.service'

export async function GET(
  _request: Request,
  context: { params: Promise<{ workspaceId: string }> },
) {
  const { workspaceId } = await context.params
  const invoices = await listEnterpriseInvoices(workspaceId)
  return NextResponse.json({ invoices })
}

export async function POST(
  request: Request,
  context: { params: Promise<{ workspaceId: string }> },
) {
  const { workspaceId } = await context.params
  const body = (await request.json()) as {
    amountCents: number
    currency?: string
    contractId?: string
    dueDate?: string
  }

  const invoice = await createEnterpriseInvoice({
    workspaceId,
    amountCents: body.amountCents,
    currency: body.currency,
    contractId: body.contractId,
    dueDate: body.dueDate ? new Date(body.dueDate) : undefined,
  })

  return NextResponse.json({ invoice })
}
