import { createClient } from "@/lib/supabase/server";
import { requireSuperadmin } from "@/lib/supabase/roles";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function LogsPage() {
  await requireSuperadmin();
  const supabase = await createClient();

  const { data: logs } = await supabase
    .from("audit_logs")
    .select("id, action, table_name, record_id, actor_id, created_at")
    .order("created_at", { ascending: false })
    .limit(100);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Activity logs</h1>
        <p className="text-sm text-muted-foreground">
          The last 100 create, update, and delete actions.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent activity</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3">
          {logs?.length ? (
            logs.map((log) => (
              <div key={log.id} className="border rounded-md p-3 text-sm">
                <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                  <span>{new Date(log.created_at).toLocaleString()}</span>
                  <span>Actor: {log.actor_id ?? "unknown"}</span>
                </div>
                <div className="font-semibold">
                  {log.action} · {log.table_name}
                </div>
                <div className="text-xs text-muted-foreground">
                  Record: {log.record_id}
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">No logs yet.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
