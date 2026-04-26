import { componentSpecToCode, ideaToPRD, prdToComponentSpec } from '@/lib/ai'
import { prisma } from '@/server/db/client'

export async function generateProjectFiles(input: { prompt: string; projectId?: string }) {
  const prd = await ideaToPRD(input.prompt)
  const componentSpec = await prdToComponentSpec(prd)
  const files = await componentSpecToCode(componentSpec)

  if (input.projectId) {
    await prisma.projectVersion.create({
      data: {
        projectId: input.projectId,
        prompt: input.prompt,
        spec: JSON.stringify(componentSpec),
        fileTree: files,
        code: JSON.stringify(files),
      },
    })
  }

  return { prd, componentSpec, files }
}
