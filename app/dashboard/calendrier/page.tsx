import { getEvents } from "@/lib/actions/events";
import { getCollaborations } from "@/lib/actions/collaborations";
import CalendarPage from "@/components/dashboard/calendar-page";

export default async function CalendrierPage() {
  const [events, collaborations] = await Promise.all([
    getEvents(),
    getCollaborations(),
  ]);

  // Merge collaboration deadlines as calendar items
  const deadlines = collaborations
    .filter((c) => c.deadline)
    .map((c) => ({
      id: `collab-${c.id}`,
      title: `${c.deliverables} — ${c.brand.name}`,
      type: "Livrable" as const,
      date: new Date(c.deadline!).toISOString(),
      notes: `${c.platform} · ${c.status}`,
      isDeadline: true,
    }));

  const calendarEvents = [
    ...events.map((e) => ({
      id: e.id,
      title: e.title,
      type: e.type,
      date: new Date(e.date).toISOString(),
      notes: e.notes,
      isDeadline: false,
    })),
    ...deadlines,
  ];

  return <CalendarPage events={calendarEvents} />;
}
