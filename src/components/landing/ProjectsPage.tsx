import React, { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { TextReveal, Section, Button, ProjectCard } from "@antigravity/ds";
import { getProjects, getImageUrl } from "../../lib/project-service";
import { Project } from "../../lib/sanity-types";
import { Link } from "react-router-dom";

export const ProjectsPage = ({ onBack, onProjectClick }: { onBack: () => void, onProjectClick?: (id: string) => void }) => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'ui' | 'study'>('ui');

    useEffect(() => {
        const loadProjects = async () => {
            try {
                const data = await getProjects();
                setProjects(data);
            } catch (error) {
                console.error("Failed to load projects", error);
            } finally {
                setLoading(false);
            }
        };
        loadProjects();
    }, []);

    // Filter projects based on the active tab
    const filteredProjects = projects.filter(project => {
        const cat = project.category?.toLowerCase() || '';
        const isStudy = cat.includes('pesquisa') || cat.includes('estudo') || cat.includes('ux');
        if (activeTab === 'study') return isStudy;
        return !isStudy; // "UI" tab shows everything else
    });

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <Section id="projects" className="py-16 md:py-32 min-h-screen flex flex-col">
            <div className="flex-grow">
                {/* Header */}
                <div className="mb-10 md:mb-16">
                    <div className="border-b border-zinc-200 dark:border-white/10 pb-10 flex flex-col md:flex-row justify-between items-end gap-6">
                        <div>
                            <TextReveal>
                                <h2 className="text-4xl md:text-6xl font-bold text-foreground mb-2">
                                    Todos os Projetos
                                </h2>
                            </TextReveal>
                            <p className="text-muted-foreground text-lg w-full mt-4">
                                Arquivo completo de cases e experimentos.
                            </p>
                        </div>

                        <div className="flex flex-col md:flex-row items-end md:items-center gap-4 relative z-10">
                            {/* Tabs Container in Header */}
                            <div className="inline-flex items-center p-1 bg-zinc-100 dark:bg-zinc-800/50 rounded-full border border-zinc-200 dark:border-white/5 no-cursor-trail">
                                <button
                                    onClick={() => setActiveTab('ui')}
                                    className={`px-4 py-1.5 md:px-5 md:py-2 rounded-full text-sm font-medium transition-all duration-200 ${activeTab === 'ui'
                                        ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-sm border border-black/5 dark:border-white/5'
                                        : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200 hover:bg-zinc-200/50 dark:hover:bg-zinc-800/70'
                                        }`}
                                >
                                    Projetos UI
                                </button>
                                <button
                                    onClick={() => setActiveTab('study')}
                                    className={`px-4 py-1.5 md:px-5 md:py-2 rounded-full text-sm font-medium transition-all duration-200 ${activeTab === 'study'
                                        ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-sm border border-black/5 dark:border-white/5'
                                        : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200 hover:bg-zinc-200/50 dark:hover:bg-zinc-800/70'
                                        }`}
                                >
                                    Pesquisas UX
                                </button>
                            </div>

                            <Link to="/">
                                <Button variant="outline" className="rounded-full">
                                    <ArrowLeft className="mr-2 h-4 w-4" />
                                    Voltar
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {filteredProjects.map((project, index) => (
                        <ProjectCard
                            key={project._id}
                            title={project.title}
                            category={project.category}
                            image={getImageUrl(project.mainImage)}
                            metric={project.metric}
                            color={project.color}
                            onClick={() => onProjectClick && onProjectClick(project.slug.current)}
                        />
                    ))}
                    {filteredProjects.length === 0 && (
                        <div className="col-span-1 lg:col-span-2 text-center py-12 text-muted-foreground bg-zinc-50 dark:bg-white/5 rounded-2xl border border-zinc-200 dark:border-white/10">
                            Nenhum projeto encontrado nesta categoria no momento.
                        </div>
                    )}
                </div>
            </div>
        </Section>
    );
};
