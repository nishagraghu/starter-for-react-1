import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import apiClient from "../../lib/apiClient";
import {
  Card, CardContent, CardHeader,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import {
  Plus, Search, RefreshCw,
} from "lucide-react";

import TeamTable from "./TeamTable";
import TeamCreateEditDialog from "./TeamCreateEditDialog";
import TeamDeleteDialog from "./TeamDeleteDialog";
import TeamMembersDialog from "./TeamMembersDialog";

const EMPTY_DIALOGS = {
  createEdit: { open: false, team: null },
  delete: { open: false, team: null },
  members: { open: false, team: null },
};

export default function Teams() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, totalPages: 0 });
  const [search, setSearch] = useState("");
  const [dialogs, setDialogs] = useState(EMPTY_DIALOGS);

  const openDialog = (name, team = null) =>
    setDialogs((d) => ({ ...d, [name]: { open: true, team } }));

  const closeDialog = (name) =>
    setDialogs((d) => ({ ...d, [name]: { open: false, team: null } }));

  const fetchTeams = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: pagination.page, limit: pagination.limit });
      if (search) params.set("search", search);
      const res = await apiClient(`/teams?${params}`);
      setTeams(res.data.teams);
      setPagination(res.data.pagination);
    } catch (err) {
      toast.error(err.message || "Failed to load teams");
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, search]);

  useEffect(() => { fetchTeams(); }, [fetchTeams]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold">Teams</h1>
          <p className="text-sm text-muted-foreground">Manage teams and their members</p>
        </div>
        <Button onClick={() => openDialog("createEdit")} size="sm">
          <Plus className="mr-2 size-4" /> Create Team
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
              <Input
                placeholder="Search teams..."
                className="pl-8"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPagination((p) => ({ ...p, page: 1 })); }}
              />
            </div>
            <Button variant="outline" size="icon" onClick={fetchTeams}>
              <RefreshCw className="size-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <TeamTable
            teams={teams}
            loading={loading}
            onEdit={(t) => openDialog("createEdit", t)}
            onMembers={(t) => openDialog("members", t)}
            onDelete={(t) => openDialog("delete", t)}
          />
          <div className="flex items-center justify-between px-4 py-3 border-t">
            <p className="text-xs text-muted-foreground">
              Page {pagination.page} of {pagination.totalPages} ({pagination.total} total)
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline" size="sm"
                disabled={pagination.page <= 1}
                onClick={() => setPagination((p) => ({ ...p, page: p.page - 1 }))}
              >
                Previous
              </Button>
              <Button
                variant="outline" size="sm"
                disabled={pagination.page >= pagination.totalPages}
                onClick={() => setPagination((p) => ({ ...p, page: p.page + 1 }))}
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <TeamCreateEditDialog
        open={dialogs.createEdit.open}
        onOpenChange={() => closeDialog("createEdit")}
        team={dialogs.createEdit.team}
        onSaved={fetchTeams}
      />
      <TeamDeleteDialog
        open={dialogs.delete.open}
        onOpenChange={() => closeDialog("delete")}
        team={dialogs.delete.team}
        onDeleted={fetchTeams}
      />
      <TeamMembersDialog
        open={dialogs.members.open}
        onOpenChange={() => closeDialog("members")}
        team={dialogs.members.team}
        onUpdated={fetchTeams}
      />
    </div>
  );
}
