import { useState, useEffect } from "react";
import { toast } from "sonner";
import apiClient from "../../lib/apiClient";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle,
} from "../../components/ui/dialog";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Badge } from "../../components/ui/badge";
import { Loader2, X } from "lucide-react";

export default function UserLabelsDialog({ open, onOpenChange, user, onUpdated }) {
  const [labels, setLabels] = useState([]);
  const [input, setInput] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user?.labels) {
      const safe = Array.isArray(user.labels) ? user.labels : [];
      setLabels(safe.filter((l) => l !== "deactivated"));
    } else {
      setLabels([]);
    }
  }, [user]);

  function addLabel() {
    const trimmed = input.trim();
    if (!trimmed || trimmed.length > 100) return;
    if (labels.includes(trimmed)) {
      toast.error("Label already exists");
      return;
    }
    setLabels([...labels, trimmed]);
    setInput("");
  }

  function removeLabel(label) {
    setLabels(labels.filter((l) => l !== label));
  }

  async function handleSave() {
    setSaving(true);
    try {
      await apiClient(`/admin/users/${user.id}/labels`, {
        method: "PUT",
        body: { labels },
      });
      toast.success("Labels updated");
      onUpdated?.();
      onOpenChange(false);
    } catch (err) {
      toast.error(err.message || "Failed to update labels");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Manage Labels</DialogTitle>
          <DialogDescription>
            Labels for <strong>{user?.name}</strong>
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Add label..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addLabel(); } }}
            />
            <Button type="button" variant="secondary" onClick={addLabel}>
              Add
            </Button>
          </div>
          <div className="flex flex-wrap gap-1.5 min-h-[32px]">
            {labels.length === 0 ? (
              <span className="text-sm text-muted-foreground">No labels</span>
            ) : (
              labels.map((label) => (
                <Badge key={label} variant="secondary" className="gap-1 pr-1">
                  {label}
                  <button
                    type="button"
                    className="ml-0.5 rounded-full hover:bg-muted p-0.5"
                    onClick={() => removeLabel(label)}
                  >
                    <X className="size-3" />
                  </button>
                </Badge>
              ))
            )}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="button" onClick={handleSave} disabled={saving}>
              {saving && <Loader2 className="mr-2 size-4 animate-spin" />}
              Save
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
