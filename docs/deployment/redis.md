# Redis requirements

Workflow durability relies on Redis for queue state.

- Use managed Redis in production.
- Configure `REDIS_URL` for workers and API services.
- Keep TLS enabled where available.
- Monitor queue depth and failed jobs.
