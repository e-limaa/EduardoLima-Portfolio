import React from "react";
import { motion } from "motion/react";

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
  return (
    <div className="w-full py-10 bg-white dark:bg-black border-y border-zinc-200 dark:border-white/5 overflow-hidden relative z-20 transition-colors duration-300">
      <div className="flex">
        <motion.div
          initial={{ x: 0 }}
          animate={{ x: "-50%" }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="flex gap-16 whitespace-nowrap pr-16 items-center"
        >
          {[...brands, ...brands, ...brands, ...brands].map((brand, i) => (
            <div key={i} className="flex items-center justify-center opacity-50 hover:opacity-100 transition-opacity cursor-default grayscale hover:grayscale-0">
              <img
                src={brand.logo}
                alt={brand.name}
                className="h-10 md:h-14 w-auto object-contain max-w-[150px]"
              />
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};
