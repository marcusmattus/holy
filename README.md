# Holy by Holystic Labs

> **The vibecoding platform.** Build, publish, and monetize web apps using AI — powered by HolyOS.

---

## What is Holy?

**Holy** is a vibecoding platform where builders create production-ready web apps through natural language prompts. Write what you want, let Holy AI generate the code, then publish to the **Holy Web App Store** and earn revenue.

---

## Quick Start

```bash
# Install dependencies
npm install

# Copy environment file and add your API key(s)
cp .env.example .env.local

# Run in dev mode
npm run dev

# Build for production
npm run build
```

---

## AI Models

Holy supports multiple LLM providers. Add at least one API key to `.env.local`:

| Provider  | Models                              | Env Variable                    |
| --------- | ----------------------------------- | ------------------------------- |
| OpenAI    | GPT-4o, GPT-4 Turbo, GPT-3.5 Turbo | `OPENAI_API_KEY`                |
| Anthropic | Claude 3.5 Sonnet, Claude 3 Opus    | `ANTHROPIC_API_KEY`             |
| Google    | Gemini 1.5 Pro, Gemini 1.5 Flash    | `GOOGLE_GENERATIVE_AI_API_KEY`  |

Switch models at any time using the model selector in the AI assistant panel.

---

## Project Structure

```
holy/
├── app/
│   ├── api/ai/chat/       # Streaming AI route (multi-model)
│   ├── dashboard/         # Dashboard, projects, editor
│   ├── (auth)/            # Login / register pages
│   └── (marketing)/       # Landing page, pricing
├── components/
│   ├── editor/            # Code panel, preview, AI assistant
│   ├── analytics/         # Charts and metrics
│   └── ui/                # shadcn/ui components
├── lib/
│   ├── atoms.ts           # Jotai global state (editor code, model)
│   └── utils.ts           # Shared utilities
└── .env.example           # Required environment variables
```

---

## Tech Stack

- **Framework**: Next.js 16 + React 19
- **AI**: Vercel AI SDK (`ai`, `@ai-sdk/openai`, `@ai-sdk/anthropic`, `@ai-sdk/google`)
- **Styling**: Tailwind CSS v4
- **Components**: shadcn/ui (new-york) + Radix UI
- **State**: Jotai
- **Charts**: Recharts
- **Fonts**: Geist Sans + Geist Mono

---

## Brand Colors

| Token        | Hex       | Usage                   |
| ------------ | --------- | ----------------------- |
| Holy Purple  | `#7C3AED` | Primary brand, CTAs     |
| Cosmic Blue  | `#2563EB` | Secondary, HolyOS layer |
| Neon Emerald | `#10B981` | Success, revenue        |
| Deep Void    | `#0A0A0F` | Dark background         |

---

## License

Apache 2.0 — © 2025 Holystic Labs

---

## Phase 16 Infrastructure Notes

- Runtime cluster scaffold: `/services/runtime-service`
- Worker autoscaling worker entrypoint: `/server/workers/autoscaler.worker.ts`
- Settlement execution worker entrypoint: `/server/workers/settlement.worker.ts`
- Production deployment manifests for runtime: Dockerfile, Fly, Render, ECS task definition under `/services/runtime-service`
