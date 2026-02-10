import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/supabase/roles";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

async function createQueueItem(formData: FormData) {
  "use server";
  await requireAdmin();

  const serviceId = String(formData.get("service_id") || "");
  const customerName = String(formData.get("customer_name") || "").trim();
  const vehiclePlate = String(formData.get("vehicle_plate") || "").trim();

  if (!serviceId || !customerName || !vehiclePlate) {
    return;
  }

  const supabase = await createClient();
  const { error } = await supabase.from("queues").insert({
    service_id: serviceId,
    customer_name: customerName,
    vehicle_plate: vehiclePlate,
  });

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/queues");
}

async function updateQueueStatus(formData: FormData) {
  "use server";
  await requireAdmin();

  const id = String(formData.get("id") || "");
  const status = String(formData.get("status") || "waiting");

  if (!id) {
    return;
  }

  const supabase = await createClient();
  const { error } = await supabase.from("queues").update({ status }).eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/queues");
}

async function deleteQueueItem(formData: FormData) {
  "use server";
  await requireAdmin();

  const id = String(formData.get("id") || "");

  if (!id) {
    return;
  }

  const supabase = await createClient();
  const { error } = await supabase.from("queues").delete().eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/queues");
}

export default async function QueuesPage() {
  await requireAdmin();
  const supabase = await createClient();

  const { data: services } = await supabase
    .from("services")
    .select("id, name, category")
    .eq("is_active", true)
    .order("name");

  const { data: queues } = await supabase
    .from("queues")
    .select(
      "id, customer_name, vehicle_plate, status, queued_at, services (name, category)",
    )
    .order("queued_at", { ascending: false });

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Queue management</h1>
        <p className="text-sm text-muted-foreground">
          Add vehicles to the queue and keep statuses updated.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Add queue item</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={createQueueItem} className="grid gap-4 md:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="service_id">Service</Label>
              <select
                id="service_id"
                name="service_id"
                className="h-9 rounded-md border border-input bg-background px-3 text-sm"
                required
              >
                <option value="">Select service</option>
                {services?.map((service) => (
                  <option key={service.id} value={service.id}>
                    {service.name} ({service.category})
                  </option>
                ))}
              </select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="customer_name">Customer name</Label>
              <Input id="customer_name" name="customer_name" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="vehicle_plate">Vehicle plate</Label>
              <Input id="vehicle_plate" name="vehicle_plate" required />
            </div>
            <div className="md:col-span-2">
              <Button type="submit">Add to queue</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Current queue</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          {queues?.length ? (
            queues.map((item) => (
              <div
                key={item.id}
                className="flex flex-col gap-2 border rounded-md p-3"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold">{item.customer_name}</div>
                    <div className="text-xs text-muted-foreground">
                      {item.vehicle_plate} · {item.services?.name} (
                      {item.services?.category})
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <form action={updateQueueStatus}>
                      <input type="hidden" name="id" value={item.id} />
                      <select
                        name="status"
                        defaultValue={item.status}
                        className="h-8 rounded-md border border-input bg-background px-2 text-xs"
                        onChange={(event) => event.currentTarget.form?.requestSubmit()}
                      >
                        <option value="waiting">Waiting</option>
                        <option value="in_progress">In progress</option>
                        <option value="done">Done</option>
                        <option value="canceled">Canceled</option>
                      </select>
                    </form>
                    <form action={deleteQueueItem}>
                      <input type="hidden" name="id" value={item.id} />
                      <Button size="sm" variant="destructive" type="submit">
                        Delete
                      </Button>
                    </form>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">No queue items yet.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
