import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check, ArrowRight, Loader2, Sparkles } from "lucide-react";

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PRESET_COLORS = [
  { name: "Midnight Blue", c1: "#0F172A", c2: "#38BDF8", desc: "Tech & Moderne" },
  { name: "Forest", c1: "#1A2E1A", c2: "#4ADE80", desc: "Nature & Écologie" },
  { name: "Royal", c1: "#1E1B4B", c2: "#A78BFA", desc: "Luxe & Créativité" },
  { name: "Crimson", c1: "#1F0A0A", c2: "#F87171", desc: "Bold & Impact" },
  { name: "Ocean", c1: "#0C1A2E", c2: "#67E8F9", desc: "Corporate & Fiable" },
  { name: "Codexa", c1: "#1F2937", c2: "#FFA77F", desc: "Charcoal & Peach ✦" },
  { name: "Sand", c1: "#2C2416", c2: "#FBBF24", desc: "Chaleureux & Premium" },
  { name: "Slate", c1: "#0F2027", c2: "#A8EDEA", desc: "Minimaliste & Clean" },
];

const PROJECT_TYPES = ["🛒 E-commerce", "💼 Site vitrine", "📰 Blog", "📊 Dashboard", "🏢 Corporate", "📱 Landing page", "🎓 E-learning", "🍽️ Restaurant", "🏥 Santé", "🎮 Gaming"];
const FEATURES = ["Réservation", "Espace membre", "Paiement en ligne", "Multilingue", "Blog", "Chat", "Galerie", "Formulaire complexe"];

