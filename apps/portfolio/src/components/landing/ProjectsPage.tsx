import {useState} from 'react'
import {ArrowLeft} from 'lucide-react'
import {TextReveal, Section, Button, ProjectCard, ToggleGroup, ToggleGroupItem} from '@limia/design-system'
import {Link} from 'react-router-dom'
import {getImageUrl, useProjects} from '../../lib/project-service'
import {useLanguage} from '../language-provider'

export const ProjectsPage = ({
  onProjectClick,
}: {
  onBack?: () => void
  onProjectClick?: (id: string) => void
}) => {
  const [activeTab, setActiveTab] = useState<'ui' | 'study'>('ui')
  const {language, t} = useLanguage()
  const {projects, isLoading: loading} = useProjects(language)

  const filteredProjects = projects.filter((project) => {
    const isStudy = project.categoryKind === 'study'
    return activeTab === 'study' ? isStudy : !isStudy
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-foreground">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <p role="status" aria-live="polite" className="text-sm text-muted-foreground">
            {t('projects.loading')}
          </p>
        </div>
      </div>
    )
  }

  return (
    <Section id="projects" className="py-16 md:py-32 min-h-screen flex flex-col">
      <div className="flex-grow">
        <div className="mb-10 md:mb-16">
          <div className="flex flex-col items-end gap-6 border-b border-border pb-10 md:flex-row md:justify-between">
            <div>
              <TextReveal>
                <h2 className="text-4xl md:text-6xl font-bold text-foreground mb-2">
                  {t('projects.archive.title')}
                </h2>
              </TextReveal>
              <p className="text-muted-foreground text-lg w-full mt-4">
                {t('projects.archive.description')}
              </p>
            </div>

            <div className="flex flex-col md:flex-row items-end md:items-center gap-4 relative z-10">
              <ToggleGroup
                type="single"
                value={activeTab}
                onValueChange={(value) => value && setActiveTab(value as 'ui' | 'study')}
                variant="outline"
                className="no-cursor-trail rounded-full border border-border/70 bg-card/80 p-1"
              >
                <ToggleGroupItem value="ui" className="px-4 py-1.5 md:px-5 md:py-2">
                  {t('projects.archive.tab.ui')}
                </ToggleGroupItem>
                <ToggleGroupItem value="study" className="px-4 py-1.5 md:px-5 md:py-2">
                  {t('projects.archive.tab.ux')}
                </ToggleGroupItem>
              </ToggleGroup>

              <Link to="/">
                <Button variant="outline" className="rounded-full">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  {t('projects.archive.back')}
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project._id}
              title={project.title}
              category={project.category}
              image={getImageUrl(project.thumbnail || project.mainImage)}
              metric={project.metric}
              color={project.color}
              onClick={() => onProjectClick && onProjectClick(project.slug.current)}
            />
          ))}
          {filteredProjects.length === 0 && (
            <div className="col-span-1 rounded-2xl border border-border bg-card/60 py-12 text-center text-muted-foreground lg:col-span-2">
              {t('projects.empty')}
            </div>
          )}
        </div>
      </div>
    </Section>
  )
}

