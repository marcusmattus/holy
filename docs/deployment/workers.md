# Worker deployment

Holy workflow and runtime processing should run in dedicated workers.

## Local

```bash
npm run worker:workflow
npm run worker:agents
```

## Production

Deploy separate long-running worker services with access to Redis and database.
