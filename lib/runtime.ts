// Central runtime guards for Vercel compatibility

export const isBrowser = typeof window !== "undefined"
export const isServer = typeof window === "undefined"

export function ensureBrowser() {
  if (!isBrowser) throw new Error("Browser-only code executed on server")
}

export function ensureServer() {
  if (!isServer) throw new Error("Server-only code executed on client")
}
