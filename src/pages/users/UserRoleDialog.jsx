import { useState } from "react";
import { toast } from "sonner";
import apiClient from "../../lib/apiClient";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle,
} from "../../components/ui/dialog";
import { Button } from "../../components/ui/button";
import { Label } from "../../components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "../../components/ui/select";
import { Loader2 } from "lucide-react";

export default function UserRoleDialog({ open, onOpenChange, user, roles, onUpdated }) {
  const [roleId, setRoleId] = useState("");
  const [saving, setSaving] = useState(false);

  function handleOpenChange(isOpen) {
    if (isOpen && user) {
      setRoleId(user.role?.id || "");
    }
    onOpenChange(isOpen);
  }

  async function handleAssign() {
    setSaving(true);
    try {
      await apiClient(`/admin/users/${user.id}/role`, {
        method: "PUT",
        body: { roleId },
      });
      toast.success("Role assigned");
      onUpdated?.();
      onOpenChange(false);
    } catch (err) {
      toast.error(err.message || "Failed to assign role");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Assign Role</DialogTitle>
          <DialogDescription>
            Change role for <strong>{user?.name}</strong>
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Role</Label>
            <Select value={roleId} onValueChange={setRoleId}>
              <SelectTrigger><SelectValue placeholder="Select role" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="_unassign">No Role (Unassign)</SelectItem>
                {roles.map((r) => (
                  <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleAssign} disabled={saving}>
              {saving && <Loader2 className="mr-2 size-4 animate-spin" />}
              Assign
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