export function ProjectModal({ isOpen, onClose }: ProjectModalProps) {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Form State
  const [data, setData] = useState({
    company: "",
    sector: "",
    contact: "",
    email: "",
    colors: PRESET_COLORS[5], // default to Codexa
    isCustomColor: false,
    customC1: "#000000",
    customC2: "#ffffff",
    types: [] as string[],
    features: [] as string[],
    budget: 500000,
    desc: ""
  });

  // Reset state when opened
  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setIsSuccess(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleNext = () => setStep(s => Math.min(4, s + 1));
  const handleBack = () => setStep(s => Math.max(1, s - 1));

  const toggleType = (t: string) => {
    setData(prev => ({
      ...prev,
      types: prev.types.includes(t) ? prev.types.filter(x => x !== t) : [...prev.types, t]
    }));
  };

  const toggleFeature = (f: string) => {
    setData(prev => ({
      ...prev,
      features: prev.features.includes(f) ? prev.features.filter(x => x !== f) : [...prev.features, f]
    }));
  };

  const submitForm = async () => {
    setIsSubmitting(true);

    const primaryColor = data.isCustomColor ? data.customC1 : data.colors.c1;
    const accentColor = data.isCustomColor ? data.customC2 : data.colors.c2;
    const paletteName = data.isCustomColor ? "Personnalisée" : data.colors.name;
    const budgetFormatted = new Intl.NumberFormat('fr-FR').format(data.budget);

    const waMessage =
`🚀 *NOUVELLE DEMANDE DE PROJET*
_Codexa Devlabs — Formulaire Site_

👤 *Entreprise :* ${data.company || "Non renseigné"}
🏷️ *Secteur :* ${data.sector || "Non renseigné"}
👨‍💼 *Contact :* ${data.contact || "Non renseigné"}
📧 *Email :* ${data.email || "Non renseigné"}

🎨 *Couleurs choisies :*
• Primaire : ${primaryColor}
• Accent : ${accentColor}
• Palette : ${paletteName}

🌐 *Type de site :* ${data.types.length ? data.types.join(", ") : "Non spécifié"}
⚙️ *Fonctionnalités :* ${data.features.length ? data.features.join(", ") : "Non spécifiées"}
💰 *Budget estimé :* ${budgetFormatted} FCFA
📝 *Description :* ${data.desc || "Aucune description fournie"}

─────────────────────────────
Envoyé depuis codevlabs.com`;

    // Sauvegarder dans la base de données
    try {
      await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "project_request",
          name: data.contact || data.company,
          email: data.email,
          message: data.desc,
          extraData: {
            company: data.company,
            sector: data.sector,
            contact: data.contact,
            palette: paletteName,
            primaryColor,
            accentColor,
            types: data.types,
            features: data.features,
            budget: data.budget,
            budgetFormatted: `${budgetFormatted} FCFA`,
          },
        }),
      });
    } catch {
      // Silently continue — WhatsApp fallback still works
    }

    const encoded = encodeURIComponent(waMessage);
    const waUrl = `https://wa.me/2250507333733?text=${encoded}`;

    window.open(waUrl, "_blank");
    setIsSubmitting(false);
    setIsSuccess(true);
  };

  const stepVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
        onClick={onClose}
      />
      
      <motion.div
        initial={{ opacity: 0, y: 100, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 100, scale: 0.95 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="relative w-full max-w-4xl bg-card border border-primary/20 shadow-2xl rounded-3xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="p-6 border-b border-white/5 flex items-center justify-between shrink-0">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Sparkles className="text-primary w-5 h-5" /> Démarrer un projet
          </h3>
          <button onClick={onClose} className="p-2 text-muted-foreground hover:text-white hover:rotate-90 transition-all rounded-full bg-white/5 hover:bg-white/10">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stepper Progress */}
        {!isSuccess && (
          <div className="px-8 py-6 shrink-0 bg-background/50">
            <div className="flex items-center justify-between relative">
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-white/10 rounded-full z-0" />
              <div 
                className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-primary rounded-full z-0 transition-all duration-500 ease-out"
                style={{ width: `${((step - 1) / 3) * 100}%` }}
              />
              
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="relative z-10 flex flex-col items-center gap-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors duration-300 ${
                    step > i ? "bg-primary text-background" : step === i ? "bg-primary text-background shadow-[0_0_15px_rgba(255,167,127,0.5)]" : "bg-card border-2 border-white/20 text-muted-foreground"
                  }`}>
                    {step > i ? <Check className="w-4 h-4" /> : i}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Body */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1 custom-scrollbar">
          <AnimatePresence mode="wait">
            {isSuccess ? (
              <motion.div key="success" initial="hidden" animate="visible" variants={stepVariants} className="text-center py-20">
                <motion.div 
                  initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", delay: 0.2 }}
                  className="w-24 h-24 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6"
                >
                  <Check className="w-12 h-12" />
                </motion.div>
                <h2 className="text-3xl font-bold text-white mb-4">WhatsApp s'est ouvert ! 🎉</h2>
                <p className="text-muted-foreground text-lg mb-2 max-w-md mx-auto">
                  Appuyez sur <span className="text-green-400 font-semibold">Envoyer</span> dans WhatsApp pour transmettre votre demande.
                </p>
                <p className="text-muted-foreground text-sm mb-8 max-w-md mx-auto">
                  Notre équipe vous répond sous 24h.
                </p>
                <button onClick={onClose} className="px-8 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-medium transition-colors">
                  Fermer
                </button>
              </motion.div>
            ) : step === 1 ? (
              <motion.div key="step1" initial="hidden" animate="visible" exit="exit" variants={stepVariants} className="space-y-6">
                <h4 className="text-2xl font-bold text-white mb-6">Informations de base</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-mono text-muted-foreground">Nom entreprise *</label>
                    <input value={data.company} onChange={e=>setData({...data, company: e.target.value})} type="text" className="w-full bg-background border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" placeholder="Acme Corp" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-mono text-muted-foreground">Secteur</label>
                    <select value={data.sector} onChange={e=>setData({...data, sector: e.target.value})} className="w-full bg-background border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary outline-none appearance-none">
                      <option value="">Sélectionner...</option>
                      <option>Tech / Software</option><option>E-commerce</option><option>Santé</option><option>Finance</option><option>Autre</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-mono text-muted-foreground">Contact</label>
                    <input value={data.contact} onChange={e=>setData({...data, contact: e.target.value})} type="text" className="w-full bg-background border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary outline-none" placeholder="Jean Dupont" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-mono text-muted-foreground">Email *</label>
                    <input value={data.email} onChange={e=>setData({...data, email: e.target.value})} type="email" className="w-full bg-background border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary outline-none" placeholder="jean@acme.com" />
                  </div>
                </div>
              </motion.div>
            ) : step === 2 ? (
              <motion.div key="step2" initial="hidden" animate="visible" exit="exit" variants={stepVariants}>
                <h4 className="text-2xl font-bold text-white mb-2">Identité visuelle</h4>
                <p className="text-muted-foreground mb-6">Choisissez une palette ou définissez la vôtre.</p>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                  {PRESET_COLORS.map((p, i) => (
                    <button 
                      key={i} 
                      onClick={() => setData({...data, colors: p, isCustomColor: false})}
                      className={`relative rounded-xl overflow-hidden text-left border-2 transition-all ${!data.isCustomColor && data.colors.name === p.name ? 'border-primary scale-105 shadow-[0_0_15px_rgba(255,167,127,0.3)] z-10' : 'border-transparent hover:border-white/20'}`}
                    >
                      <div className="h-24 w-full flex">
                        <div className="flex-1" style={{backgroundColor: p.c1}} />
                        <div className="flex-1" style={{backgroundColor: p.c2}} />
                      </div>
                      <div className="p-3 bg-background border-t border-white/5">
                        <div className="font-bold text-white text-sm">{p.name}</div>
                        <div className="text-xs text-muted-foreground truncate">{p.desc}</div>
                      </div>
                      {!data.isCustomColor && data.colors.name === p.name && (
                        <div className="absolute top-2 right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center text-background">
                          <Check className="w-4 h-4" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>

                <div className="p-4 rounded-xl border border-white/10 bg-background flex flex-col sm:flex-row items-center gap-6">
                  <div className="flex-1">
                    <h5 className="text-white font-bold mb-1">Couleurs personnalisées</h5>
                    <p className="text-sm text-muted-foreground">Vous avez déjà une charte graphique ?</p>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center gap-2">
                      <input type="color" value={data.customC1} onChange={e=>setData({...data, customC1: e.target.value, isCustomColor: true})} className="w-10 h-10 rounded cursor-pointer bg-transparent border-0 p-0" />
                      <span className="text-xs font-mono text-muted-foreground">Primaire</span>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <input type="color" value={data.customC2} onChange={e=>setData({...data, customC2: e.target.value, isCustomColor: true})} className="w-10 h-10 rounded cursor-pointer bg-transparent border-0 p-0" />
                      <span className="text-xs font-mono text-muted-foreground">Secondaire</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : step === 3 ? (
              <motion.div key="step3" initial="hidden" animate="visible" exit="exit" variants={stepVariants}>
                <h4 className="text-2xl font-bold text-white mb-6">Projet & Fonctionnalités</h4>
                
                <div className="mb-8">
                  <label className="text-sm font-mono text-muted-foreground block mb-3">Type de projet (multi-choix)</label>
                  <div className="flex flex-wrap gap-2">
                    {PROJECT_TYPES.map(t => (
                      <button key={t} onClick={() => toggleType(t)} className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${data.types.includes(t) ? 'bg-primary/20 border-primary text-primary' : 'bg-background border-white/10 text-white/70 hover:border-white/30'}`}>
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mb-8">
                  <label className="text-sm font-mono text-muted-foreground block mb-3">Fonctionnalités clés</label>
                  <div className="grid grid-cols-2 gap-3">
                    {FEATURES.map(f => (
                      <label key={f} className="flex items-center gap-3 p-3 rounded-xl border border-white/10 bg-background cursor-pointer hover:border-white/30 transition-colors">
                        <input type="checkbox" checked={data.features.includes(f)} onChange={() => toggleFeature(f)} className="w-5 h-5 rounded border-white/20 text-primary focus:ring-primary/50 bg-transparent accent-primary" />
                        <span className="text-white text-sm">{f}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-sm font-mono text-muted-foreground">Budget estimé (FCFA)</label>
                    <span className="text-primary font-bold">{new Intl.NumberFormat('fr-FR').format(data.budget)} FCFA</span>
                  </div>
                  <input type="range" min="100000" max="5000000" step="50000" value={data.budget} onChange={e=>setData({...data, budget: parseInt(e.target.value)})} className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary" />
                  <div className="flex justify-between text-xs mt-2 font-mono">
                    <span className="text-primary/80">🟢 Starter<br/><span className="text-muted-foreground">100k – 500k</span></span>
                    <span className="text-primary/80 text-center">🔵 Pro<br/><span className="text-muted-foreground">500k – 2M</span></span>
                    <span className="text-primary/80 text-right">🟠 Enterprise<br/><span className="text-muted-foreground">2M – 5M+</span></span>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div key="step4" initial="hidden" animate="visible" exit="exit" variants={stepVariants}>
                <h4 className="text-2xl font-bold text-white mb-6">Récapitulatif</h4>
                
                <div className="bg-background rounded-2xl border border-white/10 p-6 space-y-6">
                  <div className="flex justify-between items-start border-b border-white/5 pb-6">
                    <div>
                      <h5 className="font-mono text-primary text-xl font-bold">{data.company || "Entreprise non renseignée"}</h5>
                      <p className="text-muted-foreground text-sm mt-1">{data.sector} • Contact: {data.contact}</p>
                      <p className="text-muted-foreground text-sm">{data.email}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className="text-xs text-muted-foreground font-mono">Design</span>
                      <div className="flex rounded-full overflow-hidden w-12 h-6 border border-white/20">
                        <div className="flex-1" style={{backgroundColor: data.isCustomColor ? data.customC1 : data.colors.c1}} />
                        <div className="flex-1" style={{backgroundColor: data.isCustomColor ? data.customC2 : data.colors.c2}} />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h6 className="text-white text-sm font-bold mb-3">Types de projet</h6>
                    <div className="flex flex-wrap gap-2">
                      {data.types.length ? data.types.map(t=><span key={t} className="px-2 py-1 bg-white/5 rounded text-xs text-white/80 border border-white/10">{t}</span>) : <span className="text-xs text-muted-foreground italic">Aucun sélectionné</span>}
                    </div>
                  </div>

                  <div>
                    <h6 className="text-white text-sm font-bold mb-3">Fonctionnalités</h6>
                    <div className="flex flex-wrap gap-2">
                      {data.features.length ? data.features.map(f=><span key={f} className="px-2 py-1 bg-primary/10 rounded text-xs text-primary border border-primary/20">{f}</span>) : <span className="text-xs text-muted-foreground italic">Aucune sélectionnée</span>}
                    </div>
                  </div>

                  <div className="bg-white/5 rounded-xl p-4 flex justify-between items-center border border-white/5">
                    <span className="text-muted-foreground text-sm">Budget validé</span>
                    <span className="text-xl font-bold text-white font-mono">{new Intl.NumberFormat('fr-FR').format(data.budget)} FCFA</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer Actions */}
        {!isSuccess && (
          <div className="p-6 border-t border-white/5 bg-card flex items-center justify-between shrink-0">
            <button 
              onClick={handleBack}
              className={`px-6 py-2 rounded-xl text-white font-medium transition-opacity ${step === 1 ? 'opacity-0 pointer-events-none' : 'opacity-100 hover:bg-white/5'}`}
            >
              Retour
            </button>
            
            {step < 4 ? (
              <button 
                onClick={handleNext}
                disabled={step === 1 && (!data.company || !data.email)}
                className="px-8 py-3 rounded-xl bg-white text-background font-bold flex items-center gap-2 hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Suivant <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button 
                onClick={submitForm}
                disabled={isSubmitting}
                className="px-8 py-3 rounded-xl bg-primary text-primary-foreground font-bold flex items-center gap-2 hover:shadow-[0_0_20px_rgba(255,167,127,0.4)] hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:transform-none"
              >
                {isSubmitting ? <><Loader2 className="w-5 h-5 animate-spin" /> Envoi...</> : <><Sparkles className="w-4 h-4" /> Envoyer la demande</>}
              </button>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
}
