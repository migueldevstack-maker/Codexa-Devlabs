import { useState } from "react";
import { motion } from "framer-motion";
import { Send, CheckCircle } from "lucide-react";

export function Contact() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <section id="contact" className="py-24 bg-primary text-primary-foreground relative">
      <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+CjxjaXJjbGUgY3g9IjEiIGN5PSIxIiByPSIxIiBmaWxsPSIjMWYyOTM3Ii8+Cjwvc3ZnPg==')]"></div>
      
      <div className="container mx-auto px-6 max-w-5xl relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight leading-tight">
              Prêt à donner vie à votre projet ?
            </h2>
            <p className="text-xl text-primary-foreground/80 mb-8 font-light">
              Discutons de vos objectifs et voyons comment notre expertise peut accélérer votre croissance.
            </p>
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3 font-mono">
                <div className="w-10 h-10 rounded-full bg-background flex items-center justify-center">
                  <span className="text-primary text-xl">@</span>
                </div>
                <span>hello@codexadevlabs.com</span>
              </div>
            </div>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            onSubmit={handleSubmit}
            className="bg-background rounded-3xl p-8 shadow-2xl relative overflow-hidden"
          >
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-white mb-2 font-mono">Nom complet</label>
                <input required type="text" className="w-full bg-card border border-border rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors" placeholder="Jean Dupont" />
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-2 font-mono">Email professionnel</label>
                <input required type="email" className="w-full bg-card border border-border rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors" placeholder="jean@entreprise.com" />
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-2 font-mono">Votre message</label>
                <textarea required rows={4} className="w-full bg-card border border-border rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors resize-none" placeholder="Parlez-nous de votre projet..."></textarea>
              </div>
              
              <button 
                type="submit"
                disabled={submitted}
                className="w-full bg-primary text-primary-foreground font-bold text-lg py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-white transition-colors relative overflow-hidden group"
              >
                <span className="relative z-10 flex items-center gap-2">
                  {submitted ? <><CheckCircle className="w-5 h-5" /> Envoyé avec succès</> : <><Send className="w-5 h-5" /> Envoyer le message</>}
                </span>
                {!submitted && <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-0" />}
              </button>
            </div>
          </motion.form>

        </div>
      </div>
    </section>
  );
}
