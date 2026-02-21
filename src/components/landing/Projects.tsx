import React, { useState } from "react";
import { SectionHeader, Section, ProjectCard } from "@antigravity/ds";
import { getImageUrl, useProjects } from "../../lib/project-service";

export const Projects = ({ onProjectClick }: { onProjectClick?: (id: string) => void }) => {
    const { projects, isLoading: loading } = useProjects();
    const [activeTab, setActiveTab] = useState<'ui' | 'study'>('ui');

    // Filter projects based on the active tab
    const filteredProjects = projects.filter(project => {
        const cat = project.category?.toLowerCase() || '';
        const isStudy = cat.includes('pesquisa') || cat.includes('estudo') || cat.includes('ux');
        if (activeTab === 'study') return isStudy;
        return !isStudy; // "UI" tab shows everything else
    });

    // Display first 6 projects for the grid layout (3 per row * 2 rows ideally)
    const featuredProjects = filteredProjects.slice(0, 6);

    if (loading) {
        return <div className="py-20 text-center text-foreground">Carregando projetos...</div>;
    }

    return (
        <Section id="projects" className="pt-16 pb-8 md:pt-32">

            <div className="mb-10 md:mb-16">
                <SectionHeader
                    title={activeTab === 'study' ? "Pesquisas UX" : "UI Design"}
                    description="Uma seleção de trabalhos que definem minha abordagem."
                    index="01"
                    label="PROJECTS"
                >
                    {/* Tabs Container in Header */}
                    <div className="inline-flex items-center p-1 bg-zinc-100 dark:bg-zinc-800/50 rounded-full border border-zinc-200 dark:border-white/5 no-cursor-trail">
                        <button
                            onClick={() => setActiveTab('study')}
                            className={`px-4 py-1.5 md:px-5 md:py-2 rounded-full text-sm font-medium transition-all duration-200 ${activeTab === 'study'
                                ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-sm border border-black/5 dark:border-white/5'
                                : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200 hover:bg-zinc-200/50 dark:hover:bg-zinc-800/70'
                                }`}
                        >
                            Pesquisas UX
                        </button>
                        <button
                            onClick={() => setActiveTab('ui')}
                            className={`px-4 py-1.5 md:px-5 md:py-2 rounded-full text-sm font-medium transition-all duration-200 ${activeTab === 'ui'
                                ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-sm border border-black/5 dark:border-white/5'
                                : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200 hover:bg-zinc-200/50 dark:hover:bg-zinc-800/70'
                                }`}
                        >
                            UI Design
                        </button>
                    </div>
                </SectionHeader>

                {/* Grid Container */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-12 md:mt-16 no-cursor-trail">
                    {featuredProjects.map((project, index) => (
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
                    {featuredProjects.length === 0 && (
                        <div className="col-span-1 md:col-span-3 text-center py-12 text-muted-foreground bg-zinc-50 dark:bg-white/5 rounded-2xl border border-zinc-200 dark:border-white/10">
                            Nenhum projeto encontrado nesta categoria no momento.
                        </div>
                    )}
                </div>


            </div>
        </Section>
    );
};
