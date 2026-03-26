import { useState } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { ArrowUpRight, Loader2, FolderOpen } from "lucide-react";

interface Project {
  id: number;
  title: string;
  category: string;
  techTags: string[];
  imageUrl: string | null;
  projectUrl: string | null;
}

function ensureAbsoluteUrl(url: string): string {
  if (!url) return url;
  if (/^https?:\/\//i.test(url)) return url;
  return `https://${url}`;
}

const categories = ["Tous", "Web", "Mobile", "Logiciels"];

export function Portfolio() {
  const [filter, setFilter] = useState("Tous");

  const { data: projects = [], isLoading } = useQuery<Project[]>({
    queryKey: ["/api/projects"],
    queryFn: () => fetch("/api/projects").then(r => r.json()),
    retry: 1,
  });

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
        ) : filteredProjects.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-24 text-center"
          >
            <div className="w-20 h-20 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-6">
              <FolderOpen className="w-9 h-9 text-primary/60" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Bientôt disponible</h3>
            <p className="text-muted-foreground max-w-sm">
              Nos réalisations seront affichées ici très prochainement.
            </p>
          </motion.div>
        ) : (
          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project) => {
              const href = project.projectUrl ? ensureAbsoluteUrl(project.projectUrl) : null;
              return (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
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

                  {href && (
                    <a
                      href={href}
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
              );
            })}
          </motion.div>
        )}
      </div>
    </section>
  );
}
