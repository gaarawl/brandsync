import { auth } from "@/auth";
import Topbar from "@/components/dashboard/topbar";
import StatsGrid from "@/components/dashboard/stats-grid";
import CollabsList from "@/components/dashboard/collabs-list";
import CalendarWidget from "@/components/dashboard/calendar-widget";
import PaymentsWidget from "@/components/dashboard/payments-widget";

export default async function DashboardPage() {
  const session = await auth();

  return (
    <>
      <Topbar userName={session?.user?.name} />

      <main className="flex-1 overflow-y-auto p-6 space-y-6">
        <StatsGrid />

        <div className="grid gap-6 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <CollabsList />
          </div>
          <div className="lg:col-span-2 space-y-6">
            <CalendarWidget />
            <PaymentsWidget />
          </div>
        </div>
      </main>
    </>
  );
}
