const row1 = ["HTML5", "CSS3", "JavaScript", "React", "Vue", "Node.js", "Python", "Flutter", "HTML5", "CSS3", "JavaScript", "React"];
const row2 = ["Firebase", "MongoDB", "MySQL", "Figma", "Git", "Docker", "TypeScript", "AWS", "Firebase", "MongoDB", "MySQL", "Figma"];

export function TechStack() {
  return (
    <section className="py-20 bg-background overflow-hidden border-y border-white/5">
      <div className="container mx-auto px-6 mb-12 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Notre stack technologique</h2>
        <p className="text-muted-foreground">Les meilleurs outils pour des performances optimales.</p>
      </div>

      <div className="flex flex-col gap-6 relative">
        {/* Gradients to fade edges */}
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

        {/* Row 1 */}
        <div className="flex w-[200%] md:w-[150%] animate-marquee-left hover:[animation-play-state:paused]">
          {row1.map((tech, i) => (
            <div key={i} className="flex-1 px-4">
              <div className="bg-card border border-border px-8 py-4 rounded-xl flex items-center justify-center gap-3 text-muted-foreground hover:text-white hover:border-primary/50 hover:bg-white/5 transition-all cursor-default grayscale hover:grayscale-0">
                <div className="w-2 h-2 rounded-full bg-primary" />
                <span className="font-mono font-bold text-lg">{tech}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Row 2 */}
        <div className="flex w-[200%] md:w-[150%] animate-marquee-right hover:[animation-play-state:paused]">
          {row2.map((tech, i) => (
            <div key={i} className="flex-1 px-4">
              <div className="bg-card border border-border px-8 py-4 rounded-xl flex items-center justify-center gap-3 text-muted-foreground hover:text-white hover:border-primary/50 hover:bg-white/5 transition-all cursor-default grayscale hover:grayscale-0">
                <div className="w-2 h-2 rounded-full bg-primary" />
                <span className="font-mono font-bold text-lg">{tech}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
