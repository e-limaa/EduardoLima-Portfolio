import { motion } from "motion/react";
import { Quote } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage, Section, Card, CardContent, SectionHeader } from "@limia/design-system";
import { useLanguage } from "../language-provider";

const testimonials = [
  {
    name: "Sarah Collins",
    roleKey: "testimonials.1.role",
    textKey: "testimonials.1.text",
    img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop"
  },
  {
    name: "Marcus Chen",
    roleKey: "testimonials.2.role",
    textKey: "testimonials.2.text",
    img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop"
  },
  {
    name: "Elena Rodriguez",
    roleKey: "testimonials.3.role",
    textKey: "testimonials.3.text",
    img: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop"
  }
];

export const Testimonials = () => {
  const { t } = useLanguage();

  return (
    <Section className="py-32 bg-background" container={false}>
      {/* Background blob */}
      <div className="pointer-events-none absolute left-0 top-1/2 h-[600px] w-[600px] -translate-y-1/2 rounded-full bg-primary/10 blur-[120px] mix-blend-screen animate-pulse"></div>

      <div className="w-full max-w-[2000px] mx-auto px-4 md:px-8 xl:px-12 relative z-10">
        <SectionHeader
          title={t("testimonials.title")}
          description={t("testimonials.subtitle")}
          index="03"
          label="Testimonials"
          className="mb-20"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="group"
            >
              <Card className="relative h-full border-border bg-card/70 backdrop-blur-sm transition-colors hover:border-primary/20">
                <CardContent className="p-8 pt-12">
                  <Quote className="absolute top-6 right-6 mb-6 h-10 w-10 text-muted-foreground/60 transition-colors group-hover:text-primary/40" />

                  <p className="relative z-10 mb-8 leading-relaxed text-foreground/85">
                    "{t(testimonial.textKey)}"
                  </p>

                  <div className="flex items-center gap-4">
                    <Avatar>
                      <AvatarImage src={testimonial.img} />
                      <AvatarFallback>{testimonial.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="text-sm font-bold text-foreground">{testimonial.name}</h4>
                      <p className="text-xs text-muted-foreground">{t(testimonial.roleKey)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  );
};

