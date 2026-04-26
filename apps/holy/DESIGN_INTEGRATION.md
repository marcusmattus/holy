# Holy Ethereal IDE Design Integration

This document describes the integration of the "Ethereal IDE" design system into the Holy platform.

## Design System Overview

### Core Principles

1. **Ethereal Minimalism**: Dark-mode first approach using light and shadow rather than solid colors
2. **Technical Sophistication**: Space Grotesk typography with grain textures
3. **Atmospheric Depth**: Large-scale radial gradients and noise filters create physical space
4. **Gold Accents**: Single sophisticated accent color (#C9A24A) for premium quality

### Color Palette

```css
--gold: #c9a24a --gold-muted: rgba(201, 162, 74, 0.1) --bg-base: #0a0a0a
  --card-bg: rgba(255, 255, 255, 0.03)
  --border-subtle: rgba(255, 255, 255, 0.08);
```

### Typography

- **Font Family**: Space Grotesk (300, 400, 500, 600, 700)
- **Headings**: Bold weights with tight letter spacing
- **Body**: Regular weights with high contrast
- **Utility**: Light weights for secondary metadata

## Key Components

### 1. Ethereal Background

```tsx
<div className="ethereal-bg" />
<div className="grain" />
```

Creates atmospheric depth with radial gradients and noise texture.

### 2. Glass Panels

```tsx
<div className="glass-panel">{/* Content */}</div>
```

Semi-transparent containers with subtle borders and backdrop blur.

### 3. Status Indicators

```tsx
<div className="status-pulse" />
```

Animated gold pulse for active/live status indicators.

### 4. Gold Glow Effects

```tsx
<button className="bg-[#C9A24A] gold-glow">Deploy</button>
```

Soft shadow effect for primary actions.

## AI Integration

### Vercel AI SDK Setup

The platform now uses the Vercel AI SDK for streaming AI responses:

```typescript
import { useChat } from 'ai/react'

const { messages, input, handleSubmit, isLoading } = useChat({
  api: '/api/ai/chat',
  body: { projectId },
})
```

### API Route

Located at `/app/api/ai/chat/route.ts`, the API uses OpenAI's GPT-4 Turbo:

```typescript
import { openai } from '@ai-sdk/openai'
import { streamText } from 'ai'

export async function POST(req: Request) {
  const { messages, projectId } = await req.json()

  const result = await streamText({
    model: openai('gpt-4-turbo'),
    system: `You are Holy AI...`,
    messages,
  })

  return result.toDataStreamResponse()
}
```

## Page Integrations

### 1. Projects Hub (`/dashboard/projects`)

- Grid-based project cards with ethereal design
- Glassmorphic cards with shimmer effects
- Gold accent for primary actions
- Status pulse indicators

### 2. Editor (`/dashboard/projects/[id]/editor`)

- Three-panel layout: Code, Preview, AI Assistant
- Code panel with line numbers and syntax highlighting colors
- Preview pane with responsive viewport switching
- AI assistant with streaming responses

### 3. AI Assistant Panel

- Streaming chat interface
- Gold-accented messages
- Natural language prompts
- Real-time code generation feedback

## Environment Setup

Create a `.env.local` file:

```bash
OPENAI_API_KEY=sk-your-key-here
DATABASE_URL="file:./dev.db"
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## CSS Animations

### Available Animations

```css
.streaming-dot /* Pulsing dot animation */
.status-pulse /* Gold pulse animation */
.shimmer /* Shimmer sweep effect */
.glass-panel:hover /* Smooth hover transitions */
```

### Custom Scrollbars

Themed scrollbars with gold hover state:

```css
::-webkit-scrollbar-thumb:hover {
  background: var(--gold);
}
```

## Best Practices

1. **Always use the ethereal background** on full-page layouts
2. **Apply glass panels** for elevated content cards
3. **Use gold sparingly** for primary actions only
4. **Include grain texture** for authentic atmospheric feel
5. **Maintain smooth transitions** (400ms cubic-bezier)

## Component Examples

### Card with Glass Effect

```tsx
<div className="glass-panel rounded-3xl p-6 shimmer">
  <h3 className="text-xl font-bold">Project Name</h3>
  <p className="text-white/40">Description</p>
</div>
```

### Primary Button

```tsx
<button className="bg-[#C9A24A] text-black px-6 py-3 rounded-2xl font-bold gold-glow hover:bg-[#C9A24A]/90 transition-all">
  Deploy App
</button>
```

### Status Badge

```tsx
<div className="flex items-center space-x-2 bg-black/40 px-3 py-1 rounded-full border border-white/5">
  <div className="status-pulse" />
  <span className="text-[10px] font-bold uppercase">Live</span>
</div>
```

## Design Files Reference

Original design HTML files are preserved in `/Users/marcusmattus/Downloads/holyui/`:

- `active_editor___live_preview.html` - Editor interface inspiration
- `ai_generation_workspace.html` - AI workspace patterns
- `deployment_settings.html` - Deployment UI patterns
- `initial_prompt_canvas.html` - Initial canvas design
- `live_success_state.html` - Success state animations
- `project_hub.html` - Project grid layout
- `project_insights___history.html` - Analytics views
- `responsive_mobile_view.html` - Mobile responsive patterns

## Migration Notes

### Color Changes

- Primary color changed from purple (#7C3AED) to gold (#C9A24A)
- Borders changed from solid to semi-transparent
- Background changed to darker base (#0a0a0a)

### Font Changes

- Geist Sans → Space Grotesk
- Updated all font weight references

### Component Updates

- All buttons now use rounded-2xl instead of rounded-lg
- Cards use glass-panel class
- Status indicators use status-pulse animation

## Future Enhancements

1. Add code syntax highlighting with custom gold theme
2. Implement real-time collaborative editing indicators
3. Add more viewport size options (tablet, 4K)
4. Create animation presets library
5. Build component palette with drag-and-drop

## Support

For questions about the design system integration:

- Review the design documentation at `/holydesign.md`
- Check the original HTML mockups in `/Downloads/holyui/`
- Refer to Tailwind CSS documentation for utility classes
