export interface ComplianceControlRecord {
  id: string
  framework: 'SOC2' | 'GDPR' | 'ISO27001'
  key: string
  title: string
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'READY' | 'NEEDS_REVIEW' | 'COMPLETE'
}

const controls: ComplianceControlRecord[] = [
  { id: 'soc2-cc1', framework: 'SOC2', key: 'CC1', title: 'Control Environment', status: 'IN_PROGRESS' },
  { id: 'gdpr-art5', framework: 'GDPR', key: 'ARTICLE_5', title: 'Data processing principles', status: 'READY' },
]

export function listComplianceControls() {
  return controls
}
