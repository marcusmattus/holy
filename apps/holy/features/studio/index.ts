/**
 * Holy Studio feature module
 *
 * Public surface:
 *  - createProjectFromStudio  — create a project + first version from generated code
 *  - saveVersion              — snapshot the current editor state
 *  - getLatestSnapshot        — load the latest code for the editor
 */

export {
  createProjectFromStudio,
  saveVersion,
  getLatestSnapshot,
} from '@/server/services/studio.service'
