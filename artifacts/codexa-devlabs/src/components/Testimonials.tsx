import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    text: "Codexa a transformé notre présence en ligne. Leur équipe a su comprendre nos enjeux complexes et livrer une plateforme SaaS au-delà de nos espérances.",
    name: "Sarah M.",
    role: "CEO TechStartup",
    initials: "SM",
    color: "bg-blue-500"
  },
  {
    text: "Équipe professionnelle, délais respectés. La communication était fluide du début à la fin. Le code livré est propre et parfaitement documenté.",
    name: "Jean-Pierre K.",
    role: "Directeur E-commerce",
    initials: "JK",
    color: "bg-green-500"
  },
  {
    text: "Application mobile livrée en avance et parfaite. Le design UI/UX a considérablement augmenté notre taux de conversion. Je recommande vivement.",
    name: "Aminata D.",
    role: "Fondatrice Fintech",
    initials: "AD",
    color: "bg-purple-500"
  }
];

export function Testimonials() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-24 bg-[hsl(var(--section-darkest))] relative">
      <div className="container mx-auto px-6 max-w-4xl text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-16">Ce que disent nos clients</h2>

        <div className="relative h-[300px] md:h-[250px]">
          <motion.div
            key={current}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 flex flex-col items-center"
          >
            <Quote className="w-12 h-12 text-primary/20 mb-6" />
            
            <div className="flex gap-1 mb-6">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className="w-5 h-5 fill-primary text-primary" />
              ))}
            </div>

            <p className="text-xl md:text-2xl text-white/90 font-light italic leading-relaxed mb-8 max-w-3xl">
              "{testimonials[current].text}"
            </p>

            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-full ${testimonials[current].color} flex items-center justify-center text-white font-bold text-lg`}>
                {testimonials[current].initials}
              </div>
              <div className="text-left">
                <div className="font-bold text-white">{testimonials[current].name}</div>
                <div className="text-primary text-sm font-mono">{testimonials[current].role}</div>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="flex justify-center gap-3 mt-12">
          {testimonials.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrent(idx)}
              className={`h-2 rounded-full transition-all duration-300 ${
                current === idx ? "w-8 bg-primary" : "w-2 bg-white/20 hover:bg-white/40"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
