import { Github, Instagram, Linkedin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#0F172A] pt-20 pb-10 border-t border-white/5">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-2">
            <a href="#home" className="flex items-center mb-6">
              <img
                src="/logo-codexa.png"
                alt="Codexa Devlabs"
                className="h-16 w-auto object-contain"
              />
            </a>
            <p className="text-muted-foreground max-w-sm">
              L'agence tech premium qui transforme vos idées audacieuses en produits digitaux exceptionnels.
            </p>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-6">Navigation</h4>
            <ul className="space-y-4">
              <li><a href="#services" className="text-muted-foreground hover:text-primary transition-colors">Services</a></li>
              <li><a href="#portfolio" className="text-muted-foreground hover:text-primary transition-colors">Réalisations</a></li>
              <li><a href="#process" className="text-muted-foreground hover:text-primary transition-colors">Notre Processus</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6">Social</h4>
            <div className="flex gap-4">
              {[Linkedin, Instagram].map((Icon, i) => (
                <a key={i} href="#" className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary hover:-translate-y-1 transition-all">
                  <Icon className="w-5 h-5" />
                </a>
              ))}
              <a
                href="https://github.com/DARK19SMITH/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary hover:-translate-y-1 transition-all"
              >
                <Github className="w-5 h-5" />
              </a>
            </div>
            <div className="mt-6 space-y-2 text-sm text-muted-foreground">
              <p>
                Email:{" "}
                <a
                  href="mailto:CodexaDevlabsCI-MJ@gmail.com"
                  className="hover:text-white transition-colors"
                >
                  CodexaDevlabsCI-MJ@gmail.com
                </a>
              </p>
              <p>
                Téléphone:{" "}
                <a
                  href="tel:+2250507333733"
                  className="hover:text-white transition-colors"
                >
                  +225 05 07 33 37 33
                </a>
              </p>
              <p>
                GitHub:{" "}
                <a
                  href="https://github.com/DARK19SMITH/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  github.com/DARK19SMITH
                </a>
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-muted-foreground text-sm font-mono">
            © 2025 Codexa Devlabs. Tous droits réservés.
          </p>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <a href="#" className="hover:text-white transition-colors">Mentions légales</a>
            <a href="#" className="hover:text-white transition-colors">Confidentialité</a>
          </div>
        </div>
        <p className="mt-4 text-center text-sm text-secondary-foreground/60">
          Conçu par{" "}
          <a
            href="https://migueldevportofolio.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent hover:text-white transition-colors font-semibold"
          >
            Miguel Koffi
          </a>
        </p>
      </div>
    </footer>
  );
}
