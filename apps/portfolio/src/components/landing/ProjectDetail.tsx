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
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!project) return null

  const mainImageUrl = getImageUrl(project.mainImage)

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-x-hidden selection:bg-blue-500/30 transition-colors duration-300">
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
          <button
            onClick={() => navigation.prevId && handlePrev(navigation.prevId)}
            disabled={!navigation.prevId}
            className="w-10 h-10 rounded-full border border-zinc-200 dark:border-white/10 bg-background/50 backdrop-blur-md flex items-center justify-center hover:bg-foreground hover:text-background transition-colors group text-foreground disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          </button>
          <button
            onClick={() => navigation.nextId && handleNext(navigation.nextId)}
            disabled={!navigation.nextId}
            className="w-10 h-10 rounded-full border border-zinc-200 dark:border-white/10 bg-background/50 backdrop-blur-md flex items-center justify-center hover:bg-foreground hover:text-background transition-colors group text-foreground disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
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
              <span className={`inline-block mb-4 px-3 py-1 rounded-full border border-zinc-200 dark:border-white/20 bg-zinc-100 dark:bg-white/5 backdrop-blur-md text-xs font-mono tracking-widest uppercase text-transparent bg-clip-text bg-gradient-to-r ${project.color}`}>
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
              className="flex flex-wrap items-center w-full gap-8 md:gap-16 mt-8 border-t border-zinc-200 dark:border-white/10 pt-8 text-sm md:text-base"
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

              <div className={`flex items-center gap-3 px-5 py-2.5 rounded-full bg-gradient-to-r ${project.color} shadow-lg ml-auto`}>
                <span className="font-sans text-white/90 text-sm font-medium">{project.metricLabel || t('project.keyMetric')}</span>
                <div className="w-px h-3 bg-white/40" />
                <div className="font-sans text-white font-bold text-sm leading-none">{project.metric}</div>
              </div>
            </motion.div>
          </div>
        </div>
      </header>

      <main className="w-full max-w-[2000px] mx-auto px-4 md:px-8 xl:px-12 py-20">
        <div className="flex flex-col gap-16">
          <div className="flex flex-col gap-16">
            <section>
              <h3 className="text-heading-md font-bold text-foreground mb-6">{t('project.overview')}</h3>
              <div className="text-heading-sm text-muted-foreground font-light leading-relaxed">
                {project.description}
              </div>
            </section>

            <section className="bg-zinc-50 dark:bg-zinc-900/30 border border-zinc-200 dark:border-white/5 p-8 rounded-lg">
              <h3 className="text-body-lg font-mono uppercase tracking-widest text-muted-foreground mb-4">{t('project.challenge')}</h3>
              <div className="text-muted-foreground leading-relaxed">{project.challenge}</div>
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
                        className="bg-zinc-50 dark:bg-zinc-900/30 border border-zinc-200 dark:border-white/5 p-8 rounded-lg my-8"
                      >
                        <h3 className="text-body-lg font-mono uppercase tracking-widest text-muted-foreground mb-4">{t('project.solution')}</h3>
                        <div className="text-muted-foreground leading-relaxed">{item.text}</div>
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
                      className="rounded-lg overflow-hidden border border-zinc-200 dark:border-white/10"
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
          </div>
        </div>
      </main>

      <div
        className="w-full py-20 border-t border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-zinc-900/50 cursor-pointer group relative overflow-hidden transition-colors"
        onClick={() => navigation.nextId && handleNext(navigation.nextId)}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/5 dark:via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />

        <div className="w-full max-w-[2000px] mx-auto px-4 md:px-8 xl:px-12 text-center">
          <span className="text-muted-foreground uppercase tracking-widest font-mono text-sm mb-4 block">{t('project.next')}</span>
          <h2 className="text-heading-xl md:text-display-xl font-bold text-foreground group-hover:scale-105 transition-transform duration-500">
            {t('project.viewNext')}
          </h2>
          <div className="mt-6 flex justify-center">
            <div className="w-16 h-16 rounded-full border border-zinc-200 dark:border-white/20 flex items-center justify-center group-hover:bg-foreground group-hover:text-background transition-colors text-foreground">
              <ArrowRight className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}





