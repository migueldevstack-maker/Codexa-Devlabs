import { useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { CheckCircle2, TrendingUp, Users } from "lucide-react";

export function WhyUs() {
  const [codeText, setCodeText] = useState("");
  const codeSnippet = `function CodexaAgency() {
  const skills = ['Web', 'Mobile', 'SaaS'];
  const quality = 'Premium';
  
  return (
    <Project 
      status="Delivered"
      onTime={true}
      clientSatisfaction="100%"
    >
      <Success />
    </Project>
  );
}`;

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setCodeText(codeSnippet.slice(0, i));
      i++;
      if (i > codeSnippet.length) clearInterval(interval);
    }, 30);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-24 bg-background relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Text */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Pourquoi choisir <span className="text-primary">Codexa</span> ?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Nous ne faisons pas qu'écrire du code. Nous construisons des architectures robustes, 
              pensées pour la croissance de votre entreprise. Notre approche combine expertise technique 
              et design d'excellence.
            </p>
            
            <div className="space-y-6">
              <StatItem icon={CheckCircle2} endValue={50} suffix="+" label="Projets livrés" delay={0.1} />
              <StatItem icon={TrendingUp} endValue={98} suffix="%" label="Satisfaction client" delay={0.2} />
              <StatItem icon={Users} endValue={3} suffix=" ans" label="D'expérience pure" delay={0.3} />
            </div>
          </motion.div>

          {/* Right Code Editor */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            {/* Floating badges */}
            <div className="absolute -left-6 -top-6 bg-card border border-border p-3 rounded-xl shadow-xl flex items-center gap-2 animate-float z-10">
              <div className="w-3 h-3 rounded-full bg-blue-400" />
              <span className="text-white font-mono text-sm">React.tsx</span>
            </div>
            <div className="absolute -right-8 bottom-10 bg-card border border-border p-3 rounded-xl shadow-xl flex items-center gap-2 animate-float-reverse z-10">
              <div className="w-3 h-3 rounded-full bg-green-400" />
              <span className="text-white font-mono text-sm">Node.js</span>
            </div>

            {/* Editor Window */}
            <div className="bg-[#0D1117] rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="bg-[#1A2333] px-4 py-3 flex items-center gap-2 border-b border-white/5">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                </div>
                <div className="ml-4 text-xs font-mono text-muted-foreground flex-1 text-center pr-8">
                  agency.tsx
                </div>
              </div>
              {/* Body */}
              <div className="p-6 font-mono text-sm md:text-base leading-relaxed overflow-x-auto">
                <pre className="text-gray-300">
                  <code dangerouslySetInnerHTML={{ 
                    __html: codeText
                      .replace(/function/g, '<span class="text-pink-400">function</span>')
                      .replace(/const/g, '<span class="text-pink-400">const</span>')
                      .replace(/return/g, '<span class="text-pink-400">return</span>')
                      .replace(/true/g, '<span class="text-orange-300">true</span>')
                      .replace(/'[^']*'/g, '<span class="text-green-300">$&</span>')
                      .replace(/<([A-Z][a-zA-Z0-9]*)/g, '&lt;<span class="text-blue-400">$1</span>')
                      .replace(/<\/([A-Z][a-zA-Z0-9]*)/g, '&lt;/<span class="text-blue-400">$1</span>')
                      .replace(/([a-zA-Z0-9]+)=/g, '<span class="text-purple-300">$1</span>=')
                  }} />
                  <span className="animate-blink bg-primary/70 w-2 h-4 inline-block ml-1 align-middle" />
                </pre>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}

function StatItem({ icon: Icon, endValue, suffix, label, delay }: any) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const duration = 2000; // ms
      const increment = endValue / (duration / 16);
      
      const timer = setInterval(() => {
        start += increment;
        if (start >= endValue) {
          setValue(endValue);
          clearInterval(timer);
        } else {
          setValue(Math.floor(start));
        }
      }, 16);
      return () => clearInterval(timer);
    }
  }, [isInView, endValue]);

  return (
    <motion.div 
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay, duration: 0.5 }}
      className="flex items-center gap-4"
    >
      <div className="w-12 h-12 rounded-full bg-card border border-border flex items-center justify-center shrink-0">
        <Icon className="w-6 h-6 text-primary" />
      </div>
      <div>
        <div className="text-3xl font-bold font-mono text-white">
          {value}{suffix}
        </div>
        <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
          {label}
        </div>
      </div>
    </motion.div>
  );
}
