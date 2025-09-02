import SidebarNav from "@/components/sidebar-nav";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <SidebarProvider>
            <SidebarNav />
            <SidebarInset>
                {children}
            </SidebarInset>
        </SidebarProvider>
    )
}

export default MainLayout;