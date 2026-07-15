import { useState } from "react";
import { toast } from "sonner";
import apiClient from "../../lib/apiClient";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle,
} from "../../components/ui/dialog";
import { Button } from "../../components/ui/button";
import { Loader2, AlertTriangle } from "lucide-react";

export default function UserDeleteDialog({ open, onOpenChange, user, onDeleted }) {
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (!user) return;
    setLoading(true);
    try {
      await apiClient(`/admin/users/${user.id}`, { method: "DELETE" });
      toast.success(`${user.name} has been deactivated`);
      onDeleted?.();
      onOpenChange(false);
    } catch (err) {
      toast.error(err.message || "Failed to deactivate user");
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
            <DialogTitle>Deactivate User</DialogTitle>
          </div>
          <DialogDescription>
            Are you sure you want to deactivate <strong>{user?.name}</strong>?
            This will set their account as disabled but will not permanently delete their data.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={loading}>
            {loading && <Loader2 className="mr-2 size-4 animate-spin" />}
            Deactivate
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
