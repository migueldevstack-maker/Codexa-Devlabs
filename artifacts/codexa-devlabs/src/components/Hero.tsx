import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronRight, Terminal, Code, Cpu, Layers, Smartphone, Database } from "lucide-react";

interface HeroProps {
  onOpenModal: () => void;
}

export function Hero({ onOpenModal }: HeroProps) {
  const [typedText, setTypedText] = useState("");
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const phrases = ["Nous codons vos ambitions.", "We build the future.", "Des solutions sur mesure."];
  const typingSpeed = 100;
  const deletingSpeed = 50;
  const pauseTime = 2000;

  useEffect(() => {
    if (isPaused) {
      const pauseTimer = setTimeout(() => {
        setIsPaused(false);
        setIsDeleting(true);
      }, pauseTime);
      return () => clearTimeout(pauseTimer);
    }

    const currentPhrase = phrases[phraseIndex] ?? "";
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (typedText.length < currentPhrase.length) {
          setTypedText(currentPhrase.slice(0, typedText.length + 1));
        } else {
          setIsPaused(true);
        }
        return;
      }

      if (typedText.length > 0) {
        setTypedText(currentPhrase.slice(0, typedText.length - 1));
      } else {
        setIsDeleting(false);
        setPhraseIndex((prev) => (prev + 1) % phrases.length);
      }
    }, isDeleting ? deletingSpeed : typingSpeed);

    return () => clearTimeout(timeout);
  }, [typedText, isDeleting, phraseIndex, isPaused]);

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden bg-background">
      {/* Background Grid & Particles */}
      <div className="absolute inset-0 bg-grid-pattern opacity-20" />
      <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-transparent to-background" />
      
      {/* Floating Icons */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <Terminal className="absolute top-1/4 left-[10%] w-12 h-12 text-primary/30 animate-float" />
        <Code className="absolute top-1/3 right-[15%] w-16 h-16 text-white/10 animate-float-reverse" />
        <Cpu className="absolute bottom-1/3 left-[20%] w-10 h-10 text-primary/20 animate-float-slow" />
        <Layers className="absolute top-1/2 right-[25%] w-14 h-14 text-white/5 animate-float" />
        <Smartphone className="absolute bottom-1/4 right-[10%] w-12 h-12 text-primary/30 animate-float-reverse" />
        <Database className="absolute top-20 left-[30%] w-8 h-8 text-white/10 animate-float-slow" />
        
        {/* Decorative elements */}
        <div className="absolute top-40 right-40 font-mono text-4xl text-primary/10 animate-float">{"{ }"}</div>
        <div className="absolute bottom-40 left-40 font-mono text-5xl text-white/5 animate-float-reverse">{"</>"}</div>
      </div>

      <div className="container mx-auto px-6 max-w-5xl relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card/50 border border-white/10 text-primary text-sm font-mono mb-8"
        >
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          Agence Digital Premium
        </motion.div>

        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 tracking-tight font-sans h-[140px] md:h-[180px] lg:h-[200px] flex items-center justify-center">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
            {typedText}
            <span className="text-primary animate-blink inline-block w-[3px] md:w-[5px] h-[1em] bg-primary ml-1 align-middle translate-y-[-2px]"></span>
          </span>
        </h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="text-lg md:text-2xl text-muted-foreground mb-10 max-w-2xl mx-auto font-light"
        >
          Développement Web · Logiciels Sur Mesure · Applications Mobile
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <button
            onClick={onOpenModal}
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-primary text-primary-foreground font-bold text-lg flex items-center justify-center gap-2
                     hover:shadow-[0_0_30px_rgba(255,167,127,0.4)] hover:-translate-y-1 transition-all duration-300"
          >
            Démarrer un projet <ChevronRight className="w-5 h-5" />
          </button>
          <a
            href="#portfolio"
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-card border border-border text-white font-semibold text-lg flex items-center justify-center
                     hover:bg-white/5 hover:border-primary/50 transition-all duration-300"
          >
            Voir nos réalisations
          </a>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-xs font-mono text-muted-foreground tracking-widest uppercase">Scroll</span>
        <div className="w-[1px] h-12 bg-gradient-to-b from-primary/50 to-transparent" />
      </motion.div>
    </section>
  );
}
