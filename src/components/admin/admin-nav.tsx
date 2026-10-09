"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutDashboard, ArrowLeft } from "lucide-react";

const links = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-1">
      <Link
        href="/account"
        className="mb-2 lg:mb-4 inline-flex items-center gap-2 text-sm text-muted hover:text-bone transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        <span className="hidden sm:inline">Back to Account</span>
        <span className="sm:hidden">Back</span>
      </Link>
      
      <div className="flex lg:flex-col gap-1 overflow-x-auto pb-2 lg:pb-0">
        {links.map((link) => {
          const Icon = link.icon;
          const active = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors whitespace-nowrap",
                active
                  ? "bg-indigo/10 text-indigo font-medium"
                  : "text-muted-strong hover:bg-bone/5 hover:text-bone"
              )}
            >
              <Icon className="h-4 w-4" />
              {link.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
