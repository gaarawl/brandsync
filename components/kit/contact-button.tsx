"use client";

import { useState } from "react";
import { Mail, X, Copy, Check, Send } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type Props = {
  email: string;
  name: string;
};

export default function ContactButton({ email, name }: Props) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for browsers without clipboard permission
      const ta = document.createElement("textarea");
      ta.value = email;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const subject = encodeURIComponent(`Collaboration — ${name}`);
  const body = encodeURIComponent(
    `Bonjour ${name},\n\nJe vous contacte au sujet d'une possible collaboration.\n\nCordialement,`
  );
  const mailtoHref = `mailto:${email}?subject=${subject}&body=${body}`;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="group relative flex items-center justify-center gap-2 w-full overflow-hidden rounded-xl py-3.5 text-sm font-semibold bg-gradient-to-b from-[#a78bfa] to-[#7c3aed] text-white shadow-[0_0_25px_rgba(139,92,246,0.5),0_0_60px_rgba(139,92,246,0.2)]"
      >
        <span className="absolute inset-0 rounded-xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.3)]" />
        <span className="absolute -inset-2 rounded-2xl bg-accent/25 blur-xl opacity-70 group-hover:opacity-100 group-hover:bg-accent/35 transition-all duration-500" />
        <span className="absolute inset-x-4 -top-px h-px bg-gradient-to-r from-transparent via-white/60 to-transparent" />
        <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out bg-gradient-to-r from-transparent via-white/25 to-transparent" />
        <Mail className="h-4 w-4 relative z-10" />
        <span className="relative z-10">Me contacter</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm rounded-2xl border border-border-subtle bg-bg-surface p-6 shadow-2xl shadow-accent/20"
            >
              <div className="flex items-start justify-between mb-5">
                <div>
                  <h3 className="text-lg font-bold text-text-primary">
                    Contacter {name}
                  </h3>
                  <p className="text-xs text-text-muted mt-1">
                    Copiez l&apos;email ou envoyez directement
                  </p>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="text-text-muted hover:text-text-primary transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="rounded-xl border border-border-subtle bg-bg-primary p-4 mb-3">
                <p className="text-[10px] font-semibold text-text-muted uppercase tracking-wider mb-1.5">
                  Email
                </p>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm text-text-primary font-medium truncate">
                    {email}
                  </span>
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 shrink-0 rounded-lg border border-border-subtle bg-bg-surface px-3 py-1.5 text-xs font-medium text-text-secondary hover:text-accent hover:border-accent/30 transition-all"
                  >
                    {copied ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-green-400" />
                        <span className="text-green-400">Copié</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" />
                        Copier
                      </>
                    )}
                  </button>
                </div>
              </div>

              <a
                href={mailtoHref}
                className="flex items-center justify-center gap-2 w-full rounded-xl bg-gradient-to-b from-[#a78bfa] to-[#7c3aed] py-3 text-sm font-semibold text-white hover:shadow-[0_0_20px_rgba(139,92,246,0.4)] transition-shadow"
              >
                <Send className="h-4 w-4" />
                Ouvrir mon application mail
              </a>

              <p className="text-center text-[10px] text-text-muted mt-3">
                Le bouton ouvrira Gmail, Outlook ou votre app mail par défaut
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
