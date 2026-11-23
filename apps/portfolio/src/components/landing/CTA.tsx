import { motion, useReducedMotion } from "motion/react";
import { ArrowUpRight, Linkedin, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import { Button, InteractiveGrid, cn } from "@limia/design-system";
import { linkedinUrl, socialLinks, whatsappUrl } from "../../lib/social-links";
import { useLanguage } from "../language-provider";
import { ContactFormModal } from "./ContactFormModal";
import { useStudioGlow } from "./useStudioGlow";

const quickAnchors = [
  { href: "#hero", translationKey: "nav.hero" },
  { href: "#projects", translationKey: "nav.projects" },
  { href: "#services", translationKey: "nav.services" },
  { href: "#story", translationKey: "nav.story" },
  { href: "#stack", translationKey: "nav.stack" },
];

const contactButtonClass = "w-full justify-center gap-2.5 px-6 xl:px-8";

export const CTA = () => {
  const { t } = useLanguage();
  const shouldReduceMotion = useReducedMotion();
  const portalGlow = useStudioGlow();

  const activeContactCount = 1 + (whatsappUrl ? 1 : 0) + (linkedinUrl ? 1 : 0);
  const contactGridClass =
    activeContactCount === 1
      ? "mt-10 grid max-w-sm grid-cols-1 gap-4"
      : activeContactCount === 2
        ? "mt-10 grid max-w-2xl grid-cols-1 gap-4 sm:grid-cols-2"
        : "mt-10 grid max-w-5xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3";

  return (
    <footer
      id="contact"
      className="relative isolate scroll-mt-12 overflow-hidden border-t border-border bg-background pt-20 pb-32 transition-colors duration-300 sm:pb-36 md:pt-28"
    >
      <InteractiveGrid variant="subtle" className="z-0" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[url('/noise.svg')] opacity-20"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-16 left-1/2 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-primary/15 blur-[140px]"
      />

      <div className="relative z-10 mx-auto w-full max-w-[2000px] px-4 md:px-8 xl:px-12">
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
          whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          onPointerMove={portalGlow.onPointerMove}
          onPointerLeave={portalGlow.onPointerLeave}
          className="studio-glow-surface relative overflow-hidden rounded-[2.25rem] bg-layer-1/85 p-8 shadow-2xl backdrop-blur-2xl sm:p-12 lg:p-16"
        >
          <div
            data-studio-bg="true"
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent"
          />

          <div>
            <div className="inline-flex flex-wrap items-center gap-x-3 gap-y-1.5 rounded-2xl border border-border/80 bg-layer-2/80 px-4 py-2 backdrop-blur-md sm:rounded-full sm:py-1.5">
              <span className="font-mono text-xs font-semibold text-primary">
                05
              </span>
              <span aria-hidden="true" className="text-border-strong">
                /
              </span>
              <span className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
                {t("cta.label")}
              </span>
              <span aria-hidden="true" className="h-3 w-px bg-border" />
              <span className="inline-flex items-center gap-2 text-xs text-muted-foreground">
                <span
                  aria-hidden="true"
                  className="h-2 w-2 rounded-full bg-success shadow-[0_0_10px_var(--support-success-background)]"
                />
                {t("cta.availability")}
              </span>
            </div>

            <h2 className="mt-6 text-display-lg sm:text-display-xl md:text-display-2xl font-bold tracking-tighter leading-[1.02] text-foreground">
              {t("cta.title")}
              <span className="text-primary">.</span>
            </h2>

            <p className="mt-5 max-w-2xl text-body-lg leading-relaxed text-pretty text-muted-foreground">
              {t("cta.description")}
            </p>

            <div className={contactGridClass}>
              <ContactFormModal>
                <Button size="xl" className={contactButtonClass}>
                  <Mail aria-hidden="true" className="h-5 w-5 shrink-0" />
                  <span>{t("cta.button.email")}</span>
                </Button>
              </ContactFormModal>

              {whatsappUrl && (
                <Button asChild size="xl" className={contactButtonClass}>
                  <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                    <svg
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      aria-hidden="true"
                      className="h-5 w-5 shrink-0"
                    >
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.008-.57-.008-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    <span>WhatsApp</span>
                  </a>
                </Button>
              )}

              {linkedinUrl && (
                <Button
                  asChild
                  size="xl"
                  className={cn(
                    contactButtonClass,
                    activeContactCount === 3 && "sm:col-span-2 lg:col-span-1"
                  )}
                >
                  <a href={linkedinUrl} target="_blank" rel="noopener noreferrer">
                    <Linkedin aria-hidden="true" className="h-5 w-5 shrink-0" />
                    <span>{t("cta.button.linkedin")}</span>
                  </a>
                </Button>
              )}
            </div>
          </div>
        </motion.div>

        <div className="mt-12 flex flex-col items-center justify-between gap-6 border-t border-border/70 pt-8 md:flex-row">
          <div className="flex flex-col items-center gap-5 md:flex-row md:gap-10">
            <div className="text-heading-md font-bold tracking-tighter text-foreground">
              Eduardo Lima<span className="text-primary">.</span>
            </div>

            <nav aria-label="Footer sections" className="flex flex-wrap justify-center gap-5">
              {quickAnchors.map((anchor) => (
                <a
                  key={anchor.href}
                  href={anchor.href}
                  className="font-mono text-xs uppercase tracking-wider text-muted-foreground transition-colors hover:text-foreground"
                >
                  {t(anchor.translationKey)}
                </a>
              ))}
              <Link
                to="/newsletter"
                state={{ fromInternal: true }}
                className="inline-flex items-center gap-1 font-mono text-xs uppercase tracking-wider text-primary transition-colors hover:text-primary/80"
              >
                <span>{t("newsletter.trigger")}</span>
                <ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5" />
              </Link>
            </nav>

            {socialLinks.length > 0 && (
              <div className="flex flex-wrap justify-center gap-5">
                {socialLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-xs uppercase tracking-wider text-muted-foreground transition-colors hover:text-primary"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            )}
          </div>

          <div className="text-center font-mono text-xs uppercase tracking-widest text-muted-foreground md:text-right">
            <p>© {new Date().getFullYear()} Eduardo Lima</p>
            <p className="mt-1">{t("cta.footer.builtWith")}</p>
          </div>
        </div>
      </div>
    </footer>
  );
};
