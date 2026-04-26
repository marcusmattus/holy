// Suppress browser extension errors in console
if (typeof window !== 'undefined') {
  const originalError = console.error
  console.error = (...args) => {
    // Filter out known browser extension conflicts
    const message = args[0]?.toString() || ''
    if (
      message.includes('BitcoinProvider') ||
      message.includes('chrome-extension') ||
      message.includes('Cannot redefine property')
    ) {
      // Silently ignore these extension conflicts
      return
    }
    originalError.apply(console, args)
  }
}

export {}
