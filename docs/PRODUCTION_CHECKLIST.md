# Holy Production Checklist (Vercel Safe)

## Build Safety
- Monaco + Sandpack loaded with dynamic imports (ssr: false)
- No direct window/document usage without guards
- All client-only logic wrapped with `isBrowser`

## API Safety
- All AI/Prisma routes use:
  export const runtime = "nodejs"

## Performance
- Heavy components dynamically imported
- Avoid large bundle in root layout

## Database
- Use hosted DB (Neon/Supabase)
- Prisma generate runs on build

## Runtime Separation
- No long-running tasks in API routes
- Prepare for worker split (Phase 15+)

## Security
- Iframes sandboxed
- No raw script injection
- No secret exposure in client

## Observability (next step)
- Add logging (console + external)
- Add error tracking (Sentry)

## Deployment
- Vercel project configured
- Environment variables set
- Production URL tested

## Future Required
- Worker queues (BullMQ)
- Runtime service separation
- Rate limiting
- Auth middleware

---

If all above are true → Holy is production-safe on Vercel.
