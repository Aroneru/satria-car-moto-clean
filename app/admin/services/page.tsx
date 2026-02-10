import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/supabase/roles";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

async function createService(formData: FormData) {
  "use server";
  await requireAdmin();

  const name = String(formData.get("name") || "").trim();
  const category = String(formData.get("category") || "car");
  const description = String(formData.get("description") || "").trim();
  const price = Number(formData.get("price") || 0);
  const durationMinutes = Number(formData.get("duration_minutes") || 0);
  const isActive = formData.get("is_active") === "on";

  if (!name) {
    return;
  }

  const supabase = await createClient();
  const { error } = await supabase.from("services").insert({
    name,
    category,
    description: description || null,
    price,
    duration_minutes: durationMinutes,
    is_active: isActive,
  });

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/services");
}

async function toggleService(formData: FormData) {
  "use server";
  await requireAdmin();

  const id = String(formData.get("id") || "");
  const isActive = formData.get("is_active") === "true";

  if (!id) {
    return;
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("services")
    .update({ is_active: !isActive })
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/services");
}

async function deleteService(formData: FormData) {
  "use server";
  await requireAdmin();

  const id = String(formData.get("id") || "");

  if (!id) {
    return;
  }

  const supabase = await createClient();
  const { error } = await supabase.from("services").delete().eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/services");
}

export default async function ServicesPage() {
  await requireAdmin();
  const supabase = await createClient();

  const { data: services } = await supabase
    .from("services")
    .select("id, name, category, description, price, duration_minutes, is_active")
    .order("created_at", { ascending: false });

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Service management</h1>
        <p className="text-sm text-muted-foreground">
          Control what normal users can see for car and bike cleaning services.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Add service</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={createService} className="grid gap-4 md:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="name">Service name</Label>
              <Input id="name" name="name" placeholder="Premium wash" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="category">Category</Label>
              <select
                id="category"
                name="category"
                className="h-9 rounded-md border border-input bg-background px-3 text-sm"
              >
                <option value="car">Car</option>
                <option value="bike">Bike</option>
              </select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="price">Price</Label>
              <Input id="price" name="price" type="number" min="0" step="0.01" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="duration_minutes">Duration (minutes)</Label>
              <Input
                id="duration_minutes"
                name="duration_minutes"
                type="number"
                min="0"
              />
            </div>
            <div className="grid gap-2 md:col-span-2">
              <Label htmlFor="description">Description</Label>
              <Input id="description" name="description" />
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input name="is_active" type="checkbox" defaultChecked />
              Visible to users
            </label>
            <div className="md:col-span-2">
              <Button type="submit">Create service</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Current services</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          {services?.length ? (
            services.map((service) => (
              <div
                key={service.id}
                className="flex flex-col gap-2 border rounded-md p-3"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold">{service.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {service.category} · {service.duration_minutes ?? 0} mins
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <form action={toggleService}>
                      <input type="hidden" name="id" value={service.id} />
                      <input
                        type="hidden"
                        name="is_active"
                        value={String(service.is_active)}
                      />
                      <Button size="sm" variant="outline" type="submit">
                        {service.is_active ? "Hide" : "Show"}
                      </Button>
                    </form>
                    <form action={deleteService}>
                      <input type="hidden" name="id" value={service.id} />
                      <Button size="sm" variant="destructive" type="submit">
                        Delete
                      </Button>
                    </form>
                  </div>
                </div>
                {service.description && (
                  <p className="text-sm text-muted-foreground">
                    {service.description}
                  </p>
                )}
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">No services yet.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
