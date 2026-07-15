import { useState, useEffect } from "react";
import apiClient from "../lib/apiClient";
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "../components/ui/table";
import { Input } from "../components/ui/input";
import { ClipboardList, RefreshCw, Search } from "lucide-react";

const actionColors = {
  "user.create": "bg-green-500/10 text-green-600",
  "user.update": "bg-blue-500/10 text-blue-600",
  "user.delete": "bg-red-500/10 text-red-600",
  "user.status": "bg-yellow-500/10 text-yellow-600",
  "user.password_reset": "bg-orange-500/10 text-orange-600",
  "user.role_assign": "bg-purple-500/10 text-purple-600",
  "role.create": "bg-green-500/10 text-green-600",
  "role.update": "bg-blue-500/10 text-blue-600",
  "role.delete": "bg-red-500/10 text-red-600",
};

export default function AuditLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, totalPages: 0 });
  const [actionFilter, setActionFilter] = useState("");

  useEffect(() => { fetchLogs(); }, [pagination.page]);

  async function fetchLogs() {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: pagination.page, limit: pagination.limit });
      if (actionFilter) params.set("action", actionFilter);
      const res = await apiClient(`/admin/audit-logs?${params}`);
      setLogs(res.data.logs);
      setPagination(res.data.pagination);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  function formatDate(dateStr) {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return d.toLocaleString();
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold flex items-center gap-2">
            <ClipboardList className="size-5" /> Audit Logs
          </h1>
          <p className="text-sm text-muted-foreground">Track all administrative actions</p>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
              <Input
                placeholder="Filter by action (e.g. user.create)..."
                className="pl-8"
                value={actionFilter}
                onChange={(e) => { setActionFilter(e.target.value); setPagination((p) => ({ ...p, page: 1 })); }}
                onKeyDown={(e) => e.key === "Enter" && fetchLogs()}
              />
            </div>
            <Button variant="outline" size="icon" onClick={fetchLogs}>
              <RefreshCw className="size-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Action</TableHead>
                <TableHead className="hidden md:table-cell">Admin</TableHead>
                <TableHead className="hidden lg:table-cell">Target</TableHead>
                <TableHead className="hidden sm:table-cell">IP</TableHead>
                <TableHead className="hidden lg:table-cell">Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">Loading...</TableCell></TableRow>
              ) : logs.length === 0 ? (
                <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">No audit logs found</TableCell></TableRow>
              ) : logs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell>
                    <Badge className={`text-xs ${actionColors[log.action] || "bg-gray-500/10 text-gray-600"}`}>
                      {log.action}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-sm text-muted-foreground font-mono">
                    {log.performedBy?.slice(0, 8)}...
                  </TableCell>
                  <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">
                    {log.targetType}: {log.targetId?.slice(0, 8)}...
                  </TableCell>
                  <TableCell className="hidden sm:table-cell text-sm text-muted-foreground font-mono">
                    {log.ipAddress}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">
                    {formatDate(log.createdAt)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="flex items-center justify-between px-4 py-3 border-t">
            <p className="text-xs text-muted-foreground">
              Page {pagination.page} of {pagination.totalPages} ({pagination.total} total)
            </p>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" disabled={pagination.page <= 1}
                onClick={() => setPagination((p) => ({ ...p, page: p.page - 1 }))}>Previous</Button>
              <Button variant="outline" size="sm" disabled={pagination.page >= pagination.totalPages}
                onClick={() => setPagination((p) => ({ ...p, page: p.page + 1 }))}>Next</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
