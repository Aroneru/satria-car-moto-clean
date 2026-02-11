import { revalidatePath } from "next/cache";
import crypto from "crypto";

import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/supabase/roles";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GalleryEditDialog } from "@/components/gallery-edit-dialog";
import { TagManager } from "@/components/tag-manager";

async function createTag(formData: FormData) {
  "use server";
  await requireAdmin();

  const name = String(formData.get("tag_name") || "").trim();

  if (!name) {
    return;
  }

  const supabase = await createClient();
  const { error } = await supabase.from("gallery_tags").insert({ name });

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/gallery");
}

async function createGalleryItem(formData: FormData) {
  "use server";
  await requireAdmin();

  const title = String(formData.get("title") || "").trim();
  const altText = String(formData.get("alt_text") || "").trim();
  const isVisible = formData.get("is_visible") === "on";
  const file = formData.get("image");
  const selectedTags = formData.getAll("selected_tags") as string[];

  if (!title || !(file instanceof File) || file.size === 0) {
    return;
  }

  const supabase = await createClient();
  const extension = file.name.split(".").pop() || "jpg";
  const fileName = `${crypto.randomUUID()}.${extension}`;
  const path = `gallery/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from("gallery")
    .upload(path, file, { contentType: file.type, upsert: false });

  if (uploadError) {
    throw new Error(uploadError.message);
  }

  const { data: publicUrl } = supabase.storage
    .from("gallery")
    .getPublicUrl(path);

  const { data: imageData, error } = await supabase
    .from("gallery_images")
    .insert({
      title,
      image_url: publicUrl.publicUrl,
      image_path: path,
      alt_text: altText || null,
      is_visible: isVisible,
    })
    .select("id")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  // Add tags to image
  if (imageData && selectedTags.length > 0) {
    const tagLinks = selectedTags.map((tagId) => ({
      image_id: imageData.id,
      tag_id: tagId,
    }));

    const { error: tagError } = await supabase
      .from("gallery_image_tags")
      .insert(tagLinks);

    if (tagError) {
      throw new Error(tagError.message);
    }
  }

  revalidatePath("/admin/gallery");
}

async function toggleGalleryVisibility(formData: FormData) {
  "use server";
  await requireAdmin();

  const id = String(formData.get("id") || "");
  const isVisible = formData.get("is_visible") === "true";

  if (!id) {
    return;
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("gallery_images")
    .update({ is_visible: !isVisible })
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/gallery");
}

async function updateGalleryItem(formData: FormData) {
  "use server";
  await requireAdmin();

  const id = String(formData.get("id") || "");
  const title = String(formData.get("title") || "").trim();
  const altText = String(formData.get("alt_text") || "").trim();
  const isVisible = formData.get("is_visible") === "on";
  const selectedTags = formData.getAll("selected_tags") as string[];

  if (!id || !title) {
    return;
  }

  const supabase = await createClient();

  // Update image
  const { error: updateError } = await supabase
    .from("gallery_images")
    .update({
      title,
      alt_text: altText || null,
      is_visible: isVisible,
    })
    .eq("id", id);

  if (updateError) {
    throw new Error(updateError.message);
  }

  // Update tags
  await supabase.from("gallery_image_tags").delete().eq("image_id", id);

  if (selectedTags.length > 0) {
    const tagLinks = selectedTags.map((tagId) => ({
      image_id: id,
      tag_id: tagId,
    }));

    const { error: tagError } = await supabase
      .from("gallery_image_tags")
      .insert(tagLinks);

    if (tagError) {
      throw new Error(tagError.message);
    }
  }

  revalidatePath("/admin/gallery");
}

async function deleteGalleryItem(formData: FormData) {
  "use server";
  await requireAdmin();

  const id = String(formData.get("id") || "");
  const path = String(formData.get("image_path") || "");

  if (!id) {
    return;
  }

  const supabase = await createClient();
  if (path) {
    await supabase.storage.from("gallery").remove([path]);
  }
  const { error } = await supabase.from("gallery_images").delete().eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/gallery");
}

async function updateTag(formData: FormData) {
  "use server";
  await requireAdmin();

  const id = String(formData.get("id") || "");
  const name = String(formData.get("name") || "").trim();

  if (!id || !name) {
    return;
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("gallery_tags")
    .update({ name })
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/gallery");
}

async function deleteTag(formData: FormData) {
  "use server";
  await requireAdmin();

  const id = String(formData.get("id") || "");

  if (!id) {
    return;
  }

  const supabase = await createClient();
  const { error } = await supabase.from("gallery_tags").delete().eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/gallery");
}

export default async function GalleryPage() {
  await requireAdmin();
  const supabase = await createClient();

  const { data: tags } = await supabase
    .from("gallery_tags")
    .select("id, name")
    .order("name");

  const { data: gallery } = await supabase
    .from("gallery_images")
    .select(
      "id, title, image_url, image_path, alt_text, is_visible, gallery_image_tags (gallery_tags (id, name))",
    )
    .order("created_at", { ascending: false });

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Gallery management</h1>
        <p className="text-sm text-muted-foreground">
          Upload and control which photos are visible to normal users.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Add gallery image</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={createGalleryItem} className="grid gap-4 md:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" name="title" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="image">Image file</Label>
              <Input id="image" name="image" type="file" accept="image/*" required />
            </div>
            <div className="grid gap-2 md:col-span-2">
              <Label htmlFor="alt_text">Alt text</Label>
              <Input id="alt_text" name="alt_text" />
            </div>
            {tags && tags.length > 0 && (
              <div className="grid gap-2 md:col-span-2">
                <Label>Tags</Label>
                <div className="grid grid-cols-2 gap-2">
                  {tags.map((tag) => (
                    <label key={tag.id} className="flex items-center gap-2 text-sm">
                      <input name="selected_tags" type="checkbox" value={tag.id} />
                      {tag.name}
                    </label>
                  ))}
                </div>
              </div>
            )}
            <label className="flex items-center gap-2 text-sm">
              <input name="is_visible" type="checkbox" defaultChecked />
              Visible to users
            </label>
            <div className="md:col-span-2">
              <Button type="submit">Add image</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Manage tags</CardTitle>
        </CardHeader>
        <CardContent>
          <TagManager
            tags={tags ?? []}
            onCreateTag={createTag}
            onUpdateTag={updateTag}
            onDeleteTag={deleteTag}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Current gallery</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          {gallery?.length ? (
            gallery.map((item) => (
              <div
                key={item.id}
                className="flex flex-col gap-2 border rounded-md p-3"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold">{item.title}</div>
                    <div className="text-xs text-muted-foreground truncate">
                      {item.image_url}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <GalleryEditDialog
                      item={item}
                      allTags={tags ?? []}
                      onUpdate={updateGalleryItem}
                    />
                    <form action={deleteGalleryItem}>
                      <input type="hidden" name="id" value={item.id} />
                      <input
                        type="hidden"
                        name="image_path"
                        value={item.image_path ?? ""}
                      />
                      <Button size="sm" variant="destructive" type="submit">
                        Delete
                      </Button>
                    </form>
                  </div>
                </div>
                {item.alt_text && (
                  <p className="text-sm text-muted-foreground">
                    {item.alt_text}
                  </p>
                )}
                {item.gallery_image_tags && item.gallery_image_tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {item.gallery_image_tags.map((tagLink) => (
                      <span
                        key={tagLink.gallery_tags?.id}
                        className="inline-flex items-center rounded-full bg-secondary px-2 py-0.5 text-xs"
                      >
                        {tagLink.gallery_tags?.name}
                      </span>
                    ))}
                  </div>
                )}
                {item.image_url && (
                  <img
                    src={item.image_url}
                    alt={item.alt_text || item.title}
                    className="h-40 w-full rounded-md object-cover"
                    loading="lazy"
                  />
                )}
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">No images yet.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
