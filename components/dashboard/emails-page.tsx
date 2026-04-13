"use client";

import { useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Plus,
  Send,
  Trash2,
  Search,
  Users,
  Sparkles,
  Loader2,
  X,
  Check,
  Edit3,
  Eye,
  ChevronDown,
  Building2,
  AlertCircle,
  RefreshCw,
  Crown,
  Inbox,
} from "lucide-react";
import {
  createContact,
  updateContact,
  deleteContact,
  createCampaign,
  updateCampaign,
  deleteCampaign,
  sendCampaign,
} from "@/lib/actions/emails";
import {
  enableEmailSync,
  disableEmailSync,
  triggerManualSync,
} from "@/lib/actions/email-sync";

type Contact = {
  id: string;
  name: string;
  email: string;
  company: string | null;
  tags: string | null;
  notes: string | null;
  createdAt: Date;
};

type Recipient = {
  id: string;
  status: string;
  email: string;
};

type Campaign = {
  id: string;
  subject: string;
  body: string;
  status: string;
  sentAt: Date | null;
  createdAt: Date;
  recipients: Recipient[];
};

type Brand = {
  id: string;
  name: string;
  email: string | null;
  contact: string | null;
};

type Usage = {
  sentToday: number;
  dailyLimit: number;
  maxRecipients: number;
  plan: string;
};

type SyncInfo = {
  enabled: boolean;
  lastSyncAt: string | null;
  canSync: boolean;
  syncIntervalMinutes: number;
};

interface EmailsPageProps {
  contacts: Contact[];
  campaigns: Campaign[];
  brands: Brand[];
  userName: string;
  usage: Usage;
  sync: SyncInfo;
}

const inputClass =
  "w-full rounded-lg border border-border-subtle bg-bg-primary px-3 py-2 text-sm text-text-primary outline-none focus:border-accent/50 placeholder:text-text-muted";

