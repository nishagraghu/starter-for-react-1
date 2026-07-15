import { useState, useEffect } from "react";
import { toast } from "sonner";
import apiClient from "../../lib/apiClient";
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle,
} from "../../components/ui/dialog";
import { Button } from "../../components/ui/button";
import { Label } from "../../components/ui/label";
import { Badge } from "../../components/ui/badge";
import { Separator } from "../../components/ui/separator";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "../../components/ui/select";
import { Loader2, UserPlus, Trash2 } from "lucide-react";

export default function TeamMembersDialog({ open, onOpenChange, team, onUpdated }) {
  const [members, setMembers] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState("");
  const [adding, setAdding] = useState(false);
  const [removingId, setRemovingId] = useState(null);

  useEffect(() => {
    if (open && team) {
      fetchMembers();
      fetchUsers();
    } else {
      setMembers([]);
      setUsers([]);
      setUserId("");
    }
  }, [open, team]);

  async function fetchMembers() {
    setLoading(true);
    try {
      const res = await apiClient(`/teams/${team.id}/members?limit=100`);
      setMembers(res.data.members);
    } catch (err) {
      toast.error(err.message || "Failed to load members");
    } finally {
      setLoading(false);
    }
  }

  async function fetchUsers() {
    try {
      const res = await apiClient("/admin/users");
      setUsers(res.data.users);
    } catch {
      // silent
    }
  }

  async function handleAddMember(e) {
    e.preventDefault();
    if (!userId.trim()) return;

    setAdding(true);
    try {
      await apiClient(`/teams/${team.id}/members`, {
        method: "POST",
        body: { userId: userId.trim(), roles: [] },
      });
      toast.success("Member added");
      setUserId("");
      fetchMembers();
      onUpdated?.();
    } catch (err) {
      toast.error(err.message || "Failed to add member");
    } finally {
      setAdding(false);
    }
  }

  async function handleRemoveMember(membershipId) {
    setRemovingId(membershipId);
    try {
      await apiClient(`/teams/${team.id}/members/${membershipId}`, {
        method: "DELETE",
      });
      toast.success("Member removed");
      fetchMembers();
      onUpdated?.();
    } catch (err) {
      toast.error(err.message || "Failed to remove member");
    } finally {
      setRemovingId(null);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Team Members — {team?.name}</DialogTitle>
          <DialogDescription>Manage members of this team</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Add member form */}
          <form onSubmit={handleAddMember} className="space-y-3 rounded-md border p-3">
            <p className="text-sm font-medium">Add Member</p>
            <div>
              <Label htmlFor="userId" className="text-xs">User</Label>
              <Select value={userId} onValueChange={setUserId}>
                <SelectTrigger><SelectValue placeholder="Select a user..." /></SelectTrigger>
                <SelectContent>
                  {users.map((u) => (
                    <SelectItem key={u.id} value={u.id}>
                      {u.name || u.email} — {u.id}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" size="sm" disabled={adding || !userId.trim()}>              {adding && <Loader2 className="mr-2 size-3 animate-spin" />}
              <UserPlus className="mr-1 size-3" /> Add
            </Button>
          </form>

          <Separator />

          {/* Members list */}
          <div>
            <p className="text-sm font-medium mb-2">
              Members ({members.length})
            </p>
            {loading ? (
              <div className="flex items-center justify-center py-8 text-muted-foreground text-sm">
                <Loader2 className="mr-2 size-4 animate-spin" /> Loading...
              </div>
            ) : members.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">
                No members in this team
              </p>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {members.map((m) => (
                  <div
                    key={m.id}
                    className="flex items-center justify-between rounded-md border px-3 py-2"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium truncate">
                        {m.userName || m.userEmail || m.userId}
                      </p>
                      {m.userEmail && m.userName && (
                        <p className="text-xs text-muted-foreground truncate">
                          {m.userEmail}
                        </p>
                      )}
                      <div className="mt-1 flex flex-wrap gap-1">
                        {m.roles.map((r) => (
                          <Badge key={r} variant="secondary" className="text-[10px]">
                            {r}
                          </Badge>
                        ))}
                        {m.roles.length === 0 && (
                          <span className="text-[10px] text-muted-foreground">No roles</span>
                        )}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-8 shrink-0 text-muted-foreground hover:text-destructive"
                      disabled={removingId === m.id}
                      onClick={() => handleRemoveMember(m.id)}
                    >
                      {removingId === m.id ? (
                        <Loader2 className="size-3.5 animate-spin" />
                      ) : (
                        <Trash2 className="size-3.5" />
                      )}
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
