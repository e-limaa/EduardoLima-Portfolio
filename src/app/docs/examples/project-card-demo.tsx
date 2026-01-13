import React from 'react';
import { ProjectCard } from "@antigravity/ds";

export const ProjectCardDefaultDemo = () => (
    <div className="w-full max-w-md mx-auto relative">
        <ProjectCard
            title="Neo Bank App"
            category="Fintech"
            image="https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=1000&auto=format&fit=crop"
            metric="2024"
            color="from-violet-500 to-purple-500"
            className="h-[400px]"
        />
    </div>
);

export const ProjectCardGridDemo = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <ProjectCard
            title="E-commerce Platform"
            category="Web Development"
            image="https://images.unsplash.com/photo-1523474253046-8cd2748b5fd2?q=80&w=1000&auto=format&fit=crop"
            metric="+45% Conv"
            color="from-orange-500 to-red-500"
            className="h-[350px]"
        />
        <ProjectCard
            title="AI Dashboard"
            category="SaaS Product"
            image="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000&auto=format&fit=crop"
            metric="v2.0"
            color="from-cyan-500 to-blue-500"
            className="h-[350px]"
        />
    </div>
);
