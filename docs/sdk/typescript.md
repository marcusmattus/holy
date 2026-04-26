# Holy TypeScript SDK

```ts
import { createHolyClient } from '@holy/sdk'

const holy = createHolyClient({ apiKey: process.env.HOLY_API_KEY! })

await holy.agents.orchestrations.create({
  name: 'Growth Orchestration',
  graph: { nodes: [], edges: [] },
})

await holy.agents.orchestrations.run('orch_123', { requestedAction: 'RUN_QA' })
await holy.workflows.create({ name: 'Deploy Gate', definition: { version: '1.0', nodes: [], edges: [], settings: { requireApprovalForProduction: true, autoRunQaBeforeDeploy: true } } })
await holy.workflows.run('wf_123')
await holy.workflowTemplates.install('tpl_123')
await holy.integrations.list()
await holy.exports.createDestination('ws_123', { type: 'WEBHOOK', name: 'Warehouse Mirror', config: { url: 'https://example.com/hook' } })
await holy.experiments.assign('exp_123', 'session_abc')
await holy.experiments.results('exp_123')
```
