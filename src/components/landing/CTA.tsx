import { motion } from "motion/react";
import { Linkedin, Mail } from "lucide-react";
import { InteractiveGrid, Button, SectionHeader } from "@antigravity/ds";
import { ContactFormModal } from "./ContactFormModal";
import { useLanguage } from "../language-provider";

export const CTA = () => {
  const { t } = useLanguage();

  return (
    <footer className="relative pt-16 pb-12 md:pt-32 bg-zinc-50 dark:bg-black overflow-hidden border-t border-zinc-200 dark:border-white/10 transition-colors duration-300">
      {/* Background Elements */}
      <InteractiveGrid variant="subtle" />
      <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-20 pointer-events-none"></div>
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-[1000px] h-[500px] bg-blue-500/5 dark:bg-blue-900/10 blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-[2000px] mx-auto px-4 md:px-8 xl:px-12 relative z-10">

        <div className="flex flex-col items-center text-center mb-12 md:mb-24">
          {/* Status removed */}

          <div className="max-w-3xl mx-auto text-center relative z-10 w-full">
            <SectionHeader
              title={t("cta.title")}
              description={t("cta.description")}
              index="05"
              label="CONTACT"
            />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap justify-center gap-4 mt-12"
          >
            <ContactFormModal>
              <Button
                size="lg"
                className="bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 hover:scale-105 duration-300 rounded-full px-8 h-14 text-base font-bold shadow-lg dark:shadow-[0_0_30px_rgba(255,255,255,0.2)]"
              >
                <Mail className="mr-2 h-4 w-4" />
                {t("cta.button.email")}
              </Button>
            </ContactFormModal>

            <Button
              size="lg"
              className="bg-[#25D366] text-white hover:bg-[#128C7E] hover:scale-105 duration-300 rounded-full px-8 h-14 text-base font-bold shadow-[0_0_30px_rgba(37,211,102,0.3)]"
              onClick={() => window.open("https://wa.me/SEU_NUMERO", "_blank", "noopener,noreferrer")}
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="mr-2 h-5 w-5">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.008-.57-.008-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              WhatsApp
            </Button>

            <Button
              size="lg"
              className="bg-[#0077B5] text-white hover:bg-[#006097] hover:scale-105 duration-300 rounded-full px-8 h-14 text-base font-bold shadow-[0_0_30px_rgba(0,119,181,0.3)]"
              onClick={() => window.open("https://linkedin.com", "_blank", "noopener,noreferrer")}
            >
              <Linkedin className="mr-2 h-4 w-4" />
              {t("cta.button.linkedin")}
            </Button>
          </motion.div>
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-zinc-200 dark:border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col md:flex-row items-center gap-6 md:gap-12">
            <div className="text-heading-md font-bold tracking-tighter text-zinc-900 dark:text-white">
              Eduardo Lima<span className="text-blue-600 dark:text-blue-500">.</span>
            </div>
            <div className="flex gap-6">
              <a href="#" className="text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors text-sm uppercase tracking-wider font-mono">Github</a>
              <a href="#" className="text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors text-sm uppercase tracking-wider font-mono">Instagram</a>
              <a href="#" className="text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors text-sm uppercase tracking-wider font-mono">Twitter</a>
            </div>
          </div>

          <div className="text-zinc-500 dark:text-zinc-600 font-mono text-xs uppercase tracking-widest text-center md:text-right">
            <p>© {new Date().getFullYear()} Design Portfolio</p>
            <p className="mt-1">Developed with React & Tailwind</p>
          </div>
        </div>
      </div>
    </footer>
  );
};
