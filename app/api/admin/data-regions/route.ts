import { listDataResidencyAuditLog } from '@/server/services/data-residency-enforcement.service'

export async function GET() {
  return Response.json({
    shards: [
      { id: 'shard-us-1', region: 'US', status: 'ACTIVE' },
      { id: 'shard-eu-1', region: 'EU', status: 'ACTIVE' },
      { id: 'shard-apac-1', region: 'APAC', status: 'DEGRADED' },
    ],
    audit: listDataResidencyAuditLog(),
  })
}
