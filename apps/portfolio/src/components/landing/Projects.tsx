import {useState} from 'react'
import {SectionHeader, Section, ProjectCard} from '@limia/design-system'
import {getImageUrl, useProjects} from '../../lib/project-service'
import {useLanguage} from '../language-provider'

export const Projects = ({onProjectClick}: {onProjectClick?: (id: string) => void}) => {
  const [activeTab, setActiveTab] = useState<'ui' | 'study'>('ui')
  const {language, t} = useLanguage()
  const {projects, isLoading: loading} = useProjects(language)

  const filteredProjects = projects.filter((project) => {
    const isStudy = project.categoryKind === 'study'
    return activeTab === 'study' ? isStudy : !isStudy
  })

  const featuredProjects = filteredProjects.slice(0, 6)

  if (loading) {
    return (
      <Section id="projects" className="pt-16 pb-8 md:pt-32">
        <p role="status" aria-live="polite" className="py-20 text-center text-foreground">
          {t('projects.loading')}
        </p>
      </Section>
    )
  }

  return (
    <Section id="projects" className="pt-16 pb-8 md:pt-32">
      <SectionHeader
        title={activeTab === 'study' ? t('projects.tab.ux') : t('projects.tab.ui')}
        description={t('projects.description')}
        index="01"
        label={t('projects.label')}
      >
        <div className="inline-flex items-center p-1 bg-zinc-100 dark:bg-zinc-800/50 rounded-full border border-zinc-200 dark:border-white/5 no-cursor-trail">
          <button
            onClick={() => setActiveTab('study')}
            className={`px-4 py-1.5 md:px-5 md:py-2 rounded-full text-sm font-medium transition-all duration-200 ${activeTab === 'study'
              ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-sm border border-black/5 dark:border-white/5'
              : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200 hover:bg-zinc-200/50 dark:hover:bg-zinc-800/70'}`}
          >
            {t('projects.tab.ux')}
          </button>
          <button
            onClick={() => setActiveTab('ui')}
            className={`px-4 py-1.5 md:px-5 md:py-2 rounded-full text-sm font-medium transition-all duration-200 ${activeTab === 'ui'
              ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-sm border border-black/5 dark:border-white/5'
              : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200 hover:bg-zinc-200/50 dark:hover:bg-zinc-800/70'}`}
          >
            {t('projects.tab.ui')}
          </button>
        </div>
      </SectionHeader>

      <ul className="list-none m-0 p-0 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-12 md:mt-16 no-cursor-trail">
        {featuredProjects.map((project) => (
          <li key={project._id}>
            <ProjectCard
              title={project.title}
              category={project.category}
              image={getImageUrl(project.thumbnail || project.mainImage)}
              metric={project.metric}
              color={project.color}
              onClick={() => onProjectClick && onProjectClick(project.slug.current)}
            />
          </li>
        ))}
        {featuredProjects.length === 0 && (
          <li className="col-span-1 md:col-span-3 text-center py-12 text-muted-foreground bg-zinc-50 dark:bg-white/5 rounded-2xl border border-zinc-200 dark:border-white/10">
            {t('projects.empty')}
          </li>
        )}
      </ul>
    </Section>
  )
}

