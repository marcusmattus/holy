# TypeScript SDK

```ts
import { HolyClient } from '@holystic/holy-sdk'

const holy = new HolyClient({ apiKey: process.env.HOLY_API_KEY! })

const project = await holy.projects.create({
  name: 'AI Finance Dashboard',
  prompt: 'Build a fintech dashboard with revenue analytics',
})

await holy.projects.deploy(project.id, { target: 'preview' })
```

Supported methods:

- `projects.create`
- `projects.generate`
- `projects.deploy`
- `projects.get`
- `templates.list`
- `templates.fork`
- `store.listings`
- `agents.run`
