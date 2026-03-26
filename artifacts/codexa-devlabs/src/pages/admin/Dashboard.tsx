import { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Plus, Pencil, Trash2, LogOut, Loader2, X, Check, ExternalLink, Star, StarOff,
  Upload, Image as ImageIcon, MessageSquare, LayoutDashboard, BarChart2,
  Mail, Briefcase, Eye, EyeOff, ChevronDown, ChevronUp, Inbox, TrendingUp,
} from "lucide-react";

/* ─── Types ─── */
interface Project {
  id: number; title: string; description: string; category: string;
  techTags: string[]; imageUrl: string | null; projectUrl: string | null;
  featured: boolean; createdAt: string; updatedAt: string;
}
interface Message {
  id: number; type: string; name: string; email: string; phone: string | null;
  message: string | null; extraData: any; read: boolean; createdAt: string;
}
interface VisitRow { id: number; date: string; count: number; }
interface VisitsData { rows: VisitRow[]; total: number; }

/* ─── Constants ─── */
const CATEGORIES = ["Web", "Mobile", "Logiciels"];
const emptyForm = { title: "", description: "", category: "Web", techTags: "", imageUrl: "", projectUrl: "", featured: false };
type Tab = "projects" | "messages" | "stats";

/* ─── Main Component ─── */
export default function Dashboard({ token, onLogout }: { token: string; onLogout: () => void }) {
  const queryClient = useQueryClient();
  const [tab, setTab] = useState<Tab>("projects");

  // Projects state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [filter, setFilter] = useState("Tous");
  const [uploadLoading, setUploadLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Messages state
  const [expandedMsg, setExpandedMsg] = useState<number | null>(null);
  const [deleteMsgConfirm, setDeleteMsgConfirm] = useState<number | null>(null);
  const [msgFilter, setMsgFilter] = useState<"all" | "contact" | "project_request" | "unread">("all");

  const authHeaders = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };

  /* ─── Queries ─── */
  const { data: projects = [], isLoading: loadingProjects } = useQuery<Project[]>({
    queryKey: ["/api/projects"],
    queryFn: () => fetch("/api/projects").then(r => r.json()),
  });

  const { data: messages = [], isLoading: loadingMessages } = useQuery<Message[]>({
    queryKey: ["/api/messages"],
    queryFn: () => fetch("/api/messages", { headers: authHeaders }).then(r => r.json()),
    enabled: tab === "messages",
  });

  const { data: visitsData, isLoading: loadingVisits } = useQuery<VisitsData>({
    queryKey: ["/api/visits"],
    queryFn: () => fetch("/api/visits", { headers: authHeaders }).then(r => r.json()),
    enabled: tab === "stats",
  });

  /* ─── Project Mutations ─── */
  const createMutation = useMutation({
    mutationFn: (data: typeof emptyForm) =>
      fetch("/api/projects", { method: "POST", headers: authHeaders, body: JSON.stringify({ ...data, techTags: data.techTags.split(",").map(t => t.trim()).filter(Boolean) }) }).then(r => r.json()),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["/api/projects"] }); closeModal(); },
  });
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: typeof emptyForm }) =>
      fetch(`/api/projects/${id}`, { method: "PUT", headers: authHeaders, body: JSON.stringify({ ...data, techTags: data.techTags.split(",").map(t => t.trim()).filter(Boolean) }) }).then(r => r.json()),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["/api/projects"] }); closeModal(); },
  });
  const deleteProjMutation = useMutation({
    mutationFn: (id: number) => fetch(`/api/projects/${id}`, { method: "DELETE", headers: authHeaders }).then(r => r.json()),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["/api/projects"] }); setDeleteConfirm(null); },
  });

  /* ─── Message Mutations ─── */
  const markReadMutation = useMutation({
    mutationFn: (id: number) => fetch(`/api/messages/${id}/read`, { method: "PUT", headers: authHeaders }).then(r => r.json()),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/messages"] }),
  });
  const deleteMsgMutation = useMutation({
    mutationFn: (id: number) => fetch(`/api/messages/${id}`, { method: "DELETE", headers: authHeaders }).then(r => r.json()),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["/api/messages"] }); setDeleteMsgConfirm(null); },
  });

  /* ─── Image Upload ─── */
  const handleImageUpload = async (file: File) => {
    setUploadLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", headers: { Authorization: `Bearer ${token}` }, body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setForm(f => ({ ...f, imageUrl: data.url }));
      setImagePreview(URL.createObjectURL(file));
    } catch (err: any) { alert(err.message ?? "Erreur upload"); }
    finally { setUploadLoading(false); }
  };

  /* ─── Modal Helpers ─── */
  const openAdd = () => { setForm(emptyForm); setEditingProject(null); setImagePreview(""); setModalOpen(true); };
  const openEdit = (p: Project) => {
    setForm({ title: p.title, description: p.description, category: p.category, techTags: p.techTags.join(", "), imageUrl: p.imageUrl ?? "", projectUrl: p.projectUrl ?? "", featured: p.featured });
    setImagePreview(p.imageUrl ?? "");
    setEditingProject(p); setModalOpen(true);
  };
  const closeModal = () => { setModalOpen(false); setEditingProject(null); setForm(emptyForm); setImagePreview(""); };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProject) updateMutation.mutate({ id: editingProject.id, data: form });
    else createMutation.mutate(form);
  };
  const isPending = createMutation.isPending || updateMutation.isPending;

  /* ─── Derived data ─── */
  const filtered = filter === "Tous" ? projects : projects.filter(p => p.category === filter);
  const unreadCount = messages.filter(m => !m.read).length;

  const filteredMessages = messages.filter(m => {
    if (msgFilter === "unread") return !m.read;
    if (msgFilter === "contact") return m.type === "contact";
    if (msgFilter === "project_request") return m.type === "project_request";
    return true;
  });

  // Visits chart: last 14 days, fill missing dates with 0
  const last14 = Array.from({ length: 14 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (13 - i));
    const key = d.toISOString().slice(0, 10);
    const found = visitsData?.rows.find(r => r.date === key);
    return { date: key, count: found?.count ?? 0, label: d.toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit" }) };
  });
  const maxVisit = Math.max(...last14.map(d => d.count), 1);

  /* ─── Render ─── */
  return (
    <div className="min-h-screen bg-[#1F2937] text-white">
      {/* Topbar */}
      <header className="bg-[#111827] border-b border-white/10 px-6 py-4 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-4">
          <img src="/logo-codexa.png" alt="Codexa Devlabs" className="h-10 w-auto" />
          <div>
            <h1 className="font-bold text-lg leading-tight">Espace Admin</h1>
            <p className="text-xs text-gray-400">Tableau de bord</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <a href="/" target="_blank" className="text-sm text-gray-400 hover:text-[#FFA77F] transition-colors flex items-center gap-1">
            <ExternalLink className="w-4 h-4" /> Voir le site
          </a>
          <button onClick={onLogout} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white text-sm transition-all">
            <LogOut className="w-4 h-4" /> Déconnexion
          </button>
        </div>
      </header>

      {/* Tab Nav */}
      <div className="bg-[#111827] border-b border-white/5 px-6">
        <div className="flex gap-0 max-w-7xl mx-auto">
          {([
            { key: "projects", icon: LayoutDashboard, label: "Projets", count: projects.length },
            { key: "messages", icon: MessageSquare, label: "Messages", count: unreadCount || undefined, badge: unreadCount > 0 },
            { key: "stats", icon: BarChart2, label: "Statistiques" },
          ] as const).map(({ key, icon: Icon, label, count, badge }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`flex items-center gap-2 px-5 py-4 text-sm font-medium border-b-2 transition-all relative ${tab === key ? "border-[#FFA77F] text-[#FFA77F]" : "border-transparent text-gray-400 hover:text-white"}`}
            >
              <Icon className="w-4 h-4" />
              {label}
              {count !== undefined && (
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${badge ? "bg-[#FFA77F] text-[#1F2937] font-bold" : "bg-white/10 text-gray-400"}`}>{count}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 py-8">

        {/* ══ TAB: PROJECTS ══ */}
        {tab === "projects" && (
          <>
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

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <div className="flex gap-2 flex-wrap">
                {["Tous", ...CATEGORIES].map(cat => (
                  <button key={cat} onClick={() => setFilter(cat)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${filter === cat ? "bg-[#FFA77F] text-[#1F2937]" : "bg-white/5 text-gray-400 hover:text-white border border-white/10"}`}>
                    {cat}
                  </button>
                ))}
              </div>
              <button onClick={openAdd} className="flex items-center gap-2 px-5 py-2.5 bg-[#FFA77F] text-[#1F2937] font-bold rounded-xl hover:shadow-[0_0_20px_rgba(255,167,127,0.4)] transition-all">
                <Plus className="w-4 h-4" /> Ajouter un projet
              </button>
            </div>

            {loadingProjects ? (
              <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-[#FFA77F]" /></div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-20 text-gray-500">
                <p className="text-lg mb-2">Aucune réalisation</p>
                <p className="text-sm">Cliquez sur "Ajouter un projet" pour commencer</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map(project => (
                  <div key={project.id} className="bg-[#111827] border border-white/10 rounded-2xl overflow-hidden group hover:border-[#FFA77F]/30 transition-all">
                    {project.imageUrl ? (
                      <div className="h-40 overflow-hidden"><img src={project.imageUrl} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" /></div>
                    ) : (
                      <div className="h-40 bg-gradient-to-br from-[#FFA77F]/20 to-[#1F2937] flex items-center justify-center"><span className="text-4xl opacity-40">🖥️</span></div>
                    )}
                    <div className="p-5">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-bold text-white text-lg leading-tight">{project.title}</h3>
                        {project.featured && <Star className="w-4 h-4 text-[#FFA77F] shrink-0 mt-1" fill="currentColor" />}
                      </div>
                      <span className="text-xs px-2 py-1 rounded-full bg-[#FFA77F]/10 text-[#FFA77F] border border-[#FFA77F]/20 font-medium">{project.category}</span>
                      {project.description && <p className="text-sm text-gray-400 mt-3 line-clamp-2">{project.description}</p>}
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {project.techTags.map(tag => <span key={tag} className="text-xs px-2 py-0.5 rounded bg-white/5 text-gray-400 border border-white/10">{tag}</span>)}
                      </div>
                      <div className="flex gap-2 mt-4 pt-4 border-t border-white/5">
                        {project.projectUrl && <a href={project.projectUrl} target="_blank" className="flex items-center gap-1 text-xs text-gray-400 hover:text-[#FFA77F] transition-colors"><ExternalLink className="w-3 h-3" /> Voir</a>}
                        <div className="flex gap-2 ml-auto">
                          <button onClick={() => openEdit(project)} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all"><Pencil className="w-4 h-4" /></button>
                          <button onClick={() => setDeleteConfirm(project.id)} className="p-2 rounded-lg bg-red-500/5 hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-all"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* ══ TAB: MESSAGES ══ */}
        {tab === "messages" && (
          <>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-2xl font-bold">Messages reçus</h2>
                <p className="text-sm text-gray-400 mt-1">{messages.length} message{messages.length !== 1 ? "s" : ""} · {unreadCount} non lu{unreadCount !== 1 ? "s" : ""}</p>
              </div>
              <div className="flex gap-2 flex-wrap">
                {([
                  { key: "all", label: "Tous" },
                  { key: "unread", label: "Non lus" },
                  { key: "contact", label: "Contact" },
                  { key: "project_request", label: "Projets" },
                ] as const).map(f => (
                  <button key={f.key} onClick={() => setMsgFilter(f.key)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${msgFilter === f.key ? "bg-[#FFA77F] text-[#1F2937]" : "bg-white/5 text-gray-400 hover:text-white border border-white/10"}`}>
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {loadingMessages ? (
              <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-[#FFA77F]" /></div>
            ) : filteredMessages.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-gray-500">
                <Inbox className="w-14 h-14 mb-4 opacity-30" />
                <p className="text-lg">Aucun message</p>
                <p className="text-sm mt-1">Les messages de vos visiteurs apparaîtront ici</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredMessages.map(msg => {
                  const isProject = msg.type === "project_request";
                  const isExpanded = expandedMsg === msg.id;
                  const ex = msg.extraData as any;
                  return (
                    <div key={msg.id}
                      className={`bg-[#111827] border rounded-2xl overflow-hidden transition-all ${!msg.read ? "border-[#FFA77F]/30" : "border-white/10"}`}>
                      <div className="p-5 flex items-start gap-4">
                        {/* Icon */}
                        <div className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${isProject ? "bg-purple-500/10" : "bg-blue-500/10"}`}>
                          {isProject ? <Briefcase className="w-5 h-5 text-purple-400" /> : <Mail className="w-5 h-5 text-blue-400" />}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-bold text-white">{msg.name || "Anonyme"}</span>
                                {!msg.read && <span className="text-xs px-2 py-0.5 rounded-full bg-[#FFA77F] text-[#1F2937] font-bold">Nouveau</span>}
                                <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${isProject ? "bg-purple-500/10 text-purple-400 border-purple-500/20" : "bg-blue-500/10 text-blue-400 border-blue-500/20"}`}>
                                  {isProject ? "Demande projet" : "Contact"}
                                </span>
                              </div>
                              <p className="text-sm text-gray-400 mt-0.5">{msg.email}</p>
                            </div>
                            <span className="text-xs text-gray-500 shrink-0">{new Date(msg.createdAt).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}</span>
                          </div>

                          {msg.message && (
                            <p className={`text-sm text-gray-300 mt-2 ${!isExpanded ? "line-clamp-2" : ""}`}>{msg.message}</p>
                          )}

                          {/* Project request details */}
                          {isProject && isExpanded && ex && (
                            <div className="mt-4 bg-[#1F2937] rounded-xl p-4 space-y-3 text-sm">
                              {ex.company && <div className="flex gap-2"><span className="text-gray-500 w-28 shrink-0">Entreprise</span><span className="text-white font-medium">{ex.company}</span></div>}
                              {ex.sector && <div className="flex gap-2"><span className="text-gray-500 w-28 shrink-0">Secteur</span><span className="text-white">{ex.sector}</span></div>}
                              {ex.types?.length > 0 && <div className="flex gap-2"><span className="text-gray-500 w-28 shrink-0">Type</span><div className="flex flex-wrap gap-1">{ex.types.map((t: string) => <span key={t} className="px-2 py-0.5 bg-white/5 rounded text-xs text-gray-300 border border-white/10">{t}</span>)}</div></div>}
                              {ex.features?.length > 0 && <div className="flex gap-2"><span className="text-gray-500 w-28 shrink-0">Fonctionnalités</span><div className="flex flex-wrap gap-1">{ex.features.map((f: string) => <span key={f} className="px-2 py-0.5 bg-[#FFA77F]/10 rounded text-xs text-[#FFA77F] border border-[#FFA77F]/20">{f}</span>)}</div></div>}
                              {ex.budgetFormatted && <div className="flex gap-2"><span className="text-gray-500 w-28 shrink-0">Budget</span><span className="text-white font-bold">{ex.budgetFormatted}</span></div>}
                              {ex.palette && (
                                <div className="flex gap-2 items-center">
                                  <span className="text-gray-500 w-28 shrink-0">Palette</span>
                                  <div className="flex items-center gap-2">
                                    <div className="flex rounded overflow-hidden w-8 h-4 border border-white/10">
                                      <div className="flex-1" style={{ backgroundColor: ex.primaryColor }} />
                                      <div className="flex-1" style={{ backgroundColor: ex.accentColor }} />
                                    </div>
                                    <span className="text-white">{ex.palette}</span>
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="px-5 pb-4 flex items-center gap-2 border-t border-white/5 pt-3">
                        {(isProject || msg.message) && (
                          <button onClick={() => { setExpandedMsg(isExpanded ? null : msg.id); if (!msg.read && !isExpanded) markReadMutation.mutate(msg.id); }}
                            className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors">
                            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                            {isExpanded ? "Réduire" : "Voir détails"}
                          </button>
                        )}
                        {!msg.read && (
                          <button onClick={() => markReadMutation.mutate(msg.id)}
                            className="flex items-center gap-1.5 text-xs text-[#FFA77F] hover:text-white transition-colors">
                            <Eye className="w-3.5 h-3.5" /> Marquer lu
                          </button>
                        )}
                        <button onClick={() => setDeleteMsgConfirm(msg.id)}
                          className="ml-auto flex items-center gap-1.5 text-xs text-red-400 hover:text-red-300 transition-colors">
                          <Trash2 className="w-3.5 h-3.5" /> Supprimer
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {/* ══ TAB: STATS ══ */}
        {tab === "stats" && (
          <>
            <h2 className="text-2xl font-bold mb-6">Statistiques de visite</h2>

            {loadingVisits ? (
              <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-[#FFA77F]" /></div>
            ) : (
              <>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                  <div className="bg-[#111827] border border-white/10 rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-xl bg-[#FFA77F]/10 flex items-center justify-center"><TrendingUp className="w-5 h-5 text-[#FFA77F]" /></div>
                      <span className="text-gray-400 text-sm">Total visites (30j)</span>
                    </div>
                    <div className="text-4xl font-bold text-white">{visitsData?.total ?? 0}</div>
                  </div>
                  <div className="bg-[#111827] border border-white/10 rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center"><BarChart2 className="w-5 h-5 text-green-400" /></div>
                      <span className="text-gray-400 text-sm">Aujourd'hui</span>
                    </div>
                    <div className="text-4xl font-bold text-white">
                      {last14[last14.length - 1]?.count ?? 0}
                    </div>
                  </div>
                  <div className="bg-[#111827] border border-white/10 rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center"><MessageSquare className="w-5 h-5 text-blue-400" /></div>
                      <span className="text-gray-400 text-sm">Messages reçus</span>
                    </div>
                    <div className="text-4xl font-bold text-white">{messages.length || "—"}</div>
                  </div>
                </div>

                {/* Bar Chart */}
                <div className="bg-[#111827] border border-white/10 rounded-2xl p-6">
                  <h3 className="text-base font-bold mb-6 text-white">Visites — 14 derniers jours</h3>
                  <div className="flex items-end gap-2 h-48">
                    {last14.map((d, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
                        <div className="text-xs text-[#FFA77F] font-bold opacity-0 group-hover:opacity-100 transition-opacity">{d.count}</div>
                        <div className="w-full rounded-t-md transition-all duration-300 hover:opacity-80"
                          style={{
                            height: `${Math.max((d.count / maxVisit) * 100, d.count > 0 ? 4 : 0)}%`,
                            background: d.count > 0
                              ? "linear-gradient(to top, #FFA77F, #FFD4B8)"
                              : "rgba(255,255,255,0.05)",
                            minHeight: d.count > 0 ? "6px" : "3px",
                          }}
                        />
                        <span className="text-[10px] text-gray-500 writing-mode-vertical">{d.label}</span>
                      </div>
                    ))}
                  </div>
                  {last14.every(d => d.count === 0) && (
                    <p className="text-center text-gray-500 text-sm mt-4">Aucune donnée encore — les visites du site s'accumuleront ici</p>
                  )}
                </div>
              </>
            )}
          </>
        )}
      </main>

      {/* ══ Add/Edit Project Modal ══ */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={closeModal} />
          <div className="relative w-full max-w-2xl bg-[#111827] border border-white/10 rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-white/5">
              <h2 className="text-xl font-bold">{editingProject ? "Modifier le projet" : "Nouveau projet"}</h2>
              <button onClick={closeModal} className="p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-all hover:rotate-90"><X className="w-5 h-5" /></button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2 space-y-1.5">
                  <label className="text-sm text-gray-400 font-mono">Titre *</label>
                  <input required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="w-full bg-[#1F2937] border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-[#FFA77F] outline-none transition-all" placeholder="Ex: Application E-commerce" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm text-gray-400 font-mono">Catégorie *</label>
                  <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="w-full bg-[#1F2937] border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-[#FFA77F] outline-none appearance-none">
                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm text-gray-400 font-mono">Technologies (séparées par virgules)</label>
                  <input value={form.techTags} onChange={e => setForm({ ...form, techTags: e.target.value })} className="w-full bg-[#1F2937] border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-[#FFA77F] outline-none transition-all" placeholder="React, Node.js, Firebase" />
                </div>
                <div className="sm:col-span-2 space-y-1.5">
                  <label className="text-sm text-gray-400 font-mono">Description</label>
                  <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3} className="w-full bg-[#1F2937] border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-[#FFA77F] outline-none transition-all resize-none" placeholder="Décrivez le projet..." />
                </div>

                {/* Image Upload */}
                <div className="sm:col-span-2 space-y-1.5">
                  <label className="text-sm text-gray-400 font-mono">Image du projet</label>
                  <div className="relative rounded-xl border-2 border-dashed border-white/10 hover:border-[#FFA77F]/50 transition-colors overflow-hidden cursor-pointer group"
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={e => e.preventDefault()}
                    onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) handleImageUpload(f); }}>
                    <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) handleImageUpload(f); }} />
                    {imagePreview || form.imageUrl ? (
                      <div className="relative h-40">
                        <img src={imagePreview || form.imageUrl} alt="Aperçu" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <div className="text-white text-sm font-medium flex items-center gap-2"><Upload className="w-4 h-4" /> Changer l'image</div>
                        </div>
                        {uploadLoading && <div className="absolute inset-0 bg-black/60 flex items-center justify-center"><Loader2 className="w-8 h-8 text-[#FFA77F] animate-spin" /></div>}
                      </div>
                    ) : (
                      <div className="h-40 flex flex-col items-center justify-center text-gray-500 gap-3">
                        {uploadLoading ? <Loader2 className="w-8 h-8 text-[#FFA77F] animate-spin" /> : (
                          <><ImageIcon className="w-10 h-10" /><div className="text-center"><p className="text-sm font-medium text-gray-400">Cliquez ou glissez une image</p><p className="text-xs mt-1">JPG, PNG, WebP — max 5MB</p></div></>
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
                  <input value={form.projectUrl} onChange={e => setForm({ ...form, projectUrl: e.target.value })} className="w-full bg-[#1F2937] border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-[#FFA77F] outline-none transition-all" placeholder="https://monprojet.com" />
                </div>

                <div className="flex items-center">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <div onClick={() => setForm({ ...form, featured: !form.featured })} className={`w-10 h-6 rounded-full transition-colors flex items-center px-1 ${form.featured ? "bg-[#FFA77F]" : "bg-white/10"}`}>
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
              <button onClick={closeModal} className="px-6 py-2.5 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all">Annuler</button>
              <button onClick={handleSubmit} disabled={isPending} className="flex items-center gap-2 px-6 py-2.5 bg-[#FFA77F] text-[#1F2937] font-bold rounded-xl hover:shadow-[0_0_20px_rgba(255,167,127,0.3)] transition-all disabled:opacity-60">
                {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                {editingProject ? "Enregistrer" : "Créer le projet"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Project Confirm */}
      {deleteConfirm !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70" onClick={() => setDeleteConfirm(null)} />
          <div className="relative bg-[#111827] border border-red-500/20 rounded-2xl p-6 w-full max-w-sm text-center shadow-2xl">
            <div className="w-14 h-14 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4"><Trash2 className="w-7 h-7 text-red-400" /></div>
            <h3 className="text-lg font-bold text-white mb-2">Supprimer ce projet ?</h3>
            <p className="text-sm text-gray-400 mb-6">Cette action est irréversible.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-2.5 rounded-xl bg-white/5 text-gray-300 hover:bg-white/10 transition-all">Annuler</button>
              <button onClick={() => deleteProjMutation.mutate(deleteConfirm)} disabled={deleteProjMutation.isPending} className="flex-1 py-2.5 rounded-xl bg-red-500 text-white font-bold hover:bg-red-600 transition-all disabled:opacity-60 flex items-center justify-center gap-2">
                {deleteProjMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />} Supprimer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Message Confirm */}
      {deleteMsgConfirm !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70" onClick={() => setDeleteMsgConfirm(null)} />
          <div className="relative bg-[#111827] border border-red-500/20 rounded-2xl p-6 w-full max-w-sm text-center shadow-2xl">
            <div className="w-14 h-14 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4"><Trash2 className="w-7 h-7 text-red-400" /></div>
            <h3 className="text-lg font-bold text-white mb-2">Supprimer ce message ?</h3>
            <p className="text-sm text-gray-400 mb-6">Cette action est irréversible.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteMsgConfirm(null)} className="flex-1 py-2.5 rounded-xl bg-white/5 text-gray-300 hover:bg-white/10 transition-all">Annuler</button>
              <button onClick={() => deleteMsgMutation.mutate(deleteMsgConfirm)} disabled={deleteMsgMutation.isPending} className="flex-1 py-2.5 rounded-xl bg-red-500 text-white font-bold hover:bg-red-600 transition-all disabled:opacity-60 flex items-center justify-center gap-2">
                {deleteMsgMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />} Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
