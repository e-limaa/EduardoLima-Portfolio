import {useState} from 'react'
import {SectionHeader, Section, ProjectCard, ToggleGroup, ToggleGroupItem} from '@limia/design-system'
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
        <ToggleGroup
          type="single"
          value={activeTab}
          onValueChange={(value) => value && setActiveTab(value as 'ui' | 'study')}
          variant="outline"
          className="no-cursor-trail rounded-full border border-border/70 bg-card/80 p-1"
        >
          <ToggleGroupItem value="ui" className="px-4 py-1.5 md:px-5 md:py-2">
            {t('projects.tab.ui')}
          </ToggleGroupItem>
          <ToggleGroupItem value="study" className="px-4 py-1.5 md:px-5 md:py-2">
            {t('projects.tab.ux')}
          </ToggleGroupItem>
        </ToggleGroup>
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
          <li className="col-span-1 rounded-2xl border border-border bg-card/60 py-12 text-center text-muted-foreground md:col-span-3">
            {t('projects.empty')}
          </li>
        )}
      </ul>
    </Section>
  )
}

