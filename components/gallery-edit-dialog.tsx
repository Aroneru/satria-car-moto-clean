"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface GalleryTag {
  id: string;
  name: string;
}

interface GalleryItem {
  id: string;
  title: string;
  alt_text: string | null;
  is_visible: boolean;
  gallery_image_tags: Array<{ gallery_tags: GalleryTag | null }>;
}

export function GalleryEditDialog({
  item,
  allTags,
  onUpdate,
}: {
  item: GalleryItem;
  allTags: GalleryTag[];
  onUpdate: (formData: FormData) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);

  if (!isOpen) {
    return (
      <Button size="sm" variant="outline" onClick={() => setIsOpen(true)}>
        Edit
      </Button>
    );
  }

  const selectedTagIds = new Set(
    item.gallery_image_tags
      ?.map((t) => t.gallery_tags?.id)
      .filter(Boolean) as string[]
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-lg bg-background p-6 shadow-lg">
        <h2 className="mb-4 text-lg font-semibold">Edit image</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            onUpdate(formData);
            setIsOpen(false);
          }}
          className="grid gap-4"
        >
          <input type="hidden" name="id" value={item.id} />

          <div className="grid gap-2">
            <Label htmlFor="edit_title">Title</Label>
            <Input
              id="edit_title"
              name="title"
              defaultValue={item.title}
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="edit_alt_text">Alt text</Label>
            <Input
              id="edit_alt_text"
              name="alt_text"
              defaultValue={item.alt_text || ""}
            />
          </div>

          {allTags.length > 0 && (
            <div className="grid gap-2">
              <Label>Tags</Label>
              <div className="grid grid-cols-2 gap-2">
                {allTags.map((tag) => (
                  <label
                    key={tag.id}
                    className="flex items-center gap-2 text-sm"
                  >
                    <input
                      name="selected_tags"
                      type="checkbox"
                      value={tag.id}
                      defaultChecked={selectedTagIds.has(tag.id)}
                    />
                    {tag.name}
                  </label>
                ))}
              </div>
            </div>
          )}

          <label className="flex items-center gap-2 text-sm">
            <input
              name="is_visible"
              type="checkbox"
              defaultChecked={item.is_visible}
            />
            Visible to users
          </label>

          <div className="flex gap-2">
            <Button type="submit" className="flex-1">
              Save
            </Button>
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
