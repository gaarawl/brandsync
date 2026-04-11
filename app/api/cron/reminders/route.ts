import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  sendDeadlineReminderEmail,
  sendOverduePaymentEmail,
} from "@/lib/email";

// Called by Vercel Cron (or external cron) daily
// Secured with CRON_SECRET header
export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();
  const in3Days = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);

  // ── Deadline reminders (collaborations due in 3 days) ──
  const upcomingCollabs = await prisma.collaboration.findMany({
    where: {
      deadline: { gte: now, lte: in3Days },
      status: { notIn: ["paid", "invoiced"] },
    },
    include: { user: true, brand: true },
  });

  let sentDeadlines = 0;
  for (const collab of upcomingCollabs) {
    if (!collab.user.email) continue;
    try {
      await sendDeadlineReminderEmail(collab.user.email, {
        brandName: collab.brand.name,
        deliverables: collab.deliverables,
        deadline: collab.deadline!.toLocaleDateString("fr-FR"),
      });
      sentDeadlines++;
    } catch (e) {
      console.error(`Deadline email failed for collab ${collab.id}:`, e);
    }
  }

  // ── Overdue payment reminders ──
  const overduePayments = await prisma.payment.findMany({
    where: {
      status: "pending",
      dueDate: { lt: now },
    },
    include: { user: true, brand: true },
  });

  let sentOverdue = 0;
  for (const payment of overduePayments) {
    if (!payment.user.email) continue;
    try {
      await sendOverduePaymentEmail(payment.user.email, {
        brandName: payment.brand.name,
        amount: payment.amount,
        dueDate: payment.dueDate!.toLocaleDateString("fr-FR"),
      });
      // Mark as overdue
      await prisma.payment.update({
        where: { id: payment.id },
        data: { status: "overdue" },
      });
      sentOverdue++;
    } catch (e) {
      console.error(`Overdue email failed for payment ${payment.id}:`, e);
    }
  }

  return NextResponse.json({
    ok: true,
    deadlineReminders: sentDeadlines,
    overdueReminders: sentOverdue,
  });
}
