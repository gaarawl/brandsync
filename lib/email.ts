import { Resend } from "resend";

let _resend: Resend | null = null;

function getResend(): Resend {
  if (!_resend) {
    if (!process.env.RESEND_API_KEY) throw new Error("RESEND_API_KEY is not set");
    _resend = new Resend(process.env.RESEND_API_KEY);
  }
  return _resend;
}

const FROM = "BrandSync <noreply@brandsync.fr>";

// ─── Welcome ────────────────────────────────────────────────────────
export async function sendWelcomeEmail(to: string, name: string) {
  return getResend().emails.send({
    from: FROM,
    to,
    subject: "Bienvenue sur BrandSync !",
    html: layout(`
      <h1 style="margin:0 0 16px">Bienvenue ${name} !</h1>
      <p>Ton compte BrandSync est prêt. Tu peux maintenant :</p>
      <ul style="padding-left:20px;margin:12px 0">
        <li>Ajouter tes marques partenaires</li>
        <li>Suivre tes collaborations et paiements</li>
        <li>Utiliser l'assistant IA pour tes emails et briefs</li>
      </ul>
      ${button("Accéder au dashboard", `${baseUrl()}/dashboard`)}
    `),
  });
}

// ─── New collaboration ──────────────────────────────────────────────
export async function sendNewCollabEmail(
  to: string,
  data: { brandName: string; platform: string; amount: number }
) {
  return getResend().emails.send({
    from: FROM,
    to,
    subject: `Nouvelle collab avec ${data.brandName}`,
    html: layout(`
      <h1 style="margin:0 0 16px">Nouvelle collaboration</h1>
      <p>Une collaboration a été créée :</p>
      <table style="width:100%;border-collapse:collapse;margin:16px 0">
        ${row("Marque", data.brandName)}
        ${row("Plateforme", data.platform)}
        ${row("Montant", `${data.amount} €`)}
      </table>
      ${button("Voir la collab", `${baseUrl()}/dashboard/collaborations`)}
    `),
  });
}

// ─── Collaboration status change ────────────────────────────────────
const statusLabels: Record<string, string> = {
  lead: "Lead",
  negotiation: "Négociation",
  production: "Production",
  validation: "Validation",
  invoiced: "Facturé",
  paid: "Payé",
};

export async function sendCollabStatusEmail(
  to: string,
  data: { brandName: string; oldStatus: string; newStatus: string }
) {
  return getResend().emails.send({
    from: FROM,
    to,
    subject: `Collab ${data.brandName} → ${statusLabels[data.newStatus] || data.newStatus}`,
    html: layout(`
      <h1 style="margin:0 0 16px">Statut mis à jour</h1>
      <p>La collaboration avec <strong>${data.brandName}</strong> est passée de
        <span style="color:#a78bfa">${statusLabels[data.oldStatus] || data.oldStatus}</span> à
        <span style="color:#7c3aed;font-weight:600">${statusLabels[data.newStatus] || data.newStatus}</span>.
      </p>
      ${button("Voir les détails", `${baseUrl()}/dashboard/collaborations`)}
    `),
  });
}

// ─── New payment ────────────────────────────────────────────────────
export async function sendNewPaymentEmail(
  to: string,
  data: { brandName: string; amount: number; dueDate: string | null }
) {
  return getResend().emails.send({
    from: FROM,
    to,
    subject: `Nouveau paiement — ${data.brandName} (${data.amount} €)`,
    html: layout(`
      <h1 style="margin:0 0 16px">Nouveau paiement enregistré</h1>
      <table style="width:100%;border-collapse:collapse;margin:16px 0">
        ${row("Marque", data.brandName)}
        ${row("Montant", `${data.amount} €`)}
        ${data.dueDate ? row("Échéance", data.dueDate) : ""}
      </table>
      ${button("Voir les paiements", `${baseUrl()}/dashboard/paiements`)}
    `),
  });
}

// ─── Payment overdue ────────────────────────────────────────────────
export async function sendOverduePaymentEmail(
  to: string,
  data: { brandName: string; amount: number; dueDate: string }
) {
  return getResend().emails.send({
    from: FROM,
    to,
    subject: `⚠️ Paiement en retard — ${data.brandName}`,
    html: layout(`
      <h1 style="margin:0 0 16px;color:#ef4444">Paiement en retard</h1>
      <p>Le paiement de <strong>${data.amount} €</strong> de <strong>${data.brandName}</strong>
        était prévu le <strong>${data.dueDate}</strong> et n'a pas été reçu.</p>
      <p style="margin-top:12px">Pense à relancer la marque ou à mettre à jour le statut.</p>
      ${button("Gérer les paiements", `${baseUrl()}/dashboard/paiements`)}
    `),
  });
}

