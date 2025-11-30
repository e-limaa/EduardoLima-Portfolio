import React from "react";
import { motion } from "motion/react";

const brands = [
  "GOOGLE", "SPOTIFY", "AIRBNB", "STRIPE", "NETFLIX", "SHOPIFY", "DISCORD", "LINEAR"
];

export const BrandMarquee = () => {
  return (
    <div className="w-full py-10 bg-white dark:bg-black border-y border-zinc-200 dark:border-white/5 overflow-hidden relative z-20 transition-colors duration-300">
      <div className="flex">
        <motion.div
          initial={{ x: 0 }}
          animate={{ x: "-50%" }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="flex gap-16 whitespace-nowrap pr-16"
        >
          {[...brands, ...brands, ...brands].map((brand, i) => (
            <div key={i} className="flex items-center gap-4 opacity-30 hover:opacity-80 transition-opacity cursor-default">
              <span className="text-lg md:text-2xl font-bold text-black dark:text-white font-mono tracking-tighter">
                {brand}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};
