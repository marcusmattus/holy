export interface StoreApp {
  id: string
  name: string
  description: string
  author: string
  price: number
  rating: number
  downloads: number
  category: string
}

export async function listApps(): Promise<StoreApp[]> {
  return []
}

export async function getApp(_id: string): Promise<StoreApp | null> {
  return null
}
