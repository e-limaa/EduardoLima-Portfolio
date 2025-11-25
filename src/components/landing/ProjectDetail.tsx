import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import { ArrowLeft, ArrowRight, Layers, Calendar, User, Building2 } from "lucide-react";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { TextReveal } from "./TextReveal";
import { InteractiveGrid } from "./InteractiveGrid";
import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogDescription } from "../ui/dialog";
import { getProjectById, getImageUrl, getProjects } from "../../lib/project-service";
import { Project } from "../../lib/sanity-types";

interface ProjectDetailProps {
    projectId: string;
    onBack: () => void;
    onNext: (nextId: string) => void;
    onPrev: (prevId: string) => void;
}

export const ProjectDetail = ({ projectId, onBack, onNext, onPrev }: ProjectDetailProps) => {
    const [project, setProject] = useState<Project | null>(null);
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                const allProjects = await getProjects();
                setProjects(allProjects);
                const current = allProjects.find(p => p._id === projectId);
                setProject(current || null);
            } catch (error) {
                console.error("Failed to load project", error);
            } finally {
                setLoading(false);
            }
        };

        loadData();
        window.scrollTo(0, 0);
    }, [projectId]);

    const currentIndex = projects.findIndex(p => p._id === projectId);
    const nextProject = projects[currentIndex + 1] || projects[0];
    const prevProject = projects[currentIndex - 1] || projects[projects.length - 1];

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!project) return null;

    // Função auxiliar para obter URL da imagem (abstração para Sanity)
    const mainImageUrl = getImageUrl(project.mainImage);

    return (
        <div className="min-h-screen bg-black text-zinc-100 relative overflow-x-hidden selection:bg-blue-500/30">
            <InteractiveGrid variant="subtle" />
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none fixed"></div>

            {/* Navigation Bar */}
            <nav className="fixed top-0 left-0 right-0 z-50 p-6 lg:px-12 flex justify-between items-center bg-gradient-to-b from-black via-black/80 to-transparent">
                <button
                    onClick={onBack}
                    className="group flex items-center gap-3 text-zinc-400 hover:text-white transition-colors bg-black/50 backdrop-blur-md px-4 py-2 rounded-full border border-white/10"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    <span className="text-sm font-mono uppercase tracking-wider">Voltar</span>
                </button>

                <div className="flex gap-2">
                    <button
                        onClick={() => prevProject && onPrev(prevProject._id)}
                        className="w-10 h-10 rounded-full border border-white/10 bg-black/50 backdrop-blur-md flex items-center justify-center hover:bg-white hover:text-black transition-colors group"
                    >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    </button>
                    <button
                        onClick={() => nextProject && onNext(nextProject._id)}
                        className="w-10 h-10 rounded-full border border-white/10 bg-black/50 backdrop-blur-md flex items-center justify-center hover:bg-white hover:text-black transition-colors group"
                    >
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            </nav>

            {/* Hero Section */}
            <header className="relative w-full h-[70vh] md:h-[80vh] mt-0">
                <div className="absolute inset-0 w-full h-full">
                    <ImageWithFallback
                        src={mainImageUrl}
                        alt={project.title}
                        className="w-full h-full object-cover opacity-60"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/30" />
                </div>

                <div className="absolute bottom-0 left-0 w-full z-10">
                    <div className="container mx-auto px-4 lg:px-12 pb-6 md:pb-20">
                        <motion.div
                            initial={{ y: 30, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                        >
                            <span className={`inline-block mb-4 px-3 py-1 rounded-full border border-white/20 bg-white/5 backdrop-blur-md text-xs font-mono tracking-widest uppercase text-transparent bg-clip-text bg-gradient-to-r ${project.color}`}>
                                {project.category}
                            </span>
                        </motion.div>

                        <TextReveal>
                            <h1 className="text-5xl md:text-8xl font-bold text-white mb-6 tracking-tighter max-w-4xl">
                                {project.title}
                            </h1>
                        </TextReveal>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6 }}
                            className="flex flex-wrap gap-8 md:gap-16 mt-8 border-t border-white/10 pt-8 text-sm md:text-base"
                        >
                            <div className="flex flex-col gap-2">
                                <span className="text-zinc-500 uppercase tracking-wider font-mono text-xs">Cliente</span>
                                <div className="flex items-center gap-2 text-zinc-200">
                                    <Building2 className="w-4 h-4 text-zinc-500" />
                                    {project.client}
                                </div>
                            </div>
                            <div className="flex flex-col gap-2">
                                <span className="text-zinc-500 uppercase tracking-wider font-mono text-xs">Função</span>
                                <div className="flex items-center gap-2 text-zinc-200">
                                    <User className="w-4 h-4 text-zinc-500" />
                                    {project.role}
                                </div>
                            </div>
                            <div className="flex flex-col gap-2">
                                <span className="text-zinc-500 uppercase tracking-wider font-mono text-xs">Ano</span>
                                <div className="flex items-center gap-2 text-zinc-200">
                                    <Calendar className="w-4 h-4 text-zinc-500" />
                                    {project.year}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 lg:px-12 py-20">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">
                    {/* Main Content */}
                    <div className="lg:col-span-8 flex flex-col gap-16">

                        {/* Overview */}
                        <section>
                            <h3 className="text-2xl font-bold text-white mb-6">Visão Geral</h3>
                            <div className="text-xl md:text-2xl text-zinc-300 font-light leading-relaxed">
                                {/* Aqui entraria o componente <PortableText value={project.description} /> se viesse do Sanity */}
                                {project.description}
                            </div>
                        </section>

                        {/* Challenge & Solution */}
                        <div className="grid md:grid-cols-2 gap-12">
                            <section className="bg-zinc-900/30 border border-white/5 p-8 rounded-2xl">
                                <h3 className="text-lg font-mono uppercase tracking-widest text-zinc-500 mb-4">O Desafio</h3>
                                <div className="text-zinc-300 leading-relaxed">
                                    {project.challenge}
                                </div>
                            </section>
                            <section className="bg-zinc-900/30 border border-white/5 p-8 rounded-2xl">
                                <h3 className="text-lg font-mono uppercase tracking-widest text-zinc-500 mb-4">A Solução</h3>
                                <div className="text-zinc-300 leading-relaxed">
                                    {project.solution}
                                </div>
                            </section>
                        </div>

                        {/* Gallery */}
                        <section>
                            <h3 className="text-2xl font-bold text-white mb-8">Galeria</h3>
                            <div className="grid gap-8">
                                {project.gallery?.map((img, idx) => {
                                    const imgUrl = getImageUrl(img);
                                    return (
                                        <motion.div
                                            key={idx}
                                            initial={{ opacity: 0, y: 20 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            transition={{ delay: idx * 0.1 }}
                                            viewport={{ once: true }}
                                            className="rounded-2xl overflow-hidden border border-white/10"
                                        >
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <div className="cursor-zoom-in w-full h-full">
                                                        <ImageWithFallback
                                                            src={imgUrl}
                                                            alt={`${project.title} galeria ${idx + 1}`}
                                                            className="w-full h-auto hover:scale-105 transition-transform duration-700"
                                                        />
                                                    </div>
                                                </DialogTrigger>
                                                <DialogContent className="!max-w-[95vw] !w-fit !max-h-[95vh] !h-fit p-0 bg-transparent border-none shadow-none flex items-center justify-center outline-none [&>button]:text-white [&>button]:bg-black/50 [&>button]:border [&>button]:border-white/20 [&>button]:hover:bg-black/80 [&>button]:hover:text-white [&>button]:top-4 [&>button]:right-4 [&>button]:p-0 [&>button]:h-6 [&>button]:w-6 [&>button]:rounded-[8px] [&>button]:backdrop-blur-sm [&>button]:flex [&>button]:items-center [&>button]:justify-center">
                                                    <DialogTitle className="sr-only">
                                                        {project.title} - Imagem {idx + 1}
                                                    </DialogTitle>
                                                    <DialogDescription className="sr-only">
                                                        Visualização ampliada da imagem {idx + 1} da galeria do projeto {project.title}.
                                                    </DialogDescription>
                                                    <div className="relative flex items-center justify-center w-full h-full">
                                                        <ImageWithFallback
                                                            src={imgUrl}
                                                            alt={`${project.title} galeria ${idx + 1} full`}
                                                            className="w-auto h-auto max-w-[95vw] max-h-[95vh] object-contain rounded-lg shadow-2xl"
                                                        />
                                                    </div>
                                                </DialogContent>
                                            </Dialog>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </section>

                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-4 relative">
                        <div className="sticky top-32 space-y-12">
                            {/* Metric */}
                            <div className="p-8 rounded-2xl bg-gradient-to-br from-zinc-900 to-black border border-white/10">
                                <span className="block text-zinc-500 text-sm uppercase tracking-widest font-mono mb-2">Métrica Chave</span>
                                <div className={`text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r ${project.color}`}>
                                    {project.metric}
                                </div>
                            </div>

                            {/* Stack */}
                            <div>
                                <h3 className="flex items-center gap-2 text-lg font-bold text-white mb-6">
                                    <Layers className="w-5 h-5 text-zinc-500" />
                                    Tecnologias
                                </h3>
                                <div className="flex flex-wrap gap-3">
                                    {project.stack?.map((tech) => (
                                        <span
                                            key={tech}
                                            className="px-4 py-2 rounded-full bg-zinc-900 border border-white/10 text-zinc-300 text-sm hover:bg-zinc-800 transition-colors cursor-default"
                                        >
                                            {tech}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* CTA */}
                            <div className="pt-8 border-t border-white/10">
                                <p className="text-zinc-500 mb-4">Interessado em construir algo similar?</p>
                                <a href="#contact" className="inline-flex items-center gap-2 text-white font-bold hover:gap-3 transition-all">
                                    Iniciar um Projeto <ArrowRight className="w-4 h-4" />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Next Project Teaser Footer */}
            <div
                className="w-full py-20 border-t border-white/10 bg-zinc-900/50 cursor-pointer group relative overflow-hidden"
                onClick={() => nextProject && onNext(nextProject._id)}
            >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />

                <div className="container mx-auto px-4 lg:px-12 text-center">
                    <span className="text-zinc-500 uppercase tracking-widest font-mono text-sm mb-4 block">Próximo Projeto</span>
                    <h2 className="text-4xl md:text-6xl font-bold text-white group-hover:scale-105 transition-transform duration-500">
                        Ver Próximo
                    </h2>
                    <div className="mt-6 flex justify-center">
                        <div className="w-16 h-16 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-colors">
                            <ArrowRight className="w-6 h-6" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
