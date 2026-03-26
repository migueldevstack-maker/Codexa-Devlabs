import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { ArrowUpRight, Loader2 } from "lucide-react";

interface Project {
  id: number;
  title: string;
  category: string;
  techTags: string[];
  imageUrl: string | null;
  projectUrl: string | null;
}

const fallbackProjects: Project[] = [
  { id: 1, title: "FinTech Dashboard", category: "Web", techTags: ["React", "TypeScript", "Recharts"], imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80", projectUrl: null },
  { id: 2, title: "E-Commerce Mobile", category: "Mobile", techTags: ["Flutter", "Firebase", "Stripe"], imageUrl: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&q=80", projectUrl: null },
  { id: 3, title: "SaaS CRM Platform", category: "Logiciels", techTags: ["Vue.js", "Node.js", "PostgreSQL"], imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80", projectUrl: null },
  { id: 4, title: "App Fitness Santé", category: "Mobile", techTags: ["React Native", "GraphQL"], imageUrl: "https://images.unsplash.com/photo-1526506114642-999d15bfcb24?w=800&q=80", projectUrl: null },
  { id: 5, title: "Portail Immobilier", category: "Web", techTags: ["Next.js", "Tailwind", "Prisma"], imageUrl: "https://images.unsplash.com/photo-1560518883-ce09059eeefa?w=800&q=80", projectUrl: null },
  { id: 6, title: "ERP Logistique", category: "Logiciels", techTags: ["Angular", "Python", "AWS"], imageUrl: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&q=80", projectUrl: null },
];

const categories = ["Tous", "Web", "Mobile", "Logiciels"];

export function Portfolio() {
  const [filter, setFilter] = useState("Tous");

  const { data: apiProjects, isLoading } = useQuery<Project[]>({
    queryKey: ["/api/projects"],
    queryFn: () => fetch("/api/projects").then(r => r.json()),
    retry: 1,
  });

  const projects = (apiProjects && apiProjects.length > 0) ? apiProjects : fallbackProjects;

  const filteredProjects = projects.filter(
    (p) => filter === "Tous" || p.category === filter
  );

  return (
    <section id="portfolio" className="py-24 bg-[hsl(var(--card))] relative">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Nos réalisations</h2>
            <div className="w-20 h-1.5 bg-primary rounded-full"></div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex flex-wrap gap-2"
          >
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  filter === cat
                    ? "bg-primary text-primary-foreground shadow-[0_0_15px_rgba(255,167,127,0.3)]"
                    : "bg-background text-muted-foreground hover:text-white border border-border"
                }`}
              >
                {cat}
              </button>
            ))}
          </motion.div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
        ) : (
          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((project) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  key={project.id}
                  className="group relative rounded-2xl overflow-hidden bg-background border border-border aspect-[4/3] cursor-pointer"
                >
                  <div className="absolute inset-0">
                    {project.imageUrl ? (
                      <img
                        src={project.imageUrl}
                        alt={project.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-60"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary/20 to-background" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
                  </div>

                  {project.projectUrl && (
                    <a
                      href={project.projectUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute inset-0 bg-primary/90 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-6 text-center z-20"
                    >
                      <div className="w-12 h-12 rounded-full bg-background flex items-center justify-center mb-4 translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-100">
                        <ArrowUpRight className="w-6 h-6 text-primary" />
                      </div>
                      <span className="text-primary-foreground font-bold text-xl translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-150">
                        Voir le projet
                      </span>
                    </a>
                  )}

                  <div className="absolute inset-0 p-6 flex flex-col justify-end z-10 transition-opacity duration-300 group-hover:opacity-0">
                    <div className="flex gap-2 mb-3 flex-wrap">
                      {project.techTags.map((tag) => (
                        <span key={tag} className="text-xs font-mono px-2 py-1 rounded bg-white/10 text-white/80 border border-white/10 backdrop-blur-sm">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <h3 className="text-2xl font-bold text-white">{project.title}</h3>
                    <p className="text-primary mt-1 font-medium">{project.category}</p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </section>
  );
}
