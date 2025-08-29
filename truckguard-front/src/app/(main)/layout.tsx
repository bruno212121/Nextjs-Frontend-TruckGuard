import SidebarNav from "@/components/sidebar-nav";
import { SidebarProvider } from "@/components/ui/sidebar";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <SidebarProvider>
        <div>
            <SidebarNav />
            {children}
        </div>
        </SidebarProvider>
    )
}

export default MainLayout;