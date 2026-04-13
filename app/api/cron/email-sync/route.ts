import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getPlanLimits } from "@/lib/plan-limits";
import { processEmailSync } from "@/lib/actions/email-sync";

export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();

  // Get all enabled email syncs with their user plan
  const syncs = await prisma.emailSync.findMany({
    where: { enabled: true },
    include: {
      user: { select: { id: true, plan: true } },
    },
  });

  let processed = 0;
  let skipped = 0;
  const results: { userId: string; found: number; created: number }[] = [];

  for (const sync of syncs) {
    const limits = getPlanLimits(sync.user.plan);

    // Skip if plan doesn't support sync
    if (!limits.emailSync) {
      skipped++;
      continue;
    }

    // Check interval
    if (sync.lastSyncAt) {
      const elapsed = now.getTime() - sync.lastSyncAt.getTime();
      const minInterval = limits.syncIntervalMinutes * 60 * 1000;
      if (elapsed < minInterval) {
        skipped++;
        continue;
      }
    }

    try {
      const result = await processEmailSync(sync.user.id);
      results.push({
        userId: sync.user.id,
        found: result.found,
        created: result.created,
      });
      processed++;
    } catch (err) {
      console.error(`Email sync failed for user ${sync.user.id}:`, err);
    }
  }

  return NextResponse.json({
    ok: true,
    processed,
    skipped,
    results,
  });
}
