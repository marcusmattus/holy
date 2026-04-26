# Holy TypeScript SDK

## Agent marketplace

```ts
await sdk.agents.listMarketplace()
await sdk.agents.install({ agentListingId, workspaceId, config })
await sdk.agents.checkout({ agentListingId })
```

## Workflows

```ts
await sdk.workflows.create({ name, definition })
await sdk.workflows.run(workflowId, { input })
await sdk.workflows.approveStep(runId, { stepId })
```

## Enterprise

```ts
await sdk.workspaces.getIdentityProvider(workspaceId)
await sdk.workspaces.updateIdentityProvider(workspaceId, payload)
await sdk.workspaces.getAnalytics(workspaceId)
```

## Reliability & security

- Include `x-api-key` for protected endpoints.
- Respect rate-limit responses (`429`).
- Verify webhook signatures server-side.
- Use idempotency keys for mutating endpoints.
