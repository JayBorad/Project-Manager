import { DashboardProvider } from "@/lib/dashboard-context";
import { Sidebar } from "@/components/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardProvider>
      <div className="bg-muted/40 text-foreground flex h-screen w-full overflow-hidden text-xs">
        <Sidebar />
        <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
          {children}
        </div>
      </div>
    </DashboardProvider>
  );
}
