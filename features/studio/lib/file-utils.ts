import type { HolyFileMap } from '../types'

export function mergeHolyFiles(baseFiles: HolyFileMap, nextFiles: HolyFileMap): HolyFileMap {
  return {
    ...baseFiles,
    ...nextFiles,
  }
}
