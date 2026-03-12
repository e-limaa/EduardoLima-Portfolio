import { BrandMarquee } from "./BrandMarquee";
import { Projects } from "./Projects";
import { Services } from "./Services";
import { Storytelling } from "./Storytelling";
import { Stack } from "./Stack";
import { CTA } from "./CTA";

export function LandingSections({
  onProjectClick,
}: {
  onProjectClick: (slug: string) => void;
}) {
  return (
    <>
      <BrandMarquee />
      <Projects onProjectClick={onProjectClick} />
      <Services />
      <Storytelling />
      <Stack />
      <CTA />
    </>
  );
}
