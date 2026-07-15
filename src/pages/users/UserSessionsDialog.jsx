import { useState, useEffect } from "react";
import { toast } from "sonner";
import apiClient from "../../lib/apiClient";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle,
} from "../../components/ui/dialog";
import { Button } from "../../components/ui/button";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "../../components/ui/table";
import { Loader2, RefreshCw } from "lucide-react";
import { formatDate } from "./userHelpers";

export default function UserSessionsDialog({ open, onOpenChange, user, onUpdated }) {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [terminating, setTerminating] = useState(false);

  async function fetchSessions() {
    if (!user) return;
    setLoading(true);
    try {
      const res = await apiClient(`/admin/users/${user.id}/sessions`);
      setSessions(res.data || []);
    } catch (err) {
      toast.error(err.message || "Failed to load sessions");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (open) fetchSessions();
  }, [open, user?.id]);

  async function handleTerminateAll() {
    setTerminating(true);
    try {
      await apiClient(`/admin/users/${user.id}/sessions`, { method: "DELETE" });
      toast.success("All sessions terminated");
      setSessions([]);
      onUpdated?.();
    } catch (err) {
      toast.error(err.message || "Failed to terminate sessions");
    } finally {
      setTerminating(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Active Sessions</DialogTitle>
          <DialogDescription>
            Sessions for <strong>{user?.name}</strong>
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <div className="flex justify-end">
            <Button variant="outline" size="sm" onClick={fetchSessions} disabled={loading}>
              <RefreshCw className={`mr-1 size-3.5 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">
              <Loader2 className="size-5 animate-spin mx-auto" />
            </div>
          ) : sessions.length === 0 ? (
            <p className="text-center py-8 text-muted-foreground text-sm">No active sessions</p>
          ) : (
            <div className="max-h-64 overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Device / IP</TableHead>
                    <TableHead>Created</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sessions.map((s, i) => (
                    <TableRow key={s.$id || i}>
                      <TableCell className="text-xs">{s.ip || "Unknown"}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {formatDate(s.$createdAt)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
            <Button
              variant="destructive"
              onClick={handleTerminateAll}
              disabled={terminating || sessions.length === 0}
            >
              {terminating && <Loader2 className="mr-2 size-4 animate-spin" />}
              Terminate All
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
