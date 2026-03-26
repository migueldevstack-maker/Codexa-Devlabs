import { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, LogOut, Loader2, X, Check, ExternalLink, Star, StarOff, Upload, Image as ImageIcon } from "lucide-react";

interface Project {
  id: number;
  title: string;
  description: string;
  category: string;
  techTags: string[];
  imageUrl: string | null;
  projectUrl: string | null;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

interface DashboardProps {
  token: string;
  onLogout: () => void;
}

const CATEGORIES = ["Web", "Mobile", "Logiciels"];

const emptyForm = {
  title: "",
  description: "",
  category: "Web",
  techTags: "",
  imageUrl: "",
  projectUrl: "",
  featured: false,
};

export default function Dashboard({ token, onLogout }: DashboardProps) {
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [filter, setFilter] = useState("Tous");
  const [uploadLoading, setUploadLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const authHeaders = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };

  const { data: projects = [], isLoading } = useQuery<Project[]>({
    queryKey: ["/api/projects"],
    queryFn: () => fetch("/api/projects").then(r => r.json()),
  });

  const createMutation = useMutation({
    mutationFn: (data: typeof emptyForm) =>
      fetch("/api/projects", {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify({ ...data, techTags: data.techTags.split(",").map(t => t.trim()).filter(Boolean) }),
      }).then(r => r.json()),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["/api/projects"] }); closeModal(); },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: typeof emptyForm }) =>
      fetch(`/api/projects/${id}`, {
        method: "PUT",
        headers: authHeaders,
        body: JSON.stringify({ ...data, techTags: data.techTags.split(",").map(t => t.trim()).filter(Boolean) }),
      }).then(r => r.json()),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["/api/projects"] }); closeModal(); },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) =>
      fetch(`/api/projects/${id}`, { method: "DELETE", headers: authHeaders }).then(r => r.json()),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["/api/projects"] }); setDeleteConfirm(null); },
  });

  const handleImageUpload = async (file: File) => {
    setUploadLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setForm(f => ({ ...f, imageUrl: data.url }));
      setImagePreview(URL.createObjectURL(file));
    } catch (err: any) {
      alert(err.message ?? "Erreur lors de l'upload");
    } finally {
      setUploadLoading(false);
    }
  };

  const openAdd = () => { setForm(emptyForm); setEditingProject(null); setImagePreview(""); setModalOpen(true); };
  const openEdit = (p: Project) => {
    setForm({ title: p.title, description: p.description, category: p.category, techTags: p.techTags.join(", "), imageUrl: p.imageUrl ?? "", projectUrl: p.projectUrl ?? "", featured: p.featured });
    setImagePreview(p.imageUrl ?? "");
    setEditingProject(p);
    setModalOpen(true);
  };
  const closeModal = () => { setModalOpen(false); setEditingProject(null); setForm(emptyForm); setImagePreview(""); };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProject) updateMutation.mutate({ id: editingProject.id, data: form });
    else createMutation.mutate(form);
  };

  const filtered = filter === "Tous" ? projects : projects.filter(p => p.category === filter);
  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="min-h-screen bg-[#1F2937] text-white">
      {/* Topbar */}
      <header className="bg-[#111827] border-b border-white/10 px-6 py-4 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-4">
          <img src="/logo-codexa.png" alt="Codexa Devlabs" className="h-10 w-auto" />
          <div>
            <h1 className="font-bold text-lg leading-tight">Espace Admin</h1>
            <p className="text-xs text-gray-400">Gestion des réalisations</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <a href="/" target="_blank" className="text-sm text-gray-400 hover:text-[#FFA77F] transition-colors flex items-center gap-1">
            <ExternalLink className="w-4 h-4" /> Voir le site
          </a>
          <button
            onClick={onLogout}
            data-testid="button-logout"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white text-sm transition-all"
          >
            <LogOut className="w-4 h-4" /> Déconnexion
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total", value: projects.length, color: "text-white" },
            { label: "Web", value: projects.filter(p => p.category === "Web").length, color: "text-blue-400" },
            { label: "Mobile", value: projects.filter(p => p.category === "Mobile").length, color: "text-green-400" },
            { label: "Logiciels", value: projects.filter(p => p.category === "Logiciels").length, color: "text-purple-400" },
          ].map(s => (
            <div key={s.label} className="bg-[#111827] border border-white/10 rounded-2xl p-5">
              <div className={`text-3xl font-bold ${s.color}`}>{s.value}</div>
              <div className="text-sm text-gray-400 mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="flex gap-2 flex-wrap">
            {["Tous", ...CATEGORIES].map(cat => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${filter === cat ? "bg-[#FFA77F] text-[#1F2937]" : "bg-white/5 text-gray-400 hover:text-white border border-white/10"}`}
              >
                {cat}
              </button>
            ))}
          </div>
          <button
            onClick={openAdd}
            data-testid="button-add-project"
            className="flex items-center gap-2 px-5 py-2.5 bg-[#FFA77F] text-[#1F2937] font-bold rounded-xl hover:shadow-[0_0_20px_rgba(255,167,127,0.4)] transition-all"
          >
            <Plus className="w-4 h-4" /> Ajouter un projet
          </button>
        </div>

        {/* Projects grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20 text-gray-400">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <p className="text-lg mb-2">Aucune réalisation</p>
            <p className="text-sm">Cliquez sur "Ajouter un projet" pour commencer</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(project => (
              <div key={project.id} data-testid={`card-project-${project.id}`} className="bg-[#111827] border border-white/10 rounded-2xl overflow-hidden group hover:border-[#FFA77F]/30 transition-all">
                {project.imageUrl ? (
                  <div className="h-40 overflow-hidden">
                    <img src={project.imageUrl} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                ) : (
                  <div className="h-40 bg-gradient-to-br from-[#FFA77F]/20 to-[#1F2937] flex items-center justify-center">
                    <span className="text-4xl opacity-40">🖥️</span>
                  </div>
                )}
                <div className="p-5">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-bold text-white text-lg leading-tight">{project.title}</h3>
                    {project.featured && <Star className="w-4 h-4 text-[#FFA77F] shrink-0 mt-1" fill="currentColor" />}
                  </div>
                  <span className="text-xs px-2 py-1 rounded-full bg-[#FFA77F]/10 text-[#FFA77F] border border-[#FFA77F]/20 font-medium">
                    {project.category}
                  </span>
                  {project.description && (
                    <p className="text-sm text-gray-400 mt-3 line-clamp-2">{project.description}</p>
                  )}
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {project.techTags.map(tag => (
                      <span key={tag} className="text-xs px-2 py-0.5 rounded bg-white/5 text-gray-400 border border-white/10">{tag}</span>
                    ))}
                  </div>
                  <div className="flex gap-2 mt-4 pt-4 border-t border-white/5">
                    {project.projectUrl && (
                      <a href={project.projectUrl} target="_blank" className="flex items-center gap-1 text-xs text-gray-400 hover:text-[#FFA77F] transition-colors">
                        <ExternalLink className="w-3 h-3" /> Voir
                      </a>
                    )}
                    <div className="flex gap-2 ml-auto">
                      <button
                        onClick={() => openEdit(project)}
                        data-testid={`button-edit-${project.id}`}
                        className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(project.id)}
                        data-testid={`button-delete-${project.id}`}
                        className="p-2 rounded-lg bg-red-500/5 hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Add/Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={closeModal} />
          <div className="relative w-full max-w-2xl bg-[#111827] border border-white/10 rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-white/5">
              <h2 className="text-xl font-bold">{editingProject ? "Modifier le projet" : "Nouveau projet"}</h2>
              <button onClick={closeModal} className="p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-all hover:rotate-90">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2 space-y-1.5">
                  <label className="text-sm text-gray-400 font-mono">Titre *</label>
                  <input
                    required
                    value={form.title}
                    onChange={e => setForm({ ...form, title: e.target.value })}
                    data-testid="input-project-title"
                    className="w-full bg-[#1F2937] border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-[#FFA77F] outline-none transition-all"
                    placeholder="Ex: Application E-commerce"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm text-gray-400 font-mono">Catégorie *</label>
                  <select
                    value={form.category}
                    onChange={e => setForm({ ...form, category: e.target.value })}
                    className="w-full bg-[#1F2937] border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-[#FFA77F] outline-none appearance-none"
                  >
                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm text-gray-400 font-mono">Technologies (séparées par des virgules)</label>
                  <input
                    value={form.techTags}
                    onChange={e => setForm({ ...form, techTags: e.target.value })}
                    className="w-full bg-[#1F2937] border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-[#FFA77F] outline-none transition-all"
                    placeholder="React, Node.js, Firebase"
                  />
                </div>

                <div className="sm:col-span-2 space-y-1.5">
                  <label className="text-sm text-gray-400 font-mono">Description</label>
                  <textarea
                    value={form.description}
                    onChange={e => setForm({ ...form, description: e.target.value })}
                    rows={3}
                    className="w-full bg-[#1F2937] border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-[#FFA77F] outline-none transition-all resize-none"
                    placeholder="Décrivez le projet..."
                  />
                </div>

                <div className="sm:col-span-2 space-y-1.5">
                  <label className="text-sm text-gray-400 font-mono">Image du projet</label>
                  <div
                    className="relative rounded-xl border-2 border-dashed border-white/10 hover:border-[#FFA77F]/50 transition-colors overflow-hidden cursor-pointer group"
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={e => e.preventDefault()}
                    onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) handleImageUpload(f); }}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/gif"
                      className="hidden"
                      onChange={e => { const f = e.target.files?.[0]; if (f) handleImageUpload(f); }}
                    />
                    {imagePreview || form.imageUrl ? (
                      <div className="relative h-40">
                        <img
                          src={imagePreview || form.imageUrl}
                          alt="Aperçu"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <div className="text-white text-sm font-medium flex items-center gap-2">
                            <Upload className="w-4 h-4" /> Changer l'image
                          </div>
                        </div>
                        {uploadLoading && (
                          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                            <Loader2 className="w-8 h-8 text-[#FFA77F] animate-spin" />
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="h-40 flex flex-col items-center justify-center text-gray-500 gap-3">
                        {uploadLoading ? (
                          <Loader2 className="w-8 h-8 text-[#FFA77F] animate-spin" />
                        ) : (
                          <>
                            <ImageIcon className="w-10 h-10" />
                            <div className="text-center">
                              <p className="text-sm font-medium text-gray-400">Cliquez ou glissez une image ici</p>
                              <p className="text-xs mt-1">JPG, PNG, WebP — max 5MB</p>
                            </div>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                  {form.imageUrl && (
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-gray-500 truncate flex-1">{form.imageUrl}</span>
                      <button type="button" onClick={() => { setForm(f => ({ ...f, imageUrl: "" })); setImagePreview(""); }} className="text-xs text-red-400 hover:text-red-300 shrink-0">Supprimer</button>
                    </div>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm text-gray-400 font-mono">URL du projet</label>
                  <input
                    value={form.projectUrl}
                    onChange={e => setForm({ ...form, projectUrl: e.target.value })}
                    className="w-full bg-[#1F2937] border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-[#FFA77F] outline-none transition-all"
                    placeholder="https://monprojet.com"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <div
                      onClick={() => setForm({ ...form, featured: !form.featured })}
                      className={`w-10 h-6 rounded-full transition-colors flex items-center px-1 ${form.featured ? "bg-[#FFA77F]" : "bg-white/10"}`}
                    >
                      <div className={`w-4 h-4 bg-white rounded-full transition-transform ${form.featured ? "translate-x-4" : "translate-x-0"}`} />
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-300">
                      {form.featured ? <Star className="w-4 h-4 text-[#FFA77F]" fill="currentColor" /> : <StarOff className="w-4 h-4 text-gray-500" />}
                      Projet mis en avant
                    </div>
                  </label>
                </div>
              </div>
            </form>

            <div className="p-6 border-t border-white/5 flex gap-3 justify-end">
              <button onClick={closeModal} className="px-6 py-2.5 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all">
                Annuler
              </button>
              <button
                onClick={handleSubmit}
                disabled={isPending}
                data-testid="button-save-project"
                className="flex items-center gap-2 px-6 py-2.5 bg-[#FFA77F] text-[#1F2937] font-bold rounded-xl hover:shadow-[0_0_20px_rgba(255,167,127,0.3)] transition-all disabled:opacity-60"
              >
                {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                {editingProject ? "Enregistrer" : "Créer le projet"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {deleteConfirm !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70" onClick={() => setDeleteConfirm(null)} />
          <div className="relative bg-[#111827] border border-red-500/20 rounded-2xl p-6 w-full max-w-sm text-center shadow-2xl">
            <div className="w-14 h-14 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-7 h-7 text-red-400" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Supprimer ce projet ?</h3>
            <p className="text-sm text-gray-400 mb-6">Cette action est irréversible.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-2.5 rounded-xl bg-white/5 text-gray-300 hover:bg-white/10 transition-all">
                Annuler
              </button>
              <button
                onClick={() => deleteMutation.mutate(deleteConfirm)}
                disabled={deleteMutation.isPending}
                data-testid="button-confirm-delete"
                className="flex-1 py-2.5 rounded-xl bg-red-500 text-white font-bold hover:bg-red-600 transition-all disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {deleteMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
