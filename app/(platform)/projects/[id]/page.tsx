import { getProject } from '@/server/services/project.service'
import { notFound } from 'next/navigation'
import { ProjectEditor } from '@/features/projects/components/ProjectEditor'

export default async function ProjectPage({ params }: { params: { id: string } }) {
  const project = getProject(params.id)

  if (!project) return notFound()

  return (
    <main className="min-h-screen bg-[#0A0A0A] p-6 text-[#F8F2E5]">
      <div className="mx-auto max-w-7xl space-y-6">
        <header>
          <h1 className="text-3xl font-semibold">{project.name}</h1>
          <p className="mt-2 text-sm text-white/60">Edit your generated app in real time.</p>
        </header>

        <ProjectEditor initialProject={project} />
      </div>
    </main>
  )
}
