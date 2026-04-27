# Workers in Production

Run workers outside Vercel serverless limits.

- Keep worker processes separate from the web app.
- Use queue-specific concurrency and retry policies.
- Enable graceful shutdown and heartbeat reporting.
- Configure dead-letter queues for `workflow`, `agent`, `runtime`, `deployment`, `analytics`, `exports`, `settlement`, and `notifications`.
