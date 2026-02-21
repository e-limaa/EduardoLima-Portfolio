import { motion } from "motion/react";
import { Quote } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Section, Card, CardContent } from "@antigravity/ds";
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
    <Section className="py-32 bg-black" container={false}>
      {/* Background blob */}
      <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-[600px] h-[600px] bg-blue-900/10 rounded-full blur-[120px] pointer-events-none mix-blend-screen animate-pulse"></div>

      <div className="w-full max-w-[2000px] mx-auto px-4 md:px-8 xl:px-12 relative z-10">
        <div className="mb-20 border-b border-white/10 pb-10 flex flex-col md:flex-row justify-between items-end gap-6">
          <div>
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-2">{t("testimonials.title")}</h2>
            <p className="text-zinc-500 text-lg max-w-md mt-4">
              {t("testimonials.subtitle")}
            </p>
          </div>
          <div className="text-right hidden md:block">
            <span className="text-zinc-600 font-mono text-sm">03 — TESTIMONIALS</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="group"
            >
              <Card className="h-full bg-white/5 border-white/5 backdrop-blur-sm hover:border-blue-500/20 transition-colors relative">
                <CardContent className="p-8 pt-12">
                  <Quote className="w-10 h-10 text-zinc-700 group-hover:text-blue-500/40 transition-colors mb-6 absolute top-6 right-6" />

                  <p className="text-zinc-300 mb-8 leading-relaxed relative z-10">
                    "{t(testimonial.textKey)}"
                  </p>

                  <div className="flex items-center gap-4">
                    <Avatar>
                      <AvatarImage src={testimonial.img} />
                      <AvatarFallback>{testimonial.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="text-white font-bold text-sm">{testimonial.name}</h4>
                      <p className="text-zinc-500 text-xs">{t(testimonial.roleKey)}</p>
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
