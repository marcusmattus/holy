import type { Metadata } from 'next'
import { Space_Grotesk } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'

const spaceGrotesk = Space_Grotesk({
  variable: '--font-space-grotesk',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
})

export const metadata: Metadata = {
  title: 'Holy — Ethereal IDE for Vibecoding',
  description:
    'Build, monetize, and grow your web apps with Holy — the vibecoding platform powered by HolyOS.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="scroll-smooth">
      <body className={`${spaceGrotesk.variable} antialiased font-sans`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
