import { useState } from "react";
import { toast } from "sonner";
import apiClient from "../../lib/apiClient";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle,
} from "../../components/ui/dialog";
import { Button } from "../../components/ui/button";
import { Loader2, AlertTriangle } from "lucide-react";

export default function TeamDeleteDialog({ open, onOpenChange, team, onDeleted }) {
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (!team) return;
    setLoading(true);
    try {
      await apiClient(`/teams/${team.id}`, { method: "DELETE" });
      toast.success(`"${team.name}" deleted`);
      onDeleted?.();
      onOpenChange(false);
    } catch (err) {
      toast.error(err.message || "Failed to delete team");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <div className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="size-5" />
            <DialogTitle>Delete Team</DialogTitle>
          </div>
          <DialogDescription>
            Are you sure you want to delete <strong>{team?.name}</strong>?
            This will permanently remove the team and all its members.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={loading}>
            {loading && <Loader2 className="mr-2 size-4 animate-spin" />}
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
