import { redirect } from "next/navigation";
import { PortalNav } from "@/components/PortalNav";
import { getSession } from "@/lib/session";

export default async function TeamLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session || session.role !== "STAFF") {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      <PortalNav variant="team" userName={session.name} />
      <div className="flex-1 overflow-auto bg-gradient-to-b from-cream-blue/50 to-cream p-4 sm:p-8">
        {children}
      </div>
    </div>
  );
}
