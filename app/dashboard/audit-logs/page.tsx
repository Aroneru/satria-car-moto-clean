
"use client";

export const dynamic = "force-dynamic";

import { AuditLogs } from "@/components/dashboard/AuditLogs";
import { ContentProvider } from "@/context/ContentContext";
import { Dashboard } from "@/components/dashboard/Dashboard";

export default function AuditLogsPage() {
  return (
    <ContentProvider>
      <Dashboard>
        <div className="space-y-6">
          <AuditLogs />
        </div>
      </Dashboard>
    </ContentProvider>
  );
}
