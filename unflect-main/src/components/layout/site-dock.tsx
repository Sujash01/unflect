"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { FolderKanban, House, Info, ListOrdered, Mail, Shapes, UserRound } from "lucide-react";
import { MagneticDock, type DockItemData } from "@/components/ui/magnetic-dock";

const items = [
  { id: "home", label: "Home", href: "/", icon: House },
  { id: "services", label: "Services", href: "/services", icon: Shapes },
  { id: "work", label: "Work", href: "/work", icon: FolderKanban },
  { id: "process", label: "Process", href: "/process", icon: ListOrdered },
  { id: "about", label: "About", href: "/about", icon: Info },
  { id: "contact", label: "Contact", href: "/contact", icon: Mail },
  { id: "account", label: "Account", href: "/account", icon: UserRound },
] as const;

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

export function SiteDock() {
  const pathname = usePathname();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const dockItems: DockItemData[] = items.map((item) => ({
    id: item.id,
    label: item.label,
    href: item.href,
    isActive: isActive(pathname, item.href),
    icon: <item.icon className="h-[55%] w-[55%]" strokeWidth={1.8} />,
  }));

  return (
    <nav
      aria-label="Primary"
      className="pointer-events-none fixed inset-x-0 bottom-0 z-50 flex justify-center px-2 pb-[calc(env(safe-area-inset-bottom,0px)+0.75rem)] sm:px-4 sm:pb-[calc(env(safe-area-inset-bottom,0px)+1rem)]"
    >
      <div className="pointer-events-auto max-w-[calc(100vw-1rem)] sm:max-w-full">
        <MagneticDock
          items={dockItems}
          iconSize={isMobile ? 32 : 40}
          maxScale={isMobile ? 1.12 : 1.28}
          magneticDistance={isMobile ? 60 : 110}
          showLabels={!isMobile}
          position="bottom"
          className="max-w-full gap-0.5 p-1.5 sm:gap-1 sm:p-2.5"
        />
      </div>
    </nav>
  );
}
