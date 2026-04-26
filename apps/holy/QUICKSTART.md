# Quick Start Guide - Holy Ethereal IDE

## Getting Started

### 1. Environment Setup

Create `.env.local` in `/apps/holy/`:

```bash
# Required: OpenAI API Key
OPENAI_API_KEY=sk-your-openai-api-key-here

# Database (already configured)
DATABASE_URL="file:./dev.db"

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 2. Install & Run

```bash
# From project root
cd /Users/marcusmattus/holy

# Install dependencies (if not already done)
pnpm install

# Run development server
pnpm --filter holy dev

# Or from apps/holy
cd apps/holy
npm run dev
```

### 3. Access the Application

Open [http://localhost:3000](http://localhost:3000)

## Key Pages

### Projects Hub
**URL**: `/dashboard/projects`
- View all projects in grid layout
- Create new projects
- See project status with live indicators
- Access project details

### Editor Workspace
**URL**: `/dashboard/projects/[projectId]/editor`
- **Left Panel**: Code editor with syntax highlighting
- **Center Panel**: Live preview with responsive viewports
- **Right Panel**: AI assistant for code generation

### AI Assistant Usage

1. **Type a prompt**: "Create a hero section with gradient background"
2. **Press Enter** or click send button
3. **Watch streaming response**: Real-time AI generation
4. **See code update**: Preview refreshes automatically

## Design System Usage

### Ethereal Background
Always add to full-page layouts:
```tsx
<div className="ethereal-bg" />
<div className="grain" />
```

### Glass Panel Cards
```tsx
<div className="glass-panel rounded-3xl p-6">
  {/* Content */}
</div>
```

### Primary Button
```tsx
<button className="bg-[#C9A24A] text-black px-6 py-3 rounded-2xl font-bold gold-glow">
  Deploy
</button>
```

### Status Indicator
```tsx
<div className="flex items-center space-x-2">
  <div className="status-pulse" />
  <span className="text-[10px] font-bold uppercase">Live</span>
</div>
```

## Testing AI Features

### Sample Prompts

Try these in the AI assistant:

1. **Simple Component**:
   ```
   Create a card component with a title and description
   ```

2. **With Styling**:
   ```
   Build a pricing table with 3 tiers using glass panels and gold accents
   ```

3. **Interactive Element**:
   ```
   Make a button with hover animation and gold glow effect
   ```

4. **Complete Section**:
   ```
   Generate a features section with 6 cards in a grid layout
   ```

## Viewport Testing

In the editor preview pane:

1. **Desktop View**: Full-width preview
2. **Mobile View**: 320px width simulation
3. **Code View**: See generated code

Click icons in top toolbar to switch between views.

## Troubleshooting

### API Key Not Working
- Verify key format: `sk-...`
- Check OpenAI dashboard for key status
- Ensure key has API access enabled

### Styles Not Loading
- Clear Next.js cache: `rm -rf .next`
- Restart dev server: `npm run dev`
- Check browser console for errors

### TypeScript Errors
- Run type check: `npm run type-check`
- Rebuild: `npm run build`

### AI Not Responding
- Check network tab for API calls
- Verify `/api/ai/chat` route is accessible
- Check OpenAI API status

## Design System Reference

### Colors
```css
--gold: #C9A24A              /* Primary accent */
--gold-muted: rgba(201, 162, 74, 0.1)
--bg-base: #0a0a0a           /* Background */
--card-bg: rgba(255, 255, 255, 0.03)  /* Glass */
--border-subtle: rgba(255, 255, 255, 0.08)
```

### Typography
```css
font-family: 'Space Grotesk', sans-serif
weights: 300, 400, 500, 600, 700
```

### Animations
- `streaming-dot`: AI loading animation
- `status-pulse`: Live indicator pulse
- `shimmer`: Card hover effect
- `gold-glow`: Button shadow effect

## Common Tasks

### Add New Project Card
```tsx
<div className="glass-panel shimmer rounded-3xl p-6">
  <h3 className="text-xl font-bold">{project.name}</h3>
  <p className="text-white/40">{project.description}</p>
  <div className="status-pulse" />
</div>
```

### Create AI Chat Interface
```tsx
import { useChat } from 'ai/react'

const { messages, input, handleSubmit } = useChat({
  api: '/api/ai/chat'
})
```

### Add Ethereal Effect
```tsx
<div className="relative">
  <div className="ethereal-bg" />
  <div className="grain" />
  <div className="relative z-10">
    {/* Your content */}
  </div>
</div>
```

## Development Workflow

1. **Edit Components**: Make changes in `/components/`
2. **Update Styles**: Modify `/app/globals.css`
3. **Test AI**: Use AI assistant in editor
4. **Preview Changes**: Hot reload updates automatically
5. **Build**: Run `npm run build` before deployment

## Production Deployment

```bash
# 1. Set environment variables on Vercel
OPENAI_API_KEY=sk-...

# 2. Deploy
vercel --prod

# 3. Test deployment
# Visit your-app.vercel.app
```

## Next Features to Explore

1. **Code Syntax Highlighting**: Add Prism.js integration
2. **Component Library**: Build reusable component palette
3. **Real Preview**: Connect preview pane to actual component rendering
4. **Collaboration**: Add real-time multi-user editing
5. **Templates**: Create project templates with Ethereal IDE design

## Resources

- **Design Docs**: See `DESIGN_INTEGRATION.md`
- **Original Mockups**: `/Users/marcusmattus/Downloads/holyui/`
- **Vercel AI SDK**: https://sdk.vercel.ai/docs
- **Tailwind CSS**: https://tailwindcss.com/docs

## Support

Issues or questions? Check:
1. `INTEGRATION_SUMMARY.md` for overview
2. `DESIGN_INTEGRATION.md` for detailed docs
3. Original HTML mockups for design reference

---

**Ready to build!** ✨ The Ethereal IDE is now live with AI-powered code generation.
