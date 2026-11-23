import { useReducedMotion } from "motion/react";
import { useLanguage } from "../language-provider";

// Import logos
import PeninsulaLogo from "../../assets/logos/Peninsula.png";
import TendaBlogLogo from "../../assets/logos/Tenda-blog.png";
import TendaLogo from "../../assets/logos/Tenda.png";
import AvonLogo from "../../assets/logos/avon.png";
import BozzanoLogo from "../../assets/logos/bozzano.png";
import SepexLogo from "../../assets/logos/sepex.png";
import TresCoracoesLogo from "../../assets/logos/tres-coracoes.png";

const brands = [
  { name: "Peninsula", logo: PeninsulaLogo },
  { name: "Tenda Blog", logo: TendaBlogLogo },
  { name: "Tenda", logo: TendaLogo },
  { name: "Avon", logo: AvonLogo },
  { name: "Bozzano", logo: BozzanoLogo },
  { name: "Sepex", logo: SepexLogo },
  { name: "Tres Coracoes", logo: TresCoracoesLogo },
];

export const BrandMarquee = () => {
  const { t } = useLanguage();
  const shouldReduceMotion = useReducedMotion();
  const repeatedBrands = [...brands, ...brands, ...brands, ...brands];

  return (
    <section
      aria-label={t("brands.eyebrow")}
      className="relative z-20 w-full overflow-hidden border-y border-border/70 bg-layer-1/60 py-8 backdrop-blur-xl transition-colors duration-300 md:py-10"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/45 to-transparent"
      />

      <div className="mx-auto w-full max-w-[2000px] px-4 md:px-8 xl:px-12">
        <p className="mb-6 text-center font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
          {t("brands.eyebrow")}
        </p>

        {shouldReduceMotion ? (
          <ul className="m-0 flex list-none flex-wrap items-center justify-center gap-6 p-0 md:gap-10">
            {brands.map((brand) => (
              <li
                key={brand.name}
                className="group flex items-center justify-center rounded-2xl border border-transparent px-5 py-2.5 transition-all duration-300 hover:border-border/80 hover:bg-layer-2/70"
              >
                <img
                  src={brand.logo}
                  alt={brand.name}
                  className="h-9 w-auto max-w-[140px] object-contain opacity-70 transition-all duration-300 group-hover:opacity-100 dark:brightness-0 dark:invert md:h-11"
                />
              </li>
            ))}
          </ul>
        ) : (
          <div className="studio-marquee-wrap studio-marquee-mask overflow-hidden">
            <ul className="studio-marquee-track m-0 flex w-max list-none items-center gap-6 p-0 pr-6 md:gap-10 md:pr-10">
              {repeatedBrands.map((brand, index) => {
                const isDuplicate = index >= brands.length;
                return (
                  <li
                    key={`${brand.name}-${index}`}
                    aria-hidden={isDuplicate}
                    className="group flex shrink-0 items-center justify-center rounded-2xl border border-transparent px-5 py-2.5 transition-all duration-300 hover:border-border/80 hover:bg-layer-2/70"
                  >
                    <img
                      src={brand.logo}
                      alt={isDuplicate ? "" : brand.name}
                      className="h-9 w-auto max-w-[140px] object-contain opacity-65 transition-all duration-300 group-hover:opacity-100 dark:brightness-0 dark:invert md:h-11"
                    />
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
};
