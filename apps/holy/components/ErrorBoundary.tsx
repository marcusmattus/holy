'use client'

import { Component, ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: any) {
    // Log error but don't crash for browser extension conflicts
    if (error.message?.includes('BitcoinProvider') || 
        error.message?.includes('chrome-extension')) {
      console.warn('Browser extension conflict detected (safe to ignore):', error.message)
      return
    }
    console.error('Error caught by boundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError && this.props.fallback) {
      return this.props.fallback
    }

    return this.props.children
  }
}