// ─── Payment received ───────────────────────────────────────────────
export async function sendPaymentReceivedEmail(
  to: string,
  data: { brandName: string; amount: number }
) {
  return getResend().emails.send({
    from: FROM,
    to,
    subject: `Paiement reçu — ${data.brandName} (${data.amount} €)`,
    html: layout(`
      <h1 style="margin:0 0 16px;color:#22c55e">Paiement reçu !</h1>
      <p><strong>${data.brandName}</strong> a payé <strong>${data.amount} €</strong>.</p>
      ${button("Voir les paiements", `${baseUrl()}/dashboard/paiements`)}
    `),
  });
}

// ─── Deadline reminder ──────────────────────────────────────────────
export async function sendDeadlineReminderEmail(
  to: string,
  data: { brandName: string; deliverables: string; deadline: string }
) {
  return getResend().emails.send({
    from: FROM,
    to,
    subject: `Rappel : deadline dans 3 jours — ${data.brandName}`,
    html: layout(`
      <h1 style="margin:0 0 16px">Deadline approche</h1>
      <p>Ta collaboration avec <strong>${data.brandName}</strong> a une deadline le <strong>${data.deadline}</strong>.</p>
      <table style="width:100%;border-collapse:collapse;margin:16px 0">
        ${row("Livrables", data.deliverables)}
        ${row("Deadline", data.deadline)}
      </table>
      ${button("Voir les collaborations", `${baseUrl()}/dashboard/collaborations`)}
    `),
  });
}

// ─── Campaign email (envoyé par le créateur via BrandSync) ─────────
export async function sendCampaignEmail(
  to: string,
  data: { subject: string; body: string; userName: string }
) {
  const result = await getResend().emails.send({
    from: FROM,
    to,
    subject: data.subject,
    html: campaignLayout(data.body, data.userName),
  });

  if (result.error) {
    throw new Error(result.error.message || "Erreur Resend");
  }

  return result;
}

// ─── HTML helpers ───────────────────────────────────────────────────
function baseUrl() {
  return process.env.NEXTAUTH_URL || process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000";
}

function button(text: string, href: string) {
  return `<a href="${href}" style="display:inline-block;margin-top:20px;padding:12px 28px;background:#7c3aed;color:#fff;text-decoration:none;border-radius:8px;font-weight:600;font-size:14px">${text}</a>`;
}

function row(label: string, value: string) {
  return `<tr><td style="padding:8px 12px;border-bottom:1px solid #27272a;color:#a1a1aa;font-size:13px">${label}</td><td style="padding:8px 12px;border-bottom:1px solid #27272a;color:#fff;font-size:13px;font-weight:500">${value}</td></tr>`;
}

function layout(content: string) {
  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"/></head>
<body style="margin:0;padding:0;background:#09090b;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif">
  <div style="max-width:520px;margin:40px auto;background:#18181b;border-radius:16px;border:1px solid #27272a;padding:40px;color:#e4e4e7">
    <div style="margin-bottom:24px">
      <span style="font-size:20px;font-weight:700;color:#fff">Brand<span style="color:#7c3aed">Sync</span></span>
    </div>
    ${content}
    <div style="margin-top:40px;padding-top:20px;border-top:1px solid #27272a;font-size:11px;color:#71717a">
      Cet email a été envoyé par BrandSync. Si tu n'as pas demandé cet email, ignore-le.
    </div>
  </div>
</body></html>`;
}

function campaignLayout(body: string, userName: string) {
  // Convert line breaks to <br> for plain text content
  const htmlBody = body.replace(/\n/g, "<br/>");
  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"/></head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif">
  <div style="max-width:580px;margin:40px auto;background:#ffffff;border-radius:12px;border:1px solid #e5e7eb;padding:40px;color:#111827">
    ${htmlBody}
    <div style="margin-top:32px;padding-top:20px;border-top:1px solid #e5e7eb;font-size:11px;color:#9ca3af">
      Envoyé par ${userName} via BrandSync
    </div>
  </div>
</body></html>`;
}
