# Holy App SDK

Client-safe SDK for Holy-generated apps.

## Usage

```ts
import { holyApp } from '@holy/app-sdk'

holyApp.analytics.track('APP_VIEW')
holyApp.monetization.checkout('listing-id')
holyApp.rewards.getBalance()
holyApp.auth.getUser()
holyApp.env.getPublicConfig()
```

## Security

- Exposes public config only.
- Never exposes server secrets.
- Analytics calls fail silently.
- Auth/session usage must remain app-scoped.
