"use client";

import { usePathname, useRouter } from "next/navigation";
import { FolderKanban, House, Info, ListOrdered, Mail, Shapes } from "lucide-react";
import { MagneticDock, type DockItemData } from "@/components/ui/magnetic-dock";

const items = [
  { id: "home", label: "Home", href: "/", icon: House },
  { id: "services", label: "Services", href: "/services", icon: Shapes },
  { id: "work", label: "Work", href: "/work", icon: FolderKanban },
  { id: "process", label: "Process", href: "/process", icon: ListOrdered },
  { id: "about", label: "About", href: "/about", icon: Info },
  { id: "contact", label: "Contact", href: "/contact", icon: Mail },
] as const;

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

export function SiteDock() {
  const pathname = usePathname();
  const router = useRouter();

  const dockItems: DockItemData[] = items.map((item) => ({
    id: item.id,
    label: item.label,
    isActive: isActive(pathname, item.href),
    onClick: () => router.push(item.href),
    icon: <item.icon className="h-[55%] w-[55%]" strokeWidth={1.8} />,
  }));

  return (
    <nav
      aria-label="Primary"
      className="pointer-events-none fixed inset-x-0 bottom-0 z-50 flex justify-center px-4 pb-[calc(env(safe-area-inset-bottom,0px)+1rem)]"
    >
      <div className="pointer-events-auto">
        <MagneticDock
          items={dockItems}
          iconSize={46}
          maxScale={1.32}
          magneticDistance={120}
          showLabels
          position="bottom"
        />
      </div>
    </nav>
  );
}
