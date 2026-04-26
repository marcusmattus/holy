'use client'
import { useEffect } from 'react'
export function ErrorSuppression() {
  useEffect(() => {
    const originalError = console.error
    console.error = (...args) => {
      const message = args[0]?.toString() || ''
      if (message.includes('BitcoinProvider') || message.includes('chrome-extension') || message.includes('Cannot redefine property')) {
        return
      }
      originalError.apply(console, args)
    }
    return () => { console.error = originalError }
  }, [])
  return null
}
