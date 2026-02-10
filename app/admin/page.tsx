import Link from "next/link";

import { requireAdmin } from "@/lib/supabase/roles";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function AdminHomePage() {
  const { isSuperadmin } = await requireAdmin();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Admin workspace</h1>
        <p className="text-sm text-muted-foreground">
          Manage services, queues, and gallery content.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Service management</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-3">
              Control what normal users can see for car and bike cleaning.
            </p>
            <Link className="text-sm underline" href="/admin/services">
              Open services
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Queue management</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-3">
              Track vehicles in the cleaning queue.
            </p>
            <Link className="text-sm underline" href="/admin/queues">
              Open queues
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Gallery management</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-3">
              Manage images shown to normal users later.
            </p>
            <Link className="text-sm underline" href="/admin/gallery">
              Open gallery
            </Link>
          </CardContent>
        </Card>

        {isSuperadmin && (
          <Card>
            <CardHeader>
              <CardTitle>Activity logs</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">
                Review create, update, and delete activity.
              </p>
              <Link className="text-sm underline" href="/admin/logs">
                Open logs
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
