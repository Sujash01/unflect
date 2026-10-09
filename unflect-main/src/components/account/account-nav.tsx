"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserRound, Settings, Shield, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/account", label: "Overview", icon: UserRound },
  { href: "/profile", label: "Profile", icon: UserRound },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function AccountNav() {
  const pathname = usePathname();
  return (
    <nav aria-label="Account" className="rounded-2xl border border-line bg-navy-raised p-2">
      {links.map(({ href, label, icon: Icon }) => (
        <Link key={href} href={href} className={cn("flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition-colors", pathname === href ? "bg-bone/[0.07] text-bone" : "text-muted hover:bg-bone/[0.04] hover:text-bone")}>
          <Icon className="h-4 w-4" />{label}
        </Link>
      ))}
      <div className="my-2 border-t border-line" />
      <Link href="/" className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-muted transition-colors hover:bg-bone/[0.04] hover:text-bone"><ArrowLeft className="h-4 w-4" />Back to site</Link>
      <p className="mt-3 flex items-center gap-2 px-4 pb-2 text-[11px] text-muted"><Shield className="h-3.5 w-3.5" />Protected account area</p>
    </nav>
  );
}
