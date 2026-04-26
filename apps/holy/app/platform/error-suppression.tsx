'use client'

import { useEffect } from 'react'

export function ErrorSuppression() {
  useEffect(() => {
    // Suppress browser extension console errors
    const originalError = console.error
    console.error = (...args) => {
      const message = args[0]?.toString() || ''
      // Filter out known browser extension conflicts
      if (
        message.includes('BitcoinProvider') ||
        message.includes('chrome-extension') ||
        message.includes('Cannot redefine property')
      ) {
        return // Silently ignore
      }
      originalError.apply(console, args)
    }

    return () => {
      console.error = originalError
    }
  }, [])

  return null
}
