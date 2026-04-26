# Runtime Service Deployment

Deploy the dedicated runtime service separately from the Next.js web app.

- Keep runtime secrets isolated from web app secrets.
- Deploy runtime with independent autoscaling and timeouts.
- Route `POST /runtime/execute`, `GET /runtime/executions/:id`, and cancellation requests to the runtime service.
