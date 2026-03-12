import React, { useState } from "react";
import { Button, Input, Label, toast } from "@limia/design-system";
import { ArrowRight } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Navbar } from "../components/landing/Navbar";
import { supabase } from "../lib/supabase";
import posthog from "posthog-js";

const socialLinks = [
  {
    label: "Github",
    href: import.meta.env.VITE_GITHUB_URL?.trim() || "https://github.com",
  },
  {
    label: "Instagram",
    href: import.meta.env.VITE_INSTAGRAM_URL?.trim() || "https://instagram.com",
  },
  {
    label: "Twitter",
    href: import.meta.env.VITE_TWITTER_URL?.trim() || "https://x.com",
  },
];

const automationSteps = [
  "Busca noticias em fontes confiaveis via RSS",
  "Organiza e estrutura o conteudo",
  "Filtra o que realmente importa",
  "Cria o e-mail HTML com a minha identidade",
  "Dispara automaticamente tres vezes por semana",
];

const differentiators = [
  "Fontes confiaveis",
  "Atualizacao constante",
  "Menos ruido",
  "Foco pratico",
];

export const Newsletter = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isInternal = location.state?.fromInternal;
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    posthog.capture("Newsletter Subscription Attempt");

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
      posthog.capture("Newsletter Subscribed");
      toast.success("Inscrito com sucesso!", {
        description: "Voce foi adicionado a nossa lista.",
      });
    } catch (error: any) {
      console.error("Error subscribing:", error);
      setStatus("error");
      posthog.capture("Newsletter Subscription Failed", { error_code: error?.code || "unknown_error" });
      if (error?.code === "23505") {
        toast.error("Voce ja esta inscrito!", {
          description: "Este e-mail ja faz parte da nossa lista.",
        });
      } else {
        toast.error("Erro ao se inscrever.", {
          description: "Tente novamente mais tarde.",
        });
      }
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-background font-sans text-foreground selection:bg-primary/20">
      {isInternal && (
        <Navbar
          onNavigate={(id) => {
            const element = document.getElementById(id);
            if (element) {
              element.scrollIntoView({ behavior: "smooth" });
            } else {
              navigate("/", { replace: false });
              setTimeout(() => {
                const targetElement = document.getElementById(id);
                if (targetElement) {
                  targetElement.scrollIntoView({ behavior: "smooth" });
                }
              }, 100);
            }
          }}
        />
      )}

      <div className="pointer-events-none absolute top-0 left-0 z-0 h-[900px] w-full">
        <div className="absolute top-[-200px] left-[70%] h-[500px] w-[500px] rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute top-0 left-[20%] h-[500px] w-[500px] rounded-full bg-secondary/80 blur-[120px]" />
        <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-10" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-[1600px] flex-col px-6 md:px-12">
        <header className="flex w-full shrink-0 flex-row items-center justify-between py-8 text-center sm:text-left">
          {isInternal ? (
            <Link
              to="/"
              className="flex items-center text-lg font-bold tracking-tight text-foreground transition-opacity hover:opacity-80 md:text-xl"
            >
              <span>Eduardo Lima</span>
              <span className="ml-1 text-primary">.</span>
            </Link>
          ) : (
            <div className="flex items-center text-lg font-bold tracking-tight text-foreground md:text-xl">
              <span>Eduardo Lima</span>
              <span className="ml-1 text-primary">.</span>
            </div>
          )}
          <div className="flex items-center text-lg font-bold tracking-tight md:text-xl">
            <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Newsletter AI
            </span>
            <span className="ml-1 text-foreground">.</span>
          </div>
        </header>

        <div className="relative flex flex-1 flex-col items-start py-12 lg:flex-row lg:pt-20">
          <div className="relative order-1 -mt-[72px] flex w-[calc(100%+48px)] items-center justify-center pointer-events-none -mx-6 md:hidden">
            <img
              src="/assets/images/mobile-email.webp"
              alt="Newsletter Preview Mobile"
              loading="lazy"
              className="mask-image-b h-auto w-full rounded-none object-cover"
              style={{
                WebkitMaskImage: "linear-gradient(to bottom, black 60%, transparent 100%)",
                maskImage: "linear-gradient(to bottom, black 60%, transparent 100%)",
              }}
            />
          </div>

          <div className="relative z-10 order-2 mx-auto -mt-32 flex w-full flex-col gap-12 pt-4 lg:order-1 lg:mx-0 lg:mt-0 lg:max-w-[434px] lg:gap-14">
            <div className="flex flex-col gap-4">
              <h1 className="items-center text-3xl font-bold leading-[1.1] tracking-[-0.71px] text-foreground md:text-[48px] md:leading-none">
                Fique a frente da revolucao da IA.
              </h1>
              <p className="mt-2 text-[16px] leading-[1.4] text-muted-foreground">
                Tres vezes por semana envio uma curadoria estrategica das principais noticias de
                Inteligencia Artificial, coletadas automaticamente via RSS e organizadas por uma
                automacao que eu mesmo desenvolvi com n8n.
              </p>
            </div>

            <div className="flex flex-col gap-6">
              <h2 className="text-base font-bold leading-[1.4] text-foreground md:text-[18px]">
                Automacao com criterio. Informacao sem ruido.
              </h2>

              <form
                onSubmit={handleSubmit}
                className="-mx-4 relative z-10 flex flex-col gap-4 rounded-3xl border border-border/70 bg-card/80 p-4 backdrop-blur-sm md:mx-0 md:p-6"
              >
                <div className="flex flex-col gap-2">
                  <Label htmlFor="name" className="text-[16px] font-medium">
                    Nome
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Como gosta de ser chamado(a)?"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="h-12 bg-input-background text-[16px]"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="email" className="text-[16px] font-medium">
                    E-mail
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu.melhor@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-12 bg-input-background text-[16px]"
                  />
                </div>

                <div className="pt-4">
                  <Button
                    type="submit"
                    size="lg"
                    className="group flex h-12 w-full items-center justify-between px-6 text-[16px] font-medium transition-transform hover:scale-[1.01]"
                    disabled={status === "loading" || status === "success"}
                  >
                    <span className="font-normal text-primary-foreground">
                      {status === "loading"
                        ? "Inscrevendo..."
                        : status === "success"
                          ? "Inscrito com sucesso!"
                          : "Entrar na lista"}
                    </span>
                    {status === "success" ? null : (
                      <ArrowRight className="ml-2 h-5 w-5 text-primary-foreground transition-transform group-hover:translate-x-1" />
                    )}
                  </Button>
                </div>
                {status === "success" && (
                  <p className="mt-2 text-center text-sm font-medium text-primary">
                    Voce foi adicionado a lista. Verifique seu email.
                  </p>
                )}
              </form>

              <p className="-mt-2 text-[12px] text-muted-foreground">
                Sem spam. Cancelamento a qualquer momento.
              </p>
            </div>

            <div className="my-2 h-px w-full bg-gradient-to-r from-transparent via-border to-transparent" />

            <div className="flex flex-col gap-6">
              <h3 className="text-2xl font-bold tracking-[-0.71px] text-foreground md:text-[32px]">
                Como funciona?
              </h3>
              <p className="text-[16px] text-muted-foreground">
                A newsletter e alimentada por uma automacao criada por mim utilizando n8n.
              </p>

              <div className="flex flex-col gap-4">
                <p className="text-[16px] font-bold text-foreground">Ela:</p>
                <ul className="flex flex-col gap-3 text-[16px] text-muted-foreground">
                  {automationSteps.map((step) => (
                    <li key={step} className="flex items-start gap-3">
                      <div className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                      <span className="leading-[1.4]">{step}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-4 flex flex-col gap-4">
                <p className="text-lg font-bold tracking-tight text-primary md:text-[20px]">
                  Resultado:
                </p>
                <p className="text-[16px] text-muted-foreground">
                  Voce recebe informacao relevante, com consistencia e sem depender de redes
                  sociais ou algoritmo.
                </p>
              </div>
            </div>

            <div className="my-2 h-px w-full bg-gradient-to-r from-transparent via-border to-transparent" />

            <div className="flex flex-col gap-6 pb-20">
              <h3 className="text-2xl font-bold tracking-[-0.71px] text-foreground md:text-[32px]">
                Por que isso e diferente?
              </h3>
              <p className="text-[16px] text-muted-foreground">
                A maioria dos conteudos sobre IA vive de hype.
              </p>

              <div className="flex flex-col gap-4">
                <p className="text-[16px] font-bold text-foreground">Minha proposta e simples:</p>
                <ul className="flex flex-col gap-3 text-[16px] text-muted-foreground">
                  {differentiators.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <div className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                      <span className="leading-[1.4]">{item}</span>
                    </li>
                  ))}
                </ul>

                <p className="mt-4 text-[16px] font-bold leading-[1.4] text-foreground">
                  Automacao garante consistencia.
                  <br />
                  Criterio garante qualidade.
                </p>
              </div>
            </div>
          </div>

          <div className="order-1 mt-12 hidden w-full items-center justify-center pointer-events-none md:flex lg:absolute lg:-top-10 lg:left-[calc(50%+306.5px)] lg:mt-0 lg:w-[996px] lg:-translate-x-1/2 lg:order-2">
            <img
              src="/assets/images/frame-email.webp"
              alt="Newsletter Preview"
              loading="lazy"
              className="h-auto w-full object-contain"
            />
          </div>
        </div>

        <footer className="mt-auto flex flex-col items-center justify-between gap-6 border-t border-border/70 py-8 md:flex-row">
          <div className="flex items-center gap-8 md:gap-12">
            <div className="flex items-center text-xl font-bold tracking-tight text-foreground">
              <span>Eduardo Lima</span>
              <span className="ml-1 text-primary">.</span>
            </div>
            <div className="flex items-center gap-6">
              {socialLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-mono uppercase tracking-wider text-muted-foreground transition-colors hover:text-foreground"
                  onClick={() => posthog.capture("Social Link Clicked", { network: link.label })}
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-1 text-right font-mono text-xs uppercase tracking-widest text-muted-foreground">
            <p>© {new Date().getFullYear()} Design Portfolio</p>
            <p>Developed with React & Tailwind</p>
          </div>
        </footer>
      </div>
    </div>
  );
};
