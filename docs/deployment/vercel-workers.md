# Vercel worker notes

Vercel serverless functions are not suitable for long-running workflow workers.

- Keep API handlers lightweight and enqueue work.
- Run workers on dedicated compute (container/VM).
- Use Redis-backed queues for retries, leases, and resume flows.
