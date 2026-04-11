import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Sidebar from "@/components/dashboard/sidebar";
import AIChat from "@/components/dashboard/ai-chat";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="flex h-screen bg-bg-primary overflow-hidden">
      <Sidebar
        user={{
          name: session.user.name,
          email: session.user.email,
          image: session.user.image,
        }}
      />
      <div className="flex-1 flex flex-col overflow-hidden">{children}</div>
      <AIChat />
    </div>
  );
}
