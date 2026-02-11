"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface TagManagerProps {
  tags: Array<{ id: string; name: string }>;
  onCreateTag: (formData: FormData) => void;
  onUpdateTag: (formData: FormData) => void;
  onDeleteTag: (formData: FormData) => void;
}

export function TagManager({
  tags,
  onCreateTag,
  onUpdateTag,
  onDeleteTag,
}: TagManagerProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");

  const handleSaveEdit = (tagId: string) => {
    if (editingName.trim()) {
      const formData = new FormData();
      formData.append("id", tagId);
      formData.append("name", editingName);
      onUpdateTag(formData);
    }
    setEditingId(null);
    setEditingName("");
  };

  return (
    <div className="space-y-4">
      <form
        action={onCreateTag}
        className="flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.currentTarget);
          onCreateTag(formData);
          e.currentTarget.reset();
        }}
      >
        <Input
          name="tag_name"
          placeholder="New tag name"
          className="flex-1"
        />
        <Button type="submit">Add tag</Button>
      </form>

      {tags && tags.length > 0 && (
        <div className="space-y-2">
          {tags.map((tag) =>
            editingId === tag.id ? (
              <div
                key={tag.id}
                className="flex items-center justify-between rounded-md border p-2 gap-2"
              >
                <Input
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                  autoFocus
                  className="flex-1"
                />
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleSaveEdit(tag.id)}
                  >
                    Save
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setEditingId(null);
                      setEditingName("");
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div
                key={tag.id}
                className="flex items-center justify-between rounded-md border p-2"
              >
                <span>{tag.name}</span>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setEditingId(tag.id);
                      setEditingName(tag.name);
                    }}
                  >
                    Rename
                  </Button>
                  <form action={onDeleteTag} style={{ margin: 0 }}>
                    <input type="hidden" name="id" value={tag.id} />
                    <Button size="sm" variant="destructive" type="submit">
                      Delete
                    </Button>
                  </form>
                </div>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}
