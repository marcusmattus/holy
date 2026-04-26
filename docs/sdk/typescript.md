# Holy TypeScript SDK (Phase 16)

```ts
const holy = createHolyClient('https://holy.example.com')

await holy.runtime.clusters.list()
await holy.workerPools.list()
await holy.procurement.requests.create({
  workspaceId: 'ws_123',
  assetType: 'PLUGIN',
  assetId: 'plugin_123',
  amountCents: 1200,
})
await holy.procurement.requests.approve('ws_123', 'req_123')
await holy.plugins.checkout('plugin_123')
await holy.incidents.list()
await holy.autonomy.runs.list()
await holy.semanticSearch.query('Find me SOC2-ready workflow templates')
await holy.enterprise.invoices.list('ws_123')
```