export default function EmailsPage({
  contacts: initialContacts,
  campaigns: initialCampaigns,
  brands,
  userName,
  usage,
  sync,
}: EmailsPageProps) {
  const [isPending, startTransition] = useTransition();
  const [tab, setTab] = useState<"campaigns" | "contacts" | "sync">("campaigns");

  // Sync state
  const [syncEnabled, setSyncEnabled] = useState(sync.enabled);
  const [syncLoading, setSyncLoading] = useState(false);
  const [syncResult, setSyncResult] = useState<{ found: number; created: number; errors: string[] } | null>(null);
  const [syncError, setSyncError] = useState("");

  // Contacts state
  const [contacts, setContacts] = useState(initialContacts);
  const [showContactModal, setShowContactModal] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [contactSearch, setContactSearch] = useState("");
  const [contactError, setContactError] = useState("");

  // Campaigns state
  const [campaigns, setCampaigns] = useState(initialCampaigns);
  const [showCampaignModal, setShowCampaignModal] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
  const [campaignError, setCampaignError] = useState("");
  const [sendResult, setSendResult] = useState<{ sent: number; failed: number; errors?: string[] } | null>(null);

  // Campaign form
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [selectedRecipients, setSelectedRecipients] = useState<string[]>([]);
  const [showRecipientPicker, setShowRecipientPicker] = useState(false);

  // AI state
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [showAi, setShowAi] = useState(false);

  const filteredContacts = contacts.filter(
    (c) =>
      c.name.toLowerCase().includes(contactSearch.toLowerCase()) ||
      c.email.toLowerCase().includes(contactSearch.toLowerCase()) ||
      c.company?.toLowerCase().includes(contactSearch.toLowerCase())
  );

  // ── Contact handlers ──

  const openContactModal = (contact?: Contact) => {
    setContactError("");
    setEditingContact(contact || null);
    setShowContactModal(true);
  };

  const handleSaveContact = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setContactError("");
    const fd = new FormData(e.currentTarget);

    // Convert comma-separated tags to JSON
    const rawTags = fd.get("tags") as string;
    if (rawTags) {
      const tagsArr = rawTags.split(",").map((t) => t.trim()).filter(Boolean);
      fd.set("tags", JSON.stringify(tagsArr));
    }

    startTransition(async () => {
      try {
        if (editingContact) {
          await updateContact(editingContact.id, fd);
        } else {
          await createContact(fd);
        }
        setShowContactModal(false);
      } catch (err: any) {
        setContactError(err.message || "Erreur");
      }
    });
  };

  const handleDeleteContact = (id: string) => {
    setContacts((prev) => prev.filter((c) => c.id !== id));
    startTransition(async () => {
      try {
        await deleteContact(id);
      } catch (err: any) {
        setContactError(err.message);
      }
    });
  };

  const handleImportFromBrands = () => {
    const brandsWithEmail = brands.filter((b) => b.email);
    if (brandsWithEmail.length === 0) {
      setContactError("Aucune marque n'a d'adresse email renseignée");
      return;
    }

    startTransition(async () => {
      let imported = 0;
      for (const brand of brandsWithEmail) {
        try {
          const fd = new FormData();
          fd.set("name", brand.contact || brand.name);
          fd.set("email", brand.email!);
          fd.set("company", brand.name);
          fd.set("tags", JSON.stringify(["marque"]));
          await createContact(fd);
          imported++;
        } catch {
          // Contact probably already exists
        }
      }
      setContactError(
        imported > 0
          ? `${imported} contact(s) importé(s) depuis tes marques`
          : "Tous les contacts existent déjà"
      );
    });
  };

  // ── Campaign handlers ──

  const openCampaignModal = (campaign?: Campaign) => {
    setCampaignError("");
    setSendResult(null);
    if (campaign) {
      setEditingCampaign(campaign);
      setSubject(campaign.subject);
      setBody(campaign.body);
      setSelectedRecipients(campaign.recipients.map((r) => {
        const contact = contacts.find((c) => c.email === r.email);
        return contact?.id || "";
      }).filter(Boolean));
    } else {
      setEditingCampaign(null);
      setSubject("");
      setBody("");
      setSelectedRecipients([]);
    }
    setShowCampaignModal(true);
    setShowAi(false);
  };

  const handleSaveCampaign = () => {
    setCampaignError("");
    if (!subject.trim() || !body.trim()) {
      setCampaignError("Sujet et contenu requis");
      return;
    }
    if (selectedRecipients.length === 0) {
      setCampaignError("Sélectionne au moins un destinataire");
      return;
    }

    const fd = new FormData();
    fd.set("subject", subject);
    fd.set("body", body);
    fd.set("recipientIds", JSON.stringify(selectedRecipients));

    startTransition(async () => {
      try {
        if (editingCampaign) {
          await updateCampaign(editingCampaign.id, fd);
        } else {
          await createCampaign(fd);
        }
        setShowCampaignModal(false);
      } catch (err: any) {
        setCampaignError(err.message || "Erreur");
      }
    });
  };

  const handleSendCampaign = (id: string) => {
    startTransition(async () => {
      try {
        const result = await sendCampaign(id);
        setSendResult({
          sent: result.sentCount,
          failed: result.failedCount,
          errors: result.errors,
        });
      } catch (err: any) {
        setCampaignError(err.message || "Erreur d'envoi");
      }
    });
  };

  const handleDeleteCampaign = (id: string) => {
    setCampaigns((prev) => prev.filter((c) => c.id !== id));
    startTransition(async () => {
      try {
        await deleteCampaign(id);
      } catch (err: any) {
        setCampaignError(err.message);
      }
    });
  };

  // ── AI handler ──

  const handleAiDraft = async () => {
    if (!aiPrompt.trim() || aiLoading) return;
    setAiLoading(true);
    try {
      const recipientNames = selectedRecipients
        .map((id) => contacts.find((c) => c.id === id))
        .filter(Boolean)
        .map((c) => `${c!.name} (${c!.company || c!.email})`)
        .join(", ");

      const res = await fetch("/api/ai/email-draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: aiPrompt,
          context: recipientNames
            ? `Destinataires : ${recipientNames}. Sujet actuel : ${subject || "(pas encore défini)"}`
            : undefined,
        }),
      });

      if (res.status === 429) {
        setCampaignError("Limite IA atteinte pour aujourd'hui");
        return;
      }

      const data = await res.json();
      if (data.content) {
        setBody(data.content);
        setShowAi(false);
        setAiPrompt("");
      }
    } catch {
      setCampaignError("Erreur IA, réessaie");
    } finally {
      setAiLoading(false);
    }
  };

  const toggleRecipient = (id: string) => {
    setSelectedRecipients((prev) => {
      if (prev.includes(id)) return prev.filter((r) => r !== id);
      if (prev.length >= usage.maxRecipients) {
        setCampaignError(
          `Maximum ${usage.maxRecipients} destinataire(s) par campagne (plan ${usage.plan})`
        );
        return prev;
      }
      return [...prev, id];
    });
  };

  // ── Sync handlers ──

  const handleToggleSync = () => {
    setSyncError("");
    startTransition(async () => {
      try {
        if (syncEnabled) {
          await disableEmailSync();
          setSyncEnabled(false);
        } else {
          await enableEmailSync();
          setSyncEnabled(true);
        }
      } catch (err: any) {
        setSyncError(err.message || "Erreur");
      }
    });
  };

  const handleManualSync = () => {
    setSyncError("");
    setSyncResult(null);
    setSyncLoading(true);
    startTransition(async () => {
      try {
        const result = await triggerManualSync();
        setSyncResult(result);
      } catch (err: any) {
        setSyncError(err.message || "Erreur de synchronisation");
      } finally {
        setSyncLoading(false);
      }
    });
  };

  const formatRelativeTime = (dateStr: string | null) => {
    if (!dateStr) return "Jamais";
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "À l'instant";
    if (mins < 60) return `Il y a ${mins} min`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `Il y a ${hours}h`;
    return `Il y a ${Math.floor(hours / 24)}j`;
  };

  return (
    <main className="flex-1 overflow-y-auto p-6 space-y-6 bg-page-emails">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10">
            <Mail className="h-5 w-5 text-blue-400" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-text-primary">Emails</h1>
            <p className="text-xs text-text-muted">
              Campagnes et base de contacts
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-lg bg-bg-surface border border-border-subtle px-3 py-2">
            <span className="text-xs text-text-muted">
              {usage.dailyLimit - usage.sentToday}/{usage.dailyLimit} emails restants
            </span>
            <span
              className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${
                usage.plan === "business"
                  ? "bg-amber-500/15 text-amber-400"
                  : usage.plan === "pro"
                  ? "bg-accent/15 text-accent"
                  : "bg-text-muted/15 text-text-muted"
              }`}
            >
              {usage.plan === "business" ? "BUSINESS" : usage.plan === "pro" ? "PRO" : "FREE"}
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 rounded-lg bg-bg-surface border border-border-subtle p-1 w-fit">
        <button
          onClick={() => setTab("campaigns")}
          className={`flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
            tab === "campaigns"
              ? "bg-accent/10 text-accent"
              : "text-text-secondary hover:text-text-primary"
          }`}
        >
          <Send className="h-4 w-4" />
          Campagnes ({campaigns.length})
        </button>
        <button
          onClick={() => setTab("contacts")}
          className={`flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
            tab === "contacts"
              ? "bg-accent/10 text-accent"
              : "text-text-secondary hover:text-text-primary"
          }`}
        >
          <Users className="h-4 w-4" />
          Contacts ({contacts.length})
        </button>
        <button
          onClick={() => setTab("sync")}
          className={`flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
            tab === "sync"
              ? "bg-accent/10 text-accent"
              : "text-text-secondary hover:text-text-primary"
          }`}
        >
          <Inbox className="h-4 w-4" />
          Sync Gmail
          {syncEnabled && (
            <span className="h-2 w-2 rounded-full bg-green-400" />
          )}
        </button>
      </div>

      {/* ══════════════ CAMPAIGNS TAB ══════════════ */}
      {tab === "campaigns" && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="flex items-center gap-3">
            <button
              onClick={() => openCampaignModal()}
              className="flex items-center gap-2 rounded-xl bg-accent text-white px-4 py-2.5 text-sm font-medium hover:bg-accent-glow transition-colors shadow-md shadow-accent/20"
            >
              <Plus className="h-4 w-4" />
              Nouvelle campagne
            </button>
          </div>

          {sendResult && (
            <div
              className={`rounded-xl border p-4 text-sm ${
                sendResult.failed > 0 && sendResult.sent === 0
                  ? "border-red-500/20 bg-red-500/5"
                  : "border-green-500/20 bg-green-500/5"
              }`}
            >
              <p
                className={`font-medium ${
                  sendResult.sent > 0 ? "text-green-400" : "text-red-400"
                }`}
              >
                {sendResult.sent > 0
                  ? `Campagne envoyée : ${sendResult.sent} email(s) envoyé(s)`
                  : "Aucun email envoyé"}
                {sendResult.failed > 0 && (
                  <span className="text-red-400">
                    {sendResult.sent > 0 ? ", " : ""}
                    {sendResult.failed} échoué(s)
                  </span>
                )}
              </p>
              {sendResult.errors && sendResult.errors.length > 0 && (
                <div className="mt-2 text-xs text-red-400/80 space-y-0.5">
                  {sendResult.errors.map((err, i) => (
                    <p key={i}>{err}</p>
                  ))}
                </div>
              )}
            </div>
          )}

          {campaigns.length === 0 ? (
            <div className="rounded-xl border border-border-subtle bg-bg-surface p-12 text-center">
              <Mail className="h-10 w-10 text-text-muted mx-auto mb-3" />
              <p className="text-sm text-text-secondary">
                Aucune campagne email
              </p>
              <p className="text-xs text-text-muted mt-1">
                Crée ta première campagne pour contacter tes marques
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {campaigns.map((campaign) => (
                <motion.div
                  key={campaign.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-xl border border-border-subtle bg-bg-surface p-4 hover:border-border-medium transition-colors card-premium"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-sm font-semibold text-text-primary truncate">
                          {campaign.subject}
                        </h3>
                        <span
                          className={`shrink-0 text-[10px] font-medium px-2 py-0.5 rounded-full ${
                            campaign.status === "sent"
                              ? "bg-green-500/10 text-green-400"
                              : "bg-amber-500/10 text-amber-400"
                          }`}
                        >
                          {campaign.status === "sent" ? "Envoyé" : "Brouillon"}
                        </span>
                      </div>
                      <p className="text-xs text-text-muted line-clamp-1">
                        {campaign.body}
                      </p>
                      <div className="flex items-center gap-3 mt-2 text-[11px] text-text-muted">
                        <span>{campaign.recipients.length} destinataire(s)</span>
                        {campaign.sentAt && (
                          <span>
                            Envoyé le{" "}
                            {new Date(campaign.sentAt).toLocaleDateString("fr-FR")}
                          </span>
                        )}
                        {campaign.status === "sent" && (
                          <span className="text-green-400">
                            {campaign.recipients.filter((r) => r.status === "sent").length} reçu(s)
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      {campaign.status === "draft" && (
                        <>
                          <button
                            onClick={() => openCampaignModal(campaign)}
                            className="rounded-lg p-2 text-text-muted hover:text-text-primary hover:bg-bg-elevated transition-colors"
                          >
                            <Edit3 className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => handleSendCampaign(campaign.id)}
                            disabled={isPending}
                            className="flex items-center gap-1.5 rounded-lg bg-green-500/10 border border-green-500/20 px-3 py-1.5 text-xs font-medium text-green-400 hover:bg-green-500/15 transition-colors"
                          >
                            <Send className="h-3 w-3" />
                            Envoyer
                          </button>
                        </>
                      )}
                      {campaign.status === "sent" && (
                        <button
                          onClick={() => openCampaignModal(campaign)}
                          className="rounded-lg p-2 text-text-muted hover:text-text-primary hover:bg-bg-elevated transition-colors"
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteCampaign(campaign.id)}
                        disabled={isPending}
                        className="rounded-lg p-2 text-text-muted hover:text-red-400 hover:bg-red-500/10 transition-colors"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      )}

      {/* ══════════════ CONTACTS TAB ══════════════ */}
      {tab === "contacts" && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={() => openContactModal()}
              className="flex items-center gap-2 rounded-xl bg-accent text-white px-4 py-2.5 text-sm font-medium hover:bg-accent-glow transition-colors shadow-md shadow-accent/20"
            >
              <Plus className="h-4 w-4" />
              Ajouter un contact
            </button>
            <button
              onClick={handleImportFromBrands}
              disabled={isPending}
              className="flex items-center gap-2 rounded-xl border border-border-subtle bg-bg-surface px-4 py-2.5 text-sm text-text-secondary hover:text-text-primary hover:bg-bg-elevated transition-colors"
            >
              <Building2 className="h-4 w-4" />
              Importer depuis mes marques
            </button>
            <div className="flex items-center gap-2 rounded-lg border border-border-subtle bg-bg-surface px-3 py-2 ml-auto">
              <Search className="h-3.5 w-3.5 text-text-muted" />
              <input
                value={contactSearch}
                onChange={(e) => setContactSearch(e.target.value)}
                placeholder="Rechercher..."
                className="bg-transparent text-sm text-text-primary outline-none placeholder:text-text-muted w-40"
              />
            </div>
          </div>

          {contactError && (
            <p
              className={`text-sm ${
                contactError.includes("importé") || contactError.includes("existent")
                  ? "text-green-400"
                  : "text-red-400"
              }`}
            >
              {contactError}
            </p>
          )}

          {filteredContacts.length === 0 ? (
            <div className="rounded-xl border border-border-subtle bg-bg-surface p-12 text-center">
              <Users className="h-10 w-10 text-text-muted mx-auto mb-3" />
              <p className="text-sm text-text-secondary">
                {contactSearch ? "Aucun résultat" : "Aucun contact"}
              </p>
              <p className="text-xs text-text-muted mt-1">
                Ajoute des contacts ou importe-les depuis tes marques
              </p>
            </div>
          ) : (
            <div className="rounded-xl border border-border-subtle bg-bg-surface overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border-subtle text-left text-xs text-text-muted">
                    <th className="px-4 py-3 font-medium">Nom</th>
                    <th className="px-4 py-3 font-medium">Email</th>
                    <th className="px-4 py-3 font-medium hidden sm:table-cell">
                      Entreprise
                    </th>
                    <th className="px-4 py-3 font-medium hidden md:table-cell">
                      Tags
                    </th>
                    <th className="px-4 py-3 font-medium w-20" />
                  </tr>
                </thead>
                <tbody>
                  {filteredContacts.map((contact) => {
                    const tags: string[] = contact.tags
                      ? JSON.parse(contact.tags)
                      : [];
                    return (
                      <tr
                        key={contact.id}
                        className="border-b border-border-subtle/50 hover:bg-bg-elevated/50 transition-colors"
                      >
                        <td className="px-4 py-3 font-medium text-text-primary">
                          {contact.name}
                        </td>
                        <td className="px-4 py-3 text-text-secondary">
                          {contact.email}
                        </td>
                        <td className="px-4 py-3 text-text-muted hidden sm:table-cell">
                          {contact.company || "—"}
                        </td>
                        <td className="px-4 py-3 hidden md:table-cell">
                          <div className="flex gap-1 flex-wrap">
                            {tags.map((t) => (
                              <span
                                key={t}
                                className="text-[10px] rounded-full bg-accent/10 text-accent px-2 py-0.5"
                              >
                                {t}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-1 justify-end">
                            <button
                              onClick={() => openContactModal(contact)}
                              className="rounded-lg p-1.5 text-text-muted hover:text-text-primary hover:bg-bg-elevated transition-colors"
                            >
                              <Edit3 className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteContact(contact.id)}
                              disabled={isPending}
                              className="rounded-lg p-1.5 text-text-muted hover:text-red-400 hover:bg-red-500/10 transition-colors"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      )}

      {/* ══════════════ SYNC TAB ══════════════ */}
      {tab === "sync" && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          {!sync.canSync ? (
            /* Plan upgrade prompt */
            <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-8 text-center">
              <Crown className="h-10 w-10 text-amber-400 mx-auto mb-3" />
              <h3 className="text-base font-bold text-text-primary mb-2">
                Sync Gmail — Pro & Business
              </h3>
              <p className="text-sm text-text-secondary max-w-md mx-auto mb-4">
                Connecte ta boîte Gmail pour détecter automatiquement les emails
                de collaboration et les ajouter en leads.
              </p>
              <div className="flex gap-4 justify-center text-xs text-text-muted mb-5">
                <div className="rounded-lg border border-border-subtle bg-bg-surface px-4 py-3">
                  <p className="font-semibold text-accent mb-1">Pro</p>
                  <p>Sync toutes les 3h</p>
                </div>
                <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 px-4 py-3">
                  <p className="font-semibold text-amber-400 mb-1">Business</p>
                  <p>Sync toutes les 30min</p>
                </div>
              </div>
              <a
                href="/pricing"
                className="inline-flex items-center gap-2 rounded-xl bg-accent text-white px-6 py-2.5 text-sm font-semibold hover:bg-accent-glow transition-colors shadow-md shadow-accent/20"
              >
                <Crown className="h-4 w-4" />
                Passer à Pro
              </a>
            </div>
          ) : (
            /* Sync controls */
            <div className="space-y-4">
              {/* Toggle + status card */}
              <div className="rounded-xl border border-border-subtle bg-bg-surface p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10">
                      <Inbox className="h-5 w-5 text-blue-400" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-text-primary">
                        Détection automatique
                      </h3>
                      <p className="text-xs text-text-muted">
                        Scanne Gmail pour les emails de collaboration
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleToggleSync}
                    disabled={isPending}
                    className={`relative w-12 h-6 rounded-full transition-colors ${
                      syncEnabled ? "bg-green-500" : "bg-bg-elevated border border-border-subtle"
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                        syncEnabled ? "left-[26px]" : "left-0.5"
                      }`}
                    />
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="rounded-lg bg-bg-primary border border-border-subtle/50 p-3 text-center">
                    <p className="text-[11px] text-text-muted mb-0.5">Statut</p>
                    <p className={`text-xs font-semibold ${syncEnabled ? "text-green-400" : "text-text-muted"}`}>
                      {syncEnabled ? "Actif" : "Désactivé"}
                    </p>
                  </div>
                  <div className="rounded-lg bg-bg-primary border border-border-subtle/50 p-3 text-center">
                    <p className="text-[11px] text-text-muted mb-0.5">Fréquence</p>
                    <p className="text-xs font-semibold text-text-primary">
                      {sync.syncIntervalMinutes >= 60
                        ? `${sync.syncIntervalMinutes / 60}h`
                        : `${sync.syncIntervalMinutes}min`}
                    </p>
                  </div>
                  <div className="rounded-lg bg-bg-primary border border-border-subtle/50 p-3 text-center">
                    <p className="text-[11px] text-text-muted mb-0.5">Dernière sync</p>
                    <p className="text-xs font-semibold text-text-primary">
                      {formatRelativeTime(sync.lastSyncAt)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Manual sync button */}
              <div className="rounded-xl border border-border-subtle bg-bg-surface p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-text-primary mb-1">
                      Synchronisation manuelle
                    </h3>
                    <p className="text-xs text-text-muted">
                      Lance un scan immédiat de ta boîte Gmail
                    </p>
                  </div>
                  <button
                    onClick={handleManualSync}
                    disabled={isPending || syncLoading}
                    className="flex items-center gap-2 rounded-xl bg-accent text-white px-4 py-2.5 text-sm font-medium hover:bg-accent-glow transition-colors shadow-md shadow-accent/20 disabled:opacity-50"
                  >
                    {syncLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <RefreshCw className="h-4 w-4" />
                    )}
                    Synchroniser
                  </button>
                </div>

                {/* Sync result */}
                {syncResult && (
                  <div className="mt-4 rounded-lg border border-green-500/20 bg-green-500/5 p-3">
                    <div className="flex items-center gap-2 text-sm text-green-400 font-medium">
                      <Check className="h-4 w-4" />
                      {syncResult.found} email(s) détecté(s), {syncResult.created} lead(s) créé(s)
                    </div>
                    {syncResult.errors.length > 0 && (
                      <div className="mt-2 text-xs text-red-400/80 space-y-0.5">
                        {syncResult.errors.map((err, i) => (
                          <p key={i}>{err}</p>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {syncError && (
                  <div className="mt-4 flex items-center gap-2 text-xs text-red-400">
                    <AlertCircle className="h-3.5 w-3.5" />
                    {syncError}
                  </div>
                )}
              </div>

              {/* How it works */}
              <div className="rounded-xl border border-border-subtle bg-bg-surface p-5">
                <h3 className="text-sm font-semibold text-text-primary mb-3">
                  Comment ça marche ?
                </h3>
                <div className="space-y-3 text-xs text-text-secondary">
                  <div className="flex items-start gap-3">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent text-[10px] font-bold">1</span>
                    <p>BrandSync scanne ta boîte Gmail à intervalle régulier (lecture seule)</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent text-[10px] font-bold">2</span>
                    <p>Les emails contenant des mots-clés de collaboration sont détectés (partenariat, sponsoring, collab...)</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent text-[10px] font-bold">3</span>
                    <p>Une marque et une collaboration &quot;lead&quot; sont automatiquement créées dans ton dashboard</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* ══════════════ CONTACT MODAL ══════════════ */}
      <AnimatePresence>
        {showContactModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={() => setShowContactModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md rounded-2xl border border-border-subtle bg-bg-surface p-6 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-base font-bold text-text-primary">
                  {editingContact ? "Modifier le contact" : "Nouveau contact"}
                </h2>
                <button
                  onClick={() => setShowContactModal(false)}
                  className="text-text-muted hover:text-text-primary"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleSaveContact} className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-text-secondary">
                    Nom *
                  </label>
                  <input
                    name="name"
                    defaultValue={editingContact?.name}
                    required
                    className={inputClass}
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-text-secondary">
                    Email *
                  </label>
                  <input
                    name="email"
                    type="email"
                    defaultValue={editingContact?.email}
                    required
                    className={inputClass}
                    placeholder="john@brand.com"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-text-secondary">
                    Entreprise
                  </label>
                  <input
                    name="company"
                    defaultValue={editingContact?.company || ""}
                    className={inputClass}
                    placeholder="Nike, Lancôme..."
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-text-secondary">
                    Tags (séparés par des virgules)
                  </label>
                  <input
                    name="tags"
                    defaultValue={
                      editingContact?.tags
                        ? JSON.parse(editingContact.tags).join(", ")
                        : ""
                    }
                    className={inputClass}
                    placeholder="marque, vip, mode"
                    onChange={(e) => {
                      // We'll store as JSON in the hidden field
                      const tagsInput = e.target;
                      const tagsArr = tagsInput.value
                        .split(",")
                        .map((t: string) => t.trim())
                        .filter(Boolean);
                      // Override the value that will be sent
                      tagsInput.dataset.json = JSON.stringify(tagsArr);
                    }}
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-text-secondary">
                    Notes
                  </label>
                  <textarea
                    name="notes"
                    defaultValue={editingContact?.notes || ""}
                    className={inputClass}
                    rows={2}
                    placeholder="Notes internes..."
                  />
                </div>

                {contactError && (
                  <p className="text-xs text-red-400">{contactError}</p>
                )}

                <button
                  type="submit"
                  disabled={isPending}
                  className="w-full rounded-xl bg-accent text-white py-2.5 text-sm font-semibold hover:bg-accent-glow transition-colors disabled:opacity-50"
                >
                  {isPending
                    ? "Sauvegarde..."
                    : editingContact
                    ? "Modifier"
                    : "Ajouter le contact"}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══════════════ CAMPAIGN MODAL ══════════════ */}
      <AnimatePresence>
        {showCampaignModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={() => setShowCampaignModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-border-subtle bg-bg-surface p-6 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-base font-bold text-text-primary">
                  {editingCampaign
                    ? editingCampaign.status === "sent"
                      ? "Détails de la campagne"
                      : "Modifier la campagne"
                    : "Nouvelle campagne"}
                </h2>
                <button
                  onClick={() => setShowCampaignModal(false)}
                  className="text-text-muted hover:text-text-primary"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-4">
                {/* Subject */}
                <div>
                  <label className="text-xs font-medium text-text-secondary">
                    Sujet *
                  </label>
                  <input
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className={inputClass}
                    placeholder="Proposition de collaboration"
                    readOnly={editingCampaign?.status === "sent"}
                  />
                </div>

                {/* Recipients */}
                <div>
                  <label className="text-xs font-medium text-text-secondary mb-1 block">
                    Destinataires * ({selectedRecipients.length} sélectionné
                    {selectedRecipients.length > 1 ? "s" : ""})
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowRecipientPicker(!showRecipientPicker)}
                    className="flex items-center gap-2 w-full rounded-lg border border-border-subtle bg-bg-primary px-3 py-2 text-sm text-text-secondary hover:border-accent/50 transition-colors"
                    disabled={editingCampaign?.status === "sent"}
                  >
                    <Users className="h-3.5 w-3.5" />
                    {selectedRecipients.length > 0
                      ? `${selectedRecipients.length} contact(s)`
                      : "Choisir les destinataires"}
                    <ChevronDown className="h-3.5 w-3.5 ml-auto" />
                  </button>

                  <AnimatePresence>
                    {showRecipientPicker && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-2 rounded-lg border border-border-subtle bg-bg-primary p-2 max-h-40 overflow-y-auto space-y-1">
                          {contacts.length === 0 ? (
                            <p className="text-xs text-text-muted p-2">
                              Aucun contact — ajoute des contacts d'abord
                            </p>
                          ) : (
                            <>
                              <div className="flex items-center justify-between px-2 py-1">
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (selectedRecipients.length > 0) {
                                      setSelectedRecipients([]);
                                    } else {
                                      setSelectedRecipients(
                                        contacts.slice(0, usage.maxRecipients).map((c) => c.id)
                                      );
                                    }
                                  }}
                                  className="text-[11px] text-accent hover:underline"
                                >
                                  {selectedRecipients.length > 0
                                    ? "Tout désélectionner"
                                    : `Sélectionner (max ${usage.maxRecipients})`}
                                </button>
                                <span className="text-[10px] text-text-muted">
                                  {selectedRecipients.length}/{usage.maxRecipients}
                                </span>
                              </div>
                              {contacts.map((c) => (
                                <label
                                  key={c.id}
                                  className="flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-bg-elevated cursor-pointer text-sm"
                                >
                                  <input
                                    type="checkbox"
                                    checked={selectedRecipients.includes(c.id)}
                                    onChange={() => toggleRecipient(c.id)}
                                    className="accent-accent"
                                  />
                                  <span className="text-text-primary">
                                    {c.name}
                                  </span>
                                  <span className="text-text-muted text-xs">
                                    {c.email}
                                  </span>
                                </label>
                              ))}
                            </>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Body + AI */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-medium text-text-secondary">
                      Contenu *
                    </label>
                    {editingCampaign?.status !== "sent" && (
                      <button
                        type="button"
                        onClick={() => setShowAi(!showAi)}
                        className="flex items-center gap-1.5 text-[11px] font-medium text-accent hover:text-accent-glow transition-colors"
                      >
                        <Sparkles className="h-3 w-3" />
                        {showAi ? "Fermer l'IA" : "Rédiger avec l'IA"}
                      </button>
                    )}
                  </div>

                  {/* AI Panel */}
                  <AnimatePresence>
                    {showAi && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="mb-3 rounded-xl border border-accent/20 bg-accent/5 p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <Sparkles className="h-4 w-4 text-accent" />
                            <span className="text-xs font-semibold text-accent">
                              Assistant IA
                            </span>
                          </div>
                          <p className="text-[11px] text-text-muted mb-3">
                            Décris le type d'email que tu veux et l'IA le rédigera
                            pour toi.
                          </p>
                          <div className="flex gap-2 mb-2 flex-wrap">
                            {[
                              "Email de prospection pour une nouvelle collab",
                              "Relance de paiement polie",
                              "Remerciement après une collaboration",
                              "Proposition de partenariat long terme",
                            ].map((suggestion) => (
                              <button
                                key={suggestion}
                                type="button"
                                onClick={() => setAiPrompt(suggestion)}
                                className="text-[10px] rounded-full border border-accent/20 bg-accent/5 px-2.5 py-1 text-accent hover:bg-accent/10 transition-colors"
                              >
                                {suggestion}
                              </button>
                            ))}
                          </div>
                          <div className="flex gap-2">
                            <input
                              value={aiPrompt}
                              onChange={(e) => setAiPrompt(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  e.preventDefault();
                                  handleAiDraft();
                                }
                              }}
                              placeholder="Ex: email pour proposer un partenariat à Nike..."
                              className={inputClass}
                            />
                            <button
                              type="button"
                              onClick={handleAiDraft}
                              disabled={aiLoading || !aiPrompt.trim()}
                              className="shrink-0 rounded-lg bg-accent text-white px-4 py-2 text-sm font-medium hover:bg-accent-glow transition-colors disabled:opacity-50"
                            >
                              {aiLoading ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                "Générer"
                              )}
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <textarea
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    className={`${inputClass} min-h-[200px]`}
                    placeholder="Bonjour,&#10;&#10;Je me permets de vous contacter..."
                    readOnly={editingCampaign?.status === "sent"}
                  />
                </div>

                {campaignError && (
                  <div className="flex items-center gap-2 text-xs text-red-400">
                    <AlertCircle className="h-3.5 w-3.5" />
                    {campaignError}
                  </div>
                )}

                {/* Actions */}
                {editingCampaign?.status !== "sent" && (
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={handleSaveCampaign}
                      disabled={isPending}
                      className="flex-1 rounded-xl bg-bg-elevated border border-border-subtle text-text-primary py-2.5 text-sm font-medium hover:bg-bg-primary transition-colors disabled:opacity-50"
                    >
                      {isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin mx-auto" />
                      ) : (
                        <>
                          <Edit3 className="h-3.5 w-3.5 inline mr-1.5" />
                          Sauvegarder le brouillon
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (!subject.trim() || !body.trim() || selectedRecipients.length === 0) {
                          setCampaignError("Remplis tous les champs avant d'envoyer");
                          return;
                        }
                        // Save then send
                        const fd = new FormData();
                        fd.set("subject", subject);
                        fd.set("body", body);
                        fd.set("recipientIds", JSON.stringify(selectedRecipients));

                        startTransition(async () => {
                          try {
                            let campaignId = editingCampaign?.id;
                            if (editingCampaign) {
                              await updateCampaign(editingCampaign.id, fd);
                            } else {
                              campaignId = await createCampaign(fd);
                            }
                            if (campaignId) {
                              const result = await sendCampaign(campaignId);
                              setSendResult({
                                sent: result.sentCount,
                                failed: result.failedCount,
                                errors: result.errors,
                              });
                              setShowCampaignModal(false);
                            }
                          } catch (err: any) {
                            setCampaignError(err.message || "Erreur");
                          }
                        });
                      }}
                      disabled={isPending}
                      className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-green-600 text-white py-2.5 text-sm font-semibold hover:bg-green-500 transition-colors disabled:opacity-50 shadow-md shadow-green-600/20"
                    >
                      {isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <>
                          <Send className="h-3.5 w-3.5" />
                          Envoyer maintenant
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
