"use client";

import { useState } from "react";
import { Mail, X, Copy, Check, ExternalLink } from "lucide-react";
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

  const subject = `Collaboration — ${name}`;
  const body = `Bonjour ${name},\n\nJe vous contacte au sujet d'une possible collaboration.\n\nCordialement,`;

  const gmailHref = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
    email
  )}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  const outlookHref = `https://outlook.office.com/mail/deeplink/compose?to=${encodeURIComponent(
    email
  )}&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  const mailtoHref = `mailto:${email}?subject=${encodeURIComponent(
    subject
  )}&body=${encodeURIComponent(body)}`;

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
                    Choisis comment envoyer ton message
                  </p>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="text-text-muted hover:text-text-primary transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="rounded-xl border border-border-subtle bg-bg-primary p-4 mb-4">
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

              <div className="space-y-2">
                <a
                  href={gmailHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between w-full rounded-xl border border-border-subtle bg-bg-primary px-4 py-3 hover:border-accent/40 hover:bg-bg-elevated transition-all group"
                >
                  <span className="flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/95">
                      <svg viewBox="0 0 48 48" className="h-5 w-5">
                        <path fill="#4285f4" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                        <path fill="#34a853" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                        <path fill="#fbbc05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                        <path fill="#ea4335" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                      </svg>
                    </span>
                    <div className="text-left">
                      <p className="text-sm font-semibold text-text-primary">Gmail</p>
                      <p className="text-[10px] text-text-muted">Ouvrir dans Gmail</p>
                    </div>
                  </span>
                  <ExternalLink className="h-3.5 w-3.5 text-text-muted group-hover:text-accent transition-colors" />
                </a>

                <a
                  href={outlookHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between w-full rounded-xl border border-border-subtle bg-bg-primary px-4 py-3 hover:border-accent/40 hover:bg-bg-elevated transition-all group"
                >
                  <span className="flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0072C6]">
                      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="white">
                        <path d="M14.4 4H9.6v3.2H6.4v9.6h11.2V7.2h-3.2V4zM8 9.6h8v1.6H8V9.6zm0 3.2h8v1.6H8v-1.6zM4 18V6l7.2-2v16L4 18z"/>
                      </svg>
                    </span>
                    <div className="text-left">
                      <p className="text-sm font-semibold text-text-primary">Outlook</p>
                      <p className="text-[10px] text-text-muted">Ouvrir dans Outlook</p>
                    </div>
                  </span>
                  <ExternalLink className="h-3.5 w-3.5 text-text-muted group-hover:text-accent transition-colors" />
                </a>

                <a
                  href={mailtoHref}
                  className="flex items-center justify-between w-full rounded-xl border border-border-subtle bg-bg-primary px-4 py-3 hover:border-accent/40 hover:bg-bg-elevated transition-all group"
                >
                  <span className="flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-accent to-accent-glow">
                      <Mail className="h-4 w-4 text-white" />
                    </span>
                    <div className="text-left">
                      <p className="text-sm font-semibold text-text-primary">App mail par défaut</p>
                      <p className="text-[10px] text-text-muted">Apple Mail, Thunderbird, etc.</p>
                    </div>
                  </span>
                  <ExternalLink className="h-3.5 w-3.5 text-text-muted group-hover:text-accent transition-colors" />
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
