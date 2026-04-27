export interface PluginManifest {
  permissions: string[]
  components: string[]
  apiRoutes: string[]
  envVars: string[]
  clientSdk: string[]
  serverActions: string[]
}

export interface PluginListingRecord {
  id: string
  slug: string
  title: string
  description: string
  status: 'DRAFT' | 'PUBLISHED' | 'UNLISTED' | 'SUSPENDED' | 'ARCHIVED'
  manifest: PluginManifest
}

const pluginListings: PluginListingRecord[] = [
  {
    id: 'plugin-observability-kit',
    slug: 'observability-kit',
    title: 'Observability Kit',
    description: 'Adds dashboards, runtime traces, and incident widgets.',
    status: 'PUBLISHED',
    manifest: {
      permissions: ['runtime:read', 'analytics:write'],
      components: ['QueueHealthPanel', 'RuntimeClusterPanel'],
      apiRoutes: ['/api/plugins/observability/events'],
      envVars: ['OBSERVABILITY_API_KEY'],
      clientSdk: ['holy.plugins'],
      serverActions: ['trackRuntimeEvent'],
    },
  },
]
const pluginInstallRegistry = new Set<string>()

export function listPlugins() {
  return pluginListings.filter((plugin) => plugin.status === 'PUBLISHED')
}

export function getPluginBySlug(slug: string) {
  return pluginListings.find((plugin) => plugin.slug === slug) ?? null
}

export function installPlugin(pluginId: string, projectId: string, installedById: string) {
  const plugin = pluginListings.find((listing) => listing.id === pluginId)
  if (!plugin) {
    return { success: false, error: 'Plugin not found' }
  }

  const installKey = `${pluginId}:${projectId}`
  if (pluginInstallRegistry.has(installKey)) {
    return { success: false, error: 'Plugin already installed for project' }
  }
  pluginInstallRegistry.add(installKey)

  return {
    success: true,
    install: {
      id: crypto.randomUUID(),
      pluginId,
      projectId,
      installedById,
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
    },
  }
}
