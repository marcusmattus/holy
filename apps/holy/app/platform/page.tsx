'use client'

import { useState } from 'react'
import { ProjectHub } from '@/components/platform/ProjectHub'
import { AIWorkspace } from '@/components/platform/AIWorkspace'
import { ProjectInsights } from '@/components/platform/ProjectInsights'
import { DeploymentSettings } from '@/components/platform/DeploymentSettings'
import { ErrorSuppression } from './error-suppression'

export default function PlatformPage() {
  const [currentView, setCurrentView] = useState<'hub' | 'workspace' | 'insights' | 'deploy'>('hub')
  const [selectedProject, setSelectedProject] = useState<any>(null)

  return (
    <>
      <ErrorSuppression />
      <div className="min-h-screen bg-[#0a0a0a] text-white">
        {/* Ethereal Background */}
        <div className="fixed inset-0 -z-10">
          <div className="ethereal-bg" />
          <div className="grain" />
        </div>

      {/* Main Content */}
      {currentView === 'hub' && (
        <ProjectHub 
          onSelectProject={(project) => {
            setSelectedProject(project)
            setCurrentView('workspace')
          }}
          onNewProject={() => setCurrentView('workspace')}
        />
      )}
      
      {currentView === 'workspace' && (
        <AIWorkspace 
          project={selectedProject}
          onBack={() => setCurrentView('hub')}
          onDeploy={() => setCurrentView('deploy')}
          onViewInsights={() => setCurrentView('insights')}
        />
      )}
      
      {currentView === 'insights' && (
        <ProjectInsights 
          project={selectedProject}
          onBack={() => setCurrentView('workspace')}
        />
      )}
      
      {currentView === 'deploy' && (
        <DeploymentSettings 
          project={selectedProject}
          onBack={() => setCurrentView('workspace')}
          onSuccess={() => setCurrentView('hub')}
        />
      )}
      </div>
    </>
  )
}
