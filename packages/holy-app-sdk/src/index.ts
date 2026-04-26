export type HolyPluginManifest = {
  permissions: string[]
  components: string[]
  apiRoutes: string[]
  envVars: string[]
  clientSdk: string[]
  serverActions: string[]
}

export function defineHolyPlugin(manifest: HolyPluginManifest) {
  return manifest
}
