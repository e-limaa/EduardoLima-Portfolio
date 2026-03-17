import React, { useState } from "react";
import { Button, Input, Label, toast } from "@limia/design-system";
import { ArrowRight } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Navbar } from "../components/landing/Navbar";
import { supabase } from "../lib/supabase";
import posthog from "posthog-js";
import { useLanguage } from "../components/language-provider";

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

export const Newsletter = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const isInternal = location.state?.fromInternal;
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const automationSteps = [1, 2, 3, 4, 5].map((step) => t(`newsletter.page.step.${step}`));
  const differentiators = [1, 2, 3, 4].map((item) => t(`newsletter.page.diff.${item}`));

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
      toast.success(t("newsletter.page.toast.successTitle"), {
        description: t("newsletter.page.toast.successDescription"),
      });
    } catch (error: any) {
      console.error("Error subscribing:", error);
      setStatus("error");
      posthog.capture("Newsletter Subscription Failed", { error_code: error?.code || "unknown_error" });
      if (error?.code === "23505") {
        toast.error(t("newsletter.page.toast.duplicateTitle"), {
          description: t("newsletter.page.toast.duplicateDescription"),
        });
      } else {
        toast.error(t("newsletter.page.toast.errorTitle"), {
          description: t("newsletter.page.toast.errorDescription"),
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
              {t("newsletter.page.badge")}
            </span>
            <span className="ml-1 text-foreground">.</span>
          </div>
        </header>

        <div className="relative flex flex-1 flex-col items-start py-12 lg:flex-row lg:pt-20">
          <div className="relative order-1 -mt-[72px] flex w-[calc(100%+48px)] items-center justify-center pointer-events-none -mx-6 md:hidden">
            <img
              src="/assets/images/mobile-email.webp"
              alt={t("newsletter.page.mobilePreviewAlt")}
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
                {t("newsletter.page.title")}
              </h1>
              <p className="mt-2 text-[16px] leading-[1.4] text-muted-foreground">
                {t("newsletter.page.description")}
              </p>
            </div>

            <div className="flex flex-col gap-6">
              <h2 className="text-base font-bold leading-[1.4] text-foreground md:text-[18px]">
                {t("newsletter.page.eyebrow")}
              </h2>

              <form
                onSubmit={handleSubmit}
                className="-mx-4 relative z-10 flex flex-col gap-4 rounded-3xl border border-border/70 bg-card/80 p-4 backdrop-blur-sm md:mx-0 md:p-6"
              >
                <div className="flex flex-col gap-2">
                  <Label htmlFor="name" className="text-[16px] font-medium">
                    {t("newsletter.page.nameLabel")}
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder={t("newsletter.page.namePlaceholder")}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="h-12 bg-input-background text-[16px]"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="email" className="text-[16px] font-medium">
                    {t("newsletter.page.emailLabel")}
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder={t("newsletter.page.emailPlaceholder")}
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
                        ? t("newsletter.page.submitLoading")
                        : status === "success"
                          ? t("newsletter.page.submitSuccess")
                          : t("newsletter.page.submitIdle")}
                    </span>
                    {status === "success" ? null : (
                      <ArrowRight className="ml-2 h-5 w-5 text-primary-foreground transition-transform group-hover:translate-x-1" />
                    )}
                  </Button>
                </div>
                {status === "success" && (
                  <p className="mt-2 text-center text-sm font-medium text-primary">
                    {t("newsletter.page.successInline")}
                  </p>
                )}
              </form>

              <p className="-mt-2 text-[12px] text-muted-foreground">
                {t("newsletter.page.disclaimer")}
              </p>
            </div>

            <div className="my-2 h-px w-full bg-gradient-to-r from-transparent via-border to-transparent" />

            <div className="flex flex-col gap-6">
              <h3 className="text-2xl font-bold tracking-[-0.71px] text-foreground md:text-[32px]">
                {t("newsletter.page.howItWorksTitle")}
              </h3>
              <p className="text-[16px] text-muted-foreground">
                {t("newsletter.page.howItWorksDescription")}
              </p>

              <div className="flex flex-col gap-4">
                <p className="text-[16px] font-bold text-foreground">{t("newsletter.page.listTitle")}</p>
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
                  {t("newsletter.page.resultTitle")}
                </p>
                <p className="text-[16px] text-muted-foreground">
                  {t("newsletter.page.resultDescription")}
                </p>
              </div>
            </div>

            <div className="my-2 h-px w-full bg-gradient-to-r from-transparent via-border to-transparent" />

            <div className="flex flex-col gap-6 pb-20">
              <h3 className="text-2xl font-bold tracking-[-0.71px] text-foreground md:text-[32px]">
                {t("newsletter.page.whyTitle")}
              </h3>
              <p className="text-[16px] text-muted-foreground">
                {t("newsletter.page.whyDescription")}
              </p>

              <div className="flex flex-col gap-4">
                <p className="text-[16px] font-bold text-foreground">{t("newsletter.page.proposalTitle")}</p>
                <ul className="flex flex-col gap-3 text-[16px] text-muted-foreground">
                  {differentiators.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <div className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                      <span className="leading-[1.4]">{item}</span>
                    </li>
                  ))}
                </ul>

                <p className="mt-4 text-[16px] font-bold leading-[1.4] text-foreground">
                  {t("newsletter.page.closingLine1")}
                  <br />
                  {t("newsletter.page.closingLine2")}
                </p>
              </div>
            </div>
          </div>

          <div className="order-1 mt-12 hidden w-full items-center justify-center pointer-events-none md:flex lg:absolute lg:-top-10 lg:left-[calc(50%+306.5px)] lg:mt-0 lg:w-[996px] lg:-translate-x-1/2 lg:order-2">
            <img
              src="/assets/images/frame-email.webp"
              alt={t("newsletter.page.previewAlt")}
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
            <p>© {new Date().getFullYear()} {t("newsletter.page.footerCopyright")}</p>
            <p>{t("newsletter.page.footerTech")}</p>
          </div>
        </footer>
      </div>
    </div>
  );
};
