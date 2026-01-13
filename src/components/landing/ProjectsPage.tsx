import React, { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { TextReveal, Section, Button, ProjectCard } from "@antigravity/ds";
import { getProjects, getImageUrl } from "../../lib/project-service";
import { Project } from "../../lib/sanity-types";
import { Link } from "react-router-dom";

export const ProjectsPage = ({ onBack, onProjectClick }: { onBack: () => void, onProjectClick?: (id: string) => void }) => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);

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

                        <div className="flex flex-col items-end gap-4 relative z-10">
                            <Link to="/">
                                <Button variant="outline" className="rounded-full">
                                    <ArrowLeft className="mr-2 h-4 w-4" />
                                    Voltar
                                </Button>
                            </Link>
                            <span className="text-muted-foreground font-mono text-sm hidden md:block mt-2">ARCHIVE</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {projects.map((project, index) => (
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
                </div>
            </div>
        </Section>
    );
};
