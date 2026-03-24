import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Search, PenTool, Code2, Rocket } from "lucide-react";

export function Process() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"],
  });

  const pathLength = useTransform(scrollYProgress, [0, 0.8], [0, 1]);

  const steps = [
    {
      icon: Search,
      title: "Analyse & Conception",
      desc: "Nous étudions vos besoins et définissons l'architecture technique idéale.",
    },
    {
      icon: PenTool,
      title: "Design UI/UX",
      desc: "Création de maquettes interactives axées sur l'expérience utilisateur.",
    },
    {
      icon: Code2,
      title: "Développement",
      desc: "Code propre, performant et scalable utilisant les dernières technologies.",
    },
    {
      icon: Rocket,
      title: "Livraison & Support",
      desc: "Mise en production, tests finaux et accompagnement continu.",
    },
  ];

  return (
    <section id="process" className="py-24 bg-primary text-primary-foreground relative overflow-hidden" ref={containerRef}>
      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Comment nous travaillons</h2>
          <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto">
            Une méthodologie éprouvée pour transformer vos idées en produits digitaux d'exception.
          </p>
        </div>

        <div className="relative">
          {/* Connecting Line Desktop */}
          <div className="hidden md:block absolute top-12 left-10 right-10 h-1">
            <svg width="100%" height="100%" preserveAspectRatio="none">
              <line x1="0" y1="2" x2="100%" y2="2" stroke="hsl(var(--background))" strokeWidth="2" strokeOpacity="0.2" />
              <motion.line
                x1="0" y1="2" x2="100%" y2="2"
                stroke="hsl(var(--background))"
                strokeWidth="4"
                style={{ pathLength, transformOrigin: "left" }}
              />
            </svg>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 relative">
            {steps.map((step, idx) => (
              <div key={idx} className="relative flex flex-col items-center md:items-start text-center md:text-left group">
                {/* Connecting Line Mobile */}
                {idx !== steps.length - 1 && (
                  <div className="md:hidden absolute top-24 bottom-0 left-1/2 w-0.5 bg-background/20 -translate-x-1/2 z-0" />
                )}
                
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.2, type: "spring", stiffness: 200 }}
                  className="w-24 h-24 rounded-2xl bg-background flex items-center justify-center mb-6 relative z-10 
                             shadow-xl border-4 border-primary group-hover:-translate-y-2 transition-transform duration-300"
                >
                  <step.icon className="w-10 h-10 text-primary" />
                  <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-white text-background font-bold flex items-center justify-center text-sm shadow-md">
                    {idx + 1}
                  </div>
                </motion.div>
                
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.2 + 0.1 }}
                  className="bg-white/10 p-6 rounded-2xl backdrop-blur-sm border border-background/10 w-full"
                >
                  <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                  <p className="text-primary-foreground/80 leading-relaxed text-sm">
                    {step.desc}
                  </p>
                </motion.div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
