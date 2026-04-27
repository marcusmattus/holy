# Holy Runtime Service

Dedicated runtime execution boundary for long-running agent and workflow jobs.

## Responsibilities

- Execute runtime jobs
- Enforce runtime sandbox policy
- Emit structured logs and telemetry
- Support cancellation/timeouts
- Consume queued jobs
- Keep application secrets outside runtime execution contexts

## API

- `POST /runtime/execute`
- `GET /runtime/executions/:id`
- `POST /runtime/executions/:id/cancel`
