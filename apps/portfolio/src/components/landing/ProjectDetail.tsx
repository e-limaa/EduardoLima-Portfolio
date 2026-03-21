import {useEffect} from 'react'
import {motion} from 'motion/react'
import {ArrowLeft, ArrowRight, Layers, Calendar, User, Building2} from 'lucide-react'
import {useParams, useNavigate} from 'react-router-dom'
import {ImageWithFallback} from '../figma/ImageWithFallback'
import {Button, TextReveal} from '@limia/design-system'

import {getImageUrl, useProjectBySlug, useAdjacentProjects} from '../../lib/project-service'
import {useLanguage} from '../language-provider'
import {Navbar} from './Navbar'

export const ProjectDetail = () => {
  const {slug} = useParams<{slug: string}>()
  const navigate = useNavigate()
  const {language, t} = useLanguage()

  const {project, isLoading: projectLoading} = useProjectBySlug(slug, language)
  const {navigation} = useAdjacentProjects(project?._id)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [slug])

  const handleBack = () => {
    navigate(-1)
  }

  const handleNext = (nextId: string) => {
    navigate(`/project/${nextId}`)
  }

  const handlePrev = (prevId: string) => {
    navigate(`/project/${prevId}`)
  }

  if (projectLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    )
  }

  if (!project) return null

  const mainImageUrl = getImageUrl(project.mainImage)
  const scrollReveal = {
    initial: {opacity: 0, y: 28},
    whileInView: {opacity: 1, y: 0},
    viewport: {once: true, amount: 0.35},
    transition: {duration: 0.7, ease: [0.22, 1, 0.36, 1]},
  } as const
  const shouldRenderMainSolution = Boolean(project.solution?.trim())
  const renderMainSolution = () =>
    shouldRenderMainSolution ? (
      <section className="flex min-w-0 flex-1 flex-col gap-4">
        <motion.h3
          {...scrollReveal}
          className="text-body-lg font-mono uppercase tracking-[0.18em] text-muted-foreground"
        >
          {t('project.solution')}
        </motion.h3>
        <motion.div
          {...scrollReveal}
          transition={{...scrollReveal.transition, delay: 0.18}}
          className="text-base leading-[1.625] text-muted-foreground"
        >
          {project.solution}
        </motion.div>
      </section>
    ) : null
  const shouldRenderSolutionBeforeGallery = project.solutionPlacement !== 'afterGallery'

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background text-foreground selection:bg-primary/20 transition-colors duration-300">
      <Navbar />
      <nav className="fixed top-0 left-0 right-0 z-50 p-6 lg:px-12 flex justify-between items-center">
        <Button
          onClick={handleBack}
          variant="outline"
          className="group rounded-full backdrop-blur-md font-mono uppercase tracking-wider"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>{t('project.back')}</span>
        </Button>

        <div className="flex gap-2">
          <Button
            onClick={() => navigation.prevId && handlePrev(navigation.prevId)}
            disabled={!navigation.prevId}
            variant="outline"
            size="icon"
            className="group bg-background/70 backdrop-blur-md"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          </Button>
          <Button
            onClick={() => navigation.nextId && handleNext(navigation.nextId)}
            disabled={!navigation.nextId}
            variant="outline"
            size="icon"
            className="group bg-background/70 backdrop-blur-md"
          >
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </nav>

      <header className="relative w-full h-[70vh] md:h-[80vh] mt-0">
        <div className="absolute inset-0 w-full h-full">
          <ImageWithFallback
            src={mainImageUrl}
            alt={project.title}
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background from-8% via-background/30 via-28% to-transparent to-70%" />
        </div>

        <div className="absolute bottom-0 left-0 w-full z-10">
          <div className="w-full max-w-[2000px] mx-auto px-4 md:px-8 xl:px-12 pb-6 md:pb-20">
            <motion.div
              initial={{y: 30, opacity: 0}}
              animate={{y: 0, opacity: 1}}
              transition={{duration: 0.8, delay: 0.2}}
            >
              <span className={`inline-block mb-4 rounded-full border border-border bg-card/80 px-3 py-1 text-xs font-mono uppercase tracking-widest text-transparent backdrop-blur-md bg-clip-text bg-gradient-to-r ${project.color}`}>
                {project.category}
              </span>
            </motion.div>

            <TextReveal>
              <h1 className="text-heading-lg md:text-display-lg font-bold text-foreground mb-6 tracking-tighter">
                {project.title}
              </h1>
            </TextReveal>

            <motion.div
              initial={{opacity: 0}}
              animate={{opacity: 1}}
              transition={{delay: 0.6}}
              className="mt-8 flex w-full flex-wrap items-center gap-8 border-t border-border pt-8 text-sm md:gap-16 md:text-base"
            >
              <div className="flex flex-col gap-2">
                <span className="text-muted-foreground uppercase tracking-wider font-mono text-xs">{t('project.client')}</span>
                <div className="flex items-center gap-2 text-foreground">
                  <Building2 className="w-4 h-4 text-muted-foreground" />
                  {project.client}
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-muted-foreground uppercase tracking-wider font-mono text-xs">{t('project.role')}</span>
                <div className="flex items-center gap-2 text-foreground">
                  <User className="w-4 h-4 text-muted-foreground" />
                  {project.role}
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-muted-foreground uppercase tracking-wider font-mono text-xs">{t('project.tech')}</span>
                <div className="flex flex-wrap gap-2 text-foreground">
                  <Layers className="w-4 h-4 text-muted-foreground mt-1" />
                  <div className="flex flex-wrap gap-2">
                    {project.stack?.map((tech, i, arr) => (
                      <span key={tech}>
                        {tech}
                        {i < arr.length - 1 && <span className="text-muted-foreground/40 ml-2">|</span>}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <span className="text-muted-foreground uppercase tracking-wider font-mono text-xs">{t('project.year')}</span>
                <div className="flex items-center gap-2 text-foreground">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  {project.year}
                </div>
              </div>

              <div className={`ml-auto flex items-center gap-3 rounded-full bg-gradient-to-r px-5 py-2.5 shadow-lg ${project.color}`}>
                <span className="font-sans text-sm font-medium text-primary-foreground/90">{project.metricLabel || t('project.keyMetric')}</span>
                <div className="h-3 w-px bg-primary-foreground/40" />
                <div className="font-sans text-sm font-bold leading-none text-primary-foreground">{project.metric}</div>
              </div>
            </motion.div>
          </div>
        </div>
      </header>

      <main className="w-full max-w-[2000px] mx-auto px-4 md:px-8 xl:px-12 py-20">
        <div className="flex flex-col gap-16">
          <div className="flex flex-col gap-16">
            <section className="flex flex-col gap-16">
              <div className="border-b border-border pb-12">
                <motion.h3
                  {...scrollReveal}
                  className="mb-6 text-heading-sm font-bold tracking-tight text-foreground md:text-heading-md"
                >
                  {t('project.overview')}
                </motion.h3>
                <motion.div
                  {...scrollReveal}
                  transition={{...scrollReveal.transition, delay: 0.18}}
                  className="max-w-none text-base font-normal leading-[1.625] text-muted-foreground md:max-w-[95%]"
                >
                  {project.description}
                </motion.div>
              </div>

              <div className="flex flex-col gap-16 md:flex-row md:gap-16">
                <section className="flex min-w-0 flex-1 flex-col gap-4">
                  <motion.h3
                    {...scrollReveal}
                    className="text-body-lg font-mono uppercase tracking-[0.18em] text-muted-foreground"
                  >
                    {t('project.challenge')}
                  </motion.h3>
                  <motion.div
                    {...scrollReveal}
                    transition={{...scrollReveal.transition, delay: 0.18}}
                    className="text-base leading-[1.625] text-muted-foreground"
                  >
                    {project.challenge}
                  </motion.div>
                </section>

                {shouldRenderMainSolution && <div className="hidden w-px self-stretch rounded-full bg-muted md:block" />}

                {shouldRenderSolutionBeforeGallery && renderMainSolution()}
              </div>
            </section>

            <section>
              <div className="grid gap-8">
                {project.gallery?.map((item, idx) => {
                  if (typeof item === 'object' && '_type' in item && item._type === 'solution') {
                    return (
                      <motion.section
                        key={`solution-${idx}`}
                        initial={{opacity: 0, y: 20}}
                        whileInView={{opacity: 1, y: 0}}
                        viewport={{once: true}}
                        className="my-8 flex min-w-0 flex-col gap-4 md:max-w-[47.3%]"
                      >
                        <motion.h3
                          {...scrollReveal}
                          className="text-body-lg font-mono uppercase tracking-[0.18em] text-muted-foreground"
                        >
                          {t('project.solution')}
                        </motion.h3>
                        <motion.div
                          {...scrollReveal}
                          transition={{...scrollReveal.transition, delay: 0.18}}
                          className="text-base leading-[1.625] text-muted-foreground"
                        >
                          {item.text}
                        </motion.div>
                      </motion.section>
                    )
                  }

                  const imgUrl = getImageUrl(item)
                  return (
                    <motion.div
                      key={`gallery-${idx}`}
                      initial={{opacity: 0, y: 20}}
                      whileInView={{opacity: 1, y: 0}}
                      transition={{delay: 0.1}}
                      viewport={{once: true}}
                      className="overflow-hidden rounded-lg border border-border"
                    >
                      <div className="w-full h-full">
                        <ImageWithFallback
                          src={imgUrl}
                          alt={`${project.title} galeria ${idx + 1}`}
                          className="w-full h-auto"
                        />
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </section>

            {!shouldRenderSolutionBeforeGallery && renderMainSolution()}
          </div>
        </div>
      </main>

      <div
        className="group relative w-full cursor-pointer overflow-hidden border-t border-border bg-card/60 py-20 transition-colors"
        onClick={() => navigation.nextId && handleNext(navigation.nextId)}
      >
        <div className="absolute inset-0 translate-x-[-100%] bg-gradient-to-r from-transparent via-foreground/5 to-transparent transition-transform duration-1000 group-hover:translate-x-[100%]" />

        <div className="w-full max-w-[2000px] mx-auto px-4 md:px-8 xl:px-12 text-center">
          <span className="text-muted-foreground uppercase tracking-widest font-mono text-sm mb-4 block">{t('project.next')}</span>
          <h2 className="text-heading-xl md:text-display-xl font-bold text-foreground group-hover:scale-105 transition-transform duration-500">
            {t('project.viewNext')}
          </h2>
          <div className="mt-6 flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full border border-border text-foreground transition-colors group-hover:bg-foreground group-hover:text-background">
              <ArrowRight className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}





