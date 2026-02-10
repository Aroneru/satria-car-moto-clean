import Link from "next/link";

import { requireAdmin } from "@/lib/supabase/roles";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { role, isSuperadmin } = await requireAdmin();

  return (
    <main className="min-h-screen flex flex-col items-center">
      <div className="flex-1 w-full flex flex-col gap-12 items-center">
        <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
          <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
            <div className="flex gap-4 items-center font-semibold">
              <Link href="/admin">Admin</Link>
              <Link href="/admin/services">Services</Link>
              <Link href="/admin/queues">Queues</Link>
              <Link href="/admin/gallery">Gallery</Link>
              {isSuperadmin && <Link href="/admin/logs">Logs</Link>}
            </div>
            <div className="text-xs text-muted-foreground">Role: {role}</div>
          </div>
        </nav>
        <div className="flex-1 flex flex-col gap-8 w-full max-w-5xl p-5">
          {children}
        </div>
      </div>
    </main>
  );
}
