import React, { useState } from "react";
import { Button } from "@antigravity/ds";
import { Input } from "@antigravity/ds";
import { ArrowRight, Github, Instagram, Twitter } from "lucide-react";
import { Navbar } from "../components/landing/Navbar";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { toast } from "sonner";

export const Newsletter = () => {
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !email) return;

        setStatus("loading");
        try {
            const { error } = await supabase
                .from("newsletter_subscribers")
                .insert([
                    {
                        name,
                        email,
                    },
                ]);

            if (error) throw error;

            setStatus("success");
            setName("");
            setEmail("");
            toast.success("Inscrito com sucesso!", {
                description: "Você foi adicionado à nossa lista."
            });
        } catch (error: any) {
            console.error("Error subscribing:", error);
            setStatus("error");
            if (error?.code === '23505') {
                toast.error("Você já está inscrito!", {
                    description: "Este e-mail já faz parte da nossa lista."
                });
            } else {
                toast.error("Erro ao se inscrever.", {
                    description: "Tente novamente mais tarde."
                });
            }
        }
    };

    return (
        <div className="min-h-screen w-full bg-[#030303] text-zinc-300 font-sans relative overflow-x-hidden selection:bg-blue-500/30">
            <Navbar onNavigate={(id) => {
                const element = document.getElementById(id);
                if (element) {
                    element.scrollIntoView({ behavior: "smooth" });
                } else {
                    // Navigate to home and then scroll
                    navigate("/", { replace: false });
                    setTimeout(() => {
                        const targetElement = document.getElementById(id);
                        if (targetElement) {
                            targetElement.scrollIntoView({ behavior: "smooth" });
                        }
                    }, 100);
                }
            }} />

            {/* Background Gradients */}
            <div className="absolute top-0 left-0 w-full h-[900px] pointer-events-none z-0">
                <div className="absolute top-[-200px] left-[70%] w-[500px] h-[500px] bg-blue-500/10 blur-[120px] rounded-full" />
                <div className="absolute top-[0px] left-[20%] w-[500px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full" />
            </div>

            <div className="max-w-[1600px] mx-auto px-6 md:px-12 relative z-10 w-full flex flex-col min-h-screen">

                {/* Header */}
                <header className="py-8 flex text-center sm:text-left flex-row items-center justify-between w-full shrink-0">
                    <Link to="/" className="flex items-center text-lg md:text-xl font-bold tracking-tight hover:opacity-80 transition-opacity cursor-pointer">
                        <span className="text-zinc-100">Eduardo Lima</span>
                        <span className="text-blue-500 ml-1">.</span>
                    </Link>
                    <div className="flex items-center text-lg md:text-xl font-bold tracking-tight cursor-pointer hover:opacity-80 transition-opacity">
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-600">Newsletter AI</span>
                        <span className="text-zinc-100 ml-1">.</span>
                    </div>
                </header>

                {/* Main Content Layout */}
                <div className="flex flex-col lg:flex-row flex-1 py-12 lg:pt-20 items-start relative w-full">

                    {/* Mobile Image (Visible only on small screens) */}
                    <div className="w-[calc(100%+48px)] -mx-6 flex md:hidden items-center justify-center z-0 pointer-events-none order-1 -mt-[72px] relative">
                        <img src="/assets/images/mobile-email.webp" alt="Newsletter Preview Mobile" loading="lazy" className="w-full h-auto object-cover rounded-none mask-image-b" style={{ WebkitMaskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)', maskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)' }} />
                    </div>

                    {/* Left Side: Copy & Form */}
                    <div className="w-full lg:max-w-[434px] flex flex-col gap-12 lg:gap-14 mx-auto lg:mx-0 z-10 relative order-2 lg:order-1 -mt-32 lg:mt-0 pt-4">

                        {/* Header / Value Proposition */}
                        <div className="flex flex-col gap-4">
                            <h1 className="text-3xl md:text-[48px] font-bold tracking-[-0.71px] text-white leading-[1.1] md:leading-none items-center">
                                Fique à frente da revolução da IA.
                            </h1>
                            <p className="text-[#a1a1aa] text-[16px] leading-[1.4] mt-2">
                                Três vezes por semana envio uma curadoria estratégica das principais notícias de Inteligência Artificial, coletadas automaticamente via RSS e organizadas por uma automação que eu mesmo desenvolvi com n8n.
                            </p>
                        </div>

                        {/* Interactive Form */}
                        <div className="flex flex-col gap-6">
                            <h2 className="text-base md:text-[18px] font-bold text-white leading-[1.4]">
                                Automação com critério. Informação sem ruído.
                            </h2>

                            <form onSubmit={handleSubmit} className="flex flex-col gap-4 relative z-10 bg-[#030303] md:bg-transparent -mx-4 md:mx-0 p-4 md:p-0 rounded-2xl">
                                <div className="flex flex-col gap-2">
                                    <label htmlFor="name" className="text-[16px] font-medium text-[#d8d8d8]">Nome</label>
                                    <Input
                                        id="name"
                                        type="text"
                                        placeholder="Como gosta de ser chamado(a)?"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                        className="h-[48px] bg-[#262626] border-[#4d4d4d] text-[16px] text-zinc-100 placeholder:text-[#b0b0b0]"
                                    />
                                </div>

                                <div className="flex flex-col gap-2">
                                    <label htmlFor="email" className="text-[16px] font-medium text-[#d8d8d8]">E-mail</label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="seu.melhor@email.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        className="h-[48px] bg-[#262626] border-[#4d4d4d] text-[16px] text-zinc-100 placeholder:text-[#b0b0b0]"
                                    />
                                </div>

                                <div className="pt-4">
                                    <Button
                                        type="submit"
                                        size="lg"
                                        className="w-full h-[48px] rounded-full text-[16px] font-medium flex items-center justify-between px-8 cursor-pointer group hover:scale-[1.02] transition-all"
                                        disabled={status === "loading" || status === "success"}
                                    >
                                        <span className="text-primary-foreground font-normal">{status === "loading" ? "Inscrevendo..." : status === "success" ? "Inscrito com sucesso!" : "Entrar na lista"}</span>
                                        {status === "success" ? null : <ArrowRight className="w-5 h-5 ml-2 text-primary-foreground transition-transform group-hover:translate-x-1" />}
                                    </Button>
                                </div>
                                {status === "success" && (
                                    <p className="text-green-400 text-sm text-center mt-2 font-medium">Você foi adicionado à lista. Verifique seu email.</p>
                                )}
                            </form>

                            <p className="text-[#a1a1aa] text-[12px] -mt-2">Sem spam. Cancelamento a qualquer momento.</p>
                        </div>

                        {/* divider */}
                        <div className="h-px w-full bg-gradient-to-r from-zinc-800 via-zinc-700 to-zinc-800 my-2" />

                        {/* Como funciona */}
                        <div className="flex flex-col gap-6">
                            <h3 className="text-2xl md:text-[32px] font-bold tracking-[-0.71px] text-white">Como funciona?</h3>
                            <p className="text-[#a1a1aa] text-[16px]">A newsletter é alimentada por uma automação criada por mim utilizando n8n.</p>

                            <div className="flex flex-col gap-4">
                                <p className="font-bold text-white text-[16px]">Ela:</p>
                                <ul className="flex flex-col gap-3 text-[#a1a1aa] text-[16px]">
                                    <li className="flex items-start gap-3">
                                        <div className="w-1.5 h-1.5 rounded-full bg-[#a1a1aa] mt-2.5 shrink-0" />
                                        <span className="leading-[1.4]">Busca notícias em fontes confiáveis via RSS</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <div className="w-1.5 h-1.5 rounded-full bg-[#a1a1aa] mt-2.5 shrink-0" />
                                        <span className="leading-[1.4]">Organiza e estrutura o conteúdo</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <div className="w-1.5 h-1.5 rounded-full bg-[#a1a1aa] mt-2.5 shrink-0" />
                                        <span className="leading-[1.4]">Filtra o que realmente importa</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <div className="w-1.5 h-1.5 rounded-full bg-[#a1a1aa] mt-2.5 shrink-0" />
                                        <span className="leading-[1.4]">Cria o e-mail HTML com a minha identidade</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <div className="w-1.5 h-1.5 rounded-full bg-[#a1a1aa] mt-2.5 shrink-0" />
                                        <span className="leading-[1.4]">Dispara automaticamente três vezes por semana</span>
                                    </li>
                                </ul>
                            </div>

                            <div className="flex flex-col gap-4 mt-4">
                                <p className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-600 font-bold text-lg md:text-[20px] tracking-tight">Resultado:</p>
                                <p className="text-[#a1a1aa] text-[16px]">Você recebe informação relevante, com consistência e sem depender de redes sociais ou algoritmo.</p>
                            </div>
                        </div>

                        {/* divider */}
                        <div className="h-px w-full bg-gradient-to-r from-zinc-800 via-zinc-700 to-zinc-800 my-2" />

                        {/* Por que isso é diferente? */}
                        <div className="flex flex-col gap-6 pb-20">
                            <h3 className="text-2xl md:text-[32px] font-bold tracking-[-0.71px] text-white">
                                Por que isso é diferente?
                            </h3>
                            <p className="text-[#a1a1aa] text-[16px]">A maioria dos conteúdos sobre IA vive de hype.</p>

                            <div className="flex flex-col gap-4">
                                <p className="font-bold text-white text-[16px]">Minha proposta é simples:</p>
                                <ul className="flex flex-col gap-3 text-[#a1a1aa] text-[16px]">
                                    <li className="flex items-start gap-3">
                                        <div className="w-1.5 h-1.5 rounded-full bg-[#a1a1aa] mt-2.5 shrink-0" />
                                        <span className="leading-[1.4]">Fontes confiáveis</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <div className="w-1.5 h-1.5 rounded-full bg-[#a1a1aa] mt-2.5 shrink-0" />
                                        <span className="leading-[1.4]">Atualização constante</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <div className="w-1.5 h-1.5 rounded-full bg-[#a1a1aa] mt-2.5 shrink-0" />
                                        <span className="leading-[1.4]">Menos ruído</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <div className="w-1.5 h-1.5 rounded-full bg-[#a1a1aa] mt-2.5 shrink-0" />
                                        <span className="leading-[1.4]">Foco prático</span>
                                    </li>
                                </ul>

                                <p className="font-bold text-white text-[16px] mt-4 leading-[1.4]">
                                    Automação garante consistência.<br />
                                    Critério garante qualidade.
                                </p>
                            </div>
                        </div>

                    </div>

                    {/* Right Side: Mock Phone / News Layout */}
                    <div className="w-full lg:absolute lg:w-[996px] lg:left-[calc(50%+306.5px)] lg:-translate-x-1/2 lg:-top-10 hidden md:flex items-center justify-center z-0 pointer-events-none mt-12 lg:mt-0 order-1 lg:order-2">
                        <img src="/assets/images/frame-email.webp" alt="Newsletter Preview" loading="lazy" className="w-full h-auto object-contain" />
                    </div>
                </div>

                {/* Footer */}
                <footer className="border-t border-white/10 py-8 mt-auto flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-8 md:gap-12">
                        <div className="flex items-center text-xl font-bold tracking-tight">
                            <span className="text-zinc-100">Eduardo Lima</span>
                            <span className="text-blue-500 ml-1">.</span>
                        </div>
                        <div className="flex items-center gap-6">
                            <a href="#" className="text-zinc-400 hover:text-white transition-colors text-sm font-mono tracking-wider uppercase">Github</a>
                            <a href="#" className="text-zinc-400 hover:text-white transition-colors text-sm font-mono tracking-wider uppercase">Instagram</a>
                            <a href="#" className="text-zinc-400 hover:text-white transition-colors text-sm font-mono tracking-wider uppercase">Twitter</a>
                        </div>
                    </div>
                    <div className="text-right flex flex-col gap-1 text-zinc-500 font-mono text-xs uppercase tracking-widest">
                        <p>© 2025 Design Portfolio</p>
                        <p>Developed with React & Tailwind</p>
                    </div>
                </footer>

            </div>
        </div>
    );
};
