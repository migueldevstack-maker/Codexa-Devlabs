import { useState } from "react";
import { useLocation } from "wouter";
import { Eye, EyeOff, Lock, User, Loader2 } from "lucide-react";

interface LoginProps {
  onLogin: (token: string) => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [, navigate] = useLocation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message ?? "Identifiants incorrects");
        return;
      }
      onLogin(data.token);
      navigate("/admin/dashboard");
    } catch {
      setError("Erreur de connexion au serveur");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1F2937] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <img src="/logo-codexa.png" alt="Codexa Devlabs" className="h-20 w-auto mx-auto mb-6" />
          <h1 className="text-2xl font-bold text-white">Espace Admin</h1>
          <p className="text-gray-400 text-sm mt-1">Connectez-vous pour gérer vos réalisations</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-[#111827] border border-white/10 rounded-2xl p-8 shadow-2xl space-y-5"
        >
          <div className="space-y-2">
            <label className="text-sm text-gray-400 font-mono">Identifiant</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                required
                data-testid="input-username"
                placeholder="Votre identifiant"
                className="w-full bg-[#1F2937] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-600 focus:border-[#FFA77F] focus:ring-1 focus:ring-[#FFA77F] outline-none transition-all"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm text-gray-400 font-mono">Mot de passe</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                data-testid="input-password"
                placeholder="Votre mot de passe"
                className="w-full bg-[#1F2937] border border-white/10 rounded-xl pl-10 pr-12 py-3 text-white placeholder-gray-600 focus:border-[#FFA77F] focus:ring-1 focus:ring-[#FFA77F] outline-none transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-xl">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            data-testid="button-login"
            className="w-full py-3 bg-[#FFA77F] text-[#1F2937] font-bold rounded-xl hover:shadow-[0_0_20px_rgba(255,167,127,0.4)] transition-all disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Connexion...</> : "Se connecter"}
          </button>

          <a href="/" className="block text-center text-sm text-gray-500 hover:text-[#FFA77F] transition-colors mt-2">
            ← Retour au site
          </a>
        </form>
      </div>
    </div>
  );
}
