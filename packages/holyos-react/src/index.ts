'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { createClient } from 'holyos-sdk'
import type {
  HolyOSClient,
  HolyOSConfig,
  ProjectMetrics,
  Project,
} from 'holyos-sdk'

const HolyOSContext = createContext<HolyOSClient | null>(null)

export interface HolyOSProviderProps {
  config?: HolyOSConfig
  children: React.ReactNode
}

export function HolyOSProvider({ config, children }: HolyOSProviderProps) {
  const client = React.useMemo(() => createClient(config), [config])
  return React.createElement(
    HolyOSContext.Provider,
    { value: client },
    children,
  )
}

export function useHolyOS(): HolyOSClient {
  const client = useContext(HolyOSContext)
  if (!client) {
    throw new Error('useHolyOS must be used within a HolyOSProvider')
  }
  return client
}

export function useAnalytics(projectId?: string) {
  const client = useHolyOS()
  const [metrics, setMetrics] = useState<ProjectMetrics | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!projectId) return
    setLoading(true)
    client.analytics
      .getMetrics(projectId)
      .then(setMetrics)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [client, projectId])

  return { metrics, loading }
}

export function useWallet() {
  const [address, setAddress] = useState<string | null>(null)
  const [connected, setConnected] = useState(false)

  const connect = async (addr: string) => {
    setAddress(addr)
    setConnected(true)
  }

  const disconnect = () => {
    setAddress(null)
    setConnected(false)
  }

  return { address, connected, connect, disconnect }
}

export function useProjects() {
  const client = useHolyOS()
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(false)

  const refresh = () => {
    setLoading(true)
    client.projects
      .list()
      .then(setProjects)
      .catch(console.error)
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    refresh()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [client])

  return { projects, loading, refresh }
}

export interface AnalyticsTrackerProps {
  projectId: string
  pageName?: string
}

export function AnalyticsTracker({
  projectId,
  pageName,
}: AnalyticsTrackerProps) {
  const client = useHolyOS()

  useEffect(() => {
    client.analytics.track('page_view', {
      projectId,
      page:
        pageName ??
        (typeof window !== 'undefined' ? window.location.pathname : ''),
    })
  }, [client, projectId, pageName])

  return null
}
