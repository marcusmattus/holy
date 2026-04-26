export type HolyClientConfig = {
  apiKey: string
  baseUrl?: string
}

export type CreateProjectInput = {
  name: string
  prompt?: string
}

export type DeployProjectInput = {
  target?: string
}
