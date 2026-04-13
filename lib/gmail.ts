import { google } from "googleapis";
import { prisma } from "@/lib/prisma";

// Collaboration detection keywords
const SUBJECT_KEYWORDS = [
  "partenariat",
  "collaboration",
  "sponsoring",
  "collab",
  "gifting",
  "influenceur",
  "influenceuse",
  "partnership",
  "brand deal",
  "proposition",
  "sponsorship",
  "ambassador",
  "ambassadeur",
  "ambassadrice",
  "campaign",
  "campagne",
];

const BODY_KEYWORDS = [
  ...SUBJECT_KEYWORDS,
  "nous souhaitons",
  "we would like to",
  "we'd love to",
  "budget",
  "rémunération",
  "compensation",
  "deliverables",
  "livrables",
  "contenu sponsorisé",
  "sponsored content",
  "paid partnership",
  "partenariat rémunéré",
];

export interface DetectedCollab {
  messageId: string;
  from: string;
  fromName: string;
  fromDomain: string;
  subject: string;
  snippet: string;
  date: Date;
  matchedKeywords: string[];
}

/**
 * Get a Gmail API client for a user by refreshing their OAuth token
 */
async function getGmailClient(userId: string) {
  const account = await prisma.account.findFirst({
    where: { userId, provider: "google" },
  });

  if (!account?.access_token || !account?.refresh_token) {
    throw new Error("No Google account linked or missing tokens");
  }

  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET
  );

  oauth2Client.setCredentials({
    access_token: account.access_token,
    refresh_token: account.refresh_token,
    expiry_date: account.expires_at ? account.expires_at * 1000 : undefined,
  });

  // Refresh token if expired
  const tokenInfo = await oauth2Client.getAccessToken();
  if (tokenInfo.token && tokenInfo.token !== account.access_token) {
    await prisma.account.update({
      where: {
        provider_providerAccountId: {
          provider: "google",
          providerAccountId: account.providerAccountId,
        },
      },
      data: {
        access_token: tokenInfo.token,
        expires_at: tokenInfo.res?.data?.expiry_date
          ? Math.floor(tokenInfo.res.data.expiry_date / 1000)
          : account.expires_at,
      },
    });
  }

  return google.gmail({ version: "v1", auth: oauth2Client });
}

/**
 * Extract email address from a "Name <email>" format string
 */
function parseEmailAddress(raw: string): { name: string; email: string; domain: string } {
  const match = raw.match(/(?:"?([^"]*)"?\s)?<?([^\s>]+@[^\s>]+)>?/);
  if (match) {
    return {
      name: match[1]?.trim() || match[2].split("@")[0],
      email: match[2].toLowerCase(),
      domain: match[2].split("@")[1].toLowerCase(),
    };
  }
  return { name: raw, email: raw, domain: "" };
}

/**
 * Check if text contains any collab keywords
 */
function findKeywordMatches(text: string, keywords: string[]): string[] {
  const lower = text.toLowerCase();
  return keywords.filter((kw) => lower.includes(kw.toLowerCase()));
}

/**
 * Scan a user's Gmail for collaboration emails since last sync
 */
export async function scanForCollabEmails(userId: string): Promise<{
  emails: DetectedCollab[];
  lastMessageId: string | null;
}> {
  const gmail = await getGmailClient(userId);

  // Get last sync state
  const syncRecord = await prisma.emailSync.findUnique({
    where: { userId },
  });

  // Build Gmail search query - look for potential collab emails
  // We search in the last 7 days max, or since last sync
  const query = SUBJECT_KEYWORDS.slice(0, 8)
    .map((kw) => `subject:${kw}`)
    .join(" OR ");

  const res = await gmail.users.messages.list({
    userId: "me",
    q: query,
    maxResults: 20,
  });

  const messages = res.data.messages || [];
  const detected: DetectedCollab[] = [];
  let newestMessageId: string | null = syncRecord?.lastMessageId || null;

  for (const msg of messages) {
    if (!msg.id) continue;

    // Skip already processed messages
    if (syncRecord?.lastMessageId && msg.id <= syncRecord.lastMessageId) {
      continue;
    }

    try {
      const detail = await gmail.users.messages.get({
        userId: "me",
        id: msg.id,
        format: "metadata",
        metadataHeaders: ["From", "Subject", "Date"],
      });

      const headers = detail.data.payload?.headers || [];
      const fromHeader = headers.find((h) => h.name === "From")?.value || "";
      const subject = headers.find((h) => h.name === "Subject")?.value || "";
      const dateHeader = headers.find((h) => h.name === "Date")?.value || "";
      const snippet = detail.data.snippet || "";

      // Check keywords in subject and snippet
      const subjectMatches = findKeywordMatches(subject, SUBJECT_KEYWORDS);
      const bodyMatches = findKeywordMatches(snippet, BODY_KEYWORDS);
      const allMatches = [...new Set([...subjectMatches, ...bodyMatches])];

      if (allMatches.length > 0) {
        const { name, email, domain } = parseEmailAddress(fromHeader);

        // Skip emails from common non-brand senders
        const skipDomains = [
          "gmail.com", "yahoo.com", "hotmail.com", "outlook.com",
          "icloud.com", "noreply", "no-reply", "newsletter",
        ];
        if (skipDomains.some((d) => domain.includes(d) || email.includes(d))) {
          continue;
        }

        detected.push({
          messageId: msg.id,
          from: email,
          fromName: name,
          fromDomain: domain,
          subject,
          snippet,
          date: dateHeader ? new Date(dateHeader) : new Date(),
          matchedKeywords: allMatches,
        });
      }

      // Track newest message
      if (!newestMessageId || msg.id > newestMessageId) {
        newestMessageId = msg.id;
      }
    } catch (err) {
      console.error(`Error fetching message ${msg.id}:`, err);
    }
  }

  return { emails: detected, lastMessageId: newestMessageId };
}
