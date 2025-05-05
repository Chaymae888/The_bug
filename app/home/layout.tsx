import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import Topbar from "@/components/topbar";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
        <AppSidebar />
        <div className="flex flex-col relative w-full">
          <Topbar />
          <main >
            <SidebarTrigger />
            {children}
          </main>
        </div>
    </SidebarProvider>
  );
}