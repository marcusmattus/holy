import { NextResponse } from 'next/server'
import { listFederatedRecommendationBundles } from '@/server/services/federated-recommendation-bundle.service'

export async function GET() {
  return NextResponse.json({ bundles: listFederatedRecommendationBundles() })
}
