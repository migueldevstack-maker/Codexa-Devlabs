import { motion } from "framer-motion";
import { Globe, Smartphone, TerminalSquare, Wrench } from "lucide-react";

export function Services() {
  const services = [
    {
      icon: Globe,
      title: "Sites Web & Landing Pages",
      description: "Des vitrines digitales performantes, optimisées pour la conversion et le SEO. Design moderne et expériences fluides.",
    },
    {
      icon: Smartphone,
      title: "Applications Mobile",
      description: "Solutions iOS et Android natives ou cross-platform (Flutter/React Native) pensées pour l'engagement utilisateur.",
    },
    {
      icon: TerminalSquare,
      title: "Logiciels sur mesure",
      description: "Outils métiers, SaaS et tableaux de bord complexes développés pour automatiser et scaler votre activité.",
    },
    {
      icon: Wrench,
      title: "Maintenance & Support",
      description: "Accompagnement continu, mises à jour de sécurité, hébergement cloud et évolutions de vos plateformes.",
    }
  ];

  return (
    <section id="services" className="py-24 bg-primary text-primary-foreground relative overflow-hidden">
      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 font-sans tracking-tight">Ce que nous créons</h2>
          <div className="w-20 h-1.5 bg-background rounded-full"></div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="bg-background rounded-2xl p-8 group hover:-translate-y-2 transition-all duration-300
                         border border-transparent hover:border-primary/50 shadow-lg hover:shadow-2xl"
            >
              <div className="w-14 h-14 rounded-xl bg-card border border-border flex items-center justify-center mb-6
                            group-hover:bg-primary group-hover:text-background transition-colors duration-300">
                <service.icon className="w-7 h-7 text-primary group-hover:text-background transition-colors" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{service.title}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {service.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
