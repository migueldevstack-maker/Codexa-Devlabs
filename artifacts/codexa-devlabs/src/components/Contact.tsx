import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Send, CheckCircle, Loader2 } from "lucide-react";

export function Contact() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("loading");
    const form = e.currentTarget;
    const name = (form.elements.namedItem("name") as HTMLInputElement).value;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    const message = (form.elements.namedItem("message") as HTMLTextAreaElement).value;

    try {
      await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "contact", name, email, message }),
      });
      setStatus("success");
      form.reset();
      setTimeout(() => setStatus("idle"), 4000);
    } catch {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 3000);
    }
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
                <a
                  href="mailto:CodexaDevlabsCI-MJ@gmail.com"
                  className="hover:text-white transition-colors"
                >
                  codexadevlabsci@gmail.com
                </a>
              </div>
            </div>
          </motion.div>

          <motion.form
            ref={formRef}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            onSubmit={handleSubmit}
            className="bg-background rounded-3xl p-8 shadow-2xl relative overflow-hidden"
          >
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-white mb-2 font-mono">Nom complet</label>
                <input name="name" required type="text" className="w-full bg-card border border-border rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors" placeholder="Jean Dupont" />
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-2 font-mono">Email professionnel</label>
                <input name="email" required type="email" className="w-full bg-card border border-border rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors" placeholder="jean@entreprise.com" />
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-2 font-mono">Votre message</label>
                <textarea name="message" required rows={4} className="w-full bg-card border border-border rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors resize-none" placeholder="Parlez-nous de votre projet..."></textarea>
              </div>
              
              <button 
                type="submit"
                disabled={status === "loading" || status === "success"}
                className="w-full bg-primary text-primary-foreground font-bold text-lg py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-white transition-colors relative overflow-hidden group disabled:opacity-80"
              >
                <span className="relative z-10 flex items-center gap-2">
                  {status === "loading" ? <><Loader2 className="w-5 h-5 animate-spin" /> Envoi en cours...</>
                  : status === "success" ? <><CheckCircle className="w-5 h-5" /> Message reçu !</>
                  : status === "error" ? "Erreur — réessayer"
                  : <><Send className="w-5 h-5" /> Envoyer le message</>}
                </span>
                {status === "idle" && <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-0" />}
              </button>
            </div>
          </motion.form>

        </div>
      </div>
    </section>
  );
}
