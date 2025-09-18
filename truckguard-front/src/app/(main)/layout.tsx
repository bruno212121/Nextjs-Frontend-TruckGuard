import SidebarNav from "@/components/sidebar-nav";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="flex h-screen">
            <SidebarNav />
            <main className="flex-1 overflow-auto">
                {children}
            </main>
        </div>
    )
}

export default MainLayout;