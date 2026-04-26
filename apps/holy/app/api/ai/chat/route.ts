import { openai } from '@ai-sdk/openai'
import { streamText } from 'ai'

export const runtime = 'edge'

export async function POST(req: Request) {
  const { messages, projectId } = await req.json()

  const result = await streamText({
    model: openai('gpt-4-turbo'),
    system: `You are Holy AI, an expert UI/UX designer and full-stack developer. 
    You help users build beautiful, modern web applications using React, Next.js, and Tailwind CSS.
    
    Design Principles:
    - Use the "Ethereal IDE" design system with Space Grotesk font
    - Gold accent color (#C9A24A) for primary actions and highlights
    - Dark mode first with atmospheric backgrounds
    - Glassmorphism with subtle borders (rgba(255, 255, 255, 0.08))
    - Smooth animations and transitions
    
    When generating code:
    - Use TypeScript and modern React patterns
    - Include proper types and interfaces
    - Use Tailwind CSS for styling
    - Make components reusable and accessible
    - Add smooth transitions and hover effects
    
    Current project ID: ${projectId}`,
    messages,
  })

  return result.toTextStreamResponse()
}
