import React, { useState, useEffect } from "react";
import { ArrowUpRight } from "lucide-react";
import { Button, SectionHeader, Section, ProjectCard } from "@antigravity/ds";
import { getImageUrl, useProjects } from "../../lib/project-service";
import { Project } from "../../lib/sanity-types";

export const Projects = ({ onViewAll, onProjectClick }: { onViewAll?: () => void, onProjectClick?: (id: string) => void }) => {
    const { projects, isLoading: loading } = useProjects();

    // Display first 6 projects for the grid layout (3 per row * 2 rows ideally)
    const featuredProjects = projects.slice(0, 6);

    if (loading) {
        return <div className="py-20 text-center text-foreground">Carregando projetos...</div>;
    }

    return (
        <Section id="projects" className="pt-16 pb-8 md:pt-32">

            <div className="mb-10 md:mb-16">
                <SectionHeader
                    title="Projetos"
                    description="Uma seleção de trabalhos que definem minha abordagem."
                    index="01"
                    label="PROJECTS"
                />

                {/* Grid Container */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12 no-cursor-trail">
                    {featuredProjects.map((project, index) => (
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

                {/* Bottom Action */}
                <div className="mt-16 flex justify-center">
                    <Button
                        variant="outline"
                        size="lg"
                        onClick={onViewAll}
                        className="group text-lg px-8 h-14 rounded-full border-zinc-200 dark:border-white/10 hover:bg-foreground hover:text-background transition-all duration-300"
                    >
                        Ver todos os projetos
                        <ArrowUpRight className="ml-2 w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </Button>
                </div>
            </div>
        </Section>
    );
};
