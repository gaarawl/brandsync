"use client";

import { useState, useTransition } from "react";
import {
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  ExternalLink,
  MousePointerClick,
  Eye,
  EyeOff,
} from "lucide-react";
import { createLink, updateLink, deleteLink, reorderLinks } from "@/lib/actions/links";

export interface LinkItem {
  id: string;
  title: string;
  url: string;
  emoji: string | null;
  position: number;
  active: boolean;
  clicks: number;
}

export default function LinkEditor({ links: initialLinks }: { links: LinkItem[] }) {
  const [links, setLinks] = useState(initialLinks);
  const [isPending, startTransition] = useTransition();
  const [showForm, setShowForm] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const [newEmoji, setNewEmoji] = useState("");

  const handleAdd = () => {
    if (!newTitle || !newUrl) return;
    const fd = new FormData();
    fd.set("title", newTitle);
    fd.set("url", newUrl.startsWith("http") ? newUrl : `https://${newUrl}`);
    fd.set("emoji", newEmoji);
    startTransition(async () => {
      await createLink(fd);
      setLinks((prev) => [
        ...prev,
        {
          id: `temp-${Date.now()}`,
          title: newTitle,
          url: newUrl.startsWith("http") ? newUrl : `https://${newUrl}`,
          emoji: newEmoji || null,
          position: prev.length,
          active: true,
          clicks: 0,
        },
      ]);
      setNewTitle("");
      setNewUrl("");
      setNewEmoji("");
      setShowForm(false);
    });
  };

  const handleToggle = (link: LinkItem) => {
    const fd = new FormData();
    fd.set("title", link.title);
    fd.set("url", link.url);
    fd.set("emoji", link.emoji || "");
    fd.set("active", String(!link.active));
    setLinks((prev) =>
      prev.map((l) => (l.id === link.id ? { ...l, active: !l.active } : l))
    );
    startTransition(() => updateLink(link.id, fd));
  };

  const handleDelete = (id: string) => {
    setLinks((prev) => prev.filter((l) => l.id !== id));
    startTransition(() => deleteLink(id));
  };

  const handleMove = (index: number, direction: "up" | "down") => {
    const newLinks = [...links];
    const swapIndex = direction === "up" ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= newLinks.length) return;
    [newLinks[index], newLinks[swapIndex]] = [newLinks[swapIndex], newLinks[index]];
    setLinks(newLinks);
    startTransition(() => reorderLinks(newLinks.map((l) => l.id)));
  };

  return (
    <section className="card-premium rounded-xl p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-sm font-semibold text-text-primary">
            Mes liens
          </h2>
          <p className="text-xs text-text-muted mt-0.5">
            Les liens visibles sur ta page publique
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-1.5 text-xs text-accent hover:text-accent-glow transition-colors"
        >
          <Plus className="h-3.5 w-3.5" /> Ajouter
        </button>
      </div>

      {/* Add form */}
      {showForm && (
        <div className="rounded-lg border border-accent/20 bg-accent/5 p-4 mb-4 space-y-3">
          <div className="flex gap-3">
            <div className="w-16">
              <label className="text-xs text-text-muted mb-1 block">Emoji</label>
              <input
                type="text"
                value={newEmoji}
                onChange={(e) => setNewEmoji(e.target.value.slice(0, 2))}
                placeholder="🔗"
                className="w-full rounded-lg border border-border-subtle bg-bg-primary px-2 py-2 text-center text-sm outline-none focus:border-accent/40 transition-colors"
              />
            </div>
            <div className="flex-1">
              <label className="text-xs text-text-muted mb-1 block">Titre</label>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Ma chaîne YouTube"
                className="w-full rounded-lg border border-border-subtle bg-bg-primary px-3 py-2 text-sm text-text-primary outline-none focus:border-accent/40 transition-colors"
              />
            </div>
          </div>
          <div>
            <label className="text-xs text-text-muted mb-1 block">URL</label>
            <input
              type="text"
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
              placeholder="https://youtube.com/@monpseudo"
              className="w-full rounded-lg border border-border-subtle bg-bg-primary px-3 py-2 text-sm text-text-primary outline-none focus:border-accent/40 transition-colors"
            />
          </div>
          <div className="flex gap-2 justify-end">
            <button
              onClick={() => setShowForm(false)}
              className="px-3 py-1.5 text-xs text-text-muted hover:text-text-secondary transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={handleAdd}
              disabled={!newTitle || !newUrl || isPending}
              className="px-4 py-1.5 text-xs font-medium rounded-lg bg-accent text-white hover:bg-accent-glow transition-colors disabled:opacity-50"
            >
              Ajouter
            </button>
          </div>
        </div>
      )}

      {/* Links list */}
      {links.length === 0 ? (
        <p className="text-xs text-text-muted text-center py-6">
          Aucun lien. Ajoute ton premier lien pour ta page publique !
        </p>
      ) : (
        <div className="space-y-2">
          {links.map((link, index) => (
            <div
              key={link.id}
              className={`flex items-center gap-3 rounded-lg border px-3 py-2.5 transition-colors ${
                link.active
                  ? "border-border-subtle bg-bg-primary"
                  : "border-border-subtle/50 bg-bg-primary/50 opacity-60"
              }`}
            >
              {/* Reorder */}
              <div className="flex flex-col -my-1">
                <button
                  onClick={() => handleMove(index, "up")}
                  disabled={index === 0}
                  className="text-text-muted hover:text-text-primary disabled:opacity-20 transition-colors"
                >
                  <ChevronUp className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => handleMove(index, "down")}
                  disabled={index === links.length - 1}
                  className="text-text-muted hover:text-text-primary disabled:opacity-20 transition-colors"
                >
                  <ChevronDown className="h-3.5 w-3.5" />
                </button>
              </div>

              {/* Emoji */}
              <span className="text-lg w-6 text-center shrink-0">
                {link.emoji || "🔗"}
              </span>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-text-primary truncate">
                  {link.title}
                </p>
                <p className="text-xs text-text-muted truncate">{link.url}</p>
              </div>

              {/* Clicks */}
              <span className="flex items-center gap-1 text-xs text-text-muted shrink-0">
                <MousePointerClick className="h-3 w-3" />
                {link.clicks}
              </span>

              {/* Toggle */}
              <button
                onClick={() => handleToggle(link)}
                className={`shrink-0 transition-colors ${
                  link.active
                    ? "text-accent hover:text-accent-glow"
                    : "text-text-muted hover:text-text-secondary"
                }`}
                title={link.active ? "Désactiver" : "Activer"}
              >
                {link.active ? (
                  <Eye className="h-4 w-4" />
                ) : (
                  <EyeOff className="h-4 w-4" />
                )}
              </button>

              {/* Delete */}
              <button
                onClick={() => handleDelete(link.id)}
                className="text-text-muted hover:text-red-400 transition-colors shrink-0"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
