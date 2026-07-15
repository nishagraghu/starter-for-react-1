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

import UserTable from "./UserTable";
import UserCreateEditDialog from "./UserCreateEditDialog";
import UserRoleDialog from "./UserRoleDialog";
import UserPasswordDialog from "./UserPasswordDialog";
import UserEmailDialog from "./UserEmailDialog";
import UserPhoneDialog from "./UserPhoneDialog";
import UserLabelsDialog from "./UserLabelsDialog";
import UserSessionsDialog from "./UserSessionsDialog";
import UserDeleteDialog from "./UserDeleteDialog";

const EMPTY_DIALOGS = {
  createEdit: { open: false, user: null },
  role: { open: false, user: null },
  password: { open: false, user: null },
  email: { open: false, user: null },
  phone: { open: false, user: null },
  labels: { open: false, user: null },
  sessions: { open: false, user: null },
  delete: { open: false, user: null },
};

export default function Users() {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, totalPages: 0 });
  const [search, setSearch] = useState("");
  const [dialogs, setDialogs] = useState(EMPTY_DIALOGS);

  const openDialog = (name, user = null) =>
    setDialogs((d) => ({ ...d, [name]: { open: true, user } }));

  const closeDialog = (name) =>
    setDialogs((d) => ({ ...d, [name]: { open: false, user: null } }));

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: pagination.page, limit: pagination.limit });
      if (search) params.set("search", search);
      const res = await apiClient(`/admin/users?${params}`);
      setUsers(res.data.users);
      setPagination(res.data.pagination);
    } catch (err) {
      toast.error(err.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, search]);

  const fetchRoles = useCallback(async () => {
    try {
      const res = await apiClient("/admin/roles");
      setRoles(res.data);
    } catch {
      // silent — roles are optional
    }
  }, []);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);
  useEffect(() => { fetchRoles(); }, [fetchRoles]);

  async function handleToggleStatus(user) {
    try {
      await apiClient(`/admin/users/${user.id}/status`, {
        method: "PUT",
        body: { status: !user.status },
      });
      toast.success(`${user.name} ${user.status ? "disabled" : "enabled"}`);
      fetchUsers();
    } catch (err) {
      toast.error(err.message || "Failed to toggle status");
    }
  }

  async function handleVerifyEmail(user) {
    try {
      await apiClient(`/admin/users/${user.id}/verify-email`, { method: "PUT" });
      toast.success("Email verified");
      fetchUsers();
    } catch (err) {
      toast.error(err.message || "Failed to verify email");
    }
  }

  async function handleVerifyPhone(user) {
    try {
      await apiClient(`/admin/users/${user.id}/verify-phone`, { method: "PUT" });
      toast.success("Phone verified");
      fetchUsers();
    } catch (err) {
      toast.error(err.message || "Failed to verify phone");
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold">Users</h1>
          <p className="text-sm text-muted-foreground">Manage all users and their roles</p>
        </div>
        <Button onClick={() => openDialog("createEdit")} size="sm">
          <Plus className="mr-2 size-4" /> Create User
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                className="pl-8"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPagination((p) => ({ ...p, page: 1 })); }}
              />
            </div>
            <Button variant="outline" size="icon" onClick={fetchUsers}>
              <RefreshCw className="size-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <UserTable
            users={users}
            loading={loading}
            onToggleStatus={handleToggleStatus}
            onEdit={(u) => openDialog("createEdit", u)}
            onAssignRole={(u) => openDialog("role", u)}
            onResetPassword={(u) => openDialog("password", u)}
            onUpdateEmail={(u) => openDialog("email", u)}
            onUpdatePhone={(u) => openDialog("phone", u)}
            onManageLabels={(u) => openDialog("labels", u)}
            onViewSessions={(u) => openDialog("sessions", u)}
            onVerifyEmail={handleVerifyEmail}
            onVerifyPhone={handleVerifyPhone}
            onDelete={(u) => openDialog("delete", u)}
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

      {/* Dialogs */}
      <UserCreateEditDialog
        open={dialogs.createEdit.open}
        onOpenChange={(v) => closeDialog("createEdit")}
        user={dialogs.createEdit.user}
        roles={roles}
        onSaved={fetchUsers}
      />
      <UserRoleDialog
        open={dialogs.role.open}
        onOpenChange={(v) => closeDialog("role")}
        user={dialogs.role.user}
        roles={roles}
        onUpdated={fetchUsers}
      />
      <UserPasswordDialog
        open={dialogs.password.open}
        onOpenChange={(v) => closeDialog("password")}
        user={dialogs.password.user}
        onUpdated={fetchUsers}
      />
      <UserEmailDialog
        open={dialogs.email.open}
        onOpenChange={(v) => closeDialog("email")}
        user={dialogs.email.user}
        onUpdated={fetchUsers}
      />
      <UserPhoneDialog
        open={dialogs.phone.open}
        onOpenChange={(v) => closeDialog("phone")}
        user={dialogs.phone.user}
        onUpdated={fetchUsers}
      />
      <UserLabelsDialog
        open={dialogs.labels.open}
        onOpenChange={(v) => closeDialog("labels")}
        user={dialogs.labels.user}
        onUpdated={fetchUsers}
      />
      <UserSessionsDialog
        open={dialogs.sessions.open}
        onOpenChange={(v) => closeDialog("sessions")}
        user={dialogs.sessions.user}
        onUpdated={fetchUsers}
      />
      <UserDeleteDialog
        open={dialogs.delete.open}
        onOpenChange={(v) => closeDialog("delete")}
        user={dialogs.delete.user}
        onDeleted={fetchUsers}
      />
    </div>
  );
}
