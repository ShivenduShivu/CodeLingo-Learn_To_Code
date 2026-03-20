import { Sidebar } from "@/components/layout/sidebar";
import { MobileNav } from "@/components/layout/mobile-nav";
import { Navbar } from "@/components/layout/navbar";

type MainLayoutProps = {
  children: React.ReactNode;
};

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="flex min-h-screen relative z-10 w-full">
      {/* Hidden strictly on mobile screens, shown on md and above */}
      <Sidebar />
      
      <main className="md:pl-64 flex-1 h-full flex flex-col relative w-full pt-0">
        <div className="md:hidden block">
           <Navbar />
        </div>
        
        <div className="flex-1 w-full pb-20 md:pb-0">
          {children}
        </div>
      </main>

      {/* Hidden strictly on desktop screens, shown on sm/mobile only */}
      <MobileNav />
    </div>
  );
}
