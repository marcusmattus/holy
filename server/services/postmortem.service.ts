import { createId, store, writeAuditEvent } from '@/server/core/in-memory-store'

function redactSecrets(text: string) {
  return text
    .replaceAll(/sk_live_[A-Za-z0-9]+/g, '[REDACTED_SECRET]')
    .replaceAll(/Bearer\s+[A-Za-z0-9\-_.]+/g, 'Bearer [REDACTED]')
}

export async function generatePostmortemDraft(incidentId: string) {
  const incident = (store.incidents[incidentId] as { id?: string } | undefined) ?? {
    id: incidentId,
    summary: 'Unknown incident',
  }

  const draft = {
    id: createId('postmortem'),
    incidentId,
    status: 'DRAFT',
    content: {
      summary: redactSecrets('Service degradation observed after deployment.'),
      timeline: ['T0 alert fired', 'T+5m triage started', 'T+20m mitigation applied'],
      rootCauseHypothesis: redactSecrets('Worker queue saturation caused cascading retries.'),
      impact: 'Some users experienced delayed responses.',
      whatWentWell: ['Alerting fired quickly', 'Safe rollback path existed'],
      whatWentWrong: ['Insufficient queue backpressure thresholds'],
      actionItems: ['Tune queue thresholds', 'Add canary rollback checks'],
      preventionRecommendations: ['Expand self-healing playbooks for worker pressure events'],
      linkedLogsAlertsRuns: [incident.id ?? incidentId],
    },
    createdAt: new Date().toISOString(),
  }

  store.postmortems[draft.id] = draft
  writeAuditEvent({ category: 'incidents', action: 'postmortem.generated', metadata: { incidentId, draftId: draft.id } })
  return draft
}
